<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use function GuzzleHttp\Promise\settle;
use function Similik\_mysql;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;

class SaveCartMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true)
            return $delegate;

        $cart = $this->getContainer()->get(Cart::class);
        if($cart->isEmpty()) {
            if($cart->getPromises()) {
                $promise = settle($cart->getPromises());
                $promise->wait();
            }
            return $delegate;
        }

        $conn = _mysql();
        $conn->startTransaction();

        try {
            if(!$cart->getData('cart_id')) {
                $conn->getTable('cart')->insert($cart->toArray());
                $cartId = $conn->getLastID();
            } else {
                $conn->getTable('cart')->where('cart_id', '=', $cart->getData('cart_id'))->update($cart->toArray());
                $cartId = $cart->getData('cart_id');
            }

            $items = $cart->getItems();
            $oldItems = $conn->getTable('cart_item')->where('cart_id', '=', $cartId)->fetchAllAssoc();
            foreach ($oldItems as $item) {
                $flag = false;
                foreach ($items as $i) {
                    if($item['cart_item_id'] == $i->getData('cart_item_id')) {
                        $flag = true;
                        break;
                    }
                }

                if($flag == false)
                    $conn->getTable('cart_item')->where('cart_item_id', '=', $item['cart_item_id'])->delete();
            }

            foreach ($items as $item) {
                if(!$conn->getTable('cart_item')->load($item->getData('cart_item_id'))) {
                    $conn->getTable('cart_item')->insert(array_merge($item->toArray(), ['cart_id'=>$cartId]));
                } else {
                    $conn->getTable('cart_item')->where('cart_item_id', '=', $item->getData('cart_item_id'))->update(array_merge($item->toArray(), ['cart_id'=>$cartId]));
                }
            }

            $conn->commit();
            $request->getSession()->set('cart_id', $cartId);
            $promise = settle($cart->getPromises());
            $promise->wait();
            $response->addState('cart', [
                'subTotal' => $cart->getData('sub_total'),
                'taxAmount' => $cart->getData('tax_amount'),
                'shippingFee' => $cart->getData('shipping_fee_excl_tax'),
                'coupon' => $cart->getData('coupon'),
                'discountAmount' => $cart->getData('discount_amount'),
                'grandTotal' => $cart->getData('grand_total'),
                'totalWeight' => $cart->getData('total_weight'),
                'count' => count($cart->getItems()),
                'paymentMethod' => $cart->getData('payment_method'),
                'shippingMethod' => $cart->getData('shipping_method')
            ]);
        } catch (\Exception $e) {
            $conn->rollback();
            $response->addAlert('cart_save_error', 'error', $e->getMessage())->notNewPage();
        }

        if($response->isRedirect())
            return $response;

        return $delegate;
    }
}