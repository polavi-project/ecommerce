<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services\Http;


use Polavi\Module\Customer\Services\Customer;

class Request extends \Symfony\Component\HttpFoundation\Request
{
    private $user;

    /**@var Customer $customer*/
    private $customer;

    /** @var self $request*/
    private static $instance = null;

    /**
     * Create a Request object from global data
     * @return Request|\Symfony\Component\HttpFoundation\Request
     * @throws \Exception
     */
    public static function createFromGlobals()
    {
        if (self::$instance !== null)
            throw new \Exception("You only can initialize Request object one time");
        
        $request = parent::createFromGlobals();
        self::$instance = $request;
        return self::$instance;
    }

    /**
     * Assign User object to the Request object
     * @param $user
     * @return $this
     */
    public function setUser($user)
    {
        if($this->user)
            throw new \RuntimeException('You can not set user twice');
        $this->user = $user;
        return $this;
    }

    /**
     * Assign User object to the Request object
     * @param Customer $customer
     * @return $this
     */
    public function setCustomer(Customer $customer)
    {
        $this->customer = $customer;

        return $this;
    }

    /**
     * @return Customer
     */
    public function getCustomer()
    {
        return $this->customer;
    }

    /**
     * @return string|null
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return string
     */
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

    /**
     * Check if current request is an Ajax request or not
     * @return bool
     */
    public function isAjax() : bool
    {
        if((int)$this->query->get('ajax') === 1)
            return true;
        else
            return $this->isXmlHttpRequest();
    }

    /**
     * @return bool
     */
    public function isAdmin() : bool
    {
        if(preg_match("/^\/" . ADMIN_PATH . "/", $this->getPathInfo()))
            return true;
        else
            return false;
    }
}