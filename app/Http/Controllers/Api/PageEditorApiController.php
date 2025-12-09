<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PageEditor\PageEditorRequestForm;
use App\Models\PageEditor\DashboardPage;
use Illuminate\Http\JsonResponse;

class PageEditorApiController
{
    /**
     * Get all pages.
     */
    public function index(): JsonResponse
    {
        $pages = DashboardPage::all();

        return response()->json([
            'pages' => $pages,
        ]);
    }

    /**
     * Get a single page by ID.
     */
    public function show(DashboardPage $page): JsonResponse
    {
        return response()->json([
            'page' => $page,
        ]);
    }

    /**
     * Store a newly created page in storage.
     */
    public function store(PageEditorRequestForm $request): JsonResponse
    {
        $dashboardPage = DashboardPage::create([
            'title' => $request->title,
            'description' => $request->description,
            'link' => $request->link,
            'page' => $request->page,
            'published' => $request->published,
            'anchor_widget' => $request->anchor_widget,
        ]);

        return response()->json([
            'message' => 'Page created successfully',
            'page' => $dashboardPage,
        ], 201);
    }

    /**
     * Update the specified page in storage.
     */
    public function update(PageEditorRequestForm $request, DashboardPage $page): JsonResponse
    {
        $page->update([
            'title' => $request->title,
            'description' => $request->description,
            'link' => $request->link,
            'page' => $request->page,
            'published' => $request->published,
            'anchor_widget' => $request->anchor_widget,
        ]);

        return response()->json([
            'message' => 'Page updated successfully',
            'page' => $page->fresh(),
        ]);
    }
}
