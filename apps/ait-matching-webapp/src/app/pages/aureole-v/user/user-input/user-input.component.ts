/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import { UserProfileService } from './../../../../services/aureole-v/user-profile.service';
import { UserJobQueryService } from '../../../../services/aureole-v/user-job-query.service';
import { UserCertificateAwardService } from '../../../../services/aureole-v/user-certificate-award.service';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitFileUploaderService,
  AitMasterDataService,
  AitNavigationService,
  AitTranslationService,
  AitUserService,
  AppState,
  getCaption,
  getLang,
  MODE,
} from '@ait/ui';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NbDialogRef,
  NbDialogService,
  NbToastrService,
  NbLayoutScrollService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import kanjidate from 'kanjidate';
import { KeyValueCheckedDto } from '../user-basic-info/user-basic-info.component';
import { UserCertificateAward, UserJobQuery } from './interface';

import { Subscription } from 'rxjs';
import { UserCertificateErrorsMessage, UserInfoErrorsMessage, UserJobQueryErrorsMessage } from '../../interface';

@Component({
  selector: 'ait-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss'],
})
export class UserInputComponent
  extends AitBaseComponent
  implements OnInit, OnDestroy {
  // Create form group
  userInfo: FormGroup;
  userJobQuery: FormGroup;
  userCertificate: FormGroup;

  userInfoClone: any;
  userJobQueryClone: any;
  userCertificateClone: any;

  genderList: KeyValueCheckedDto[];
  mode = MODE.NEW;

  userInfoErros = new UserInfoErrorsMessage();
  userJobQueryErros = new UserJobQueryErrorsMessage();
  userCertificateErros = new UserCertificateErrorsMessage();

  infoLabelList = {} as KeyValueDto;
  queryLabelList = {} as KeyValueDto;
  certificateLabelList = {} as KeyValueDto;

  // Form status change subscribe
  private userInfoSubscr: Subscription;
  private userJobQuerySubscr: Subscription;
  private userCertificateSubscr: Subscription;

  isChanged = false;
  isSubmit = false;
  isReset = false;
  isClearErrors = false;

  isOpen = {
    userInfo: true,
    userTraining: true,
    userJobQuery: true,
    userCertificate: true,
  };

  resetUserInfo = {
    name: false,
    emp_type: false,
    dob: false,
    country: false,
    residence_status: false,
    occupation: false,
    immigration_date: false,
    employment_start_date: false,
    no2_permit_date: false,
    stay_period: false,
    no3_exam_dept_date: false,
    no3_exam_dept_pass: false,
    no3_exam_practice_date: false,
    no3_exam_practice_pass: false,
    no3_permit_date: false,
    resume: false,
    current_salary: false,
  };

  resetUserJobQuery = {
    residence_status: false,
    salary_type: false,
    business: false,
    desired_salary: false,
    desired_occupation: false,
    prefecture: false,
    immigration_date: false,
  };

  resetUserCertificate = {
    japanese_skill: false,
  };

  isError = true;

  currentLang = '';
  user_key = '';
  sys_user_key = '';

  dateField = [
    'immigration_date',
    'employment_start_date',
    'no2_permit_date',
    'stay_period',
    'no3_exam_dept_date',
    'no3_exam_practice_date',
    'no3_permit_date',
  ];

  constructor(
    public router: Router,
    @Optional() protected ref: NbDialogRef<UserInputComponent>,
    public activeRouter: ActivatedRoute,
    private masterDataService: AitMasterDataService,
    private formBuilder: FormBuilder,
    public store: Store<AppState | any>,
    private dialogService: NbDialogService,
    private translateService: AitTranslationService,
    private element: ElementRef,
    private navigation: AitNavigationService,
    private aitFileUploaderService: AitFileUploaderService,
    private userProfileService: UserProfileService,
    private userJobQueryService: UserJobQueryService,
    private userCertificateService: UserCertificateAwardService,
    authService: AitAuthService,
    userService: AitUserService,
    toastrService: NbToastrService,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    apollo: Apollo
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      env,
      layoutScrollService,
      toastrService
    );
    this.setModulePage({
      module: 'aureole-v',
      page: 'user-info',
    });
    store.pipe(select(getLang)).subscribe((lang) => {
      this.currentLang = lang;
    });
    store.pipe(select(getCaption)).subscribe(() => {
      this.getI18n();
    });

    this.userInfo = this.formBuilder.group({
      //実習生区分（オレオウ組合・オレオウ組合に非所属）
      emp_type: new FormControl(null, [Validators.required]),
      //実習生名
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(400),
      ]),
      //実習生名（カナ）
      name_kana: new FormControl(null, [
        Validators.required,
        Validators.maxLength(400),
      ]),
      // 顔写真
      avatar_url: new FormControl(null),
      //性別
      gender: new FormControl(null, [Validators.required]),
      //生年月日
      dob: new FormControl(null),
      //生年月日（和暦）
      dob_jp: new FormControl(null, [Validators.maxLength(200)]),
      //国籍
      country: new FormControl(null),
      //パスポート番号
      passport_number: new FormControl(null, [Validators.maxLength(20)]),
      //在留資格
      residence_status: new FormControl(null, [Validators.required]),
      // 渉外担当
      relation_pic: new FormControl(null, [Validators.maxLength(400)]),
      // 通訳担当
      translate_pic: new FormControl(null, [Validators.maxLength(400)]),
      // _key
      _key: new FormControl(null),
      //受入企業名
      accepting_company: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1000),
      ]),
      //現住所
      address: new FormControl(null, [Validators.maxLength(1000)]),
      //職種
      occupation: new FormControl(null),
      //入国日
      immigration_date: new FormControl(null),
      //雇用開始日
      employment_start_date: new FormControl(null),
      // 許可年月日（2号移行（予定）年月日)
      no2_permit_date: new FormControl(null),
      //在留期限
      stay_period: new FormControl(null),
      //3号試験学科
      no3_exam_dept_date: new FormControl(null),
      //3号試験学科合否
      no3_exam_dept_pass: new FormControl(null),
      //3号試験実技
      no3_exam_practice_date: new FormControl(null),
      //3号試験実技合否
      no3_exam_practice_pass: new FormControl(null),
      //許可年月日（3号移行(予定)年月日
      no3_permit_date: new FormControl(null),
      //職務経歴
      resume: new FormControl(null),
      //現在の給料(雇用契約書)
      current_salary: new FormControl(null, [
        Validators.min(0),
        Validators.max(999999999999),
      ]),
      //実習中の特記事項
      training_remark: new FormControl(null, [Validators.maxLength(4000)]),
      //個人情報の取り扱いについての同意 attack_file
      agreement_file: new FormControl(null),
    });

    this.userJobQuery = this.formBuilder.group({
      // 希望の在留資格
      residence_status: new FormControl(null, Validators.required),
      // 希望の給料
      salary_type: new FormControl(null, Validators.required),
      // 希望の給料（円）
      desired_salary: new FormControl(null, [
        Validators.min(0),
        Validators.max(999999999999),
        Validators.required,
      ]),
      // 希望の職種（分野）
      business: new FormControl(null, Validators.required),
      // 希望職種
      desired_occupation: new FormControl(null),
      // 希望の勤務地
      prefecture: new FormControl(null, Validators.required),
      // 入国日（許可日）
      immigration_date: new FormControl(null),
      // 転職先に関する特記事項
      remark: new FormControl(null, Validators.maxLength(4000)),
      // _key
      _key: new FormControl(null),
    });

    this.userCertificate = this.formBuilder.group({
      // 特定技能1号証明書
      certificate_no1: new FormControl(null),
      // 語学力（N1-N5）
      japanese_skill: new FormControl(null),
      // 語学資格証明書
      japanese_skill_certificate: new FormControl(null),
      // 語学資格証明書
      qualification: new FormControl(null, Validators.maxLength(1000)),
      // 資格の証明書
      qualification_certificate: new FormControl(null),
      // _key
      _key: new FormControl(null),
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
    if (this.mode === MODE.NEW) {
      this.userInfo.addControl(
        'agreement',
        new FormControl(false, [Validators.requiredTrue])
      );
    }
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    // Run when form value change and only in edit mode
    this.userInfo.valueChanges.subscribe((data) => {
      if (this.userInfo.pristine) {
        this.userInfoClone = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave();
      }
    });

    this.userJobQuery.valueChanges.subscribe((data) => {
      if (this.userJobQuery.pristine) {
        this.userJobQueryClone = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave();
      }
    });

    this.userCertificate.valueChanges.subscribe((data) => {
      if (this.userCertificate.pristine) {
        this.userCertificateClone = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave();
      }
    });

    // Check mode
    if (this.user_key) {
      const resInfo = await this.userProfileService.findUserProfile(
        this.user_key
      );
      const resJobQuery = await this.userJobQueryService.find(this.user_key);
      const resCertificate = await this.userCertificateService.find(
        this.user_key
      );
      let isUserExist = false;
      if (resInfo.data.length > 0) {
        const data = resInfo.data[0];
        console.log(resInfo);
        this.userInfo.patchValue({ ...data });
        isUserExist = true;
      }
      if (resJobQuery.data.length > 0) {
        const data = resJobQuery.data[0];
        console.log(data);

        this.userJobQuery.patchValue({ ...data });
        isUserExist = true;
      }

      if (resCertificate.data.length > 0) {
        const data = resCertificate.data[0];
        console.log(data);

        this.userCertificate.patchValue({ ...data });
        isUserExist = true;
      }
    !isUserExist && this.router.navigate([`/404`]);
    }
    await this.getGenderList();
    this.setDefaultGenderValue();
    this.getMappingLabel();
    this.cancelLoadingApp();
  }

  // Get gender list from master-data, param class = GENDER
  async getGenderList(): Promise<void> {
    const condition = { class: { value: ['GENDER'] } };
    await this.masterDataService.find(condition).then((res) => {
      if (res.status && res.status === RESULT_STATUS.OK) {
        this.genderList = res.data;
      }
    });
  }

  // In create mode default = 男性, edit mode = user.gender
  setDefaultGenderValue() {
    const genderObj = this.userInfo.controls['gender'].value as KeyValueDto;
    if (genderObj) {
      this.genderList = this.genderList.map((gender) =>
        Object.assign({}, gender, {
          checked: gender.code === genderObj._key ? true : false,
        })
      );
      const gender = this.genderList.find((gender) => gender.checked === true);
      this.userInfo.controls['gender'].setValue({
        _key: gender.code,
        value: gender.name,
      });
    } else {
      const genderList = [...this.genderList].map((gender, index) =>
        Object.assign({}, gender, { checked: index === 0 ? true : false })
      );
      const gender = genderList[0];
      this.userInfo.controls['gender'].setValue({
        _key: gender.code,
        value: gender.name,
      });
    }
  }

  // Take value form components and assign to form
  takeMasterValue(
    value: KeyValueDto[] | KeyValueDto,
    group: string,
    form: string
  ): void {
    if (isObjectFull(value)) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this[group].controls[form].setValue(null);
    }
  }

  // Take values form components and assign to form
  takeMasterValues(value: KeyValueDto[], group: string, form: string): void {
    console.log(value)
    if (isArrayFull(value)) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    } else {
      this[group].controls[form].setValue(null);
    }
  }

  takeInputValue(value: string, group: string, form: string): void {
    if (value) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    } else {
      this[group].controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
      // set jp_dob format japan cadidates
      form === 'dob' && this.setKanjiDate();
    } else {
      this[group].controls[form].setValue(null);
      form === 'dob' && this.userInfo.controls['dob_jp'].setValue(null);
    }
  }

  takeInputNumberValue(value: any, group: string, form: string) {
    if (value !== '' && value !== null && !isNaN(value)) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(Number(value));
    } else {
      this[group].controls[form].setValue(null);
    }
  }

  takeGenderValue(value: KeyValueCheckedDto): void {
    if (isObjectFull(value)) {
      this.userInfo.controls['gender'].markAsDirty();
      this.userInfo.controls['gender'].setValue({
        _key: value.code,
        value: value.name,
      });
    } else {
      this.userInfo.controls['gender'].setValue(null);
    }
  }

  takeFiles(fileList: any[], group: string, form: string) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(data);
    } else {
      this[group].controls[form].setValue(null);
    }
  }

  setKanjiDate() {
    const dob_jp = kanjidate.format(
      kanjidate.f2,
      new Date(this.userInfo.controls['dob'].value)
    );
    this.userInfo.controls['dob_jp'].setValue(dob_jp);
  }

  toggleCheckBox(checked: boolean) {
    this.userInfo.controls['agreement'].setValue(checked);
  }

  toggleContent(group: string, status: boolean) {
    this.isOpen[group] = status;
  }

  getI18n() {
    //TODO about I18n
  }

  back() {
    this.router.navigate([`/user/${this.user_key}`]);
  }

  async remove() {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('このデータを削除しますか。'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.onDelete();
        }
      });
  }

  async onDelete() {
    await this.userProfileService.removeAllByUserId(this.user_key).then(res => {
      console.log(res);
      if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
        this.showToastr('', this.getMsg('情報削除が成功しました。'));
        this.router.navigate([`/recommenced-user`]);
      } else {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }
  });
}

  reset() {
    const resetField = [
      'resetUserInfo',
      'resetUserJobQuery',
      'resetUserCertificate',
    ];
    if (this.mode === MODE.EDIT) {
      this.userInfo.patchValue({
        ...this.userInfoClone,
      });
      this.userJobQuery.patchValue({
        ...this.userJobQueryClone,
      });
      this.userCertificate.patchValue({
        ...this.userCertificateClone,
      });

      for (const index in resetField) {
        const field = resetField[index];
        const group = 'u' + field.substring(6);
        for (const prop in this[field]) {
          if (!this[group].controls[prop].value) {
            this[field][prop] = true;
            setTimeout(() => {
              this[field][prop] = false;
            }, 100);
          }
        }
      }
    } else {
      this.userInfo.reset();
      this.userJobQuery.reset();
      this.userCertificate.reset();

      this.isReset = true;
      for (const index in resetField) {
        const field = resetField[index];
        for (const prop in this[field]) {
          this[field][prop] = true;
          setTimeout(() => {
            this[field][prop] = false;
          }, 100);
        }
      }
      setTimeout(() => {
        this.isReset = false;
      }, 100);
      this.unSubscribeForm();
      this.resetErrors();
    }
    this.isClearErrors = true;
    setTimeout(() => {
      this.isClearErrors = false;
    }, 100);
    this.showToastr('', this.getMsg('I0007'));
  }

  async submit() {
    if (this.isFormsValid()) {
      this.isSubmit = true;
      setTimeout(() => {
        this.isSubmit = false;
      }, 100);
      // this.callLoadingApp();

      const isSysUserExist = await this.isSysUserExist();
      if (isSysUserExist) {
        const data = this.getDataSave();
        await this.userProfileService.saveUserInfo([data]).then(res => {
          console.log(res);
          if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
            const user_id = res.data[0].user_id;
            this.showToastr('', this.getMsg('I0005'));
            this.router.navigate([`/user/${user_id}`]);
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
      } else {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }
    } else {
      // Form invalid, get all erros messages
      this.getErrors();
      this.scrollIntoError();

      // Subscribe form status for onchange event error message
      this.userInfoSubscr = this.userInfo.statusChanges.subscribe((status) => {
        if (status === 'INVALID') {
          this.getErrors();
        }
      });
      this.userJobQuerySubscr = this.userJobQuery.statusChanges.subscribe(
        (status) => {
          if (status === 'INVALID') {
            this.getErrors();
          }
        }
      );
      this.userCertificateSubscr = this.userCertificate.statusChanges.subscribe(
        (status) => {
          if (status === 'INVALID') {
            this.getErrors();
          }
        }
      );
    }
  }

  async isSysUserExist(): Promise<boolean> {
    if (this.mode === MODE.NEW) {
      try {
        return await this.userProfileService.createSysUser().then((res) => {
          if (res.status === RESULT_STATUS.OK) {
            const sysUser = res.data[0];
            this.sys_user_key = sysUser._key;
            return true;
          } else {
            return false;
          }
        });
      } catch (error) {
        return false;
      }
    } else {
      return true;
    }
  }

  getDataSave() {
      const userInfo = this.getUserProfile({...this.userInfo.value});
      const userJobQuery = this.getUserJobQuery({...this.userJobQuery.value});
      const userCertificate = this.getUserCertificate({...this.userCertificate.value});

      const data = {};

      data['userInfo'] = userInfo;
      data['userJobQuery'] = userJobQuery;
      data['userCertificate'] = userCertificate;
      return data;
  }

  getUserProfile(data: any) {
    data.agreement = ['同意する'];
    if (this.mode === MODE.NEW) {
      data.is_matching = true;
    }
    const _key = this.getUserKey();
    data['user_id'] = _key;
    return data;
  }

  getUserJobQuery(data: any) {
    const _key = this.getUserKey();
    const userJobQuery = new UserJobQuery(
      data._key,
      _key,
      data.residence_status,
      data.salary_type,
      data.desired_salary,
      data.business,
      data.desired_occupation,
      data.prefecture,
      data.immigration_date,
      data.remark,
      true
    );
    return userJobQuery;
  }

  getUserCertificate(data: any) {
    const _key = this.getUserKey();
    const userCertificate = new UserCertificateAward(
      data._key,
      _key,
      data.certificate_no1,
      data.japanese_skill,
      data.japanese_skill_certificate,
      data.qualification,
      data.qualification_certificate,
      true
    );
    return userCertificate;
  }

  isFormsValid() {
    return (
      this.userInfo.valid &&
      this.userJobQuery.valid &&
      this.userCertificate.valid
    );
  }

  getUserKey(): string {
    return this.sys_user_key ? this.sys_user_key : this.user_key;
  }

  checkAllowSave() {
    const userInfo = { ...this.userInfo.value };
    const userJobQuery = { ...this.userJobQuery.value };
    const userCertificate = { ...this.userCertificate.value };
    const userInfoClone = { ...this.userInfoClone };
    const userJobQueryClone = { ...this.userJobQueryClone };
    const userCertificateClone = { ...this.userCertificateClone };

    this.setHours(userInfo);
    this.setHours(userJobQuery);
    this.setHours(userCertificate);

    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
    const isChangedUserJobQuery = AitAppUtils.isObjectEqual(
      { ...userJobQuery },
      { ...userJobQueryClone }
    );
    const isChangedUserCertificate = AitAppUtils.isObjectEqual(
      { ...userCertificate },
      { ...userCertificateClone }
    );
    this.isChanged = !(
      isChangedUserInfo &&
      isChangedUserJobQuery &&
      isChangedUserCertificate
    );
  }

  setHours(data: any) {
    for (const prop in data) {
      if (this.dateField.includes(prop)) {
        if (data[prop]) {
          data[prop] = new Date(data[prop]).setHours(0, 0, 0, 0);
        }
        if (data[prop]) {
          data[prop] = new Date(data[prop]).setHours(0, 0, 0, 0);
        }
      }
    }
  }

  //Get all form error messages
  getErrors(): void {
    this.resetErrors();
    this.userInfoErros = this.getFormErrorMessage(
      this.userInfo,
      this.infoLabelList
    );
    this.userJobQueryErros = this.getFormErrorMessage(
      this.userJobQuery,
      this.queryLabelList
    );
    this.userCertificateErros = this.getFormErrorMessage(
      this.userCertificate,
      this.certificateLabelList
    );
  }

  getErrorsMessage(group: string, form: string) {
    const isValid = this[group].valid;
    const errorList = group + 'Erros';
    if (isValid) {
      return [];
    } else {
      return this[errorList][form] || [];
    }
  }

  resetErrors(): void {
    this.userInfoErros = new UserInfoErrorsMessage();
    this.userJobQueryErros = new UserJobQueryErrorsMessage();
    this.userCertificateErros = new UserCertificateErrorsMessage();
  }

  scrollIntoError() {
    const formGroup = ['userInfo', 'userJobQuery', 'userCertificate'];
    let isFocus = false;
    for (const index in formGroup) {
      if (!isFocus) {
        const group = this[formGroup[index]] as FormGroup;
        for (const key of Object.keys(group.controls)) {
          if (group.controls[key].invalid) {
            const errorKey = this.getErrorKey(formGroup[index], key);
            const invalidControl = this.element.nativeElement.querySelector(
              `#${errorKey}_input`
            );
            try {
              this.openErrorContent(formGroup[index], key);
              invalidControl.scrollIntoView({
                behavior: 'auto',
                block: 'center',
              });
              isFocus = true;
              break;
            } catch {
              console.error('scroll into error failed!!!');
            }
          }
        }
      }
    }
  }

  getErrorKey(group: string, key: string) {
    if (key === 'residence_status') {
      return (
        key +
        '_' +
        group
          .split(/(?=[A-Z])/)
          .join()
          .toLowerCase()
          .replace(/,/g, '_')
      );
    } else {
      return key;
    }
  }

  openErrorContent(group: string, key: string) {
    if (group === 'userInfo') {
      const groupName =
        key === 'accepting_company' ? 'userTraining' : 'userInfo';
      this.isOpen[groupName] = true;
    } else {
      this.isOpen[group] = true;
    }
  }

  getMappingLabel() {
    Object.keys(this.userInfo.controls).forEach((key) => {
      let name = '';
      switch (key) {
        case 'emp_type':
          name = '実習生区分（オレオウ組合・オレオウ組合に非所属）';
          break;
        case 'name':
          name = '実習生名';
          break;
        case 'name_kana':
          name = '実習生名（カナ）';
          break;
        case 'gender':
          name = '性別';
          break;
        case 'dob_jp':
          name = '生年月日（和暦）';
          break;
        case 'passport_number':
          name = 'パスポート番号';
          break;
        case 'residence_status':
          name = '在留資格';
          break;
        case 'relation_pic':
          name = '渉外担当';
          break;
        case 'translate_pic':
          name = '通訳担当';
          break;
        case 'accepting_company':
          name = '受入企業名*';
          break;
        case 'address':
          name = '現住所';
          break;
        case 'current_salary':
          name = '現在の給料（円）';
          break;
        case 'training_remark':
          name = '実習中の特記事項';
          break;
        case 'agreement':
          name = '個人情報の取り扱いについての同意';
          break;
        default:
          break;
      }
      this.infoLabelList[key] = this.setLabel(name);
    });

    Object.keys(this.userJobQuery.controls).forEach((key) => {
      let name = '';
      switch (key) {
        case 'residence_status':
          name = '希望の在留資格';
          break;
        case 'salary_type':
          name = '希望の給料';
          break;
        case 'desired_salary':
          name = '希望の給料（円）';
          break;
        case 'business':
          name = '希望の分野';
          break;
        case 'prefecture':
          name = '希望の勤務地';
          break;
        case 'remark':
          name = '転職先に関する特記事項';
          break;
        default:
          break;
      }
      this.queryLabelList[key] = this.setLabel(name);
    });
    this.userCertificateErros['qualification'] = this.setLabel(
      '資格の種類(玉掛クレーン等)'
    );
  }

  setLabel = (label: string) => {
    return this.translateService.translate(label);
  };

  unSubscribeForm() {
    // Unsubscribe form status
    if (this.userInfoSubscr) {
      this.userInfoSubscr.unsubscribe();
    }
    if (this.userJobQuerySubscr) {
      this.userJobQuerySubscr.unsubscribe();
    }
    if (this.userCertificateSubscr) {
      this.userCertificateSubscr.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unSubscribeForm();
  }
}
