<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\User\Services;

class Customer implements UserInterface
{
    protected $customer_id;

    protected $status;

    protected $group_id;

    protected $email;

    protected $full_name;

    protected $gender;

    protected $dob;

    protected $created_at;

    protected $updated_at;

    public function __construct($id)
    {
        $customer = get_mysql_table('customer')->load($id);
        if($customer == false)
            throw new \RuntimeException('Customer does not exist');
        foreach ($customer as $key=>$value)
            $this->$key = $value;
    }

    public function getId()
    {
        return $this->customer_id;
    }

    public function getGroupId()
    {
        return $this->group_id;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    public function getOrders()
    {
        $orders = get_mysql_table('order')->where('customer_id', '=', $this->customer_id)->fetchAllAssoc();
        return $orders;
    }

    /**
     * @return mixed
     */
    public function getGender()
    {
        return $this->gender;
    }

    /**
     * @return mixed
     */
    public function getFullName()
    {
        return $this->full_name;
    }

    /**
     * @return mixed
     */
    public function getDob()
    {
        return $this->dob;
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }
}