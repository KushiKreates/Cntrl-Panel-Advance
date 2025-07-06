<?php


namespace App\Console\Commands;

use Illuminate\Console\Command;

class PanelLock extends Command
{
    protected $signature = 'panel:lock';
    protected $description = 'Toggle the install.lock file (add if missing, remove if present)';

    public function handle()
    {
        $lockPath = base_path('install.lock');
        $this->line("
  _   _           _ _     _      _            
 | \\ | |         | | |   (_)    | |           
 |  \\| | __ _  __| | |__  _   __| | _____   __
 | . ` |/ _` |/ _` | '_ \\| | / _` |/ _ \\ \\ / /
 | |\\  | (_| | (_| | | | | || (_| |  __/\\ V / 
 |_| \\_|\\__,_|\\__,_|_| |_|_(_)__,_|\\___| \\_/  install lock
                                              
                                              
        ");

        if (file_exists($lockPath)) {
            if (@unlink($lockPath)) {
                $this->info("install.lock found and removed at: {$lockPath}");
            } else {
                $this->error("install.lock found but could not be removed at: {$lockPath}");
            }
        } else {
            if (file_put_contents($lockPath, "LOCKED\n") !== false) {
                $this->info("install.lock not found. File created at: {$lockPath}");
            } else {
                $this->error("Could not create install.lock file at: {$lockPath}");
            }
        }
    }
}