<?php
namespace App\Http\Requests;

use App\Ship;
use Gate;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

class StoreShipRequest extends FormRequest
{
    public function authorize ()
    {
        abort_if(Gate::denies('ship_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');
        return true;
    }

    public function rules ()
    {
        return [
            'ship_ids' => [
                'required',
            ],
            'name' => [
                'required',
                'unique:ships,name,NULL,id,deleted_at,NULL',
            ],
            'last_registration_utc' => [
                'date_format:' . config('panel.date_format') . ' ' . config('panel.time_format'),
                'nullable',
            ],
            'terminals.*' => [
                'integer',
            ],
            'terminals' => [
                'array',
            ],
        ];
    }

}
