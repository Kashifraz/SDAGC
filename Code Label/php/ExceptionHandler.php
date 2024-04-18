<?php

/**
 * class ExceptionHandler
 * This class is used to handle exceptions thrown by the api for output in json
 */
abstract class ExceptionHandler
{

    /**
     * register is used to register the exception handler
     * @return void
     */
    public static function register()
    {
        set_exception_handler(array(__CLASS__, 'handleException'));
    }

    /**
     * handleException is used to handle exceptions thrown by the api for output in json
     * @generated Github CoPilot was used during the creation of this code
     * @return void
     */
    public static function handleException($e)
    {
        $output['file'] = $e->getFile();
        $output['line'] = $e->getLine();

        if ($e instanceof \Core\ClientErrorException) {
            $code = $e->getResponseCode();
            if (!empty($e->getAdditionalData())) {
                $output = array_merge($output, $e->getAdditionalData());
            }
        } else {
            $code = 500;
        }
        $output['message'] = $e->getMessage();
        new \Core\HTTP\Classes\Response($code, "error", $output);

        exit();
    }
}
