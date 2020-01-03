<?php

return [
    'userManagement' => [
        'title'          => 'User management',
        'title_singular' => 'User management',
    ],
    'permission'     => [
        'title'          => 'Permissions',
        'title_singular' => 'Permission',
        'fields'         => [
            'id'                => 'ID',
            'id_helper'         => '',
            'title'             => 'Title',
            'title_helper'      => '',
            'created_at'        => 'Created at',
            'created_at_helper' => '',
            'updated_at'        => 'Updated at',
            'updated_at_helper' => '',
            'deleted_at'        => 'Deleted at',
            'deleted_at_helper' => '',
        ],
    ],
    'role'           => [
        'title'          => 'Roles',
        'title_singular' => 'Role',
        'fields'         => [
            'id'                 => 'ID',
            'id_helper'          => '',
            'title'              => 'Title',
            'title_helper'       => '',
            'permissions'        => 'Permissions',
            'permissions_helper' => '',
            'created_at'         => 'Created at',
            'created_at_helper'  => '',
            'updated_at'         => 'Updated at',
            'updated_at_helper'  => '',
            'deleted_at'         => 'Deleted at',
            'deleted_at_helper'  => '',
        ],
    ],
    'user'           => [
        'title'          => 'Users',
        'title_singular' => 'User',
        'fields'         => [
            'id'                       => 'ID',
            'id_helper'                => '',
            'name'                     => 'Name',
            'name_helper'              => '',
            'username'                 => 'Username',
            'username_helper'          => '',
            'email'                    => 'Email',
            'email_helper'             => '',
            'email_verified_at'        => 'Email verified at',
            'email_verified_at_helper' => '',
            'password'                 => 'Password',
            'password_helper'          => '',
            'roles'                    => 'Roles',
            'roles_helper'             => '',
            'remember_token'           => 'Remember Token',
            'remember_token_helper'    => '',
            'created_at'               => 'Created at',
            'created_at_helper'        => '',
            'updated_at'               => 'Updated at',
            'updated_at_helper'        => '',
            'deleted_at'               => 'Deleted at',
            'deleted_at_helper'        => '',
            'old_password'             => 'Old Password',
            'new_password'             => 'New Password',
            'confirm_password'         => 'Confirm Password',
            'change_password'          => 'Change Password',
            'destinasion-email'        => 'Email Destination',
            'terminal'                 => 'Terminal',
            'terminal_helper'          => '',
        ],
    ],
    'manager'        => [
        'title'          => 'Manager',
        'title_singular' => 'Manager',
        'fields'         => [
            'id'                => 'ID',
            'id_helper'         => '',
            'created_at'        => 'Created at',
            'created_at_helper' => '',
            'updated_at'        => 'Updated at',
            'updated_at_helper' => '',
            'deleted_at'        => 'Deleted at',
            'deleted_at_helper' => '',
            'user'              => 'User',
            'user_helper'       => '',
            'manager'           => 'Manager',
            'manager_helper'    => '',
        ],
    ],
    'ship'           => [
        'title'          => 'Antenna List',
        'title_singular' => 'Antenna',
        'fields'         => [
            'id'                           => 'ID',
            'id_helper'                    => '',
            'name'                         => 'Name',
            'name_helper'                  => '',
            'type'                         => 'Type',
            'type_helper'                  => '',
            'long'                         => 'Long',
            'long_helper'                  => '',
            'owner'                        => 'Owner',
            'owner_helper'                 => '',
            'call_sign'                    => 'Call Sign',
            'call_sign_helper'             => '',
            'created_at'                   => 'Created at',
            'created_at_helper'            => '',
            'updated_at'                   => 'Updated at',
            'updated_at_helper'            => '',
            'deleted_at'                   => 'Deleted at',
            'deleted_at_helper'            => '',
            'ship_ids'                     => 'Antenna Ids',
            'ship_ids_helper'              => '',
            'region_name'                  => 'Region Name',
            'region_name_helper'           => '',
            'last_registration_utc'        => 'Last Registration Utc',
            'last_registration_utc_helper' => '',
        ],
    ],
    'terminal'       => [
        'title'          => 'Terminal',
        'title_singular' => 'Terminal',
        'fields'         => [
            'id'                        => 'ID',
            'id_helper'                 => '',
            'name'                      => 'Name',
            'name_helper'               => '',
            'air_comm_blocked'          => 'Air Comm Blocked',
            'air_comm_blocked_helper'   => '',
            'power_backup'              => 'Power Backup',
            'power_backup_helper'       => '',
            'power_main'                => 'Power Main',
            'power_main_helper'         => '',
            'sleep_schedule'            => 'Sleep Schedule',
            'sleep_schedule_helper'     => '',
            'battery_low'               => 'Battery Low',
            'battery_low_helper'        => '',
            'speeding_start'            => 'Speeding Start',
            'speeding_start_helper'     => '',
            'speeding_end'              => 'Speeding End',
            'speeding_end_helper'       => '',
            'modem_registration'        => 'Modem Registration',
            'modem_registration_helper' => '',
            'geofence_in'               => 'Geofence In',
            'geofence_in_helper'        => '',
            'geofence_out'              => 'Geofence Out',
            'geofence_out_helper'       => '',
            'created_at'                => 'Created at',
            'created_at_helper'         => '',
            'updated_at'                => 'Updated at',
            'updated_at_helper'         => '',
            'deleted_at'                => 'Deleted at',
            'deleted_at_helper'         => '',
            'ship'                      => 'Antenna',
            'ship_helper'               => '',
            'ship_id'                   => 'Antenna ID',
            'ship_id_helper'            => '',
        ],
    ],
    'historyShip'    => [
        'title'          => 'Form Mobile',
        'title_singular' => 'Form Mobile',
        'fields'         => [
            'id'                      => 'ID',
            'id_helper'               => '',
            'created_at'              => 'Created at',
            'created_at_helper'       => '',
            'updated_at'              => 'Updated at',
            'updated_at_helper'       => '',
            'deleted_at'              => 'Deleted at',
            'deleted_at_helper'       => '',
            'history_ids'             => 'History Id',
            'history_ids_helper'      => '',
            'sin'                     => 'Sin',
            'sin_helper'              => '',
            'min'                     => 'Min',
            'min_helper'              => '',
            'region_name'             => 'Region Name',
            'region_name_helper'      => '',
            'receive_utc'             => 'Receive Utc',
            'receive_utc_helper'      => '',
            'message_utc'             => 'Message Utc',
            'message_utc_helper'      => '',
            'ship'                    => 'Antenna Id',
            'ship_helper'             => '',
            'payload'                 => 'Payload',
            'payload_helper'          => '',
            'ota_message_size'        => 'Ota Message Size',
            'ota_message_size_helper' => '',
        ],
    ],
    'setting'        => [
        'title'          => 'Settings',
        'title_singular' => 'Setting',
        'fields'         => [
            'id'                   => 'ID',
            'id_helper'            => '',
            'simple_report'        => 'Simple Report',
            'simple_report_helper' => '',
            'created_at'           => 'Created at',
            'created_at_helper'    => '',
            'updated_at'           => 'Updated at',
            'updated_at_helper'    => '',
            'deleted_at'           => 'Deleted at',
            'deleted_at_helper'    => '',
        ],
    ],
];
