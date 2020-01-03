<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyTerminalRequest;
use App\Http\Requests\StoreTerminalRequest;
use App\Http\Requests\UpdateTerminalRequest;
use App\Ship;
use App\Terminal;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class TerminalController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $query = Terminal::with(['ships'])->select(sprintf('%s.*', (new Terminal)->table));
            $table = Datatables::of($query);

            $table->addColumn('placeholder', '&nbsp;');
            $table->addColumn('actions', '&nbsp;');

            $table->editColumn('actions', function ($row) {
                $viewGate      = 'terminal_show';
                $editGate      = 'terminal_edit';
                $deleteGate    = 'terminal_delete';
                $crudRoutePart = 'terminals';

                return view('partials.datatablesActions', compact(
                    'viewGate',
                    'editGate',
                    'deleteGate',
                    'crudRoutePart',
                    'row'
                ));
            });

            $table->editColumn('id', function ($row) {
                return $row->id ? $row->id : "";
            });
            $table->editColumn('name', function ($row) {
                return $row->name ? $row->name : "";
            });
            $table->editColumn('ship', function ($row) {
                $labels = [];

                foreach ($row->ships as $ship) {
                    $labels[] = sprintf('<span class="label label-info label-many">%s</span>', $ship->name);
                }

                return implode(' ', $labels);
            });
            $table->editColumn('ship_id', function ($row) {
                $labels = [];

                foreach ($row->ships as $ship) {
                    $labels[] = sprintf('<span class="label label-info label-many">%s</span>', $ship->ship_ids);
                }

                return implode(' ', $labels);
            });

            $table->editColumn('air_comm_blocked', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->air_comm_blocked ? 'checked' : null) . '>';
            });
            $table->editColumn('power_backup', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->power_backup ? 'checked' : null) . '>';
            });
            $table->editColumn('power_main', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->power_main ? 'checked' : null) . '>';
            });
            $table->editColumn('sleep_schedule', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->sleep_schedule ? 'checked' : null) . '>';
            });
            $table->editColumn('battery_low', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->battery_low ? 'checked' : null) . '>';
            });
            $table->editColumn('speeding_start', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->speeding_start ? 'checked' : null) . '>';
            });
            $table->editColumn('speeding_end', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->speeding_end ? 'checked' : null) . '>';
            });
            $table->editColumn('modem_registration', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->modem_registration ? 'checked' : null) . '>';
            });
            $table->editColumn('geofence_in', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->geofence_in ? 'checked' : null) . '>';
            });
            $table->editColumn('geofence_out', function ($row) {
                return '<input type="checkbox" disabled ' . ($row->geofence_out ? 'checked' : null) . '>';
            });

            $table->rawColumns(['actions', 'placeholder', 'ship', 'ship_id', 'air_comm_blocked', 'power_backup', 'power_main', 'sleep_schedule', 'battery_low', 'speeding_start', 'speeding_end', 'modem_registration', 'geofence_in', 'geofence_out']);

            return $table->make(true);
        }

        return view('admin.terminals.index');
    }

    public function create()
    {
        abort_if(Gate::denies('terminal_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $ships = Ship::all()->pluck('name', 'id');

        return view('admin.terminals.create', compact('ships'));
    }

    public function store(StoreTerminalRequest $request)
    {
        $terminal = Terminal::create($request->all());
        $terminal->ships()->sync($request->input('ships', []));

        return redirect()->route('admin.terminals.index');
    }

    public function edit(Terminal $terminal)
    {
        abort_if(Gate::denies('terminal_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $ships = Ship::all()->pluck('name', 'id');

        $terminal->load('ships');

        return view('admin.terminals.edit', compact('ships', 'terminal'));
    }

    public function update(UpdateTerminalRequest $request, Terminal $terminal)
    {
        $terminal->update($request->all());
        $terminal->ships()->sync($request->input('ships', []));

        return redirect()->route('admin.terminals.index');
    }

    public function show(Terminal $terminal)
    {
        abort_if(Gate::denies('terminal_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $terminal->load('ships', 'terminalUsers');

        return view('admin.terminals.show', compact('terminal'));
    }

    public function destroy(Terminal $terminal)
    {
        abort_if(Gate::denies('terminal_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $terminal->delete();

        return back();
    }

    public function massDestroy(MassDestroyTerminalRequest $request)
    {
        Terminal::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
