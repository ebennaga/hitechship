<?php

namespace App\Http\Requests;

use App\Terminal;
use Gate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateTerminalRequest extends FormRequest
{
    public function authorize()
    {
        abort_if(Gate::denies('terminal_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        return true;
    }

    public function rules(Request $request , $id)
    {
        return [
            'name'    => [
                'required',
                'unique:terminals,name,'.$id.',id,deleted_at,NULL'
            ],
            'ships.*' => [
                'integer',
            ],
            'ships'   => [
                'required',
                'array',
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.unique' => 'Terminal Name has been used',
        ];
    }
}
