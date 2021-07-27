import { UserProfileService } from './../../../../services/aureole-v/user-profile.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isArrayFull,
  isObjectFull,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NbDialogRef,
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import kanjidate from 'kanjidate';
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
import { BasicInfoErrorsMessage, UserInfo } from '../../interface';
import { Apollo } from 'apollo-angular';
import _ from 'lodash';

@Component({
  selector: 'ait-user-basic-info',
  templateUrl: './user-basic-info.component.html',
  styleUrls: ['./user-basic-info.component.scss'],
})
export class UserBasicInfoComponent
  extends AitBaseComponent
  implements OnInit, OnDestroy {
  // Create form group
  userBasic: FormGroup;

  // Clone data to compare form change in edit mode
  cloneData: UserInfo;

  // Form status change subscribe
  private subscr: Subscription;

  genderList: KeyValueCheckedDto[];
  currentLang = '';
  user_key = '';
  pageTitle = '';
  nameLabel = '';
  mode = MODE.NEW;
  // Form error messages
  errors = new BasicInfoErrorsMessage();
  isChanged = false;
  isDataInit = false;
  isSubmit = false;
  isReset = {
    country: false,
    residence_status: false,
    dob: false,
    avatar_url: false
  };

  stateInfo = {} as UserInfo;
  labelNameList = {} as KeyValueDto;

  @ViewChild('name', { static: false }) name: ElementRef;
  @ViewChild('name_kana', { static: false }) name_kana: ElementRef;
  @ViewChild('gender', { static: false }) gender: ElementRef;
  @ViewChild('dob_jp', { static: false }) dob_jp: ElementRef;
  @ViewChild('passport_number', { static: false }) passport_number: ElementRef;
  @ViewChild('residence_status', { static: false })
  residence_status: ElementRef;

  constructor(
    public router: Router,
    @Optional() protected ref: NbDialogRef<UserBasicInfoComponent>,
    public activeRouter: ActivatedRoute,
    private masterDataService: AitMasterDataService,
    private formBuilder: FormBuilder,
    public store: Store<AppState | any>,
    private dialogService: NbDialogService,
    private translateService: AitTranslationService,
    private element: ElementRef,
    private navigation: AitNavigationService,
    private userProfileService: UserProfileService,
    private aitFileUploaderService: AitFileUploaderService,
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
      page: 'user-basic-info',
    });
    store.pipe(select(getLang)).subscribe((lang) => {
      this.currentLang = lang;
    });
    store.pipe(select(getCaption)).subscribe(() => {
      this.getI18n();
    });
    // Create form builder group
    this.userBasic = this.formBuilder.group({
      //No
      // no: new FormControl(''),
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
    });

    // get key from parameter
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    // Run when form value change and only in edit mode
    this.userBasic.valueChanges.subscribe((data) => {
      if (this.userBasic.pristine) {
        this.cloneData = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave(data);
      }
    });
    // Check mode
    const stateData = this.userService.getFormInfo();
    if (this.user_key) {
      const res = await this.userProfileService.findUserProfile(this.user_key);
      const data = isObjectFull(stateData)
        ? stateData
        : (res?.data[0] as UserInfo);
      if (isObjectFull(data)) {
        this.userBasic.patchValue({ ...data });
        const backUpData = this.userService.getUserBasicBackUp();
        if (!isObjectFull(backUpData)) {
          this.userService.setUserBasicBackUp({ ...data });
        }
      }
    } else {
      if (isObjectFull(stateData)) {
        this.userBasic.patchValue({ ...stateData });
      }
    }

    await this.getGenderList();
    this.isDataInit = true;
    this.setDefaultGenderValue();
    this.getMappingLabel();
    this.cancelLoadingApp();
    console.log(JSON.stringify(this.genderList))
  }

  getI18n() {
    this.pageTitle = this.translateService.translate('基本情報');
    this.nameLabel = this.translateService.translate('実習生名*');
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
    const genderObj = this.userBasic.controls['gender'].value as KeyValueDto;
    if (genderObj) {
      this.genderList = this.genderList.map((gender) =>
        Object.assign({}, gender, {
          checked: gender.code === genderObj._key ? true : false,
        })
      );
      const gender = this.genderList.find((gender) => gender.checked === true);
      this.userBasic.controls['gender'].setValue({
        _key: gender.code,
        value: gender.name,
      });
    } else {
      const genderList = [...this.genderList].map((gender, index) =>
        Object.assign({}, gender, { checked: index === 0 ? true : false })
      );
      const gender = genderList[0];
      this.userBasic.controls['gender'].setValue({
        _key: gender.code,
        value: gender.name,
      });
    }
  }

  takeGenderValue(value: KeyValueCheckedDto): void {
    if (isObjectFull(value)) {
      this.userBasic.controls['gender'].markAsDirty();
      this.userBasic.controls['gender'].setValue({
        _key: value.code,
        value: value.name,
      });
    } else {
      this.userBasic.controls['gender'].setValue(null);
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.userBasic.controls[form].markAsDirty();
      this.userBasic.controls[form].setValue(value);
    } else {
      this.userBasic.controls[form].setValue(null);
    }
  }

  // Take value form components and assign to form
  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.userBasic.controls[form].markAsDirty();
      this.userBasic.controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this.userBasic.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.userBasic.controls[form].markAsDirty();
      this.userBasic.controls[form].setValue(value);
      // set jp_dob format japan cadidates
      const dob_jp = kanjidate.format(
        kanjidate.f2,
        new Date(this.userBasic.controls['dob'].value)
      );
      this.userBasic.controls['dob_jp'].setValue(dob_jp);
    } else {
      this.userBasic.controls[form].setValue(null);
    }
  }

  //Get all form error messages
  getErrors(): void {
    this.resetErrors();
    this.errors = this.getFormErrorMessage(this.userBasic, this.labelNameList);
  }

  scrollIntoError(form: FormGroup) {
    for (const key of Object.keys(form.controls)) {
      if (form.controls[key].invalid) {
        const invalidControl = this.element.nativeElement.querySelector(
          `#${key}_input`
        );
        try {
          invalidControl.scrollIntoView({
            behavior: 'auto',
            block: 'center',
          });
          break;
        } catch {
          console.error('scroll into error failed!!!');
        }
      }
    }
  }

  submitForm(): void {
    if (this.userBasic.valid) {
      this.saveFiles();
      const data = this.userBasic.value as UserInfo;
      if (this.mode === MODE.NEW) {
        this.userService.setFormBasicInfo(data);
        this.router.navigate([`/user-training-info`]);
      } else {
        this.userService.setFormBasicInfo(data);
        this.router.navigate([`/user-training-info/${this.user_key}`]);
      }
    } else {
      // Because form invalid, get all erros messages and focus on erros
      this.getErrors();
      this.scrollIntoError(this.userBasic);
      // Subscribe form status for onchange event error message
      !this.subscr &&
        (this.subscr = this.userBasic.statusChanges.subscribe((status) => {
          if (status === 'INVALID') {
            this.getErrors();
          }
        }));
    }
  }

  async saveFiles() {
    const fileData = this.userProfileService.avatar_url_list.value;
    fileData.map((file: any) => delete file.progress);
    await this.aitFileUploaderService.uploadFile(fileData);
    this.userProfileService.avatar_url_list.next(null);
  }

  checkAllowSave(data: UserInfo) {
    const currentData = { ...data };
    const cloneData = { ...this.cloneData };

    if (currentData['dob']) {
      currentData['dob'] = new Date(currentData['dob']).setHours(0, 0, 0, 0);
    }
    if (cloneData['dob']) {
      cloneData['dob'] = new Date(cloneData['dob']).setHours(0, 0, 0, 0);
    }
    this.isChanged = !_.isEqual(currentData, cloneData);
  }
  getMappingLabel() {
    Object.keys(this.userBasic.controls).forEach((key) => {
      let name = '';
      switch (key) {
        case 'name':
          name = '実習生名';
          break;
        case 'name_kana':
          name = '実習生名（カナ)';
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
        default:
          break;
      }
      this.labelNameList[key] = this.setLabel(name);
    });
  }

  setLabel = (label: string) => {
    return this.translateService.translate(label);
  };

  // Rest form errors messages
  resetErrors(): void {
    this.errors = new BasicInfoErrorsMessage();
  }

  resetForm() {
    if (this.mode === MODE.EDIT) {
      this.userBasic.patchValue({ ...this.userService.getUserBasicBackUp() });
      for (const prop in this.isReset) {
        if (!this.userBasic.controls[prop].value) {
          this.isReset[prop] = true;
          setTimeout(() => {
            this.isReset[prop] = false;
          }, 100);
        }
      }
    } else {
      this.userBasic.reset();
      for (const prop in this.isReset) {
        this.isReset[prop] = true;
        setTimeout(() => {
          this.isReset[prop] = false;
        }, 100);
      }
      this.setDefaultGenderValue();
      this.subscr.unsubscribe();
      this.resetErrors();
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFiles(fileList: any[]) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this.userProfileService.avatar_url_list.next(fileList);
      this.userBasic.controls['avatar_url'].setValue(data);
    } else {
        this.userProfileService.avatar_url_list.next(null);
      this.userBasic.controls['avatar_url'].setValue(null);
    }
  }

  back() {
    if (this.isChanged) {
      this.dialogService
        .open(AitConfirmDialogComponent, {
          context: {
            title: this.translateService.translate(
              'common.system.confirm.confirm-close'
            ),
          },
        })
        .onClose.subscribe((event) => {
          if (event) {
            this.navigation.back();
          }
        });
    } else {
      this.navigation.back();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe form status
    if (this.subscr) {
      this.subscr.unsubscribe();
    }
  }
}

export interface KeyValueCheckedDto {
  _key: string;
  value: string;
  class: string;
  parent_code: string;
  code: string;
  checked: boolean;
  name: string;
}
