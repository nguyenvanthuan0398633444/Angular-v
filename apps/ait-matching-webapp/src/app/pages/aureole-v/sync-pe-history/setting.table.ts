/* eslint-disable @typescript-eslint/no-explicit-any */
// import { IconColumnComponent } from './components/icon-column.component';

import { AitAppUtils } from '@ait/ui';
import { IconColumnComponent } from '../sync-api-config/components/icon-column.component';
import { LinkAPIComponent } from './link-api/link-api.component';
import { LinkLogComponent } from './link/link-log.component';

export const SETTING_TABLE_HISTORY = (self: any) => {
  return {
    actions: false,
    mode: 'external',
    row: {},
    columns: {

      sequence: {
        title: self.sequence,
        type: 'html',
        with: '80px',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(row?._key)}</span></div>`;
        },
      },
      api_config: {
        title: self.api_id,
        type: 'custom',
        renderComponent: LinkAPIComponent
      },
      database: {
        title: self.database,
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(row?.database)}</span></div>`;
        },
      },
      status: {
        title: self.status,
        type: 'custom',
        renderComponent: IconColumnComponent,
      },
      create_by: {
        title: self.create_by,
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(row?.create_by)}</span></div>`;
        },
      },
      create_at: {
        title: self.create_at,
        position: 'center',
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>
          ${AitAppUtils.trimDataString(self.dayJS.calculateDateTime(row?.create_at))}</span></div>`;
        },
      },
      change_at: {
        title: self.change_at,
        position: 'center',
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>
          ${AitAppUtils.trimDataString(self.dayJS.calculateDateTime(row?.change_at))}</span></div>`;
        },
      },
      count: {
        title: self.count,
        width : '25%',
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(row?.count)}</span></div>`;
        },
      },
      log: {
        title: self.log,
        type: 'custom',
        renderComponent: LinkLogComponent,
      },
    },
    add: {
      confirmCreate: true,
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
  };
};
