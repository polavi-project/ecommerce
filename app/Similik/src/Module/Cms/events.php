<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\_mysql;
use function Similik\get_default_language_Id;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;
use Similik\Services\Routing\Router;

$eventDispatcher->addListener(
        'filter.query.type',
        function (&$fields) use ($container) {
            /**@var array $fields*/
            $fields += [
                'cmsPage' => [
                    'type' => $container->get(\Similik\Module\Cms\Services\Type\CmsPageType::class),
                    'description' => 'Return a cms page',
                    'args' => [
                        'id' => Type::nonNull(Type::id()),
                        'language' => Type::nonNull(Type::id())
                    ],
                    'resolve' => function($value, $args, \Similik\Services\Di\Container $container, ResolveInfo $info) {
                        $cmsWidgetTable = $container->get(\Similik\Services\Db\Processor::class)
                            ->getTable('cms_page')
                            ->where('cms_page_id', '=', $args['id']);
                        if($container->get(\Similik\Services\Http\Request::class)->isAdmin() === false)
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
                    'type' => $container->get(\Similik\Module\Cms\Services\Type\PageCollectionType::class),
                    'description' => "Return list of cms page and total count",
                    'args' => [
                        'filter' =>  [
                            'type' => $container->get(\Similik\Module\Cms\Services\Type\PageCollectionFilterType::class)
                        ]
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        if($container->get(\Similik\Services\Http\Request::class)->isAdmin() == false)
                            return [];
                        else
                            return $container->get(\Similik\Module\Cms\Services\PageCollection::class)->getData($rootValue, $args, $container, $info);
                    }
                ]
            ];


            $fields += [
                'cmsWidget' => [
                    'type' => $container->get(\Similik\Module\Cms\Services\Type\WidgetType::class),
                    'description' => 'Return a widget',
                    'args' => [
                        'id' => Type::nonNull(Type::id())
                    ],
                    'resolve' => function($value, $args, \Similik\Services\Di\Container $container, ResolveInfo $info) {
                        $cmsWidgetTable = _mysql()
                            ->getTable('cms_widget')
                            ->where('cms_widget_id', '=', $args['id']);
                        if($container->get(\Similik\Services\Http\Request::class)->isAdmin() === false)
                            $cmsWidgetTable->andWhere('status', '=', 1);

                        return $cmsWidgetTable->fetchOneAssoc();
                    }
                ]
            ];
            $fields += [
                'widgetCollection' => [
                    'type' => $container->get(\Similik\Module\Cms\Services\Type\WidgetCollectionType::class),
                    'description' => "Return list of widget and total count",
                    'args' => [
                        'filter' =>  [
                            'type' => $container->get(\Similik\Module\Cms\Services\Type\WidgetCollectionFilterType::class)
                        ]
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        return $container->get(\Similik\Module\Cms\Services\WidgetCollection::class)->getData($rootValue, $args, $container, $info);
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
                            'file' => $container->get(\Similik\Module\Cms\Services\Type\FileType::class)
                        ]
                    ]))
                ]
            ]),
            'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
                $allowType = ["image/jpeg", "image/png", "image/gif"];
                $request = $container->get(\Similik\Services\Http\Request::class);
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
                                'url'=> \Similik\get_base_url() . '/media/' . $args['targetPath'] . '/' . $file->getFilename()
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
                    'type' => $container->get(\Similik\Module\Cms\Services\Type\CmsPageInputType::class)
                ]
            ],
            'type' => new ObjectType([
                'name'=> 'createCmsPageOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'page' => $container->get(\Similik\Module\Cms\Services\Type\CmsPageType::class)
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
                    'type' => $container->get(\Similik\Module\Cms\Services\Type\WidgetInputType::class)
                ]
            ],
            'type' => new ObjectType([
                'name'=> 'createWidgetOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'widget' => $container->get(\Similik\Module\Cms\Services\Type\WidgetType::class)
                ]
            ]),
            'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
                //var_dump($args);
                $conn = _mysql();
                $data = $args['widget'];
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
    'before_execute_' . strtolower(str_replace('\\', '_', \Similik\Middleware\AdminNavigationMiddleware::class)),
    function (\Similik\Services\Di\Container $container) {
        $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
            'cms',
            'CMS',
            '',
            'copy',
            null,
            20
        )->addItem(
            'page.grid',
            'All pages',
            $container->get(Router::class)->generateUrl('page.grid'),
            'file-text',
            'cms',
            0
        )->addItem(
            'widget.grid',
            'All widgets',
            $container->get(Router::class)->generateUrl('widget.grid'),
            'thumbnails',
            'cms',
            10
        );
    },
    0
);

$eventDispatcher->addListener('register.admin.graphql.api.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Similik\Module\Cms\Middleware\Widget\BeforeSaveMiddleware::class, 0);
});

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Similik\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Similik\Module\Cms\Middleware\TextWidget\TextWidgetMiddleware::class, 21);
    },
    5
);