/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ait-link-api',
  template: `
    <div class="row__td__tablex" *ngIf="!rowData.isNormal">
      <a
        (click)="navigate()"
        style="cursor:pointer;color:royalblue;
    text-decoration: underline;"
        >{{ rowData.config_key }}</a
      >
    </div>
    <div class="row__td__tablex" *ngIf="rowData.isNormal">
      <a>{{ rowData.config_key }}</a>
    </div>
  `,
  styles: [
    `
      .row__td__tablex {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class LinkAPIComponent {
  rowData: any;
  isNormal = false;
  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (location.hash.includes('sync-pe-api-setting')) {
          this.isNormal = true;
        } else {
          this.isNormal = false;
        }
      }
    });
  }

  navigate = () => {
    this.router.navigateByUrl('/sync-pe-api-setting', {
      state: {
        config_key: this.rowData?.config_key,
      },
    });
  };
}
