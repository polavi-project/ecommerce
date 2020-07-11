<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */


namespace Polavi\Services\Db;

use function Polavi\dispatch_event;
use Polavi\Services\Log\Logger;

class Processor extends \PDO
{
    private $commit = true;

    private $inTransaction = false;

    public function __construct()
    {
        try {
            parent::__construct('mysql:dbname=' . DB_DATABASE . ';host=' . DB_HOST .';charset=utf8mb4', DB_USERNAME, DB_PASSWORD );
        } catch (\PDOException $e) {
            throw $e;
        }
        $this->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        // TIMESTAMP type columns we need to set UTC timezone
        $this->exec("SET time_zone = '+00:00'");
    }

    /**
     * Start a transaction
     */
    public function startTransaction()
    {
        if (!$this->inTransaction) {
            $this->exec("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            $this->beginTransaction();
            $this->inTransaction = true;
        }
    }

    /**
     * This method executes a query with binding params
     * @param $query
     * @param array $binding
     * @return bool|\PDOStatement
     */
    public function executeQuery($query, array $binding = [])
    {
        $stmt = $this->prepare($query);
        $stmt->execute($binding);
        return $stmt;
    }

    /**
     * Commit a transaction
     * @return bool|void
     */
    public function commit()
    {
        if ($this->inTransaction and $this->commit == true) {
            try {
                parent::commit();
                $this->inTransaction = false;
            } catch (\PDOException $e) {
                $this->rollback();
                throw $e;
            }
        }
    }

    /**
     * Rollback a transaction
     * @return bool|void
     */
    public function rollback()
    {
        if ($this->inTransaction) {
            parent::rollBack();
            $this->inTransaction = false;
        }
    }

    /**
     * Get main table of current query
     * @param string $tableName
     * @return Table
     */
    public function getTable(string $tableName) : Table
    {
        return new Table($tableName, $this);
    }

    /**
     * @inheritDoc
     * @return string
     */
    public function getLastID()
    {
        return $this->lastInsertId();
    }

    /**
     * Build SELECT query base on provided table
     * @param Table $table
     * @return string
     */
    protected function buildSelect(Table $table)
    {
        $table_name = DB_PREFIX . $table->getTable();
        $query = "SELECT ";
        $fields = $table->getSelectFields();
        if($fields == null)
            $query .= "*";
        else {
            foreach ($fields as $field=>$alias) {
                if($field == "*") {
                    $query .= " {$field},";
                    continue;
                }
                if(strpos($field, "(") !== false) {
                    if($alias == null)
                        $query .= " {$field},";
                    else
                        $query .= " {$field} AS `{$alias}`,";
                    continue;
                }
                if (strpos($field, '.') !== false) {
                    $field = "`". str_replace('.', '`.', $field);
                } else {
                    $field = '`'. $field . '`';
                }
                if($alias == null)
                    $query .= " {$field},";
                else
                    $query .= " {$field} AS `{$alias}`,";
            }
        }
        $query = rtrim($query, ',');
        if($table->getJoin())
            $query .= " FROM `{$table_name}` AS `{$table->getTable()}`";
        else
            $query .= " FROM `{$table_name}`";

        return $query;
    }

    /**
     * Build JOIN statement base on provided table
     * @param Table $table
     * @return string
     */
    protected function buildJoin(Table $table)
    {
        if(!$table->getJoin())
            return '';
        $joinClause = '';
        foreach($table->getJoin() as $join) {
            if(isset($join['alias']) and $join['alias'])
                $alias = $join['alias'];
            else
                $alias = $join['table'];
            $joinClause .= "{$join['type']} `" . DB_PREFIX . $join['table'] . "` AS `" . $alias . "` ON {$join['on']} ";
            $joinClause = rtrim($joinClause, 'AND');
            $where = "";
            if(isset($join['where'])) {
                $where = $this->buildWhere($join['where']);
            }
            $joinClause .= str_replace("WHERE "," AND ",$where);
        }
        return $joinClause;
    }

    /**
     * Build WHERE statement base on provided table
     * @param array $where
     * @param null $binding
     * @return string|null
     */
    protected function buildWhere(array $where, &$binding = null)
    {
        if(count($where) == 0)
            return null;
        $whereClause = '';
        foreach($where as $key=>$condition) {
            if($key != 0)
                $whereClause .= ' ' . strtoupper($condition['ao']) . ' ';
            if($condition['start_group'])
                $whereClause .= ' ' . $condition['start_group'] . ' ';
            if(isset($condition['isValueAColumn']) and $condition['isValueAColumn'] == true) {
                $whereClause .= "{$condition['column']} {$condition['operator']} {$condition['value']} ";
            } else {
                $placeholder = str_ireplace(["`", "'", "."], ['', '', "_"], $condition['column']) . '_' . $key;
                switch($condition['operator']) {
                    case '=':
                    case '>':
                    case '>=':
                    case '<':
                    case '<=':
                    case '!=':
                    case '<>':
                        $whereClause .= "{$condition['column']} {$condition['operator']} :{$placeholder} ";
                        $binding[$placeholder] = $condition['value'];
                        break;
                    case 'LIKE':
                    case 'NOT LIKE':
                    case 'IS':
                    case 'IS NOT':
                        $operator = strtolower(str_replace(' ', '', $condition['operator']));
                        $whereClause .= "{$condition['column']} {$condition['operator']} :{$operator}_{$placeholder} ";
                        $binding[$operator . '_' . $placeholder] = $condition['value'];
                        break;
                    case 'IN':
                    case 'NOT IN':
                        // Value must be an array
                        $whereClause .= "{$condition['column']} {$condition['operator']} ";
                        $in = '(';
                        foreach($condition['value'] as $k=>$value) {
                            $in .= ':in' . $k . ', ';
                            $binding[':in' . $k] = $value;
                        }
                        $in = rtrim(trim($in), ',') . ')';
                        $whereClause .= $in;
                        break;
                }
            }

            if($condition['end_group'])
                $whereClause .= ' ' . $condition['end_group'] . ' ';
        }
        $whereClause = 'WHERE ' . $whereClause;

        return  $whereClause;
    }

    /**
     * Execute SELECT statement.
     * @param Table $table
     * @param array $setting
     * @return bool|\PDOStatement
     */
    public function select(Table $table, array $setting = [])
    {
        $setting = $this->validateSelectQuerySetting($table, $setting);
        $query = $this->buildSelect($table) . " " . $this->buildJoin($table);
        $whereClause = $this->buildWhere($table->getWhere());
        $query = $query . " {$whereClause} ";

        if($table->getGroupBy())
            $query = $query . ' GROUP BY ' . $table->getGroupBy();

        if($table->getHaving()) {
            $having = str_replace("WHERE", "HAVING", $this->buildWhere($table->getHaving()));
            $query = $query . ' ' . $having;
        }

        $sortBy = "ORDER BY {$setting['sort_by']}";
        $sortOrder = "{$setting['sort_order']}";
        $limit = $setting['limit'];
        if($limit == null)
            $limit = '';
        else {
            $offset = (int)$setting['page'] > 1 ? ((int)$setting['page']-1) * $limit : 0;
            $limit = ((int)$limit == 1 && $offset == 0) ? "LIMIT 1" : "LIMIT {$offset},{$limit}";
        }
        $noSortByQuery = $query . "ORDER BY `{$table->getTable()}`.{$table->getPrimary()} ASC " . " {$limit}";
        $query = $query . " {$sortBy} {$sortOrder} {$limit}";
        try {
            $stmt = $this->prepare($query);
            Logger::write($query);
            Logger::write($table->getBinding());
            $stmt->execute($table->getBinding());
            return $stmt;
        } catch (\PDOException $e) {
            if($e->getCode() == '42S22')
                try {
                    $stmt = $this->prepare($noSortByQuery);
                    $stmt->execute($table->getBinding());
                    return $stmt;
                } catch (\PDOException $e) {
                    $this->commit = false;
                    throw $e;
                }
            $this->commit = false;
            throw $e;
        }
    }

    /**
     * Execute INSERT INTO statement
     * @param Table $table
     * @param array $data
     * @return int
     * @throws \Exception
     */
    public function insert(Table $table, array  $data = [])
    {
        dispatch_event("before_insert_{$table->getTable()}", [&$data]);
        unset($data[$table->getPrimary()]);
        $binding = [];
        $insertColumns = [];
        foreach ($table->getColumns() as $column) {
            if(isset($data[$column['Field']]) and is_array($data[$column['Field']]))
                $data[$column['Field']] = json_encode($data[$column['Field']], JSON_NUMERIC_CHECK);
            if($column['Type'] == 'timestamp' and $column['Default'] == 'CURRENT_TIMESTAMP')
                continue;
            if((!isset($data[$column['Field']]) or trim($data[$column['Field']])=='')) {
                if($column['Extra'] == 'auto_increment')
                    continue;
                if($column['Null'] == 'NO' and $column['Default'] != NULL)
                    continue;

                if($column['Null'] == 'NO' and $column['Default'] == NULL)
                    throw new \InvalidArgumentException("{$column['Field']} can not be empty");

                if($column['Null'] == 'YES' and in_array($column['Type'], ['date', 'datetime', 'timestamp']))
                    continue;
            }
            $insertColumns[] = $column['Field'];
            $binding[':'.$column['Field']] = isset($data[$column['Field']]) ? $data[$column['Field']] : NULL;
        }
        if(count($insertColumns)==0)
            throw new \RuntimeException("Something wrong, can not save data");
        $query = "INSERT INTO `" . DB_PREFIX . $table->getTable() . "` (`" . implode('`, `', $insertColumns) . "`) VALUES (:" . implode(', :', $insertColumns) . ")";
        try {
            $stmt = $this->prepare($query);
            $stmt->execute($binding);
            $rowCount = $stmt->rowCount();
            dispatch_event("after_insert_{$table->getTable()}", [$data, $rowCount, $this]);
            return $rowCount;
        } catch (\Exception $e) {
            $this->commit = false;
            throw $e;
        }
    }

    /**
     * Execute UPDATE statement
     * @param Table $table
     * @param array $data
     * @return int
     * @throws \Exception
     */
    public function update(Table $table, array $data = [])
    {
        dispatch_event("before_update_{$table->getTable()}", [&$data]);
        $prepare = '';
        $binding = [];
        foreach ($table->getColumns() as $column) {
            if($column['Type'] == 'timestamp' and $column['Default'] == 'CURRENT_TIMESTAMP')
                continue;
            if(!array_key_exists($column['Field'], $data))
                continue;
            if(is_array($data[$column['Field']]))
                $data[$column['Field']] = json_encode($data[$column['Field']], JSON_NUMERIC_CHECK);
            if(trim($data[$column['Field']]) == '') {
                if($column['Null'] == 'NO' and $column['Default'] != NULL)
                    continue;
                if($column['Null'] == 'NO' and $column['Default'] == NULL)
                    throw new \InvalidArgumentException("{$column['Field']} can not be empty");
                if($column['Null'] == 'YES' and in_array($column['Type'], ['date', 'datetime', 'timestamp']))
                    continue;
            }
            $prepare .= "`" . $column['Field'] . "` = :" . $column['Field'] . ",";
            $binding[':'.$column['Field']] = isset($data[$column['Field']]) ? $data[$column['Field']] : NULL;
        }
        if($prepare == '')
            throw new \RuntimeException('You are trying to update no column');
        $prepare = trim($prepare, ',');
        $whereClause = $this->buildWhere($table->getWhere(), $binding);
        $query = "UPDATE `" . DB_PREFIX . $table->getTable() . "` SET " . $prepare . " {$whereClause}";
        try {
            $stmt = $this->prepare($query);
            $stmt->execute($binding);
            $rowCount = $stmt->rowCount();
            dispatch_event("after_update_{$table->getTable()}", [$data, $rowCount, $this]);
            return $rowCount;
        } catch (\Exception $e) {
            $this->commit = false;
            throw $e;
        }
    }

    /**
     * Execute INSERT ON UPDATE statement
     * @param Table $table
     * @param array $data
     * @return int
     */
    public function insertOnUpdate(Table $table, array $data)
    {
        $binding = [];
        $insertColumns = [];
        foreach ($table->getColumns() as $column) {
            if(!array_key_exists($column['Field'], $data))
                continue;
            if(is_array($data[$column['Field']]))
                $data[$column['Field']] = json_encode($data[$column['Field']], JSON_NUMERIC_CHECK);
            if((!isset($data[$column['Field']]) or trim($data[$column['Field']])=='')) {
                if($column['Null'] == 'NO' and $column['Default'] != NULL)
                    continue;
                if($column['Extra'] == 'auto_increment')
                    continue;
                if($column['Null']=='NO' and $column['Default']== NULL)
                    throw new \InvalidArgumentException("{$column['Field']} can not be empty");

                if($column['Null'] == 'YES' and in_array($column['Type'], ['date', 'datetime', 'timestamp']))
                    continue;
            }
            $insertColumns[] = $column['Field'];
            $binding[':'.$column['Field']] = isset($data[$column['Field']]) ? $data[$column['Field']] : null;
        }
        $prepare = '';
        foreach ($insertColumns as $column) {
            $prepare .= "`" . $column . "` = :" . $column . ",";
        }
        $prepare = trim($prepare, ',');
        $query = "INSERT INTO `" . DB_PREFIX . $table->getTable() . "` (`" . implode('`, `', $insertColumns) . "`)
                    VALUES (:" . implode(', :', $insertColumns) . ")
                      ON DUPLICATE KEY UPDATE {$prepare}";
        try {
            $stmt = $this->prepare($query);
            $stmt->execute($binding);
            $rowCount = $stmt->rowCount();
            dispatch_event("after_insert_on_update_{$table->getTable()}", [$data, $rowCount, $this]);
            return $stmt->rowCount();
        } catch (\PDOException $e) {
            $this->commit = false;
            throw $e;
        }
    }

    /**
     * Execute DELETE statement
     * @param Table $table
     * @return $this
     */
    public function delete(Table $table)
    {
        $affectedRows = $table->fetchAllAssoc();
        dispatch_event("before_delete_{$table->getTable()}", [$affectedRows]);

        $whereClause = $this->buildWhere($table->getWhere());
        $binding = $table->getBinding();
        $query = "DELETE FROM `" . DB_PREFIX . $table->getTable()  . "` " . $whereClause;
        try {
            $stmt = $this->prepare($query);
            $stmt->execute($binding);
            dispatch_event("after_delete_{$table->getTable()}", [$affectedRows, $this]);
        } catch (\PDOException $e) {
            $this->commit = false;
            throw $e;
        }

        return $this;
    }

    protected function validateSelectQuerySetting(Table $table, array $setting)
    {
        $defaultSetting = [
            'sort_by'=> "`{$table->getTable()}`." . $table->getPrimary(),
            'sort_order'=> 'DESC',
            'page'=> 1,
            'limit'=> null
        ];

        $setting = array_filter($setting, function($value){return !is_null($value);});

        if(isset($setting['sort_order']))
            $setting['sort_order'] = (in_array(strtoupper($setting['sort_order']), ['ASC', 'DESC'])) ? strtoupper($setting['sort_order']) : 'ASC';

        $setting = array_merge($defaultSetting, $setting);

        return $setting;
    }

    protected function validate(Table $table, array $data = [])
    {
        foreach($table->getColumns() as $column) {
            $this->validateField($column, $data);
        }
    }

    public function describeTable($table)
    {
        $sql = 'DESCRIBE ' . $table;
        $stmt = $this->prepare($sql);
        if($stmt->execute())
            return $stmt->fetchAll(\Pdo::FETCH_ASSOC);
        return false;
    }

    protected function validateField($field, array &$data = [])
    {
        if($field['Null']=='NO' and (!isset($data[$field['Field']]) or trim($data[$field['Field']])==''))
            if($field['Default']!= NULL)
                $data[$field['Field']] = $field['Default'];
            else
                throw new \InvalidArgumentException("{$field['Field']} can not be empty");
        $type = preg_replace('/\([0-9]\)/', '', $field['Type']);
        switch($type) {
            case 'tinyint':
            case 'smallint':
            case 'int':
            case 'mediumint':
            case 'bigint':
                if(isset($data[$field['Field']]) and !preg_match('/^[0-9]*$/', $data[$field['Field']]))
                    throw new \InvalidArgumentException("{$field['Field']} must be a number");
        }
    }

//    public function prepare($statement, $options = NULL)
//    {
//        Logger::write($statement);
//        return parent::prepare($statement, []); // TODO: Change the autogenerated stub
//    }
}
