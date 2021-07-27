import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { PopupLoggingComponent } from '../popup/popup-logging.component';
@Component({
  selector: 'ait-link-log',
  template: `
    <div class="row__td__tablex"><a (click)="openPopup()"
    style="cursor:pointer;color:royalblue;
    text-decoration: underline;">{{'詳細' | translate}}</a></div>
  `,
  styles: [
    `
      .row__td__tablex {
        width : 100%;
        display : flex;
        align-items:center;
        justify-content:center

      }
    `
  ]
})

export class LinkLogComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any;
  constructor(private dialogService: NbDialogService) { }

  openPopup() {
    this.dialogService.open(PopupLoggingComponent, {
      context: {
        rowData: this.rowData,
      },
    });
  }
}
