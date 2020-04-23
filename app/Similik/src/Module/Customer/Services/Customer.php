<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Services;


use function Similik\_mysql;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class Customer
{
    /**@var SessionInterface $session*/
    protected $session = false;

    protected $isLoggedIn = false;

    protected $data = [];

    public function __construct(SessionInterface $session)
    {
        $this->session = $session;
        $user = _mysql()->getTable('customer')->load($session->get('customer_id'));
        if(!$user or $user['status'] == 0) {
            $this->session->remove('customer_id');
            $this->session->save();
        } else {
            $this->isLoggedIn = true;
            $this->data = $user;
        }
    }

    public function setData($key, $value)
    {
        $this->data[$key] = $value;

        return $this;
    }

    public function getData($key)
    {
        return $this->data[$key] ?? null;
    }

    public function toArray()
    {
        return $this->data;
    }

    public function login($email, $password)
    {
        if($this->isLoggedIn == true)
            return $this;

        $user = _mysql()->getTable('customer')->where('email', '=', $email)->andWhere('status', '=', 1)->fetchOneAssoc();
        if($user == false)
            throw new \RuntimeException("Email or password is invalid");
        if (password_verify($password, $user['password'])) {
            $this->session->set('customer_id', $user['customer_id']);
            $this->session->save();
            $this->isLoggedIn = true;
            $this->data = $user;
            return $this;
        } else {
            throw new \RuntimeException("Email or password is invalid");
        }
    }

    public function forceLogin($email)
    {
        if($this->isLoggedIn == true)
            return $this;

        $user = _mysql()->getTable('customer')->where('email', '=', $email)->andWhere('status', '=', 1)->fetchOneAssoc();
        if($user == false)
            throw new \RuntimeException("Email or password is invalid");
        $this->session->set('customer_id', $user['customer_id']);
        $this->session->save();
        $this->isLoggedIn = true;
        $this->data = $user;
        return $this;
    }

    public function logOut()
    {
        if(!$this->isLoggedIn)
            return $this;
        $this->session->remove('customer_id');
        $this->session->save();
        $this->isLoggedIn = false;
        $this->data = [];

        return $this;
    }

    /**
     * @return bool
     */
    public function isLoggedIn(): bool
    {
        return $this->isLoggedIn;
    }
}