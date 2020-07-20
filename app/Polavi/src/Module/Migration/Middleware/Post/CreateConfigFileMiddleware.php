<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Post;


use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Db\Configuration;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Symfony\Component\Filesystem\Filesystem;

class CreateConfigFileMiddleware extends MiddlewareAbstract
{
    const FILE_TEMPLATE = <<< 'EOT'
<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

return [
    "driver" => "mysql",
    "host"   => "%s",
    "database" => "%s",
    "username" => "%s",
    "password" => "%s"
];
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
            $this->getContainer()->set(Configuration::class, function() use($database, $host, $user, $password) {
                return new Configuration(
                    $database,
                    "mysql",
                    $host,
                    $user,
                    $password
                );
            });
            $fileSystem->dumpFile(CONFIG_PATH . DS . 'config.tmp.php', $fileContent);
        } catch(\Exception $e) {
            $response->addData('success', 0);
            $response->addData('message', $e->getMessage());
            return $response;
        }

        return null;
    }
}