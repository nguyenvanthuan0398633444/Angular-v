import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ait-popup-logging',
  template: `
  <ait-template-popup>
    <div class="cont">

    <h3 style="color:#fff">{{'ステップ' | translate}}</h3>
    <div style="display:flex;flex-direction:column;align-items:flex-start;width:100%">
    <p *ngFor="let step of rowData.steps;let i = index" style="color:#fff">{{i +1}}. {{step}}</p>
    </div>
    <div style="margin:20px"></div>
    <ait-button [style]="'active'" [title]="'閉じる' | translate" (click)="close()"></ait-button>
    <div style="margin:20px"></div>
    </div>

  </ait-template-popup>
  `,
  styles: [
    `.cont {
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      width:100%;
    } ,
    `,
  ],
})

export class PopupLoggingComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any;
  constructor(private ref: NbDialogRef<PopupLoggingComponent>) { }

  close() {
    this.ref.close();
  }
}
