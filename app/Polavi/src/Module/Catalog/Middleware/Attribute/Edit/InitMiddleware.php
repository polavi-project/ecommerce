<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Attribute\Edit;

use Polavi\Services\Db\Processor;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Response;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;

class InitMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $id = (int) $request->attributes->get('id');
        if($id) {
            if($this->getContainer()->get(Processor::class)->getTable('attribute')->load($id) === false) {
                $response->addData('success', 0)
                        ->addData('message', 'Requested attribute does not exist')
                        ->setStatusCode(404);

                return $response;
            }
            $this->getContainer()->get(Helmet::class)->setTitle("Edit attribute");
        } else {
            $this->getContainer()->get(Helmet::class)->setTitle("Create new attribute");
        }

        return $delegate;
    }
}