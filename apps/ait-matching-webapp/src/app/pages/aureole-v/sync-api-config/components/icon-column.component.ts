/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { AitTranslationService } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { IMPORT_STATUS } from '../sync-api-config.component';

@Component({
  selector: 'ait-icon-column',
  template: `
    <div class="icon"><nb-icon [icon]="icon" [style]="iconStyle" [nbTooltip]="status" [status]="iconColor"></nb-icon></div>
  `,
  styles: [
    `
     .icon {
       width : 100%;
       display:flex;
       align-items:center;
       justify-content:center;
     }
    `,
  ],
})

export class IconColumnComponent implements OnInit {
  rowData: any;
  icon: string;
  iconStyle: any = {
    'text-align': 'center',
  };
  iconColor: string;
  status: string = '';
  constructor(private translateService : AitTranslationService) {

  }

  ngOnInit() {
    this.setup(this.rowData);
    this.status = this.translateService.translate(this.rowData?.status);
  }

  setup = (rowData: any) => {
    switch ((rowData.status || '').trim()) {
      case IMPORT_STATUS.ABORT:
        this.icon = 'close-circle-outline';
        this.iconStyle = {};
        this.iconColor = 'warning';
        return;
      case IMPORT_STATUS.EXCEPTION:
        this.icon = 'alert-triangle-outline';
        this.iconStyle = {};
        this.iconColor = 'warning';
        return;
      case IMPORT_STATUS.ERROR:
        this.icon = 'alert-triangle-outline';
        this.iconStyle = {};
        this.iconColor = 'danger';
        return;
      case IMPORT_STATUS.FINISHED:
        this.icon = 'done-all-outline';
        this.iconStyle = {};
        this.iconColor = 'success';
        return;
      case IMPORT_STATUS.PROCESSING:
        this.icon = 'activity-outline';
        this.iconStyle = {};
        this.iconColor = 'primary';
        return;
      default:
        this.icon = 'play-circle-outline',
        this.iconStyle = {};
        this.iconColor = 'info';
        return;
    }
  }
}
