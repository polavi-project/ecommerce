<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\SendGrid\Services;


use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use function Similik\dispatch_event;
use function Similik\get_config;
use function Similik\the_container;
use SendGrid\Mail\Mail;

class SendGrid
{
    protected $apiKey;

    protected $enable;

    protected $senderEmail;

    protected $senderName;

    /**@var Logger $logger*/
    protected $logger;

    public function __construct($apiKey, $senderEmail, $senderName, $enable)
    {
        $this->apiKey = $apiKey;
        $this->senderEmail = $senderEmail;
        $this->senderName = $senderName;
        $this->enable = $enable;
        $logger = new Logger('sendGrid');
        $logger->pushHandler(new StreamHandler(LOG_PATH . '/sendGrid.log', Logger::DEBUG));
        $this->logger = $logger;
    }

    public function sendEmail(string $identity, $receiver, $templateId, array $data = [])
    {
        if($this->enable == 0) {
            $this->logger->addInfo('SendGrid transactional email is disabled from Admin');
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
            $response = $sendGrid->send($email);
            if(get_config('sendgrid_log', 1) == 1) {
                $this->logger->addInfo($response->statusCode());
                $this->logger->addInfo($response->body());
            }
        } catch (\Exception $e) {
            the_container()->get(Logger::class)->addError($e->getMessage());
        }
    }
}