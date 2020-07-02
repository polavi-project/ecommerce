<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\User\Services;

interface UserInterface
{
    public function getId();

    public function getEmail();

    public function getFullName();

    public function getGroupId();
}