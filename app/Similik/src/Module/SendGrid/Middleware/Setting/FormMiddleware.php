<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\SendGrid\Middleware\Setting;

use function Similik\_mysql;
use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getMethod() == 'POST')
            return $delegate;

        $this->getContainer()->get(Helmet::class)->setTitle("SendGrid email setting");
        $stm = _mysql()
            ->executeQuery("SELECT * FROM `setting`
WHERE language_id = :language
AND `name` LIKE 'sendgrid_%'
UNION
SELECT * FROM `setting`
WHERE `name` NOT IN (SELECT `name` FROM `setting` WHERE language_id = :language AND `name` LIKE 'sendgrid_%')
AND language_id = 0
AND `name` LIKE 'sendgrid_%'", ['language' => $request->attributes->get('language', get_default_language_Id())!= get_default_language_Id() ? $request->attributes->get('language', get_default_language_Id()) : 0]);

        $setting = [];
        while ($row = $stm->fetch()) {
            if($row['json'] == 1)
                $setting[$row['name']] = json_decode($row['value'], true);
            else
                $setting[$row['name']] = $row['value'];
        }

        $response->addWidget(
            'sendgrid_setting_form',
            'content',
            10,
            get_js_file_url("production/sendgrid/setting_form.js", true),
            array_merge($setting, [
                "formAction"=>$this->getContainer()->get(Router::class)->generateUrl('setting.sendgrid')
            ])
        );

        return $delegate;
    }
}