<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services\Routing;


use FastRoute\BadRouteException;
use FastRoute\RouteParser\Std;

class RouteParser extends Std
{
    /**
     * Parse a route
     * @param $route
     * @return array|mixed[]|\mixed[][]|null
     */
    public function parse($route)
    {
        $routeWithoutClosingOptionals = rtrim($route, ']');
        $numOptionals = strlen($route) - strlen($routeWithoutClosingOptionals);

        // Split on [ while skipping placeholders
        $segments = preg_split('~' . self::VARIABLE_REGEX . '(*SKIP)(*F) | \[~x', $routeWithoutClosingOptionals);
        if ($numOptionals !== count($segments) - 1) {
            // If there are any ] in the middle of the route, throw a more specific error message
            if (preg_match('~' . self::VARIABLE_REGEX . '(*SKIP)(*F) | \]~x', $routeWithoutClosingOptionals)) {
                throw new BadRouteException('Optional segments can only occur at the end of a route');
            }
            throw new BadRouteException("Number of opening '[' and closing ']' does not match");
        }

        $currentRoute = '';
        foreach ($segments as $n => $segment) {
            $routeData = null;
            if ($segment === '' && $n !== 0) {
                throw new BadRouteException('Empty optional part');
            }

            $currentRoute .= $segment;
            $routeData = $this->parsePlaceholders($currentRoute);
        }

        if ($n > 0) {
            $routeData[count($routeData)-1][] = 'optional';
        }

        return $routeData;
    }

    /**
     * @param $route
     * @return array|mixed[]
     */
    private function parsePlaceholders($route)
    {
        if (!preg_match_all(
            '~' . self::VARIABLE_REGEX . '~x',
            $route,
            $matches,
            PREG_OFFSET_CAPTURE | PREG_SET_ORDER
        )) {
            return [$route];
        }

        $offset = 0;
        $routeData = [];
        foreach ($matches as $set) {
            if ($set[0][1] > $offset) {
                $routeData[] = substr($route, $offset, $set[0][1] - $offset);
            }
            $routeData[] = [
                $set[1][0],
                isset($set[2]) ? trim($set[2][0]) : self::DEFAULT_DISPATCH_REGEX
            ];
            $offset = $set[0][1] + strlen($set[0][0]);
        }

        if ($offset !== strlen($route)) {
            $routeData[] = substr($route, $offset);
        }

        return $routeData;
    }
}