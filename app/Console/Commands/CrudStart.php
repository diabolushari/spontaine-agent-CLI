<?php

namespace App\Console\Commands;

use App\Console\TemplateGenerator\GenerateController;
use App\Console\TemplateGenerator\GenerateFormRequest;
use App\Console\TemplateGenerator\GenerateMigration;
use App\Console\TemplateGenerator\GenerateModel;
use App\Console\TemplateGenerator\GenerateSearchRequest;
use App\Console\TemplateGenerator\GenerateUIFiles;
use App\Console\TemplateGenerator\InsertNewRoute;
use App\Console\TemplateGenerator\InsertNewTypeDefinition;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;

class CrudStart extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:crud-start {model} {url} {directory}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize Model with corresponding resource controller, route, views and typescript interface.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {

        $model = $this->argument('model');
        $url = $this->argument('url');
        $directory = $this->argument('directory');

        //model file
        $modelNamespace = 'App\\Models\\'.ucfirst($directory).'\\'.ucfirst($model);
        $currentWorkingDirectory = getcwd();
        $this->line('project path: '.$currentWorkingDirectory);
        $this->info('Creating CRUD files for '.$modelNamespace);

        $this->line('creating migration file...');
        (new GenerateMigration($this, $currentWorkingDirectory, $directory, $model, $url))->generate();

        $this->line('creating model file...');
        (new GenerateModel($this, $currentWorkingDirectory, $directory, $model, $url))->generate();

        $this->line('setting up data_interface file...');
        (new InsertNewTypeDefinition($model))->generate();
        (new GenerateSearchRequest($this, $currentWorkingDirectory, $directory, $model))->generate();
        (new GenerateFormRequest($this, $currentWorkingDirectory, $directory, $model))->generate();

        $this->line('creating controller...');
        (new GenerateController(
            $this,
            $currentWorkingDirectory,
            $directory,
            $model,
            $url
        ))->generate();

        $this->line('creating tsx files...');
        (new GenerateUIFiles(
            $this,
            $currentWorkingDirectory,
            $directory,
            $model,
            $url
        ))->generate();

        $this->line('updating route file...');
        (new InsertNewRoute(
            $this,
            $currentWorkingDirectory,
            $directory,
            $model,
            $url
        ))->generate();
    }

    /**
     * Prompt for missing input arguments using the returned questions.
     *
     * @return array<string, string>
     */
    protected function promptForMissingArgumentsUsing(): array
    {
        return [
            'model' => 'Model used in CRUD files?',
            'url' => 'URL used in CRUD files?',
            'directory' => 'Directory in which file are grouped and placed?',
        ];
    }
}
