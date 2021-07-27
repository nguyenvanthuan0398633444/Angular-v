/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { SETTING_TABLE } from './settings.table';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  NbDialogService,
  NbToastrService,
} from '@nebular/theme';
import { Router } from '@angular/router';
import { RESULT_STATUS } from '@ait/shared';
import { Subscription } from 'rxjs';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitDayJSService,
  AitEnvironmentService,
  AitTranslationService,
  AitUserService,
  AppState,
  getCaption,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { Enforcement } from '../interface';
import {
  getIsReloadApiConfig,
  getObjectIdWebDB,
} from '../../../state/selectors';
import { CHANGEOBJECTWEBDB, RELOADCONFIGAPI } from '../../../state/actions';
import { SyncApiConfigService } from '../../../services/aureole-v/sync-api-config.service';

export enum IMPORT_STATUS {
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
  EXCEPTION = 'EXCEPTION',
  ABORT = 'ABORT',
}

export enum MODE_SCREEN {
  SHOW = 'SHOW',
  SAVE = 'SAVE',
  NONE = 'NONE',
  NEW = 'NEW',
}

export interface ERROR {
  api_name?: any[];
  api_url?: any[];
  http_method?: any[];
  api_key?: any[];
  params?: any[];
}
@Component({
  selector: 'ait-web-db',
  templateUrl: 'sync-api-config.component.html',
  styleUrls: ['./sync-api-config.component.scss'],
})
export class SyncApiConfigComponent extends AitBaseComponent implements OnInit, AfterViewInit {
  i18nWebDB = 'common.aureole-v.web-db';
  dataSource: any[];
  source: LocalDataSource;
  mode_screen: string = MODE_SCREEN.SHOW;
  settings = {};
  api_nameCtrl: FormControl;
  api_urlCtrl: FormControl;
  http_methodCtrl: FormControl;
  api_keyCtrl: FormControl;
  paramsCtrl: FormControl;
  isLoading = false;
  showedElement = [];
  isShowLink = false;
  isProgress = false;
  isHoverRow = false;
  data: any;
  paramsPlaceholder: any;

  action = '';
  api_id = '';
  name = '';
  api_url = '';
  http_method = '';
  api_key = '';
  enforce_key = '';
  params = '';
  create_at = '';
  change_at = '';
  create_by = '';

  sub = {
    api_name: new Subscription(),
    api_url: new Subscription(),
    http_method: new Subscription(),
    api_key: new Subscription(),
    params: new Subscription(),
  };

  @ViewChild('table') table: Ng2SmartTableComponent;
  errors: ERROR = {
    api_name: [],
    api_url: [],
    http_method: [],
    api_key: [],
    params: [],
  };

  constructor(
    private jsonPipe: JsonPipe,
    private syncApiConfig: SyncApiConfigService,
    private dayJS: AitDayJSService,
    private translateService: AitTranslationService,
    store: Store<AppState | any>,
    authService: AitAuthService,
    apollo: Apollo,
    toatrsService: NbToastrService,
    env: AitEnvironmentService,
    private router: Router,
    private dialogService: NbDialogService,
    userService: AitUserService
  ) {
    super(store, authService, apollo, userService, env, null, toatrsService);
    this.setModulePage({
      page: 'sync_api_config',
      module: 'aureole-v'
    })
    store
      .pipe(select(getCaption))
      .subscribe(() => {
        this.action = this.translateService.translate('アクション');
        this.api_id = this.translateService.translate('開始日時');
        this.name = this.translateService.translate('開始日時');
        this.api_url = this.translateService.translate('API (URL)');
        this.http_method = this.translateService.translate('httpメソッド');
        this.api_key = this.translateService.translate('APIキー');
        this.params = this.translateService.translate('パラメータ (JSON)');
        this.create_at = this.translateService.translate('開始日時');
        this.change_at = this.translateService.translate('終了日時');
        this.create_by = this.translateService.translate('実行社員');
        this.settings = SETTING_TABLE(this);
        this.paramsPlaceholder = `${this.translateService.translate(
          '例：'
        )}
        {
          system: '0',
          database: '${this.translateService.translate('実習生名簿')}'
        }`;
      });

    this.syncApiConfig.sys_key.subscribe(_key => {
      if (_key) {
        this.enforce_key = _key;
        setTimeout(() => {
          this.mode_screen = MODE_SCREEN.SAVE;
        }, 1);
      }
    })
    
    store.pipe(select(getIsReloadApiConfig)).subscribe((val) => {
      if (val) {
        this.loadTable(true);
      }
    });

    this.api_nameCtrl = new FormControl('');
    this.api_urlCtrl = new FormControl('');
    this.http_methodCtrl = new FormControl('');
    this.api_keyCtrl = new FormControl('');
    this.paramsCtrl = new FormControl('');
    this.paramsCtrl.setValidators(this.jsonValidator());
    this.api_nameCtrl.valueChanges.subscribe((r) => this.getErrorByApiName(r));
    this.api_urlCtrl.valueChanges.subscribe((r) => this.getErrorByApiUrl(r));
    this.http_methodCtrl.valueChanges.subscribe((r) =>
      this.getErrorByHttpMethod(r)
    );
  }

  setLabel = (label: string) => {
    return this.translateService.translate(label);
  };

  ngAfterViewInit() {
    this.mode_screen = MODE_SCREEN.SHOW;
  }

  handleFocusout = (field) => {
    this.sub[field].unsubscribe();
  };

  handleCheckErrorFocus = (field: string) => {
    switch (field) {
      case 'api_nameCtrl':
        return;
      case 'api_urlCtrl':
        return;
      case 'api_keyCtrl':
        return this.getErrorByApiKey(this.api_keyCtrl.value);
      case 'paramsCtrl':
        return;
      case 'http_methodCtrl':
        return;
      default:
        return;
    }
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  setErrors = (newState: any) => (this.errors = { ...this.errors, ...newState });

  getErrorByApiKey = (value: any) => {
    const listErrors = [
      this.checkRequired(value, this.getI18n('api_key')),
    ];

    this.setErrors({
      api_key: listErrors,
    });
  };

  getErrorByParams = (value: any) => {
    this.errors.params = [];
    const listErrors = [
      this.checkRequired(value, this.getI18n('params')),
    ];

    this.setErrors({
      params: Array.from(new Set([...this.errors.params, ...listErrors])),
    });
  };

  getErrorByHttpMethod = (value: any) => {
    const listErrors = [
      this.checkRequired(value, this.getI18n('http_method')),
    ];

    this.setErrors({
      http_method: listErrors,
    });
  };

  callingCheckErrors = () => {
    this.getErrorByApiKey(this.api_keyCtrl.value);
    this.getErrorByApiName(this.api_nameCtrl.value);
    this.getErrorByApiUrl(this.api_urlCtrl.value);
    this.getErrorByHttpMethod(this.http_methodCtrl.value);
    this.getErrorByParams(this.paramsCtrl.value);
  };

  handleHoverRow = () => {
    this.isHoverRow = true;
  };

  checkErrorForAll = () => {
    const res = [];
    Object.entries(this.errors).forEach(([key, value]) => {
      const r = (value || []).filter((v: any) => !!v);
      if (r && r?.length !== 0) {
        res.push(key);
      }
    });
    return {
      result: res.length !== 0,
    };
  };

  getI18n = (fragment: string) => {
    return this.translateService.translate(fragment);
  };

  jsonValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const error: ValidationErrors = {
        message: this.translateService.translate('フォーマットが間違っています'),
      };
      try {
        JSON.parse(control.value);
      } catch (e) {
        control.setErrors(error);
        return error;
      }

      control.setErrors({ mesaage: '' });
      return null;
    };
  }

  getErrorByApiName = (value) => {
    const listErrors = [this.checkRequired(value, this.translateService.translate('API名'))];
    this.setErrors({
      api_name: listErrors,
    });
  };

  getErrorByApiUrl = (value) => {
    const listErrors = [
      this.checkRequired(value, this.translateService.translate('API (URL)')),
    ];

    this.setErrors({
      api_url: listErrors,
    });
  };

  confirmBeforeEnforce = (cb?) => {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.translateService.translate('インポートを開始します。実行してよろしいですか？'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          cb();
        }
      });
  };

  moveElToTop = (array: any[], field: any, value: any) => {
    return array.sort((x, y) =>
      x[field] === value ? -1 : y[field] === value ? 1 : 0
    );
  };

  loadTable = (spec?: boolean, config_key?: string) => {
    this.syncApiConfig.getSyncApiConfig().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = AitAppUtils.deepCloneArray(res.data);
        data.forEach(item => item.params && (item.params = JSON.parse(item.params)));
        let firstElement: any = {};
        if (config_key) {
          firstElement = data.find((d: any) => d?._key === config_key);
          this.dataSource = this.moveElToTop(
            (data || []).map((m: any) => ({
              ...m,
              config_key: m?._key,
              isNormal: true,
            })),
            '_key',
            config_key
          );
        } else {
          firstElement = data[0];
          this.dataSource = (data || []).map((m: any) => ({
            ...m,
            config_key: m?._key,
            isNormal: true,
          }));
        }
        this.data = firstElement;

        this.showedElement = [firstElement].filter((s) => !!s);

        if (spec) {
          this.store.dispatch(new RELOADCONFIGAPI(false));
        }

        this.source = new LocalDataSource(this.dataSource);
        this.resetForm();
        if (this.data && this.dataSource.length !== 0) {
          setTimeout(() => {
            this.mode_screen = MODE_SCREEN.SHOW;
            this.api_keyCtrl.patchValue(this.replaceAPIKey(this.data?.api_key));
            this.api_nameCtrl.patchValue(this.data?.name);
            this.api_urlCtrl.patchValue(this.data?.api_url);
            this.http_methodCtrl.patchValue(this.data?.http_method);
            this.paramsCtrl.patchValue(this.jsonPipe.transform(this.data?.params) || '');
          }, 0);
        }
      }
    });
  };

  getParams = (value: any) => JSON.parse(value) || '';

  handleFocusKey = () => {
    if (this.mode_screen !== MODE_SCREEN.SHOW) {
      this.api_keyCtrl.patchValue(
        this.showedElement[0]?.api_key || this.api_keyCtrl.value
      );
    } else {
      this.api_keyCtrl.patchValue(
        this.replaceAPIKey(this.showedElement[0]?.api_key)
      );
    }
  };

  ngOnInit() {
    const { state } = history;

    this.paramsCtrl.valueChanges.subscribe((r) => {
      if (r !== '') {
        this.setErrors({
          params: this.paramsCtrl.errors
            ? [this.paramsCtrl.errors.message]
            : [],
        });
      } else {
        this.getErrorByParams(r);
      }
    });

    this.loadTable(null, state.config_key);
  }

  actionBtnRight = () => {
    if (this.mode_screen === MODE_SCREEN.SHOW) {
      this.actionEditButton();
    } else {
      this.save();
    }
  };

  actionEditButton = () => {
    this.mode_screen = MODE_SCREEN.SAVE;
  };

  handleClickAddnew = () => {
    this.mode_screen = MODE_SCREEN.NEW;
    this.showedElement = [];
    this.resetForm();
  };

  handleClearBtn = () => {
    this.resetForm();
  };

  getContentMiddleButton = () => {
    this.handleFocusKey();
    return {
      title:
        this.mode_screen !== MODE_SCREEN.NEW
          ? this.translateService.translate('add-new')
          : this.translateService.translate('clear'),
      action:
        this.mode_screen !== MODE_SCREEN.NEW
          ? this.handleClickAddnew
          : this.handleClearBtn,
    };
  };

  resetForm = async () => {
    this.api_keyCtrl.patchValue(null);
    this.api_nameCtrl.patchValue(null);
    this.api_urlCtrl.patchValue(null);
    this.http_methodCtrl.patchValue(null);
    this.paramsCtrl.patchValue(null);
    setTimeout(() => {
      this.clearErrors();
    }, 0);
  };

  navigateHistory = () => {
    this.router.navigateByUrl('/sync-pe-api-history');
  };

  getSaveOrEditButton = () => {
    return {
      title:
        this.mode_screen !== MODE_SCREEN.SHOW
          ? this.translateService.translate('c_2001')
          : this.translateService.translate('edit'),
      icon:
        this.mode_screen !== MODE_SCREEN.SHOW
          ? 'play-circle-outline'
          : 'edit-outline',
    };
  };

  getValue = (v: any) => {
    if (!this.isProgress) {
      v?.data?.config_key && (this.enforce_key = v.data.config_key);
      this.clearErrors();
      this.source = v.source;
      this.showedElement = [v.data];
      const firstElement = this.showedElement[0];
      if (this.showedElement.length !== 0 && firstElement) {
        this.mode_screen = MODE_SCREEN.SHOW;
        this.api_keyCtrl.patchValue(firstElement?.api_key);
        this.api_nameCtrl.patchValue(firstElement?.name);
        this.api_urlCtrl.patchValue(firstElement?.api_url);
        this.http_methodCtrl.patchValue(firstElement?.http_method);
        this.paramsCtrl.patchValue(this.jsonPipe.transform(firstElement?.params));
        this.clearErrors();
      }
    }
  };

  clearErrors = () => {
    this.setErrors({
      api_key: [],
      api_name: [],
      api_url: [],
      http_method: [],
      params: [],
    });
  };

  focus = () => {
    this.setErrors({
      api_key: [],
    });
  };

  replaceAPIKey = (string: string) => {
    if (!string) {
      return '';
    }
    const sr = '****';
    const arr = string.split('-');
    arr[1] = sr;
    arr[2] = sr;
    arr[3] = sr;
    return arr.join('-');
  };

  save = async () => {
    this.callingCheckErrors();
    const title = this.translateService.translate(
      '通知'
    );
    const ErrorFrom = this.checkErrorForAll();

    if (!ErrorFrom.result) {
      this.isLoading = true;
      this.callLoadingApp();
      const data = {
        _key: this.showedElement[0]?._key,
        name: this.api_nameCtrl.value,
        api_url: this.api_urlCtrl.value,
        http_method: this.http_methodCtrl.value,
        api_key: this.api_keyCtrl.value,
        params: this.paramsCtrl.value
          ? this.paramsCtrl.value.replace(/\n/g, '')
          : null,
      };
      !data._key && delete data._key;

      this.syncApiConfig.saveApiConfig([data]).then((res) => {
        if (res?.status === RESULT_STATUS.OK) {
          this.showToastr(
            title,
            this.translateService.translate(
              'データは正常に保存されました'
            )
          );
          this.loadTable();
          this.isLoading = false;
          this.cancelLoadingApp();
        } else {
          this.showToastr(
            title,
            this.translateService.translate(
              'データが正常に保存されませんでした'
            ),
            'danger'
          );
          this.isLoading = false;
          this.cancelLoadingApp();
        }
      });
    }
  };

  enforcementWebDB = async () => {
    this.isProgress = true;
    if (this.mode_screen === MODE_SCREEN.SHOW) {
      this.callingCheckErrors();
      const title = this.translateService.translate(
        '通知'
      );
      const message1 = this.translateService.translate(
        'リクエストが行われています...'
      );
      const err_message = this.translateService.translate(
        '実行が中断されました'
      );
      const callback = () => {
        this.callLoadingApp();
        const data: Enforcement = {
          api_config_key: `${this.enforce_key}`,
          user_id: this.user_id,
          company: this.COMPANY,
        };
        this.syncApiConfig.enforcementWebDb([data]).then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            this.showToastr(title, message1, 'info');
            this.isLoading = false;
            this.isShowLink = true;
            this.cancelLoadingApp();
          } else {
            this.showToastr(title, err_message, 'danger');
            this.isLoading = false;
            this.cancelLoadingApp();
          }
          this.isProgress = false;
        });
      };
      this.confirmBeforeEnforce(callback);
    }
  };
}
