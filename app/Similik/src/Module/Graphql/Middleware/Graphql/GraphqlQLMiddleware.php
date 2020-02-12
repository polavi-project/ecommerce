<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Graphql\Middleware\Graphql;


use GraphQL\Error\Error;
use GraphQL\Executor\ExecutionResult;
use Similik\Module\Graphql\Services\ExecutionPromise;
use Similik\Module\Graphql\Services\MutationType;
use Similik\Module\Graphql\Services\QueryType;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;
use GraphQL\Type\Schema;
use GraphQL\GraphQL;
use GraphQL\Error\FormattedError;

class GraphqlQLMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     * @throws \Throwable
     * @internal param callable $next
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $myErrorFormatter = function(Error $error) {
                return FormattedError::createFromException($error);
            };

            $myErrorHandler = function(array $errors, callable $formatter) {
                throw new \Exception($errors[0]->message);
            };
            // GraphQL schema to be passed to query executor:
            $schema = new Schema([
                'query' => $this->getContainer()->get(QueryType::class),
                'mutation' => $this->getContainer()->get(MutationType::class)
            ]);

            $delegate = GraphQL::executeQuery(
                $schema,
                $request->get('query'),
                null,
                $this->getContainer(),
                $request->get('variables', [])
            )->setErrorFormatter($myErrorFormatter)->setErrorsHandler($myErrorHandler);

            $this->getContainer()->set(ExecutionResult::class, $delegate);

            $response->addData('payload', array_merge($delegate->toArray(false), ['success'=> true, 'message'=> '']));
        } catch (\Exception $error) {
            $response->addData('payload', ['success'=> false, 'message'=> $error->getMessage(), 'data'=>[]]);
        }

        return $delegate;
    }
}