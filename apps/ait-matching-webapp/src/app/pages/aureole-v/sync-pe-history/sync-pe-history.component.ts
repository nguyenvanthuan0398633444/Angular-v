/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SETTING_TABLE_HISTORY } from './setting.table';
import { interval, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import {
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Router } from '@angular/router';
import { PopupLoggingComponent } from './popup/popup-logging.component';
import { RESULT_STATUS } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitDayJSService,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  getCaption,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import {
  getDataReload,
  getFlagDataReload,
} from '../../../state/selectors';
import {
  CHANGERELOADDATAFLAG,
  GETRELOADDATAFLAG,
} from '../../../state/actions';
import { SyncPeHistoryService } from '../../../services/aureole-v/sync-pe-history.service';

@Component({
  selector: 'ait-sync-api-history',
  templateUrl: 'sync-pe-history.component.html',
  styleUrls: ['./sync-pe-history.component.scss'],
})
export class SyncPeHistoryComponent
  extends AitBaseComponent
  implements OnInit, OnDestroy {
  isLoading = false;
  source: LocalDataSource;
  settings = {};
  timeout: number;
  isLoadInterval = false;
  secondCountDown = 30;
  counter$: Observable<number>;
  counter = 0;
  subscription: Subscription;
  subscription2: Subscription;
  currentValue = -1;
  isLoadingTable = false;
  mainCount = 30;
  sequence = '';
  api_id = '';
  database = '';
  status = '';
  create_by = '';
  create_at = '';
  change_at = '';
  count = '';
  log = '';

  constructor(
    layoutScrollService: NbLayoutScrollService,
    private syncApiHistory: SyncPeHistoryService,
    private dayJS: AitDayJSService,
    private translateService: AitTranslationService,
    store: Store<AppState | any>,
    authService: AitAuthService,
    apollo: Apollo,
    toatrsService: NbToastrService,
    env: AitEnvironmentService,
    private router: Router,
    private dialogService: NbDialogService
  ) {
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toatrsService
    );
    this.setModulePage({
      page: 'sync_pe_history',
      module: 'aureole-v',
    });

    store.pipe(select(getFlagDataReload)).subscribe((flag) => {
      if (flag !== this.isLoadInterval) {
        this.isLoadInterval = flag;
      }
    });

    store
      .pipe(select(getCaption))
      .subscribe(() => {
        this.sequence = this.translateService.translate('シーケンス');
        this.api_id = this.translateService.translate('APIのID');
        this.database = this.translateService.translate('データベース');
        this.status = this.translateService.translate('状況');
        this.create_by = this.translateService.translate('実行社員');
        this.create_at = this.translateService.translate('開始日時');
        this.change_at = this.translateService.translate('終了日時');
        this.count = this.translateService.translate('レコード');
        this.log = this.translateService.translate('ログ');
        this.settings = SETTING_TABLE_HISTORY(this);
      });

    store.pipe(select(getDataReload)).subscribe((data) => {
      this.secondCountDown = data?.secondCountDown;
      this.currentValue = data?.currentValue;
      this.counter = data?.counter;
      this.isLoadingTable = data?.isLoadingTable;
    });

    router.events.subscribe(() => {
      const pathArr = location.hash.split('/');
      const fragment = pathArr[pathArr.length - 1];
      if (fragment !== 'sync-api-history') {
        this.isLoadInterval = false;
        store.dispatch(new CHANGERELOADDATAFLAG(false));
        this.store.dispatch(
          new GETRELOADDATAFLAG({
            secondCountDown: 31,
            currentValue: -1,
            counter: 30,
            isLoadingTable: false,
          })
        );
      }
    });
  }
  naviagteWebDB = () => {
    this.isLoadInterval = false;
    this.router.navigateByUrl('/sync-pe-api-setting');
  };

  ngOnInit() {
    this.counter$ = of(this.secondCountDown);
    this.syncApiHistory.getInfoHistory().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = [...res.data].sort((a,b) => (a.create_at < b.create_at) ? 1 : -1);
        this.source = new LocalDataSource(data);
      }
    });
  }

  openPopup() {
    this.dialogService.open(PopupLoggingComponent);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.isLoadInterval = false;
  }

  pushDataReload = () => {
    this.store.dispatch(
      new GETRELOADDATAFLAG({
        secondCountDown: this.secondCountDown,
        currentValue: this.currentValue,
        counter: this.counter,
        isLoadingTable: this.isLoadingTable,
      })
    );
  };

  handleTimer = () => {
    if (this.isLoadInterval) {
      this.counter$ = interval(1000).pipe(
        map((value) => {
          if (value !== this.currentValue) {
            this.currentValue = value;
            this.secondCountDown = this.secondCountDown - 1;
            return this.secondCountDown;
          }
          return this.secondCountDown;
        })
      );

      this.subscription = this.counter$.subscribe((count) => {
        if (count >= 0) {
          this.counter = count || this.secondCountDown;
        } else {
          const title = this.translateService.translate('003');
          const message = this.translateService.translate('詳細を表示');
          this.showToastr(title, message, 'info');
          this.isLoadingTable = true;
          this.callLoadingApp();
          this.syncApiHistory.getInfoHistory().then((res) => {
            if (res.status === RESULT_STATUS.OK) {
              this.source = new LocalDataSource(res.data);
              setTimeout(() => {
                this.isLoadingTable = false;
                this.cancelLoadingApp();
              }, 1000);
              this.secondCountDown = 31;
              this.counter = this.secondCountDown - 1;
            }
          });
        }
      });
    }
  };

  changeFlag = () => {
    this.store.dispatch(new CHANGERELOADDATAFLAG(this.isLoadInterval));
  };

  isWebDBPage = () => {
    const pathArray = location.hash.split('/');
    return pathArray[pathArray.length - 1] === 'sync-api-history';
  };

  handleClickButtonRight = () => {
    if (!this.isLoadInterval) {
      this.isLoadInterval = true;
      this.changeFlag();
      this.counter$ = interval(1000).pipe(
        map((value) => {
          if (value !== this.currentValue) {
            this.currentValue = value;
            this.secondCountDown = this.secondCountDown - 1;
            return this.secondCountDown;
          }
          return this.secondCountDown;
        })
      );
      this.subscription = this.counter$.subscribe((count) => {
        if (count >= 0) {
          this.counter = count || this.secondCountDown;
        } else {
          const title = this.translateService.translate('003');
          const message = this.translateService.translate('詳細を表示');
          this.showToastr(title, message, 'info');
          this.isLoadingTable = true;
          this.callLoadingApp();
          this.syncApiHistory.getInfoHistory().then((res) => {
            if (res.status === RESULT_STATUS.OK) {
              this.source = new LocalDataSource(res.data);
              setTimeout(() => {
                this.isLoadingTable = false;
                this.cancelLoadingApp();
              }, 1000);
              this.secondCountDown = 31;
              this.counter = this.secondCountDown - 1;
            }
          });
        }
        this.pushDataReload();
      });
    } else {
      this.secondCountDown = 31;
      this.counter = this.secondCountDown - 1;
      this.isLoadInterval = false;
      this.changeFlag();
      this.subscription.unsubscribe();
    }
  };

  getContentButtonRight = () => {
    const auto = this.translateService.translate('自動更新');
    const seconds = this.translateService.translate('秒');
    if (this.isLoadInterval) {
      return `${auto}...（${this.counter} ${seconds}）`;
    } else {
      return auto;
    }
  };

  ngOnDestroy() {
    if (!this.isLoadInterval) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }
}
