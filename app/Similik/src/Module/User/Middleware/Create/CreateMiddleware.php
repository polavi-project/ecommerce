<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Middleware\User\Create;

use Similik\App;
use Similik\Db\Mysql;
use Similik\Services\Locale\Country;
use Similik\Services\Locale\Province;
use Similik\Services\Url;
use Similik\Middleware\MiddlewareAbstract;

class CreateMiddleware extends Mysql extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $delegate = $this->loadToCreate();
        return $next($request, $response, $delegate);
    }

    private function loadToCreate()
    {
        try{
            $tax_rate = array_fill_keys($this->getTable('tax_class')->getColumnNames(), null);;
            $tax_rate['tax_rates'] = [];
            $tax_rate['save_action'] = Url::buildUrl('tax/class/save');
            $tax_rate['countries'] = Country::listCountriesV2();
            $tax_rate['regions'] = Province::listStateV3();
            return $tax_rate;
        } catch (\Exception $e) {
            return $e;
        }
    }
}