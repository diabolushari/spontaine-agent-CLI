<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class WidgetsEditorController extends Controller
{
    public function index()
    {
        return Inertia::render('WidgetsEditor/WidgetsEditorIndexPage');
    }

    public function create()
    {
        return Inertia::render('WidgetsEditor/WidgetsEditorCreatePage');
    }
}
