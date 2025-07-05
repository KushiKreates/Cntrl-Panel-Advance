<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QueueStreamController extends Controller
{
    public function stream(Request $request): StreamedResponse
    {
        // disable timeouts
        set_time_limit(0);
        ini_set('output_buffering', 'off');
        ini_set('zlib.output_compression', 'off');

        return response()->stream(function() {
            // initial ping
            echo ": connected\n\n";
            ob_flush(); flush();

            while (true) {
                // 1) Poll queue length
                $pending = Queue::size('default');

                // 2) Detect if "php artisan queue:work" is running
                // on Mac/Linux you can use pgrep; adjust the grep pattern if needed
                $output = [];
                exec('pgrep -f "artisan queue:work"', $output);
                $workerRunning = count($output) > 0;

                // 3) Emit queue-size event
                echo "event: queue-size\n";
                echo 'data: ' . json_encode([
                    'pending'   => $pending,
                    'timestamp' => now()->toIso8601String(),
                ]) . "\n\n";

                // 4) Emit worker-status event
                echo "event: worker-status\n";
                echo 'data: ' . json_encode([
                    'running'   => $workerRunning,
                    'timestamp' => now()->toIso8601String(),
                ]) . "\n\n";

                ob_flush(); flush();

                // 5) Sleep 1s before next update
                sleep(1);
            }
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache',
            'X-Accel-Buffering' => 'no',       // for nginx
            'Connection'        => 'keep-alive',
        ]);
    }
}