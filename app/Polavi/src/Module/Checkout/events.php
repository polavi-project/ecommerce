<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Event\EventDispatcher $eventDispatcher */

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\_mysql;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Polavi\Module\Checkout\Middleware\Core\MiniCartMiddleware::class, 71);
    },
    0
);

$eventDispatcher->addListener(
    'register.checkout.index.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Polavi\Module\Customer\Middleware\Checkout\AccountMiddleware::class, 31);
    },
    0
);

$eventDispatcher->addListener(
    'register.customer.logout.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddlewareAfter(\Polavi\Module\Customer\Middleware\Logout\LogoutMiddleware::class, \Polavi\Module\Checkout\Middleware\Logout\ClearCartMiddleware::class);
    },
    0
);

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddlewareBefore(\Polavi\Middleware\ResponseMiddleware::class, \Polavi\Module\Checkout\Middleware\Cart\Add\ButtonMiddleware::class);
    },
    0
);
$eventDispatcher->addListener(
    'filter.mutation.type',
    function (&$fields, Container $container) {
        $fields['addShippingAddress'] = [
            'args' => [
                'address' => Type::nonNull($container->get(\Polavi\Module\Customer\Services\Type\AddressInputType::class)),
                'cartId' => Type::nonNull(Type::int())
            ],
            'type' => new ObjectType([
                'name'=> 'addShippingAddressOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'address' => $container->get(\Polavi\Module\Customer\Services\Type\AddressType::class)
                ]
            ]),
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $conn = _mysql();
                $address = $args['address'];
                $provinces = \Polavi\Services\Locale\Province::listStateV3();
                // TODO: Verify allow countries
                if($container->get(Polavi\Module\Checkout\Services\Cart\Cart::class)->isEmpty())
                    return ['status'=> false, 'address' => null, 'message' => 'Your shopping cart is empty'];

                if(
                    $container->get(Request::class)->getSession()->get('cart_id') != $args['cartId']
                )
                    return ['status'=> false, 'address' => null, 'message' => 'Permission denied'];

                if(
                    !isset($provinces[$address['country']]) ||
                    (
                        isset($address['province']) &&
                        !\Polavi\array_find($provinces[$address['country']], function ($value) use ($address) {
                            if($value['value'] == $address['province'])
                                return $value;
                            else
                                return null;
                        })
                    )
                )
                    return ['status'=> false, 'address' => null, 'message' => 'Country or Province is invalid'];


                $conn->getTable('cart_address')->insert($address);
                $id = $conn->getLastID();
                $container->get(\Polavi\Module\Checkout\Services\Cart\Cart::class)->setData('shipping_address_id', $id);

                return ['status'=> true, 'address' => $conn->getTable('cart_address')->load($id)];
            }
        ];

        $fields['addBillingAddress'] = [
            'args' => [
                'address' => $container->get(\Polavi\Module\Customer\Services\Type\AddressInputType::class),
                'cartId' => Type::nonNull(Type::int())
            ],
            'type' => new ObjectType([
                'name'=> 'addBillingAddressOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'address' => $container->get(\Polavi\Module\Customer\Services\Type\AddressType::class)
                ]
            ]),
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $conn = _mysql();
                $address = $args['address'];
                $provinces = \Polavi\Services\Locale\Province::listStateV3();
                // TODO: Verify allow countries
                if($container->get(Polavi\Module\Checkout\Services\Cart\Cart::class)->isEmpty())
                    return ['status'=> false, 'address' => null, 'message' => 'Your shopping cart is empty'];

                if(
                    $container->get(Request::class)->getSession()->get('cart_id') != $args['cartId']
                )
                    return ['status'=> false, 'address' => null, 'message' => 'Permission denied'];

                if($address == null) {
                    $container->get(\Polavi\Module\Checkout\Services\Cart\Cart::class)->setData('billing_address_id', null);
                    return ['status'=> true, 'address' => null];
                }
                if(
                    !isset($provinces[$address['country']]) ||
                    (
                        isset($address['province']) &&
                        !\Polavi\array_find($provinces[$address['country']], function ($value) use ($address) {
                            if($value['value'] == $address['province'])
                                return $value;
                            else
                                return null;
                        })
                    )
                )
                    return ['status'=> false, 'address' => null, 'message' => 'Country or Province is invalid'];

                $conn->getTable('cart_address')->insert($address);
                $id = $conn->getLastID();
                $container->get(\Polavi\Module\Checkout\Services\Cart\Cart::class)->setData('billing_address_id', $id);

                return ['status'=> true, 'address' => $conn->getTable('cart_address')->load($id)];
            }
        ];
    },
    5
);