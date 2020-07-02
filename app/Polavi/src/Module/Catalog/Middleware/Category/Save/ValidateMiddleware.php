<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Category\Save;

use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Symfony\Component\Filesystem\Filesystem;

class ValidateMiddleware extends MiddlewareAbstract
{
    const CACHE_TEMPLATE = <<< 'EOT'
<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

return %s;
EOT;
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response)
    {
        $data = $request->request->all();
        // Doing validation here
        $file_system = new Filesystem();
        $cache_content = sprintf(
            self::CACHE_TEMPLATE,
            var_export($data, true)
        );
        $file_system->dumpFile(CACHE_PATH . DS . 'category_data.php', $cache_content);
        return $data;
    }
}