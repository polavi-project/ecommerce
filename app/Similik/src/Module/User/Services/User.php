<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Services;

class User implements UserInterface
{
    private $admin_user_id;

    private $status;

    private $role_id;

    private $email;

    private $full_name;

    private $created_at;

    private $updated_at;

    public function __construct(array $data)
    {
        foreach ($data as $key=>$value)
            $this->$key = $value;
    }

    public function getId()
    {
        return $this->admin_user_id;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @return mixed
     */
    public function getRoleId()
    {
        return $this->role_id;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
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

    public function getGroupId()
    {
        return null;// TODO: Implement getGroupId() method.
    }
}