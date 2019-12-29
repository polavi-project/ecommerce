<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\SendGrid\Services;


use Monolog\Logger;
use function Similik\dispatch_event;
use function Similik\the_container;
use SendGrid\Mail\Mail;

class SendGrid
{
    protected $apiKey;

    protected $enable;

    protected $senderEmail;

    protected $senderName;

    public function __construct($apiKey, $senderEmail, $senderName, $enable)
    {
        $this->apiKey = $apiKey;
        $this->senderEmail = $senderEmail;
        $this->senderName = $senderName;
        $this->enable = $enable;
    }

    public function sendEmail(string $identity, $receiver, $templateId, array $data = [])
    {
        if($this->enable == 0) {
            the_container()->get(Logger::class)->addInfo('Send grid is disabled');
            return;
        }

        if(!$this->apiKey) {
            the_container()->get(Logger::class)->addInfo('Send grid API is empty');
            return;
        }

        try {
            $email = new Mail();
            $email->setFrom($this->senderEmail, $this->senderName);
            $email->addTo($receiver);
            $email->setTemplateId($templateId);
            foreach ($data as $key => $value)
                $email->addDynamicTemplateData($key, $value);

            $sendGrid = new \SendGrid($this->apiKey);
            dispatch_event('sendGrid_before_send', [$email, $receiver, &$data]);
            dispatch_event('sendGrid_before_send_' . $identity, [$email, $receiver, &$data]);
            $sendGrid->send($email);
        } catch (\Exception $e) {
            the_container()->get(Logger::class)->addError($e->getMessage());
        }
    }
}