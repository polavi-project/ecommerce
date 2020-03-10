<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use function Similik\_mysql;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Module\Checkout\Services\Cart\Item;
use Similik\Module\Tax\Services\TaxCalculator;
use Similik\Services\Routing\Router;

$eventDispatcher->addListener(
        'before_execute_' . strtolower(str_replace('\\', '_', \Similik\Middleware\AdminNavigationMiddleware::class)),
        function (\Similik\Services\Di\Container $container) {
            $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
                'tax_class',
                'Tax',
                $container->get(Router::class)->generateUrl('tax.class.list'),
                'print',
                'setting',
                10
            );
        },
        0
);


$eventDispatcher->addListener("register_cart_field", function(&$fields) use($container) {
    // Register discount to cart
    $fields["shipping_fee_incl_tax"] = [
        "resolver" => function(Cart $cart) use($container) {
            return $cart->getData('shipping_fee_excl_tax'); // TODO: Adding tax
        },
        "dependencies" => ['shipping_fee_excl_tax']
    ];

    $fields["tax_amount"] = [
        "resolver" => function(Cart $cart) {
            $itemTax = 0;
            foreach ($cart->getItems() as $item)
                $itemTax += $item->getData('tax_amount');
            return $itemTax + $cart->getData('shipping_fee_incl_tax') - $cart->getData('shipping_fee_excl_tax');
        },
        "dependencies" => ["shipping_fee_incl_tax", "discount_amount"]
    ];

    $fields["grand_total"] = [
        "resolver" => function(Cart $cart) use ($fields){
            return $fields["grand_total"]["resolver"]($cart) + $cart->getData('tax_amount');
        },
        "dependencies" => array_merge($fields["grand_total"]["dependencies"], ["tax_amount"])
    ];
});

$eventDispatcher->addListener("register_cart_item_field", function(array &$fields) {
    $fields["tax_percent"] = [
        "resolver" => function(Item $item) {
            $conn = _mysql();
            $shippingAddress = $conn->getTable('cart_address')->load($this->cart->getData('shipping_address_id'));
            if($shippingAddress) {
                TaxCalculator::setCountry($shippingAddress['country']);
                TaxCalculator::setProvince($shippingAddress['province']);
                TaxCalculator::setPostcode($shippingAddress['postcode']);
            }
            return TaxCalculator::getTaxPercent($item->getDataSource()['product']['tax_class']);
        }
    ];

    $fields["tax_amount"] = [
        "resolver" => function(Item $item) use ($fields){
            return TaxCalculator::getTaxAmount(
                $item->getData('product_price') * $item->getData('qty'),
                $item->getData('tax_percent')
            );
        },
        "dependencies" => ["product_price", "qty", "tax_percent", "discount_amount"]
    ];

    $fields["product_price_incl_tax"] = [
        "resolver" => function(Item $item) use ($fields){
            return TaxCalculator::getTaxAmount(
                    $item->getData('product_price'),
                    $item->getData('tax_percent')
                ) + $item->getData('product_price');
        },
        "dependencies" => ["product_price", "tax_percent"]
    ];

    $fields["final_price_incl_tax"] = [
        "resolver" => function(Item $item) use ($fields){
            return TaxCalculator::getTaxAmount(
                    $item->getData('final_price'),
                    $item->getData('tax_percent')
                ) + $item->getData('final_price');
        },
        "dependencies" => ["final_price", "tax_percent"]
    ];

    $fields["total"] = [
        "resolver" => function(Item $item) use ($fields){
            return $item->getData('final_price')
                * $item->getData('qty')
                + $item->getData('tax_amount');
        },
        "dependencies" => ["final_price", "qty", "tax_amount"]
    ];
});