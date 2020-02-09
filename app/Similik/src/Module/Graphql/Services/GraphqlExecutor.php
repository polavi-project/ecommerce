<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Graphql\Services;

use GraphQL\Error\Debug;
use GraphQL\Error\Error;
use GraphQL\Error\FormattedError;
use GraphQL\Executor\ExecutionResult;
use GraphQL\GraphQL;
use GraphQL\Server\OperationParams;
use GraphQL\Server\ServerConfig;
use GraphQL\Server\StandardServer;
use GraphQL\Type\Schema;
use GuzzleHttp\Promise\Promise;
use function GuzzleHttp\Promise\settle;
use Similik\Services\Di\Container;


class GraphqlExecutor extends Promise
{
    /** @var OperationParams|OperationParams[] $operationParams */
    protected $operationParams = [];

    /** @var Schema $schema */
    private $schema;

    /** @var Container $container */
    private $container;

    /**@var Promise[] */
    protected $promises = [];

    /**@var ExecutionResult[] $result*/
    protected $results;

    public function __construct(Schema $schema, Container $container)
    {
        $this->schema = $schema;
        $this->container = $container;
        parent::__construct(function() {
            $this->execute();
            $promise = settle($this->promises);
            $promise->wait();
            $promise->then(function($result) {
                $this->resolve($result);
            });
        });
    }

    /**
     * Register a query
     *
     * @param array $operationParams
     *
     * @return Promise
     *
     */
    public function waitToExecute(array $operationParams)
    {
        $this->operationParams[] = OperationParams::create($operationParams);
        $id = count($this->operationParams) - 1;
        $promise = new Promise(function() use (&$promise, $id) {
            $result = $this->results[$id];
            if($result->data)
                $promise->resolve($result);
            else
                $promise->reject($result->errors);
        });

        $this->promises[] = $promise;

        return $promise;
    }

    public function execute() {
        $config = ServerConfig::create()
            ->setSchema($this->schema)
            ->setContext($this->container)
            ->setQueryBatching(true)
            ->setErrorFormatter(function(array $errors, callable $formatter) {
                return array_map($formatter, $errors);
            })
            ->setErrorsHandler(function(Error $error) {
                return new \Exception($error->getMessage());
            })
            ->setDebug(true)
        ;

        $server = new StandardServer($config);

        $this->results = $server->executeRequest($this->operationParams);

        return $this;
    }

    /**
     * @return OperationParams|OperationParams[]
     */
    public function getOperationParams()
    {
        return $this->operationParams;
    }

    /**
     * @return Promise[]
     */
    public function getPromises(): array
    {
        return $this->promises;
    }
}