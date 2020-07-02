<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Setting\Middleware\Shipment;

use function Polavi\_mysql;
use function Polavi\get_default_language_Id;
use function Polavi\get_js_file_url;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;
// TODO: move this middlewre to Flatrate module
class FlatRateFormMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getMethod() == 'POST')
            return $delegate;

        $stm = _mysql()
            ->executeQuery("SELECT * FROM `setting`
WHERE language_id = :language
AND `name` LIKE 'payment_flat_rate_%'
UNION 
SELECT * FROM `setting`
WHERE `name` NOT IN (SELECT `name` FROM `setting` WHERE language_id = :language AND `name` LIKE 'payment_flat_rate_%') 
AND language_id = 0
AND `name` LIKE 'shipment_flat_rate_%'", ['language' => $request->attributes->get('language', get_default_language_Id())!= get_default_language_Id() ? $request->attributes->get('language', get_default_language_Id()) : 0]);

        $data = [];
        while ($row = $stm->fetch()) {
            if($row['json'] == 1)
                $data[$row['name']] = json_decode($row['value'], true);
            else
                $data[$row['name']] = $row['value'];
        }

        $response->addWidget(
            'flat_rate_shipment_form',
            'shipment-setting',
            10,
            get_js_file_url("production/flat_rate/setting/flat_rate_form.js", true),
            array_merge($data, [
                "action"=>$this->getContainer()->get(Router::class)->generateUrl('setting.shipment', ['method'=>'flat_rate']),
            ])
        );

        return $delegate;
    }
}