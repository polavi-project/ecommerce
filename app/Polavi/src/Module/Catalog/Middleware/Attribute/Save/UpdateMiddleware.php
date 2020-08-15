<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Attribute\Save;

use function Polavi\_mysql;
use Polavi\Services\Db\Processor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

class UpdateMiddleware extends MiddlewareAbstract
{
    /**@var Processor $conn*/
    protected $conn;

    /**
     * @param Request $request
     * @param Response $response
     * @param array|null $data
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->attributes->get('id', null) == null)
            return $delegate;

        $this->conn = _mysql();
        try {
            $conn = _mysql();
            $conn->getTable('attribute')
                ->where('attribute_id', '=', $request->attributes->get('id'))
                ->update($request->request->all());

            if (in_array($request->request->get('type'), ['select', 'multiselect']))
                $this->saveOptions((int) $request->attributes->get('id'), $request->request->get('attribute_code'), $request->request->get('options'));
            else
                $this->conn->getTable('attribute_option')->where('attribute_id', '=', $request->attributes->get('id'))->delete();

            $response->addAlert('attribute_save_success', 'success', 'Attribute saved')
                ->redirect($this->getContainer()->get(Router::class)->generateUrl('attribute.grid'));

            return $response;
        } catch(\Exception $e) {
            $response->addAlert('attribute_save_error', 'error', $e->getMessage());

            return $response;
        }
    }

    protected function saveOptions(int $attributeId, $attributeCode, array $options)
    {
        if (empty($options)) {
            $this->conn->getTable('attribute_option')
                ->where('attribute_id', '=', $attributeId)
                ->delete();
            return;
        }
        $oldOptions = [];
        $optionTable = $this->conn->getTable('attribute_option')
            ->where('attribute_id', '=', $attributeId);
        while ($row = $optionTable->fetch()) {
            $oldOptions[$row['attribute_option_id']] = $row['attribute_option_id'];
        }
        foreach ($oldOptions as $oId)
            if (!array_key_exists($oId, $options))
                $this->conn->getTable('attribute_option')
                    ->where('attribute_option_id', '=', $oId)
                    ->delete();
        foreach ($options as $key=>$option) {
            $optionData = [
                'attribute_id'  => $attributeId,
                'attribute_code' => $attributeCode,
                'option_text' => $option['option_text']
            ];
            if (!array_key_exists($key, $oldOptions))
                $this->conn->getTable('attribute_option')->insert($optionData);
            else {
                $this->conn->getTable('attribute_option')
                    ->where('attribute_option_id', '=', $key)
                    ->update($optionData);
            }
        }
    }
}