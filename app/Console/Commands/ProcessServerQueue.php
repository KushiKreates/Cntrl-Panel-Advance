<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ServerQueue;
use App\Jobs\ProcessServerQueue;

class ProcessServerQueueCommand extends Command
{
    protected $signature = 'queue:process-servers';
    protected $description = 'Dispatch jobs for pending server creation';

    public function handle()
    {
        ServerQueue::whereIn('status',['pending','failed'])
            ->where('attempts','<',5) // optional max retries
            ->get()
            ->each(fn($item) => ProcessServerQueue::dispatch($item));
    }
}