<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Tax\Middleware\Save;


use function Similik\_mysql;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

class SaveMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $conn = _mysql();
        $conn->startTransaction();
        try {
            $data = $request->request->all();
            $id = $request->request->get('id');
            if($id)
                $conn->getTable('tax_class')->where('tax_class_id', '=', $id)->update($data);
            else {
                $conn->getTable('tax_class')->insert($data);
                $id = $conn->getLastID();
            }
            $conn->getTable('tax_rate')->where('tax_class_id', '=', $id)->delete();
            $rates = isset($data['tax_rate']) ? $data['tax_rate'] : [];
            array_walk($rates, function (&$value) use($id) {
               $value['tax_class_id'] = $id;
            });
            foreach ($rates as $key=>$value) {
                $value['country'] = (isset($value['country']) and $value['country']) ? $value['country'] : '*';
                $value['province'] = (isset($value['province']) and $value['province']) ? $value['province'] : '*';
                $value['postcode'] = (isset($value['postcode']) and $value['province']) ? $value['postcode'] : '*';
                $conn->getTable('tax_rate')->insert($value);
            }
            $conn->commit();
            $response->addAlert('tax_class_update_success', 'success', "Tax setting saved successfully");
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('tax.class.list'));
        } catch (\Exception $e) {
            $conn->rollback();
            $response->addAlert('tax_class_update_error', 'error', $e->getMessage())->notNewPage();
        }

        return $response;
    }
}