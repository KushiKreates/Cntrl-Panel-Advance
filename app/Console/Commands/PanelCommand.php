<?php


namespace App\Console\Commands;

use Illuminate\Console\Command;

class PanelCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'panel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Display panel ASCII art and help information';

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
 |_| \\_|\\__,_|\\__,_|_| |_|_(_)__,_|\\___| \\_/  info
                                              
                                              
        ");
        $this->info(str_repeat('=', 78));

        $this->info('Ctrl Panel Command Help:');
        $this->line('');
        $this->line('  panel:info         Show this ASCII art and help info');
        $this->line('  panel:user         Create a new user (with options for admin, email, etc)');
        $this->line('  panel:update       Automatically Update your panel.');
        $this->line('  panel:env          Backup the .env in case of errors while installing themes and etc');
        $this->line('  inspire            Just run it!');
        $this->line('');
        $ctrlVar = env('CTRL_VAR');
        if ($ctrlVar) {
            $this->line("Version: " . $ctrlVar);
        } else {
            $this->line("No version found!");
        }
        $this->info(str_repeat('=', 78));
    }
}