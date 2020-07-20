<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services\Db;


class Configuration
{
    protected $db;

    protected $driver;

    protected $host;

    protected $user;

    protected $password;

    protected $prefix = "";

    public function __construct($db, $driver, $host, $user, $password)
    {
        $this->db = $db;
        $this->driver = $driver;
        $this->host = $host;
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * @return mixed
     */
    public function getDriver()
    {
        return $this->driver;
    }

    /**
     * @return mixed
     */
    public function getHost()
    {
        return $this->host;
    }

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @return mixed
     */
    public function getPrefix()
    {
        return $this->prefix;
    }

    /**
     * @return mixed
     */
    public function getDb()
    {
        return $this->db;
    }
}