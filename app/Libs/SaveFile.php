<?php

namespace App\Libs;

use Exception;
use Illuminate\Http\UploadedFile;

class SaveFile
{
    public function __construct()
    {
    }

    public function save(UploadedFile $file, string|int $name, string $folder, bool $public = true): string
    {
        try {
            $fileName = $name.'.'.$file->extension();
            $file->storeAs(
                $public ? 'public/'.$folder.'/' : $folder.'/',
                $fileName
            );
        } catch (Exception $e) {
            return '';
        }

        return $public ? '/storage/'.$folder.'/'.$fileName : $fileName;
    }
}
