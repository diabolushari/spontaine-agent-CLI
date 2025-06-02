<?php

namespace App\Http\Controllers\Blocks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksFormRequest;
use App\Http\Requests\PageBuilder\PageBuilderFormRequest;
use App\Models\Blocks\Blocks;
use App\Models\PageBuilder\PageBuilder;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlocksController extends Controller

{
    public static function middleware()
    {
        return [
            'auth',
        ];
    }

    public function index(): Response {}

    public function create(): Response {}

    public function store(BlocksFormRequest $request): RedirectResponse
    {
        try {
            $maxPosition = Blocks::where('page_id', $request->page_id)->max('position');
            $newPosition = $maxPosition ? $maxPosition + 1 : 1;
            $block = Blocks::create([
                'name' => $request->name,
                'position' => $newPosition,
                'dimensions' => $request->dimensions,
                'page_id' => $request->page_id,
            ]);
        } catch (Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
        return redirect()->route('page-builder.show', $block->page_id)->with(['message' => 'Block added successfully']);
    }

    public function show(Request $request, int $id): Response
    {
        dd('hellow');
    }

    public function edit(Request $request, int $id): Response {}

    public function update(BlocksFormRequest $request, int $id): RedirectResponse
    {

        $block = Blocks::findOrFail($id);

        $block->update([
            'dimensions' => $request->dimensions
        ]);

        return redirect()->back()->with('message', 'Block updated successfully!');
    }

    public function destroy(int $id): RedirectResponse
    {

        try {
            $block = Blocks::findOrFail($id);
            $block->delete();
        } catch (Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
        return redirect()->back()->with(['message' => 'Block deleted successfully']);
    }
}
