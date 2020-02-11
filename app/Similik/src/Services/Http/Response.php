<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services\Http;

use function Similik\get_base_url;
use function Similik\get_config;
use Similik\Services\DataObject;
use Similik\Services\Helmet;
use function Similik\the_container;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

class Response extends \Symfony\Component\HttpFoundation\Response
{
    protected $isNewPage = true;

    protected $jsonData;

    protected $widgets = [];

    protected $appState = [];

    protected $alerts = [];

    public function __construct()
    {
        parent::__construct('', 200, []);
        $this->jsonData = new DataObject();
        $this->addState('currency', get_config('general_currency', 'USD'));
        $this->addState('baseUrl', get_base_url(false));
        $this->addState('baseUrlAdmin', get_base_url(true));
    }

    protected function sendHtml()
    {
        if($this->jsonData->has('redirectUrl')) {
            $redirect = new RedirectResponse($this->jsonData->get('redirectUrl'), $this->getStatusCode());
            return $redirect->send();
        } else {
            $this->headers->set('Content-Type', 'text/html');
            $this->setCharset('utf-8');
            return parent::send();
        }
    }

    protected function sendJson($status = 200, $isApi = false, $headers = []) {
        if($isApi == false)
            $jsonResponse = new JsonResponse($this->getData(), $status, $headers, false);
        else
            $jsonResponse = new JsonResponse($this->jsonData->toArray(), $status, $headers, false);

        $jsonResponse->send();
    }

    public function send($isAjax = true, $status = 200, $isApi = false, $headers = [])
    {
        if($isAjax == true)
            $this->sendJson($status, $isApi, $headers);
        else
            $this->sendHtml();
    }

    public function getData()
    {
        if($this->widgets && $this->isNewPage())
            $this->addData('widgets', $this->widgets);
        $this->addData('alerts', $this->alerts);
        $this->addData('isNewPage', $this->isNewPage);
        $this->addState('helmet', the_container()->get(Helmet::class)->getData());
        $this->addData('appState', $this->appState);

        return $this->jsonData->toArray();
    }

    public function getDataApi()
    {
        return $this->jsonData->toArray();
    }

    public function addData($key, $value)
    {
        $this->jsonData->offsetSet($key, $value);

        return $this;
    }

    public function removeData($key)
    {
        $this->jsonData->offsetUnset($key);
        return $this;
    }

    public function findData($key)
    {
        return $this->jsonData->get($key);
    }

    // TODO: Change the way managing widget
    public function addWidget(string $id, string $area, int $sort_order, string $template, $props = null) {
//        dispatch_event('before_add_widget', [$id, $area, $sort_order, $template, $props]);
//        if(!preg_match('/^[A-Za-z0-9_]+$/', $event->getArgument(0)))
//            throw new \RuntimeException(__('Invalid widget id'));
        $w = [
            'org_id' => $id . '_' . $area,
            'id' => $id . uniqid(),
            'area' => $area,
            'template' => $template,
            'props' => $props,
            'sort_order' => $sort_order
        ];
        $flag = false;
        $this->widgets = array_map(function($widget) use ($w, &$flag) {
            if($widget['org_id'] == $w['org_id']) {
                $flag = true;
                return $w;
            } else {
                return $widget;
            }
            }, $this->widgets);

        if($flag == false)
            $this->widgets[] = [
                'org_id' => $id . '_' . $area,
                'id' => $id . uniqid(),
                'area' => $area,
                'template' => $template,
                'props' => $props,
                'sort_order' => $sort_order
            ];
        return $this;
    }

    public function hasWidget($id) {
        foreach ($this->widgets as $widget)
            if($widget['org_id'] == $id)
                return true;
        return false;
    }

    public function getWidget($id, $area) {
        foreach ($this->widgets as $widget)
            if($widget['org_id'] == $id . '_' . $area)
                return $widget;
        return null;
    }

    public function removeWidget($id) {
        foreach ($this->widgets as $key=> $widget)
            if($widget['org_id'] == $id)
                unset($this->widgets[$key]);
        return $this;
    }

    public function addState($key, $value) {
        $this->appState[$key] = $value;

        return $this;
    }

    public function hasState($key) {
        return isset($this->appState[$key]);
    }

    public function getState($key) {
        return $this->appState[$key] ?? null;
    }

    public function removeState($key) {
        if(isset($this->appState[$key]))
            unset($this->appState[$key]);
        return $this;
    }

    public function addAlert($id, $type, $message) {
        $this->alerts[] = [
            'id'=>$id,
            'type'=>$type,
            'message'=> $message
        ];
        return $this;
    }

    public function notNewPage()
    {
        $this->isNewPage = false;
    }

    public function isNewPage()
    {
        return $this->isNewPage;
    }

    public function redirect($url, $status = 302)
    {
        $this->addData('redirectUrl', $url);
        $this->setStatusCode($status);

        return $this;
    }
}