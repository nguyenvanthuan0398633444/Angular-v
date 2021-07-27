/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { LOADINGAPP, RELOADCONFIGAPI } from '../../../../state/actions';
import { AppState } from '../../../../state/models';
import { SyncApiConfigService } from '../../../../services/aureole-v/sync-api-config.service';
import { AitConfirmDialogComponent, AitTranslationService } from '@ait/ui';

@Component({
  selector: 'ait-action-column',
  template: `
    <div class="row__td__table" style="justify-content:center">
      <button
      (click)="btn.action()"
      nbButton
      style="margin:5px"
      size="tiny" status="{{btn.status}}"
      *ngFor="let btn of actionBtn"
      [nbTooltip]="btn.title">
      <nb-icon icon="{{btn.icon}}"></nb-icon>
     </button>
    </div>
  `
})

export class ActionColumnComponent implements OnInit {
  constructor(
    private dialogService: NbDialogService,
    private translateService : AitTranslationService,
    private apiConfigService: SyncApiConfigService,
    private store: Store<AppState>) { }
  rowData: any;
  actionBtn = []

  ngOnInit() {
    this.actionBtn = [
      {
        status: 'primary',
        title: this.translateService.translate('c_2003'),
        icon: 'edit',
        action: () => {
          const _key = this.rowData._key;
          this.apiConfigService.sys_key.next(_key);
        }
      },
      {
        status: 'danger',
        title: this.translateService.translate('c_2002'),
        icon: 'trash-2-outline',
        action: this.handleDelete
      },

    ];
  }

  handleDelete = () => {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.translateService.translate('このデータを削除しますか。'),
        }
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.store.dispatch(new LOADINGAPP(true));
          this.apiConfigService.removeApiConfig(this.rowData._key).then(() => {
            this.store.dispatch(new RELOADCONFIGAPI(true));
            this.store.dispatch(new LOADINGAPP(false));
          })
        }
      });
  }
}
