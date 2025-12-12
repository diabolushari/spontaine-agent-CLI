<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WidgetEditor\WidgetEditorFormRequest;
use App\Models\WidgetEditor\Widget;
use Illuminate\Http\JsonResponse;

class WidgetApiController
{
    /**
     * Store a newly created widget in storage.
     */
    public function store(WidgetEditorFormRequest $request): JsonResponse
    {
        $widget = Widget::create($request->toArray());

        return response()->json([
            'message' => 'Widget created successfully',
            'widget' => $widget,
        ], 201);
    }

    /**
     * Update the specified widget in storage.
     */
    public function update(WidgetEditorFormRequest $request, Widget $widget): JsonResponse
    {
        $widget->update($request->toArray());

        return response()->json([
            'message' => 'Widget updated successfully',
            'widget' => $widget->fresh(),
        ]);
    }
}
