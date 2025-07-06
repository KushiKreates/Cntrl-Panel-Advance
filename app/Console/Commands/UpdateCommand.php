<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'panel:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the panel (coming soon)';

    /**
     * Execute the console command.
     */
    public function handle()

    {
        $this->line("
        _   _           _ _     _      _            
        | \\ | |         | | |   (_)    | |           
        |  \\| | __ _  __| | |__  _   __| | _____   __
        | . ` |/ _` |/ _` | '_ \\| | / _` |/ _ \\ \\ / /
        | |\\  | (_| | (_| | | | | || (_| |  __/\\ V / 
        |_| \\_|\\__,_|\\__,_|_| |_|_(_)__,_|\\___| \\_/  update
                                                    
                                                    
                ");
        $this->info('Panel update: Coming soon!');
    }
}