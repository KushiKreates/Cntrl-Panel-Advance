<?php
namespace App\Jobs;

/**
 * ProcessServerQueue
 *
 * This job processes a server queue item, creating a server using the Pterodactyl API.
 * It handles the status updates and retries in case of failure.
 * 
 * it will create model 
 */

use App\Models\ServerQueue;
use App\Classes\PterodactylClient;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProcessServerQueue implements ShouldQueue
{
    use Dispatchable, Queueable;

    protected ServerQueue $item;

    public function __construct(ServerQueue $item)
    {
        $this->item = $item;
    }

    public function handle(PterodactylClient $client)
    {
        if ($this->item->status !== 'pending' && $this->item->status !== 'failed') {
            return;
        }

        $this->item->update(['status'=>'processing','attempts' => $this->item->attempts + 1]);

        try {
            // assume $item->data contains all needed attrs
            $response = $client->createServerFromAttributes($this->item->data);

            if ($response->failed()) {
                throw new Exception('API returned failure');
            }

            $attrs = $response->json()['attributes'] ?? [];
            $this->item->update([
                'status' => 'completed',
                'uuid'   => $attrs['id'] ?? null,
                'output' => $response->json(),
            ]);

            // optional: delete record after success
            $this->item->delete();

        } catch (Exception $e) {
            // mark failed; leave it for retry
            $this->item->update(['status'=>'failed']);
        }
    }
}