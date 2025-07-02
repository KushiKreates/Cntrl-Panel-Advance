<?php


namespace App\Console\Commands;

use App\Classes\PterodactylClient;
use App\Models\User;
use App\Settings\PterodactylSettings;
use App\Traits\Referral;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class MakeUserCommand extends Command
{
    use Referral;

    private $pterodactyl;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:user {--ptero_id=} {--password=} {--force}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin account with the Artisan Console';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }


    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(PterodactylSettings $ptero_settings)
    {
        $this->pterodactyl = new PterodactylClient($ptero_settings);
        $ptero_id = $this->option('ptero_id') ?? $this->ask('Please specify your Pterodactyl ID.');
        $password = $this->option('password') ?? $this->secret('Please specify your password.');
        $force = $this->option('force');

        // Validate user input
        $validator = Validator::make([
            'ptero_id' => $ptero_id,
            'password' => $password,
        ], [
            'ptero_id' => 'required|numeric|integer|min:1|max:2147483647',
            'password' => 'required|string|min:8|max:60',
        ]);

        if ($validator->fails()) {
            $this->error($validator->errors()->first());
            return 0;
        }

        // Get user from Pterodactyl
        $response = $this->pterodactyl->getUser($ptero_id);

        if (isset($response['errors'])) {
            if (isset($response['errors'][0]['code'])) {
                $this->error("code: {$response['errors'][0]['code']}");
            }
            if (isset($response['errors'][0]['status'])) {
                $this->error("status: {$response['errors'][0]['status']}");
            }
            if (isset($response['errors'][0]['detail'])) {
                $this->error("detail: {$response['errors'][0]['detail']}");
            }
            return 0;
        }

        // Check if user already exists with this email
        $existingUser = User::where('email', $response['email'])->first();
        
        if ($existingUser) {
            if (!$force) {
                $this->error("A user with email {$response['email']} already exists.");
                $this->info("Use --force option to update the existing user.");
                return 0;
            }
            
            // Update existing user
            $this->info("Updating existing user with email {$response['email']}");
            $existingUser->update([
                'name' => $response['first_name'],
                'password' => Hash::make($password),
                'pterodactyl_id' => $response['id'],
            ]);
            
            $user = $existingUser;
        } else {
            // Create new user
            $user = User::create([
                'name' => $response['first_name'],
                'email' => $response['email'],
                'password' => Hash::make($password),
                'referral_code' => $this->createReferralCode(),
                'pterodactyl_id' => $response['id'],
            ]);
        }

        $this->table(['Field', 'Value'], [
            ['ID', $user->id],
            ['Email', $user->email],
            ['Username', $user->name],
            ['Ptero-ID', $user->pterodactyl_id],
            ['Referral code', $user->referral_code],
        ]);

        // Only sync roles if it's a new user or force option is used
        if (!$existingUser || $force) {
            $user->syncRoles(1);
            $this->info("User assigned to admin role.");
        }

        return 1;
    }
}