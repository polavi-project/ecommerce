<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Save;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Symfony\Component\Filesystem\Filesystem;

class ValidateMiddleware extends MiddlewareAbstract
{
    const CACHE_TEMPLATE = <<< 'EOT'
<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
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
        $file_system->dumpFile(CACHE_PATH . DS . 'product_data.php', $cache_content);
        return $data;
    }
}