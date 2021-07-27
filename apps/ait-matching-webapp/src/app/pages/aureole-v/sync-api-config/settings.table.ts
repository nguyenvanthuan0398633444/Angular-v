/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitAppUtils } from '@ait/ui';
import { LinkAPIComponent } from '../sync-pe-history/link-api/link-api.component';
import { ActionColumnComponent } from './components/action.column.component';

export const SETTING_TABLE = (self: any) => {
  return {
    actions: false,
    mode: 'external',
    row: {},
    columns: {
      action: {
        title: self.action,
        type: 'custom',
        renderComponent: ActionColumnComponent,
      },
      api_config: {
        title: self.api_id,
        type: 'custom',
        renderComponent: LinkAPIComponent,
      },
      name: {
        title: self.name,
        type: 'html',
        with: '250px',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(
            row?.name
          )}</span></div>`;
        },
      },
      api_url: {
        title: self.api_url,
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(
            row?.api_url
          )}</span></div>`;
        },
      },
      http_method: {
        title: self.http_method,
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(
            row?.http_method
          )}</span></div>`;
        },
      },
      api_key: {
        title: self.api_key,
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(
            self.replaceAPIKey(row?.api_key)
          )}</span></div>`;
        },
      },
      param: {
        title: self.params,
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>
          ${
            AitAppUtils.trimDataString(row?.params)
              ? self.jsonPipe.transform(row?.params)
              : ''
          }</span></div>`;
        },
      },
      create_at: {
        title: self.create_at,
        position: 'center',
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>
          ${AitAppUtils.trimDataString(
            self.dayJS.calculateDateTime(row?.create_at)
          )}</span></div>`;
        },
      },
      change_at: {
        title: self.change_at,
        position: 'center',
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>
          ${AitAppUtils.trimDataString(
            self.dayJS.calculateDateTime(row?.change_at)
          )}</span></div>`;
        },
      },
      create_by: {
        title: self.create_by,
        type: 'html',
        valuePrepareFunction: (cell: any, row: any) => {
          return `<div class="row__td__table"><span>${AitAppUtils.trimDataString(
            row?.create_by
          )}</span></div>`;
        },
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
