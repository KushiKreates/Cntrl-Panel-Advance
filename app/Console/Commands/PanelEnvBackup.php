<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PanelEnvBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'panel:env';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup the .env file to storage/app/env-backup';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $envPath = base_path('.env');
        $backupPath = 'env-backup/env.' . now()->format('Y-m-d_H-i-s');

        if (!file_exists($envPath)) {
            $this->error('.env file not found!');
            return 1;
        }

        $envContents = file_get_contents($envPath);
        Storage::disk('local')->put($backupPath, $envContents);

        $this->info("Backup created: storage/app/{$backupPath}");
        return 0;
    }
}