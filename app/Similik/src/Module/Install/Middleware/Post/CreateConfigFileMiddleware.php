<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Install\Middleware\Post;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Symfony\Component\Filesystem\Filesystem;

class CreateConfigFileMiddleware extends MiddlewareAbstract
{
    const FILE_TEMPLATE = <<< 'EOT'
<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */


define('DB_DRIVER', 'mysql');
define('DB_HOST', '%s');
define('DB_DATABASE', '%s');
define('DB_USERNAME', '%s');
define('DB_PASSWORD', '%s');
define('DB_PREFIX', '');
EOT;
    public function __invoke(Request $request, Response $response)
    {
        $host = $request->request->get('db_host');
        $database = $request->request->get('db_name');
        $user = $request->request->get('db_user');
        $password = $request->request->get('db_password');

        try {
            $fileSystem = new Filesystem();
            $conn = new \PDO("mysql:host={$host}; dbname={$database}", $user, $password);
            $conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $fileContent = sprintf(
                self::FILE_TEMPLATE,
                $host,
                $database,
                $user,
                $password
            );
            $fileSystem->dumpFile(CONFIG_PATH . DS . 'config.tmp.php', $fileContent);
        } catch(\Exception $e) {
            $response->addData('success', 0);
            $response->addData('message', $e->getMessage());
            return $response;
        }

        return null;
    }
}