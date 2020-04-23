<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services\Log;

class Logger
{
    protected static $_file = 'system.log';
    protected static $_folder = 'log';

    protected static function checkLogConfig()
    {
        return true;
    }

    public static function write($message, $file = null, $line = null)
    {
        if(self::checkLogConfig())
        {
            try {
                $logDir  = CACHE_PATH . DS . 'mysql' . DS . 'log';
                if($file == null)
                    $logFile = $logDir . DS . self::$_file;
                else
                    $logFile = $logDir . DS . $file;
                if (!is_dir($logDir)) {
                    mkdir($logDir, 0777, true);
                    chmod($logDir, 0777);
                }

                if (!file_exists($logFile)) {
                    file_put_contents($logFile, '');
                    chmod($logFile, 0777);
                }

                if(is_array($message)) {
                    $message = date("Y-m-d H:i:s") . print_r($message, true);
                    $message .= "\n";
                } else {
                    $message = date("Y-m-d H:i:s") .' - '.$message;
                    $message .= "\n";
                }
                return file_put_contents( $logFile, $message, FILE_APPEND );
            }
            catch (\Exception $e)
            {
                echo $e->getMessage();
            }
        }
    }
}