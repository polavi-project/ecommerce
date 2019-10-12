<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services\Http;


use Similik\Module\Customer\Services\Customer;

class Request extends \Symfony\Component\HttpFoundation\Request
{
    private $user;

    /**@var Customer $customer*/
    private $customer;

    /** @var self $request*/
    private static $instance = null;

    public static function createFromGlobals()
    {
        if (self::$instance === null) {
            $request = parent::createFromGlobals();
            self::$instance = $request;
        }
        return self::$instance;
    }

    public function setUser($user)
    {
        if($this->user)
            throw new \RuntimeException(__('You can not set user twice'));
        $this->user = $user;
        return $this;
    }

    public function setCustomer(Customer $customer)
    {
        $this->customer = $customer;

        return $this;
    }

    public function getCustomer()
    {
        return $this->customer;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getUri() : string
    {
        $uri =  str_replace('index.php', '', $this->getPathInfo());
        if (isset($_SERVER['SCRIPT_NAME'][0])) {
            if (strpos($uri, $_SERVER['SCRIPT_NAME']) === 0) {
                $uri = (string) substr($uri, strlen($_SERVER['SCRIPT_NAME']));
            } elseif (strpos($uri, dirname($_SERVER['SCRIPT_NAME'])) === 0) {
                $uri = (string) substr($uri, strlen(dirname($_SERVER['SCRIPT_NAME'])));
            }
        }
        return $uri;
    }

    public function isAjax() : bool
    {
        if((int)$this->query->get('ajax') === 1)
            return true;
        else
            return $this->isXmlHttpRequest();
    }

    public function isAdmin() : bool
    {
        if(preg_match("/^\/" . ADMIN_PATH . "/", $this->getUri()))
            return true;
        else
            return false;
    }
}