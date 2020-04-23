<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services\Db;

use function Similik\_unique_number;

class Table
{
    protected $processor;

    protected $table;

    protected $primary;

    protected $columns = [];

    protected $data = [];

    protected $join = [];

    protected $where = [];

    protected $groupBy;

    protected $having = [];

    protected $customWhereClause;

    protected $binding = [];

    protected $query = '';

    protected $selectFields;

    protected $targetRow;

    protected $fetchPdoStatement;

    public function __construct($table, Processor $processor)
    {
        $this->table = $table;
        $this->processor = $processor;
        $this->describeTable();

        return $this;
    }

    protected function describeTable()
    {
        $sql = "DESCRIBE `{$this->getTable()}`";
        $stmt = $this->processor->executeQuery($sql);
        $columns = [];
        if($stmt) {
            $raw_column_data = $stmt->fetchAll(\Pdo::FETCH_ASSOC);
            foreach($raw_column_data as $key => $column){
                if (strtoupper($column['Key']) == 'PRI')
                    $this->primary = $column['Field'];
                else {
                    $columns[] = $column;
                }
            }
        }
        $this->columns = $columns;

        return $this;
    }

    public function getProcessor()
    {
        return $this->processor;
    }

    public function getTable()
    {
        return $this->table;
    }

    public function getPrimary()
    {
        return $this->primary;
    }

    public function getColumns()
    {
        return $this->columns;
    }

    public function getQuery()
    {
        return $this->query;
    }

    public function getWhere()
    {
        return $this->where;
    }

    public function getBinding()
    {
        return $this->binding;
    }

    public function setData($data = [])
    {
        $this->data = $data;

        return $this;
    }

    public function getData()
    {
        return $this->data;
    }

    public function addData(array $data)
    {
        $this->data = array_merge($this->data, $data);

        return $this;
    }

    public function __get($name)
    {
        return $this->data[$name];
    }

    public function __set($name, $value)
    {
        $this->data[$name] = $value;

        return $this;
    }

    public function addFieldToSelect(string $field, string $alias = null) : Table
    {
        $this->selectFields[$field] = $alias ? $alias : null;

        return $this;
    }

    public function getSelectFields()
    {
        return $this->selectFields;
    }

    protected function setBinding($column, $operator, $value)
    {
        $binding = [];
        switch($operator) {
            case '=':
            case '>':
            case '>=':
            case '<':
            case '<=':
            case '!=':
            case '<>':
                $binding[':' . $column] = $value;
                break;
            case 'LIKE':
            case 'NOT LIKE':
            case 'IS':
            case 'IS NOT':
                $operator = strtolower(str_replace(' ', '', $operator));
                $binding[':' . strtolower($operator) . '_' . $column] = $value;
                break;
            case 'IN':
            case 'NOT IN':
                // Value must be an array
                foreach($value as $k=>$v) {
                    $binding[':in' . $k] = $v;
                }
                break;
        }

        $this->binding = array_merge($this->binding, $binding);
    }

    public function leftJoin($table, $alias = null, array $extraCondition = [])
    {
        return $this->join($table, 'LEFT JOIN', $alias, $extraCondition);
    }

    public function rightJoin($table, $alias = null, array $extraCondition = [])
    {
        return $this->join($table, 'RIGHT JOIN', $alias, $extraCondition);
    }

    public function innerJoin($table, $alias = null, array $extraCondition = [])
    {
        return $this->join($table, 'INNER JOIN', $alias, $extraCondition);
    }

    public function fullOuterJoin($table, $alias = null, array $extraCondition = [])
    {
        return $this->join($table, 'FULL OUTER JOIN', $alias, $extraCondition);
    }

    public function join($table, string $joinType, $alias = null, array $extraCondition = [])
    {
        if(!in_array($joinType, ['LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'INNER JOIN']))
            throw new \RuntimeException("Invalid join");
        $relation = $this->checkForJoin($table);
        if($alias == null)
            $alias = $table;

        $this->join[] = [
            'table' => $table,
            'alias' => $alias,
            'type'  => $joinType,
            'on'    => "`{$this->getTable()}`.{$relation['to']} = `{$alias}`.{$relation['from']}",
            'where' => $extraCondition
        ];
        foreach ($extraCondition as $key=>$condition) {
            if(!isset($condition['isValueAColumn']) || $condition['isValueAColumn'] == false)
                $this->setBinding(str_ireplace(["`", "'", "."], ['', '', "_"], $condition['column'] . '_' . $key), $condition['operator'], $condition['value']);
        }

        return $this;
    }

    /**
     * @param $column
     * @param $operator
     * @param $value
     * @param bool $startGroup
     * @param bool $endGroup
     * @return $this
     */
    public function where($column, $operator, $value, $startGroup = false, $endGroup = false)
    {
        // reset where
        //$this->where = [];
        if(strpos($column, '.') === false)
            $column = "`{$this->getTable()}`.{$column}";
        if(is_array($value))
            foreach($value as $key=>$val) {
                $value['binding' . _unique_number()] = $val;
                unset($value[$key]);
            }
        $this->where[] = [
            'column'      => $column,
            'operator'    => $operator,
            'value'       => $value,
            'ao'          => 'and',
            'start_group' => $startGroup,
            'end_group'   => $endGroup
        ];
        $this->setBinding(str_ireplace(["`", "'", "."], ['', '', "_"], $column) . "_0", $operator, $value);
        if($column == "`{$this->getTable()}`." . $this->primary && trim($operator) == '=')
            $this->targetRow = (int) $value;

        return $this;
    }

    /**
     * @param $column
     * @param $operator
     * @param $value
     * @param bool $startGroup
     * @param bool $endGroup
     * @return $this
     */
    public function andWhere($column, $operator, $value, $startGroup = false, $endGroup = false)
    {
        if(strpos($column, '.') === false)
            $column = "`{$this->getTable()}`.{$column}";
        if(is_array($value))
            foreach($value as $key=>$val) {
                $value['binding' . _unique_number()] = $val;
                unset($value[$key]);
            }
        $this->where[] = [
            'column'      => $column,
            'operator'    => $operator,
            'value'       => $value,
            'ao'          => 'and',
            'start_group' => $startGroup,
            'end_group'   => $endGroup
        ];
        $this->setBinding(str_ireplace(["`", "'", "."], ['', '', "_"], $column) . "_" . (count($this->where) - 1), $operator, $value);
        if($column == "`{$this->getTable()}`." . $this->primary && trim($operator) == '=')
            $this->targetRow = (int) $value;

        return $this;
    }

    public function orWhere($column, $operator, $value, $startGroup = false, $endGroup = false)
    {
        if(strpos($column, '.') === false)
            $column = "`{$this->getTable()}`.{$column}";
        if(is_array($value))
            foreach($value as $key=>$val) {
                $value['binding' . _unique_number()] = $val;
                unset($value[$key]);
            }
        $this->where[] = [
            'column'      => $column,
            'operator'    => $operator,
            'value'       => $value,
            'ao'          => 'or',
            'start_group' => $startGroup,
            'end_group'   => $endGroup
        ];
        $this->setBinding(str_ireplace(["`", "'", "."], ['', '', "_"], $column) . "_" . (count($this->where) - 1), $operator, $value);

        return $this;
    }

    public function getJoin()
    {
        return count($this->join) > 0 ? $this->join : [];
    }

    protected function checkForJoin($table)
    {
        $query = '
            SELECT
				information_schema.key_column_usage.constraint_name AS `name`,
				information_schema.key_column_usage.column_name AS `from`,
				information_schema.key_column_usage.referenced_column_name AS `to`
				FROM information_schema.key_column_usage
				INNER JOIN information_schema.referential_constraints
				ON information_schema.referential_constraints.constraint_name = information_schema.key_column_usage.constraint_name
			WHERE
				information_schema.key_column_usage.table_schema = :database
				AND information_schema.referential_constraints.constraint_schema  = :database
				AND information_schema.key_column_usage.constraint_schema  = :database
				AND information_schema.key_column_usage.table_name = :table
				AND information_schema.key_column_usage.referenced_table_name = :referenced_table
				AND information_schema.key_column_usage.constraint_name != \'PRIMARY\'
				AND information_schema.key_column_usage.referenced_table_name IS NOT NULL';

        $stmt = $this->processor->prepare($query);
        $stmt->execute([':database' => DB_DATABASE, ':table' => $table, ':referenced_table' => $this->getTable()]);
        $result = $stmt->fetchAll();
        if(!$result) {
            $stmt = $this->processor->prepare($query);
            $stmt->execute([':database' => DB_DATABASE, ':table' => $this->getTable(), ':referenced_table' => $table]);
            $result = $stmt->fetchAll();
            if(!$result)
                throw new \RuntimeException("No relation between {$table} and {$this->getTable()}");
        }
        $relation = [];
        foreach ( $result as $fk ) {
            $relation = [
                'name'          => $fk['name'],
                'from'          => $fk['from'],
                'to'            => $fk['to']
            ];
        }

        return $relation;
    }

    public function load($id)
    {
        if($this->getWhere())
            $this->andWhere($this->getPrimary(), '=', (int) $id);
        else
            $this->where($this->getPrimary(), '=', (int) $id);

        return $this->fetchOneAssoc(['limit'=> 1]);
    }

    public function loadByField($field, $value)
    {
        return $this->where($field, '=', $value)->fetchOneAssoc(['select' => '*', 'limit'=> 1]);
    }

    public function delete()
    {
        $this->processor->delete($this);
    }

    public function fetchOneAssoc(array $setting = [])
    {
        $stmt = $this->processor->select($this, $setting);

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function fetchAssoc(array $setting = [])
    {
        $stmt = $this->processor->select($this, $setting);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function fetchAssocPrimaryKey(array $setting = [])
    {
        $stmt = $this->processor->select($this, $setting);
        $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if(!$data)
            return $data;
        $refined_data = [];
        foreach ($data as $value) {
            $primary = $value[$this->getPrimary()];
            unset($value[$this->getPrimary()]);
            $refined_data[$primary] = $value;
        }

        return $refined_data;
    }

    public function fetchNumber(array $setting = [])
    {
        $stmt = $this->processor->select($this, $setting);
        $this->data = $stmt->fetch(\PDO::FETCH_NUM);

        return $this;
    }

    public function fetchAllAssoc(array $setting = [])
    {
        $setting['limit'] = null;
        $stmt = $this->processor->select($this, $setting);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function fetchAllAssocPrimaryKey(array $setting = [])
    {
        $stmt = $this->processor->select($this, $setting);
        $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if(!$data)
            return $data;
        $refined_data = [];
        foreach ($data as $value) {
            $primary = $value[$this->getPrimary()];
            unset($value[$this->getPrimary()]);
            $refined_data[$primary] = $value;
        }

        return $refined_data;
    }

    public function fetchAllNumber(array $setting = [])
    {
        $setting['limit'] = null;
        $stmt = $this->processor->select($this, $setting);

        return $stmt->fetchAll(\PDO::FETCH_NUM);
    }

    public function fetch(array $setting = []) {
        if($this->fetchPdoStatement == null)
            $this->fetchPdoStatement = $this->processor->select($this, $setting);
        $row = $this->fetchPdoStatement->fetch(\PDO::FETCH_ASSOC);
        if($row == false)
            $this->fetchPdoStatement = null;

        return $row;
    }

    public function getSelect()
    {
        return $this->selectFields ? $this->selectFields : '*';
    }

    public function select(array $fields)
    {
        $this->selectFields = $fields;

        return $this;
    }

    public function update(array $data)
    {
        if(count($this->getWhere()) == 0)
            throw new \RuntimeException("Where must be defined to update row");

        return $this->processor->update($this, $data);
    }

    public function insert(array $data)
    {
        $row = $this->processor->insert($this, $data);

        return $row;
    }

    public function insertOnUpdate($data)
    {
        return $this->processor->insertOnUpdate($this, $data);
    }

    public function reset()
    {
        $this->where = [];
        $this->binding = [];
        $this->join = [];
    }

    /**
     * @param null $groupBy
     * @return Table
     */
    public function groupBy($groupBy)
    {
        $this->groupBy = $groupBy;
        return $this;
    }

    /**
     * @param $column
     * @param $operator
     * @param $value
     * @param bool $startGroup
     * @param bool $endGroup
     * @return $this
     */
    public function having($column, $operator, $value, $startGroup = false, $endGroup = false)
    {
        if(strpos($column, '.') === false)
            $column = "`{$this->getTable()}`.{$column}";
        if(is_array($value))
            foreach($value as $key=>$val) {
                $value['binding' . _unique_number()] = $val;
                unset($value[$key]);
            }
        $this->having[] = [
            'column'      => $column,
            'operator'    => $operator,
            'value'       => $value,
            'ao'          => 'and',
            'start_group' => $startGroup,
            'end_group'   => $endGroup
        ];
        $this->setBinding(str_ireplace(["`", "'", "."], ['', '', "_"], $column) . "_0", $operator, $value);

        return $this;
    }

    /**
     * @param $column
     * @param $operator
     * @param $value
     * @param bool $startGroup
     * @param bool $endGroup
     * @return $this
     */
    public function andHaving($column, $operator, $value, $startGroup = false, $endGroup = false)
    {
        return $this->having($column, $operator, $value, $startGroup, $endGroup);
    }

    public function orHaving($column, $operator, $value, $startGroup = false, $endGroup = false)
    {
        if(strpos($column, '.') === false)
            $column = "`{$this->getTable()}`.{$column}";
        if(is_array($value))
            foreach($value as $key=>$val) {
                $value['binding' . _unique_number()] = $val;
                unset($value[$key]);
            }
        $this->having[] = [
            'column'      => $column,
            'operator'    => $operator,
            'value'       => $value,
            'ao'          => 'or',
            'start_group' => $startGroup,
            'end_group'   => $endGroup
        ];
        $this->setBinding(str_ireplace(["`", "'", "."], ['', '', "_"], $column) . "_" . (count($this->where) - 1), $operator, $value);

        return $this;
    }

    /**
     * @return string
     */
    public function getGroupBy()
    {
        return $this->groupBy;
    }

    /**
     * @return string
     */
    public function getHaving()
    {
        return $this->having;
    }
}
