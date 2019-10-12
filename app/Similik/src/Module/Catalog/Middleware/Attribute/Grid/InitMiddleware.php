<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Grid;

use Similik\Services\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Symfony\Component\EventDispatcher\GenericEvent;

class InitMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @param Delegate|null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $columns = [
            [
                'name' => 'ID',
                'index' => 'attribute_id',
                'alias' => 'id',
                'table'=>'attribute',
                'sortable' => true,
                'filterable'=>true,
                'filter_type'=>'range'
            ],
            [
                'name' => 'Name',
                'index' => 'attribute_name',
                'table'=>'attribute',
                'sortable' => true,
                'filterable'=>true,
                'filter_type'=>'text'
            ],
            [
                'name' => 'Code',
                'index' => 'attribute_code',
                'table'=>'attribute',
                'sortable' => true,
                'filterable'=>true,
                'filter_type'=>'text'
            ],
            [
                'name' => 'Type',
                'index' => 'type',
                'table'=>'attribute',
                'sortable' => true,
                'filterable'=>true,
                'filter_type'=>'select',
                'filter_options'=>[
                    [
                        'value'=>'text',
                        'text'=> 'Text'
                    ],
                    [
                        'value'=>'select',
                        'text'=> 'Select'
                    ],
                    [
                        'value'=>'multiselect',
                        'text'=> 'Multi select'
                    ],
                    [
                        'value'=>'textarea',
                        'text'=> 'Textarea'
                    ],
                    [
                        'value'=>'date',
                        'text'=> 'Date'
                    ],
                    [
                        'value'=>'datetime',
                        'text'=> 'Date time'
                    ]
                ]
            ],
            [
                'name' => 'Is required?',
                'index' => 'is_required',
                'table'=>'attribute',
                'sortable' => true,
                'filter_type'=>'select',
                'filter_options'=>[
                    [
                        'value'=>0,
                        'text'=> 'No'
                    ],
                    [
                        'value'=>1,
                        'text'=> 'Yes'
                    ]
                ]
            ],
            [
                'name' => 'Display on frontend',
                'index' => 'display_on_frontend',
                'table'=>'attribute',
                'sortable' => true,
                'filter_type'=>'select',
                'filter_options'=>[
                    [
                        'value'=>0,
                        'text'=> 'No'
                    ],
                    [
                        'value'=>1,
                        'text'=> 'Yes'
                    ]
                ]
            ],
            [
                'name' => 'Action',
                'index' => 'action',
                'sortable' => false,
                'filterable' => false
            ]
        ];
        $event = new GenericEvent(null, [$columns]);
        dispatch_event('register_attribute_grid_column', $event);
        $delegate->offsetSet('grid_columns', $event->getArgument(0));
        $delegate->offsetSet('main_table', 'attribute');
        return $next($request, $response, $delegate);
    }
}