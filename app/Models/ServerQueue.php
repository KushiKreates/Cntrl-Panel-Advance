<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServerQueue extends Model
{
    protected $table = 'server_queue';
    protected $casts = [
      'data'   => 'array',
      'output' => 'array',
    ];
    protected $fillable = ['name','type','uuid','status','data','output','attempts'];
}