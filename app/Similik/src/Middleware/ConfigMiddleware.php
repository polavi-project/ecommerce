<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Services\Db\Processor;
use Similik\Services\Db\Table;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Symfony\Component\Filesystem\Filesystem;

class ConfigMiddleware extends MiddlewareAbstract
{
    const CACHE_TEMPLATE = <<< 'EOT'
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

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!file_exists(CACHE_PATH . DS . 'config_cache.php')) {
            $setting_table = new Table('setting', $this->getContainer()->get(Processor::class));
            while ($row = $setting_table->fetch(['sort_by'=> 'language_id'])) {
                if($row['json'] == 1)
                    $configuration[$row['language_id']][$row['name']] = json_decode($row['value'], true);
                else
                    $configuration[$row['language_id']][$row['name']] = $row['value'];
            }
            $file_system = new Filesystem();
            $cache_content = sprintf(
                self::CACHE_TEMPLATE,
                date('c'),
                var_export($configuration, true)
            );
            $file_system->dumpFile(CACHE_PATH . DS . 'config_cache.php', $cache_content);
        } else {
            $configuration = include (CACHE_PATH . DS . 'config_cache.php');
        }

        // Set time zone
        @date_default_timezone_set($configuration[0]['general_timezone']);

        return true;
    }
}