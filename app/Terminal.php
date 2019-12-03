<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Terminal extends Model
{
    use SoftDeletes;

    public $table = 'terminals';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'name',
        'power_main',
        'created_at',
        'updated_at',
        'deleted_at',
        'battery_low',
        'geofence_in',
        'power_backup',
        'speeding_end',
        'geofence_out',
        'sleep_schedule',
        'speeding_start',
        'air_comm_blocked',
        'modem_registration',
    ];

    public function terminalShips()
    {
        return $this->belongsToMany(TerminalShip::class);
    }
}
