import { RESULT_STATUS } from '@ait/shared';
import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../state/models';

import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitMasterDataService,
 
  AitTranslationService,
 
  ButtonGroupInterface,
  MODULES,
  PAGES
} from '@ait/ui';
import { RecommencedUserService } from '../../../../services/aureole-v/recommenced-user.service';
import { JobService } from '../../../../services/aureole-v/job.service';
import { Apollo } from 'apollo-angular';
import { MODE_SCREEN } from '../../sync-api-config/sync-api-config.component';
import { JobInfoDto } from '../../company/interface';
import { leadingComment } from '@angular/compiler';


@Component({
  selector: 'ait-job-edit',
  templateUrl: 'job-edit.component.html',
  styleUrls: ['./job-edit.component.scss']
})

export class JobCompanyComponent extends AitBaseComponent implements OnInit, AfterViewChecked, AfterContentInit {
  constructor(
    private masterDataService: AitMasterDataService,
    store: Store<AppState | any>,
    authService: AitAuthService,
    toastService: NbToastrService,
    private companyService: RecommencedUserService,
    private translatePipe: AitTranslationService,
    private router: Router,
    private dialogService: NbDialogService,
    private translateService: AitTranslationService,
    private jobService: JobService,
    apollo: Apollo,
    private cdr: ChangeDetectorRef,
    _env: AitEnvironmentService
  ) {
    super(store, authService, apollo, null, _env, null, toastService);
    this.setModulePage({
      module: MODULES.JOB,
      page: PAGES.JOB_EDIT
    });

  }
  isFirst = true;

  buttons: any[] = [
    {
      title: 'スキップ',
      style: 'active',
      action: () => {
        this.skip();
      },
      hide: false, // ===NEW
      isLoading: this.isLoading,
      id: 'skip_button',
      isDefault: true
    },
    {
      title: '戻る',
      style: 'active',
      action: () => {
        this.back();
      },
      hide: false, // !==NEW
      isLoading: this.isLoading,
      id: 'back_button',
      isDefault: true

    },
    {
      title: '削除',
      style: 'active',
      action: () => {
        this.confirmBeforeDelete();
      },
      hide: false, // !==NEW
      isLoading: this.isLoading,
      id: 'delete_button',
      isDefault: true

    },
    {
      title: 'リセット',
      style: 'active',
      action: () => {
        console.log('eff')
        this.resetForm();
      },
      hide: false, // !==NEW
      isLoading: this.isLoading,
      id: 'reset_button',
      isDefault: true

    },
    {
      title: '保存',
      style: 'active',
      action: () => {
        this.save();
      },
      hide: false, // !==NEW
      isLoading: this.isLoading,
      id: 'save_button',
      isDefault: true

    },
    {
      title: 'tests',
      style: 'active',
      action: () => {
        this.test();
      },
      hide: false, // !==NEW
      isLoading: this.isLoading,
      id: 'save_button',
      isDefault: true

    }
  ]

  isResetCheckbox = false;



  loading = true;
  isSubmit = false;

  error_settings = [];
  timeError = {
    time1: [],
    time2: [],
    time3: []
  };



  genderSelect: any;
  job_company: any = '';

  companyName: any = null;

  mode_screen = MODE_SCREEN.SAVE;
  errors = {
    job_company: [],
    business: [],
    residence_status: [],
    description: [],
    prefecture: [],
    salary_type: [],
    desired_salary: [],
    gender: [],
    desired_occupation: [],
    experienced_occupation: []
  }

  requireFieldsConds = []

  gender = []

  date = (new Date()).getTime();
  stateJobInfo = {} as JobInfoDto;
  stateJobInfoDf = {} as JobInfoDto;
  stateForm: any = {} as JobInfoDto;
  resetMasterInput = false;
  dataCompany = [];

  getModeStatus = (title: string) => {
    const newMode = ['スキップ',]
    const saveMode = ['戻る', '削除'];
    const anyMode = ['リセット', '保存'];
    if (this.mode_screen === MODE_SCREEN.NEW) {
      return newMode.includes(title) || anyMode.includes(title);
    }
    return saveMode.includes(title) || anyMode.includes(title);;
  }

  getTitleByMode = () => {
    return this.mode_screen === MODE_SCREEN.SAVE ? '求人要件更新' : '求人要件登録'
  }

  getNumberDefault = (number1, number2) => {

    return number1 ?? number2;
  }

  setErrors = (newErrors: any) => this.errors = { ...this.errors, ...newErrors };
  clearErrors = () => {
    this.setErrors({
      job_company: [],
      business: [],
      residence_status: [],
      description: [],
      prefecture: [],
      salary_type: [],
      desired_salary: [],
      gender: [],
      desired_occupation: [],
      experienced_occupation: []
    })
  }
  translateLabel = (label) => this.translateService.translate(label);

  handleInput = (val, field: string, label: string) => {
    this.getErrorMessageAll(val, label, field);

  }
  getErrorMessageAll = (value: any, label: string, fieldName: string) => {
    const listErrors = [
      this.checkRequired(value, label)
    ]
    this.setErrors({
      [fieldName]: listErrors
    })
  }

  ngAfterViewChecked() {
    // your code to update the model
    this.cdr.detectChanges();
  }

  handleError = (value, field: string) => {
    const find = this.error_settings.find(f => f.field === field);
    if (find) {
      find.isValid = value?.isValid;
    }
    else {
      this.error_settings = [...this.error_settings, { field, isValid: value?.isValid }]
    }

  }

  getValueMaster = ($event) => {
    const midware = (data) => {

      return data ? data[0]?._key : undefined;
    }
    // console.log($event, $event?.value ? midware($event?.value) : undefined)
    return $event?.value ? midware($event?.value) : undefined
  }

  getValueMasterArray = ($event) => {
    const midware = (data) => {
      const target = data.map(m => m?._key).filter(f => !!f);
      return target.length !== 0 ? 'has' : undefined;
    }
    return $event?.value ? midware($event?.value) : undefined
  }
  setState = (newState: any) => {
    this.stateJobInfo = { ...this.stateJobInfo, ...newState };
    this.stateJobInfoDf = { ...this.stateJobInfoDf, ...newState };
  }

  getFieldName = (name: string) => this.translatePipe.translate(name || '');

  checkRequireField = (field: string) => {
    return this.requireFieldsConds.includes(field);
  }

  checkChange = (val: boolean, field: string) => {
    // console.log(this.requireFieldsConds)
    if (val) {
      if (!this.requireFieldsConds.includes(field)) {
        this.requireFieldsConds.push(field);
        if (field === 'desired_occupation') {
          this.stateForm = {
            ...this.stateForm,
            only_apply: ['希望者のみ'],
          }
        }
        else {
          this.stateForm = {
            ...this.stateForm,
            only_experienced: ['希望者のみ']
          }
        }


      }

    }
    else {
      if (field === 'desired_occupation') {
        this.stateForm = {
          ...this.stateForm,
          only_apply: null,
        }
      }
      else {
        this.stateForm = {
          ...this.stateForm,
          only_experienced: null
        }
      }




      this.requireFieldsConds = this.requireFieldsConds.filter(f => f !== field);
    }

  }



  resetJobInfo = () => this.stateJobInfo = {} as JobInfoDto;

  back = () => {
    if (!this.isLoading) {
      if (!this.compareOriginData()) {
        this.confirmDialog('back');
      }
      else {
        this.goBack()
      }
    }
  }

  resetForm = () => {
    this.resetMasterInput = true;
    this.clearErrors();
    const title = this.translatePipe.translate('c_10020');
    const msg = this.translateService.getMsg('I0007');

    if (this.mode_screen === 'NEW') {

      this.stateForm = {};
      this.setupGender();
      // this.setupButton()

    }
    else {
      this.stateForm = {};
      this.stateJobInfo = {} as JobInfoDto;
      // this.setupButton()

    }

    setTimeout(() => {
      if (this.mode_screen !== 'NEW') {
        this.stateJobInfo = { ...this.stateJobInfoDf };
        this.stateForm = {};
        this.isResetCheckbox = true;
        setTimeout(() => {
          this.isResetCheckbox = false;
          if ((this.stateJobInfo?.only_apply || []).length !== 0) {
            this.requireFieldsConds = [...this.requireFieldsConds, 'desired_occupation']
          }
          if ((this.stateJobInfo?.only_experienced || []).length !== 0) {
            this.requireFieldsConds = [...this.requireFieldsConds, 'experienced_occupation']
          }
          this.setupButton()
        }
          , 100)
        this.showToastr(title, msg, 'success');
      }
      else {
        this.resetMasterInput = false;
        this.resetJobInfo();

        this.stateForm = {} as JobInfoDto;
        this.setupGender();
        this.showToastr(title, msg, 'success');
        // this.setupButton()

      }

    }, 5)

    this.requireFieldsConds = [];
    setTimeout(() => {
      this.resetMasterInput = false;

    }, 150)

  }

  setJobInfo = (newState: any) => {
    if (this.mode_screen === 'NEW') {
      this.stateJobInfo = { ...this.stateJobInfo, ...newState };
    }
  }

  setStateForm = (newState: any) => this.stateForm = { ...this.stateForm, ...newState };

  settingValues = (field: string) => {
    if (this.mode_screen === 'NEW') {
      if (field === 'time') {
        return
      }
    }
  }

  getLength = () => Object.keys(this.stateForm).length;
  getAtt = () => Object.keys(this.stateForm).join(', ')

  handleOnchange = (val: any, field: string, target?: string) => {
    // console.log(val)
    if (field !== 'job_company') {

    }
    else {
      this.job_company = val?.value[0]?._key;
      this.setJobInfo({ job_company: val?.value[0]?._key });
    }
    const selectOne = [
      'dormitory', 'accommodation',
      'gender', 'salary_type', 'japanese_skill',
      'status', 'job_company', 'desired_occupation', 'experienced_occupation']
    if (field === 'time') {
      this.setStateForm({
        ...val?.value,
      })
      // this.setJobInfo({ ...val?.value });

    }
    else if (target === 'master') {
      if (selectOne.includes(field)) {
        if (field === 'job_company') {
          this.setStateForm({
            [field]: val?.value[0]?._key,
          });
          this.setJobInfo({ [field]: val?.value[0]?._key });
        }
        else {
          this.setStateForm({
            [field]: val?.value[0],
          });
          this.setJobInfo({ [field]: val?.value[0] });
        }
      }
      else {
        // // // console.log(val)
        this.setStateForm({
          [field]: val?.value,
        });
        this.setJobInfo({ [field]: val?.value });

      }

    }
    else {
      this.setStateForm({
        [field]: val
      });
    }

    this.setupButton()
    // console.log(this.stateForm)
  }

  handleChangeRadio = (val) => {
    // // // console.log(val);
    // this.handleInput(val?.value, 'gender', this.getFieldName('性別'))
    this.genderSelect = { _key: val?.code, value: val?.value }
    this.setStateForm({
      gender: this.genderSelect
    })
  }

  ngAfterContentInit() {
    this.getGenderData();

  }

  getStyleBtn = (m?: any): 'disabled' | 'active' => {
    if (m.title === '保存') {
      if (this.mode_screen === 'NEW') {
        return 'active';
      }
      return this.compareOriginData() ? 'disabled' : 'active';
    }
    return m.style;
  }

  setupButton = () => {
    this.buttons = this.buttons.map(m => {
      return {
        ...m,
        hide: !this.getModeStatus(m.title),
        style: this.getStyleBtn(m)
      }
    })
  }

  setupGender = (data?: any) => {
    this.stateForm = {
      ...this.stateForm,
      gender: data || { _key: '全て', value: '全て' }
    }
  }

  ngOnInit() {

    this.setupGender();

    // console.log('init')
    this.getJobInfo();

    // this.getGenderData();


  }
  getGenderData = () => {
    this.masterDataService.find({
      class: {
        value: ['JOB_GENDER']
      }
    }).then(res => {
      if (res.status == RESULT_STATUS.OK) {
        // // // console.log(this.stateJobInfo.gender, res.data)
        const data = (res.data || []).filter(f => f.active_flag);
        const keyValues = data.map(m => ({
          _key: m._key,
          label: m.name,
          checked: m?.code === this.stateJobInfo?.gender?._key,
          value: m.name,
          code: m?.code
        }));
        this.gender = keyValues;
        this.genderSelect = keyValues.find(f => f?.code === this.stateJobInfo?.gender?._key);

        this.loading = false

      }
    })
  }

  confirmDialog = (title?: string) => {
    this.dialogService.open(AitConfirmDialogComponent, {
      closeOnBackdropClick: true,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        title: this.translateService.getMsg('I0006')
      }
    }).onClose.subscribe(r => {
      if (title === 'back' && r) {
        this.goBack();
      }
    })
  }

  skip = () => {
    if (!this.isLoading) {
      this.router.navigateByUrl('/');
    }
  }

  getJobInfo = () => {
    const id: any = AitAppUtils.getParamsOnUrl();
    if (id.includes(MODE_SCREEN.NEW.toLowerCase())) {
      this.mode_screen = MODE_SCREEN.NEW;
      this.setupButton();
      const job_company: any = AitAppUtils.getParamsOnUrl(true);
      if (!job_company || job_company.includes('new')) {
        // this.goBack();
      }
      else {
        // this.job_company = job_company;
        this.companyService.getCompanyProfileByName(decodeURIComponent(job_company)).then(r => {
          if (r.status === RESULT_STATUS.OK) {
            this.dataCompany = r.data;
          }
        })
      }
    }
    if (this.mode_screen === MODE_SCREEN.SAVE) {
      this.setupButton();
      this.callLoadingApp()
      const job_id: any = AitAppUtils.getParamsOnUrl(true);
      this.jobService.findJobByKey(job_id).then(r => {
        if (r.status === RESULT_STATUS.OK) {
          this.setState(r.data[0]);
          if ((this.stateJobInfoDf?.only_apply || []).length !== 0) {
            this.requireFieldsConds = [...this.requireFieldsConds, 'desired_occupation']
          }
          if ((this.stateJobInfoDf?.only_apply || []).length !== 0) {
            this.requireFieldsConds = [...this.requireFieldsConds, 'experienced_occupation']
          }
          if (this.stateJobInfoDf?.gender?.value) {
            this.setupGender(this.stateJobInfoDf?.gender)
          }
          if (this.stateJobInfoDf?.job_company) {
            this.companyService.getCompanyProfile(this.stateJobInfoDf?.job_company).then(r => {
              if (r.status === RESULT_STATUS.OK) {
                // console.log(r.data)
                this.dataCompany = r.data
                this.companyName = {
                  _key: r.data[0]?._key,
                  value: r.data[0]?.name
                }
              }
            })
          }
          this.cancelLoadingApp()
        }
      })
    }

  }

  goToElemet = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }

  getFieldNotNullFromState = () => {
    const keys = []

    Object.keys(this.stateForm).forEach(key => {
      if (this.stateForm[key]) {
        keys.push(key)
      }
    })

    return keys;
  }

  commonCheck = (obj?: any) => {
    const commonFields = [{
      field: 'gender',
      label: '性別'
    }, {
      field: 'description',
      label: '業務内容'
    }, {
      field: 'job_company',
      label: '企業名'
    }
    ]
    commonFields.forEach(item =>
      this.handleInput((obj || this.stateForm)[item.field], item.field, this.getFieldName(item.label)));
    this.checkTimePicker(1);
    this.checkTimePicker(2);
    this.checkTimePicker(3);
  }



  isErrorForm = () => {
    let check = false;
    Object.entries(this.errors).forEach(([key, value]) => {
      const target = value.filter(f => !!f);
      if (target.length !== 0) {
        check = true;
      }
    })
    return check;
  }

  getArrayData = (data: any[]) => {
    if (!data || data.length === 0) {
      return []
    }
    return Array.from(new Set(data.map(d => d?.value).filter(x => !!x)));
  }

  getNotNullObject = (obj) => {
    const res: any = {};
    const check = [0, '0', '00'];
    Object.keys(obj || {}).forEach(key => {
      if ((obj[key] || '').length !== 0 || check.includes(obj[key])) {
        if (obj[key] || check.includes(obj[key])) {
          res[key] = obj[key];
        }
      }
    })
    return res;
  }

  compareOriginData = (dataSave?: any) => {

    const coverDataDf = {
      ...this.stateJobInfoDf,
      accommodation: this.stateJobInfoDf['accommodation']?.value,
      business: this.getArrayData(this.stateJobInfoDf['business']),
      desired_occupation: this.stateJobInfoDf?.desired_occupation?.value,
      dormitory: this.stateJobInfoDf?.dormitory?.value,
      experienced_occupation: this.stateJobInfoDf?.experienced_occupation?.value,
      gender: this.stateJobInfoDf?.gender?.value,
      japanese_skill: this.stateJobInfoDf?.japanese_skill?.value,
      prefecture: this.getArrayData(this.stateJobInfoDf?.prefecture),
      residence_status: this.getArrayData(this.stateJobInfoDf?.residence_status),
      status: this.stateJobInfoDf?.status?.value,
      salary_type: this.stateJobInfoDf?.salary_type?.value,
      only_apply: !dataSave ? this.stateJobInfoDf?.only_apply : (this.checkRequireField('desired_occupation') ? ['希望者のみ'] : null),
      only_experienced: !dataSave ? this.stateJobInfoDf?.only_experienced :
        (this.checkRequireField('experienced_occupation') ? ['希望者のみ'] : null)
    }
    let filterNull;
    if (!dataSave) {
      const saveData = {
        ...this.stateJobInfo, ...this.stateForm
      };


      const coverDataSave = {
        ...saveData,
        accommodation: saveData['accommodation']?.value,
        business: this.getArrayData(saveData['business']),
        desired_occupation: saveData?.desired_occupation?.value,
        dormitory: saveData?.dormitory?.value,
        gender: saveData?.gender?.value,
        experienced_occupation: saveData?.experienced_occupation?.value,
        japanese_skill: saveData?.japanese_skill?.value,
        prefecture: this.getArrayData(saveData?.prefecture),
        residence_status: this.getArrayData(saveData?.residence_status),
        status: saveData?.status?.value,
        salary_type: saveData?.salary_type?.value,
      }
      filterNull = [this.getNotNullObject(coverDataSave)];
      // console.log({
      //   only_apply: filterNull[0]?.only_apply,
      //   only_experienced: filterNull[0]?.only_experienced
      // }, {
      //   only_apply: this.getNotNullObject(coverDataDf)?.only_apply,
      //   only_experienced: this.getNotNullObject(coverDataDf)?.only_experienced
      // })
      return JSON.stringify(filterNull[0]) === JSON.stringify(this.getNotNullObject(coverDataDf));

    }


    return JSON.stringify(dataSave[0]) === JSON.stringify(this.getNotNullObject(coverDataDf));
  }

  checkTimePicker = (no: number) => {
    const symbols = no === 1 ? '①' : no === 2 ? '②' : '③';
    const res = [];
    const time_from = {
      hour: this.stateForm[`shift_${no}_from_hour`],
      minute: this.stateForm[`shift_${no}_from_minute`]
    }
    const time_to = {
      hour: this.stateForm[`shift_${no}_to_hour`],
      minute: this.stateForm[`shift_${no}_to_minute`]
    }

    const msg = this.translateService.getMsg('E0004');
    if (time_from.hour > time_to.hour) {
      if ((time_from.hour && time_to.hour) || (time_from.hour > 0 && time_to.hour > 0)) {
        const transferMsg = (msg || '')
          .replace('{0}', this.getFieldName(`${symbols}勤務時間`) + `${no}（時）`)
          .replace('{1}', ' ' + this.getFieldName(`${symbols}勤務時間`) + `${no}（時）`);
        res.push(transferMsg);
      }
    }
    else if (time_from.hour === time_to.hour) {
      if ((time_from.hour && time_to.hour) || (time_from.hour > 0 && time_to.hour > 0)) {
        if ((time_from.minute > time_to.minute) || (time_from.minute >= 0 && time_to.minute >= 0)) {
          const transferMsg = (msg || '')
            .replace('{0}', this.getFieldName(`${symbols}勤務時間`) + `${no}（分）`)
            .replace('{1}', ' ' + this.getFieldName(`${symbols}勤務時間`) + `${no}（分）`);
          res.push(transferMsg);
        }
      }
    }
    this.timeError = { ...this.timeError, [`time${no}`]: res }
    return res;
  }
  test = 
  async () => {
    console.log("thuan nguyen van ");
 

      const saveData = {
        ...this.stateJobInfo, ...this.stateForm,
      };

      const coverDataSave = {
        ...saveData,
        accommodation: saveData['accommodation']?.value,
        business: this.getArrayData(saveData['business']),
        desired_occupation: saveData?.desired_occupation?.value,
        dormitory: saveData?.dormitory?.value,
        experienced_occupation: saveData?.experienced_occupation?.value,
        gender: saveData?.gender?.value || '男性',
        japanese_skill: saveData?.japanese_skill?.value,
        prefecture: this.getArrayData(saveData?.prefecture),
        residence_status: this.getArrayData(saveData?.residence_status),
        status: saveData?.status?.value,
        salary_type: saveData?.salary_type?.value,
        only_apply: this.checkRequireField('desired_occupation') ? ['希望者のみ'] : null,
        only_experienced: this.checkRequireField('experienced_occupation') ? ['希望者のみ'] : null
      }
      console.log(' data day',coverDataSave);
    
  }
  save = 
  async () => {

    if (!this.isLoading) {
      this.isSubmit = true;


      const title = this.translatePipe.translate('c_10020');


      const saveData = {
        ...this.stateJobInfo, ...this.stateForm,
      };

      const coverDataSave = {
        ...saveData,
        accommodation: saveData['accommodation']?.value,
        business: this.getArrayData(saveData['business']),
        desired_occupation: saveData?.desired_occupation?.value,
        dormitory: saveData?.dormitory?.value,
        experienced_occupation: saveData?.experienced_occupation?.value,
        gender: saveData?.gender?.value || '男性',
        japanese_skill: saveData?.japanese_skill?.value,
        prefecture: this.getArrayData(saveData?.prefecture),
        residence_status: this.getArrayData(saveData?.residence_status),
        status: saveData?.status?.value,
        salary_type: saveData?.salary_type?.value,
        only_apply: this.checkRequireField('desired_occupation') ? ['希望者のみ'] : null,
        only_experienced: this.checkRequireField('experienced_occupation') ? ['希望者のみ'] : null
      }
      this.commonCheck(coverDataSave);


      const filterNull = [this.getNotNullObject(coverDataSave)];
      const compare = this.compareOriginData(filterNull);
      const { time1, time2, time3 } = this.timeError;
      const errorTime = time1.length === 0 && time2.length === 0 && time3.length === 0;
      this.callLoadingApp();
      setTimeout(() => {

        if (!compare && errorTime) {
          if (!!coverDataSave?.gender && !!coverDataSave?.description && !this.getErrorSettings()) {

            this.jobService.saveJobInfo(filterNull).then(res => {
              // console.log(res)
              if (res?.status === RESULT_STATUS.OK) {
                const message = this.mode_screen === 'NEW' ? this.translatePipe.getMsg('I0012') : this.translatePipe.getMsg('I0002')
                this.showToastr(title, message, 'success');
                this.cancelLoadingApp();
                if (this.mode_screen === 'NEW') {
                  this.router.navigateByUrl('/')
                }
                else {
                  this.goBack();
                }
              }
              else {
                const msg = this.getMsg('E0100');
                this.showToastr(title, msg, 'danger');
                this.cancelLoadingApp();
              }
            }).catch(() => {
              const msg = this.getMsg('E0100');
              this.showToastr(title, msg, 'danger');
              this.cancelLoadingApp();
            })
          }
          else {
            this.cancelLoadingApp();
          }
          this.cancelLoadingApp();
        }
        else {
          const nothingToSave = this.getMsg('E0100');
          this.showToastr(title, nothingToSave, 'danger');
          this.cancelLoadingApp();

        }
        this.isSubmit = false;
      }, 300)
      this.goToElemet('form_edit_job')
    }
  }

  getErrorSettings = () => {
    const res = this.error_settings.filter(v => v?.isValid === false);
    // console.log(res)
    return res.length !== 0;
  }

  delete() {
    const title = this.translatePipe.translate('c_10020');

    if (this.company === this.env?.COMMON?.COMPANY_DEFAULT) {
      this.callLoadingApp();
      this.jobService.deleteJobInfo(this.stateJobInfoDf._key).then(r => {
        if (r.status === RESULT_STATUS.OK) {
          this.showToastr(title, this.getMsg('I0003'), 'success');
          this.cancelLoadingApp();
          this.goBack();
        }
        else {
          this.showToastr(title, this.getMsg('E0100'), 'danger');
          this.cancelLoadingApp();
        }
      }).catch(e => {
        const msg = this.getMsg('E0100');
        this.showToastr(title, msg, 'danger');
        this.cancelLoadingApp();
      })
    }
    else {
      const msg = this.getMsg('E0050');
      this.showToastr(title, msg, 'danger');
    }

  }

  confirmBeforeDelete = () => {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.getMsg('I0004'),
        }
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.delete();
        }
      });
  }

}
