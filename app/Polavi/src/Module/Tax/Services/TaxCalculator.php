<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Tax\Services;

use function Polavi\get_config;
use Polavi\Services\Db\Processor;
use function Polavi\the_container;

class TaxCalculator
{
    static protected $country;

    static protected $province;

    static protected $postcode;

    static protected $rates;

    /**
     * @return mixed
     */
    public static function getCountry()
    {
        return self::$country;
    }

    /**
     * @param mixed $country
     */
    public static function setCountry($country)
    {
        self::$country = $country;
    }

    /**
     * @return mixed
     */
    public static function getProvince()
    {
        return self::$province;
    }

    /**
     * @param mixed $province
     */
    public static function setProvince($province)
    {
        self::$province = $province;
    }

    /**
     * @return mixed
     */
    public static function getPostcode()
    {
        return self::$postcode;
    }

    /**
     * @param mixed $postcode
     */
    public static function setPostcode($postcode)
    {
        self::$postcode = $postcode;
    }

    public static function getTaxRates($taxClassId)
    {
        $postcode = self::$postcode ? self::$postcode : get_config('sale_default_tax_postcode', '*');
        $province = self::$province ? self::$province : get_config('sale_default_tax_province', '*');
        $country = self::$country ? self::$country : get_config('sale_default_tax_country', 'US');

        if(isset(self::$rates[$taxClassId][$country . $province . $postcode]))
            return self::$rates[$taxClassId][$country . $province . $postcode];

        $conn = the_container()->get(Processor::class);
        $taxRates = $conn->getTable('tax_rate')
            ->where('tax_class_id', '=', (int)$taxClassId)
            ->fetchAllAssoc([
            'sort_by'    => 'priority',
            'sort_order' => 'ASC',
        ]);

        foreach ($taxRates as $key=>$value) {
            if($value['postcode'] != $postcode and $postcode != '*')
                unset($taxRates[$key]);
            elseif($value['province'] != $province and $province != '*')
                unset($taxRates[$key]);
            elseif($value['country'] != $country and $country != '*')
                unset($taxRates[$key]);
        }

        if(empty($taxRates))
            return [];

        $applicableRates = [];
        reset($taxRates);
        $applicableRates[] = current($taxRates);

        foreach ($taxRates as $key=>$value) {
            $prev = end($applicableRates);
            if($prev['priority']!=$value['priority']) {
                $applicableRates[] = $value;
            } else {
                if($prev['country']==$value['country'] and $prev['province']==$value['province'] and $prev['postcode']==$value['postcode']) {
                    array_pop($applicableRates);
                    $applicableRates[] = ($prev['tax_rate_id'] > $value['tax_rate_id']) ? $value : $prev;
                    continue;
                }

                if($prev['postcode']=='*' and $value['postcode']!='*') {
                    array_pop($applicableRates);
                    $applicableRates[] = $value;
                    continue;
                } else if($prev['postcode']!='*' and $value['postcode']=='*') {
                    array_pop($applicableRates);
                    $applicableRates[] = $prev;
                    continue;
                }

                if($prev['province']=='*' and $value['province']!='*') {
                    array_pop($applicableRates);
                    $applicableRates[] = $value;
                    continue;
                } else if($prev['province']!='*' and $value['province']=='*') {
                    array_pop($applicableRates);
                    $applicableRates[] = $prev;
                    continue;
                }

                if($prev['country']=='*' and $value['country']!='*') {
                    array_pop($applicableRates);
                    $applicableRates[] = $value;
                    continue;
                } else if($prev['country']!='*' and $value['country']=='*') {
                    array_pop($applicableRates);
                    $applicableRates[] = $prev;
                    continue;
                }
            }
        }
        self::$rates[$taxClassId][$country . $province . $postcode] = $applicableRates;

        return self::$rates[$taxClassId][$country . $province . $postcode];
    }

    public static function getTaxPercent($taxClassId)
    {
        $rates = self::getTaxRates($taxClassId);
        $taxPercent = 0;

        foreach ($rates as $key=>$rate) {
            $_rate = $rate['rate'] / 100;
            if($rate['is_compound'] == 1) {
                $taxPercent = $taxPercent + $_rate + $taxPercent * $_rate;
            } else {
                $taxPercent = $taxPercent + $_rate;
            }
        }

        return $taxPercent * 100;
    }

    public static function getTaxAmount($price, $taxPercent, $rounding = true)
    {
        if($taxPercent == 0)
            return 0;
        if(get_config('sale_entered_price_tax', 0) == 0) {
            $taxAmount = $price * $taxPercent / 100;
        } else {
            $taxAmount = ($price * ($taxPercent/100)) / (1 + $taxPercent / 100);
        }
        if($rounding == true) {
            switch ((int)get_config('sale_tax_calculation_rounding', 0)) {
                case 1:
                    $taxAmount = ceil($taxAmount);
                    break;
                case -1:
                    $taxAmount = floor($taxAmount);
                    break;
            }
        }

        return $taxAmount;
    }

    public static function getTaxedPrice($price, $taxClass)
    {
        if(get_config('sale_entered_price_tax', 0) == 0) {
            return [
                'price_excl_tax' => $price,
                'price_incl_tax' => $price + self::getTaxAmount($price, $taxClass)
            ];
        } else {
            return [
                'price_excl_tax' => $price - self::getTaxAmount($price, $taxClass),
                'price_incl_tax' => $price
            ];
        }
    }
}