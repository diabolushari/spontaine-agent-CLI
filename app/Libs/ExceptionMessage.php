<?php

namespace App\Libs;

use Exception;
use Illuminate\Support\Facades\Log;

class ExceptionMessage
{
    public static function getMessage(Exception $exception): string
    {
        $isDebug = config('app.debug', false);
        if ($isDebug) {
            return $exception->getMessage();
        }
        Log::info($exception);

        return 'Something went wrong, please try again later';
    }
}
