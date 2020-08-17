<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Marketing\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;
use Polavi\Services\Routing\Router;

class SubscriberType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Subscriber',
            'fields' => function () use ($container) {
                $fields = [
                    'newsletter_subscriber_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'customer_id' => [
                        'type' => Type::id()
                    ],
                    'status' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'email' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'full_name' => [
                        'type' => Type::string()
                    ],
                    'customerEditUrl' => [
                        'type' => Type::string(),
                        'resolve' => function ($subscriber, $args, Container $container, ResolveInfo $info) {
                            if ($container->get(Request::class)->isAdmin() == false || !$subscriber["customer_id"])
                                return null;
                            return $container->get(Router::class)->generateUrl('customer.edit', ["id"=>$subscriber['customer_id']]);
                        }
                    ],
                    'subscribeUrl' => [
                        'type' => Type::string(),
                        'resolve' => function ($subscriber, $args, Container $container, ResolveInfo $info) {
                            if ($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('newsletter.subscribe');
                        }
                    ],
                    'unsubscribeUrl' => [
                        'type' => Type::string(),
                        'resolve' => function ($subscriber, $args, Container $container, ResolveInfo $info) {
                            if ($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('admin.newsletter.unsubscribe');
                        }
                    ]
                ];

                dispatch_event('filter.subscriber.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function ($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}