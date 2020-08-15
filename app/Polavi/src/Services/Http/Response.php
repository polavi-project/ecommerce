<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services\Http;

use function Polavi\get_base_url;
use function Polavi\get_config;
use Polavi\Services\DataObject;
use Polavi\Services\Helmet;
use function Polavi\the_container;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

class Response extends \Symfony\Component\HttpFoundation\Response
{
    protected $isNewPage = true;

    protected $jsonData;

    protected $widgets = [];

    protected $appState = [];

    protected $alerts = [];

    public function __construct() // TODO: Helmet should be a dependency here
    {
        parent::__construct('', 200, []);
        $this->jsonData = new DataObject();
        $this->addState('currency', get_config('general_currency', 'USD'));
        $this->addState('baseUrl', get_base_url(false));
        $this->addState('baseUrlAdmin', get_base_url(true));
    }

    /**
     * This will send Html response
     * @return RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    protected function sendHtml()
    {
        if ($this->jsonData->has('redirectUrl')) {
            $redirect = new RedirectResponse($this->jsonData->get('redirectUrl'), $this->getStatusCode());
            return $redirect->send();
        } else {
            $this->headers->set('Content-Type', 'text/html');
            $this->setCharset('utf-8');
            return parent::send();
        }
    }

    /**
     * @param int $status
     * @param bool $isApi
     * @param array $headers
     */
    protected function sendJson($status = 200, $isApi = false, $headers = [])
    {
        if ($isApi == false) {
            $jsonResponse = new JsonResponse($this->getData(), $status, $headers, false);
        } else {
            $jsonResponse = new JsonResponse($this->jsonData->toArray(), $status, $headers, false);
        }

        $jsonResponse->send();
    }

    /**
     * @param bool $isAjax
     * @param int $status
     * @param bool $isApi
     * @param array $headers
     * @return \Symfony\Component\HttpFoundation\Response|void
     */
    public function send($isAjax = true, $status = 200, $isApi = false, $headers = [])
    {
        if ($isAjax == true || $isApi == true) {
            $this->sendJson($status, $isApi, $headers);
        } else {
            $this->sendHtml();
        }
    }

    /**
     * @return array
     */
    public function getData()
    {
        if ($this->widgets && $this->isNewPage()) {
            $this->addData('widgets', $this->widgets);
        }
        $this->addData('alerts', $this->alerts);
        $this->addData('isNewPage', $this->isNewPage);
        $this->addState('helmet', the_container()->get(Helmet::class)->getData());
        $this->addData('appState', $this->appState);

        return $this->jsonData->toArray();
    }

    /**
     * @return array
     */
    public function getDataApi()
    {
        return $this->jsonData->toArray();
    }

    /**
     * @param $key
     * @param $value
     * @return $this
     */
    public function addData($key, $value)
    {
        $this->jsonData->offsetSet($key, $value);

        return $this;
    }

    /**
     * @param $key
     * @return $this
     */
    public function removeData($key)
    {
        $this->jsonData->offsetUnset($key);

        return $this;
    }

    /**
     * @param $key
     * @return mixed|null
     */
    public function findData($key)
    {
        return $this->jsonData->get($key);
    }

    // TODO: Change the way managing widget

    /**
     * @param string $id
     * @param string $area
     * @param int $sort_order
     * @param string $template
     * @param null $props
     * @return $this
     */
    public function addWidget(string $id, string $area, int $sort_order, string $template, $props = null) {
        $w = [
            'org_id' => $id . '_' . $area,
            'id' => $id . uniqid(),
            'area' => $area,
            'template' => $template,
            'props' => $props,
            'sort_order' => $sort_order
        ];
        $flag = false;
        $this->widgets = array_map(
            function ($widget) use ($w, &$flag) {
                if ($widget['org_id'] == $w['org_id']) {
                    $flag = true;
                    return $w;
                } else {
                    return $widget;
                }
            },
            $this->widgets
        );

        if ($flag == false) {
            $this->widgets[] = [
                'org_id' => $id . '_' . $area,
                'id' => $id . uniqid(),
                'area' => $area,
                'template' => $template,
                'props' => $props,
                'sort_order' => $sort_order
            ];
        }

        return $this;
    }

    /**
     * @param $id
     * @return bool
     */
    public function hasWidget($id)
    {
        foreach ($this->widgets as $widget) {
            if ($widget['org_id'] == $id) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param $id
     * @param $area
     * @return mixed|null
     */
    public function getWidget($id, $area)
    {
        foreach ($this->widgets as $widget) {
            if ($widget['org_id'] == $id . '_' . $area) {
                return $widget;
            }
        }

        return null;
    }

    /**
     * @param $id
     * @return $this
     */
    public function removeWidget($id)
    {
        foreach ($this->widgets as $key => $widget) {
            if ($widget['org_id'] == $id) {
                unset($this->widgets[$key]);
            }
        }

        return $this;
    }

    /**
     * @param $key
     * @param $value
     * @return $this
     */
    public function addState($key, $value)
    {
        $this->appState[$key] = $value;

        return $this;
    }

    /**
     * @param $key
     * @return bool
     */
    public function hasState($key)
    {
        return isset($this->appState[$key]);
    }

    /**
     * @param $key
     * @return mixed|null
     */
    public function getState($key)
    {
        return $this->appState[$key] ?? null;
    }

    /**
     * @param $key
     * @return $this
     */
    public function removeState($key)
    {
        if (isset($this->appState[$key])) {
            unset($this->appState[$key]);
        }

        return $this;
    }

    /**
     * @param $id
     * @param $type
     * @param $message
     * @return $this
     */
    public function addAlert($id, $type, $message)
    {
        $this->alerts[] = [
            'id'=>$id,
            'type'=>$type,
            'message'=> $message
        ];

        return $this;
    }

    /**
     * This request will not take user to new page
     */
    public function notNewPage()
    {
        $this->isNewPage = false;
    }

    /**
     * Check if this request will take user to new page or not
     */
    public function isNewPage()
    {
        return $this->isNewPage;
    }

    /**
     * @param $url
     * @param int $status
     * @return $this
     */
    public function redirect($url, $status = 302)
    {
        $this->addData('redirectUrl', $url);
        $this->setStatusCode($status);

        return $this;
    }
}