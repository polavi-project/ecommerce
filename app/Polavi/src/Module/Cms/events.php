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
use function Polavi\get_default_language_Id;
use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;
use Polavi\Services\Routing\Router;

$eventDispatcher->addListener(
        'filter.query.type',
        function (&$fields) use ($container) {
            /**@var array $fields*/
            $fields += [
                'cmsPage' => [
                    'type' => $container->get(\Polavi\Module\Cms\Services\Type\CmsPageType::class),
                    'description' => 'Return a cms page',
                    'args' => [
                        'id' => Type::nonNull(Type::id()),
                        'language' => Type::nonNull(Type::id())
                    ],
                    'resolve' => function($value, $args, \Polavi\Services\Di\Container $container, ResolveInfo $info) {
                        $cmsWidgetTable = $container->get(\Polavi\Services\Db\Processor::class)
                            ->getTable('cms_page')
                            ->where('cms_page_id', '=', $args['id']);
                        if($container->get(\Polavi\Services\Http\Request::class)->isAdmin() === false)
                            $cmsWidgetTable->andWhere('status', '=', 1);
                        $cmsWidgetTable->leftJoin('cms_page_description', null, [
                            [
                                'column'      => "cms_page_description.language_id",
                                'operator'    => "=",
                                'value'       => $args['language'],
                                'ao'          => 'and',
                                'start_group' => null,
                                'end_group'   => null
                            ]
                        ]);

                        return $cmsWidgetTable->fetchOneAssoc();
                    }
                ]
            ];
            $fields += [
                'pageCollection' => [
                    'type' => $container->get(\Polavi\Module\Cms\Services\Type\PageCollectionType::class),
                    'description' => "Return list of cms page and total count",
                    'args' => [
                        'filter' =>  [
                            'type' => $container->get(\Polavi\Module\Cms\Services\Type\PageCollectionFilterType::class)
                        ]
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        if($container->get(\Polavi\Services\Http\Request::class)->isAdmin() == false)
                            return [];
                        $collection = new \Polavi\Module\Cms\Services\PageCollection($container);
                        return $collection->getData($rootValue, $args, $container, $info);
                    }
                ]
            ];


            $fields += [
                'cmsWidget' => [
                    'type' => $container->get(\Polavi\Module\Cms\Services\Type\WidgetType::class),
                    'description' => 'Return a widget',
                    'args' => [
                        'id' => Type::nonNull(Type::id())
                    ],
                    'resolve' => function($value, $args, \Polavi\Services\Di\Container $container, ResolveInfo $info) {
                        $cmsWidgetTable = _mysql()
                            ->getTable('cms_widget')
                            ->where('cms_widget_id', '=', $args['id']);
                        if($container->get(\Polavi\Services\Http\Request::class)->isAdmin() === false)
                            $cmsWidgetTable->andWhere('status', '=', 1);

                        return $cmsWidgetTable->fetchOneAssoc();
                    }
                ]
            ];
            $fields += [
                'widgetCollection' => [
                    'type' => $container->get(\Polavi\Module\Cms\Services\Type\WidgetCollectionType::class),
                    'description' => "Return list of widget and total count",
                    'args' => [
                        'filter' =>  [
                            'type' => $container->get(\Polavi\Module\Cms\Services\Type\WidgetCollectionFilterType::class)
                        ]
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        $collection = new \Polavi\Module\Cms\Services\WidgetCollection($container);
                        return $collection->getData($rootValue, $args, $container, $info);
                    }
                ]
            ];
        },
        0
);

$eventDispatcher->addListener(
    'filter.mutation.type',
    function (&$fields, Container $container) {
        $fields['uploadMedia'] = [
            'args'=> [
                'targetPath'=> Type::string()
            ],
            'type' => new ObjectType([
                'name'=> 'uploadMediaOutput',
                'fields' => [
                    'files' => Type::listOf(new ObjectType([
                        'name' => "FileUploadOutput",
                        'fields' => [
                            'status' => Type::nonNull(Type::boolean()),
                            'message'=> Type::string(),
                            'file' => $container->get(\Polavi\Module\Cms\Services\Type\FileType::class)
                        ]
                    ]))
                ]
            ]),
            'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
                $allowType = ["image/jpeg", "image/png", "image/gif"];
                $request = $container->get(\Polavi\Services\Http\Request::class);
                /**@var \Symfony\Component\HttpFoundation\File\UploadedFile[] $files */
                $files = $request->files->all();
                if(!$files)
                    return null;
                if($request->isAdmin() == false)
                    return array_fill(0, count($files), [
                        'status' => false,
                        'message'=> 'Permission denied',
                        'file' => null
                    ]);
                $targetPath = MEDIA_PATH . DS . $args['targetPath'];
                $fileSystem = new \Symfony\Component\Filesystem\Filesystem();
                if(!$fileSystem->exists($targetPath))
                    $fileSystem->mkdir($targetPath);
                $outPut = [];
                foreach ($files as $file) {
                    $name = str_replace(' ', '_', $file->getClientOriginalName());
                    $i = 0;
                    while ($fileSystem->exists($targetPath . DS . $name)) {
                        $name = str_replace('.' . $file->getClientOriginalExtension(), '_' . ++ $i . '.' . $file->getClientOriginalExtension(), $name);
                    }

                    try {
                        if(!in_array($file->getMimeType(), $allowType))
                            throw new Exception("Type of file is not allowed");
                        $file = $file->move($targetPath, $name);
                        $outPut[] = [
                            'status' => true,
                            'file' => [
                                'name'=> $file->getFilename(),
                                'type'=> $file->getMimeType(),
                                'size'=> $file->getSize(),
                                'path'=> $args['targetPath'] . '/' . $file->getFilename(),
                                'url'=> \Polavi\get_base_url_scheme_less() . '/public/media/' . $args['targetPath'] . '/' . $file->getFilename()
                            ]
                        ];
                    } catch (Exception $e) {
                        $outPut[] = [
                            'status' => false,
                            'message' => $e->getMessage(),
                            'file' => null
                        ];
                    }
                }

                return ['files' => $outPut];
            }
        ];

        $fields['createCmsPage'] = [
            'args'=> [
                'page' => [
                    'type' => $container->get(\Polavi\Module\Cms\Services\Type\CmsPageInputType::class)
                ]
            ],
            'type' => new ObjectType([
                'name'=> 'createCmsPageOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'page' => $container->get(\Polavi\Module\Cms\Services\Type\CmsPageType::class)
                ]
            ]),
            'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
            //var_dump($args);
                $conn = _mysql();
                $data = $args['page'];

                if(
                    $container->get(Request::class)->isAdmin() == false
                )
                    return ['status'=> false, 'page' => null, 'message' => 'Permission denied'];
                else {
                    if(isset($data['id']) and $data['id']) {
                        $page = $conn->getTable('cms_page')->load($data['id']);
                        if(!$page)
                            return ['status'=> false, 'page' => null, 'message' => 'Requested page does not exist'];
                        $conn->getTable('cms_page')->where('cms_page_id', '=', $data['id'])->update($data);
                        $conn->getTable('cms_page_description')
                            ->insertOnUpdate(array_merge($data, ['cms_page_description_cms_page_id' => $data['id'], 'language_id' =>get_default_language_Id()]));
                        return [
                            'status'=> true,
                            'page' =>$conn->getTable('cms_page')->leftJoin('cms_page_description', null, [
                                [
                                    'column'      => "cms_page_description.language_id",
                                    'operator'    => "=",
                                    'value'       => get_default_language_Id(),
                                    'ao'          => 'and',
                                    'start_group' => null,
                                    'end_group'   => null
                                ]])->load($data['id'])
                        ];
                    } else {
                        $conn->getTable('cms_page')->insert($data);
                        $id = $conn->getLastID();
                        $conn->getTable('cms_page_description')->insert(array_merge($data, ['cms_page_description_cms_page_id' => $id, 'language_id' =>get_default_language_Id()]));
                        return [
                            'status'=> true,
                            'page' =>$conn->getTable('cms_page')->leftJoin('cms_page_description', null, [
                                [
                                    'column'      => "cms_page_description.language_id",
                                    'operator'    => "=",
                                    'value'       => get_default_language_Id(),
                                    'ao'          => 'and',
                                    'start_group' => null,
                                    'end_group'   => null
                                ]])->load($id)
                        ];
                    }
                }
            }
        ];

        $fields['createWidget'] = [
            'args'=> [
                'widget' => [
                    'type' => $container->get(\Polavi\Module\Cms\Services\Type\WidgetInputType::class)
                ]
            ],
            'type' => new ObjectType([
                'name'=> 'createWidgetOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'widget' => $container->get(\Polavi\Module\Cms\Services\Type\WidgetType::class)
                ]
            ]),
            'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
                //var_dump($args);
                $conn = _mysql();
                $data = $args['widget'];
                $data['sort_order'] = (int)$data['sort_order'];
                $data['setting'] = json_encode($data['setting'], JSON_NUMERIC_CHECK);
                $data['display_setting'] = json_encode($data['display_setting'], JSON_NUMERIC_CHECK);
                if(isset($data['id']) and $data['id']) {
                    $page = $conn->getTable('cms_widget')->load($data['id']);
                    if(!$page)
                        return ['status'=> false, 'widget' => null, 'message' => 'Requested widget does not exist'];
                    $conn->getTable('cms_widget')->where('cms_widget_id', '=', $data['id'])->update($data);
                    return [
                        'status'=> true,
                        'widget' =>$conn->getTable('cms_widget')->load($data['id'])
                    ];
                } else {
                    $conn->getTable('cms_widget')->insert($data);
                    $id = $conn->getLastID();
                    return [
                        'status'=> true,
                        'widget' =>$conn->getTable('cms_widget')->load($id)
                    ];
                }
            }
        ];
    },
    5
);

$eventDispatcher->addListener(
        "admin_menu",
        function (array $items) {
            return array_merge($items, [
                [
                    "id" => "cms",
                    "sort_order" => 40,
                    "url" => null,
                    "title" => "CMS",
                    "parent_id" => null
                ],
                [
                    "id" => "cms_pages",
                    "sort_order" => 10,
                    "url" => \Polavi\generate_url("page.grid"),
                    "title" => "Pages",
                    "icon" => "file-alt",
                    "parent_id" => "cms"
                ],
                [
                    "id" => "cms_widgets",
                    "sort_order" => 20,
                    "url" => \Polavi\generate_url("widget.grid"),
                    "title" => "Widgets",
                    "icon" => "th-large
                    ",
                    "parent_id" => "cms"
                ]
            ]);
    },
    0
);

$eventDispatcher->addListener(
    'widget_types',
    function ($types) {
        $types[] = ['code' => 'text', 'name' => 'Text widget'];
        $types[] = ['code' => 'menu', 'name' => 'Menu widget'];

        return $types;
    },
    0
);

$eventDispatcher->addListener('register.widget.create.middleware', function(\Polavi\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Polavi\Module\Cms\Middleware\TextWidget\FormMiddleware::class, 0);
    $mm->registerMiddleware(\Polavi\Module\Cms\Middleware\MenuWidget\FormMiddleware::class, 0);
});

$eventDispatcher->addListener('register.widget.edit.middleware', function(\Polavi\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Polavi\Module\Cms\Middleware\TextWidget\FormMiddleware::class, 0);
    $mm->registerMiddleware(\Polavi\Module\Cms\Middleware\MenuWidget\FormMiddleware::class, 0);
});

$eventDispatcher->addListener('register.admin.graphql.api.middleware', function(\Polavi\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Polavi\Module\Cms\Middleware\Widget\BeforeSaveMiddleware::class, 0);
});

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Polavi\Module\Cms\Middleware\TextWidget\TextWidgetMiddleware::class, 21);
        $middlewareManager->registerMiddleware(\Polavi\Module\Cms\Middleware\MenuWidget\MenuWidgetMiddleware::class, 21);
        $middlewareManager->registerMiddleware(\Polavi\Module\Cms\Middleware\Page\View\LogoMiddleware::class, 22);
        $middlewareManager->registerMiddlewareBefore(\Polavi\Middleware\ResponseMiddleware::class, \Polavi\Module\Cms\Middleware\Page\View\NotFoundPageMiddleware::class);
    },
    5
);