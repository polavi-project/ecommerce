<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use Similik\Services\Routing\Router;
use Symfony\Component\Filesystem\Filesystem;

$eventDispatcher->addListener(
        'before_execute_' . strtolower(str_replace('\\', '_', \Similik\Middleware\AdminNavigationMiddleware::class)),
        function (\Similik\Services\Di\Container $container) {
            $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
                'setting',
                'Setting',
                '',
                'cog',
                null,
                30
            )->addItem(
                'setting.general',
                'General',
                $container->get(Router::class)->generateUrl('setting.general'),
                'settings',
                'setting'
            )->addItem(
                'setting.catalog',
                'Catalog',
                $container->get(Router::class)->generateUrl('setting.catalog'),
                'thumbnails',
                'setting'
            )->addItem(
                'setting.payment',
                'Payment',
                $container->get(Router::class)->generateUrl('setting.payment'),
                'credit-card',
                'setting'
            )->addItem(
                'setting.shipment',
                'Shipment',
                $container->get(Router::class)->generateUrl('setting.shipment'),
                'cart',
                'setting'
            );
        },
        0
);

function createConfigCache() {
    $cacheTemplate = <<< 'EOT'
<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);
/**
 * This configuration cache file was generated at %s
 */
return %s;
EOT;

    $settingTable = \Similik\_mysql()->getTable('setting');
    while ($row = $settingTable->fetch(['sort_by'=> 'language_id'])) {
        if($row['json'] == 1)
            $configuration[$row['language_id']][$row['name']] = json_decode($row['value'], true);
        else
            $configuration[$row['language_id']][$row['name']] = $row['value'];
    }
    $file_system = new Filesystem();
    $cacheContent = sprintf(
        $cacheTemplate,
        date('c'),
        var_export($configuration, true)
    );
    $file_system->dumpFile(CACHE_PATH . DS . 'config_cache.php', $cacheContent);
}

$eventDispatcher->addListener('after_insert_setting', 'createConfigCache');
$eventDispatcher->addListener('after_update_setting', 'createConfigCache');
$eventDispatcher->addListener('after_insert_on_update_setting', 'createConfigCache');