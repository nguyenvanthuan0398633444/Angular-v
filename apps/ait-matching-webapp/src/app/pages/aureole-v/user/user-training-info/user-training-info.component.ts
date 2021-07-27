/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
  Utils,
} from '@ait/shared';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitFileUploaderService,
  AitNavigationService,
  AitTranslationService,
  AitUserService,
  AppState,
  getLang,
  MODE,
} from '@ait/ui';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
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
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Store, select } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { TrainingInfoErrorsMessage, UserInfo } from '../../interface';
import { UserProfileService } from './../../../../services/aureole-v/user-profile.service';

@Component({
  selector: 'ait-user-training-info',
  templateUrl: './user-training-info.component.html',
  styleUrls: ['./user-training-info.component.scss'],
})
export class UserTrainingInfoComponent
  extends AitBaseComponent
  implements OnInit, OnDestroy {
  // Create form group
  userTraining: FormGroup;

  // Clone data to compare form change in edit mode
  cloneData: UserInfo;

  tempData: UserInfo;
  test: any;

  // Form status change subscribe
  private subscr: Subscription;
  currentLang = '';

  // Form error messages
  errors = new TrainingInfoErrorsMessage();

  labelNameList = {} as KeyValueDto;

  user_key = '';
  mode = MODE.NEW;
  isChanged = false;
  isDataInit = false;
  isSubmit = false;

  isReset = {
    occupation: false,
    no3_exam_dept_pass: false,
    no3_exam_practice_pass: false,
    current_salary: false,
    immigration_date: false,
    employment_start_date: false,
    no2_permit_date: false,
    stay_period: false,
    no3_exam_dept_date: false,
    no3_exam_practice_date: false,
    no3_permit_date: false,
    agreement_file: false,
    resume: false
  };

  dateField = [
    'immigration_date',
    'employment_start_date',
    'no2_permit_date',
    'stay_period',
    'no3_exam_dept_date',
    'no3_exam_practice_date',
    'no3_permit_date',
  ];

  @ViewChild('accepting_company', { static: false })
  accepting_company: ElementRef;
  @ViewChild('address', { static: false }) address: ElementRef;
  @ViewChild('current_salary', { static: false }) current_salary: ElementRef;
  @ViewChild('training_remark', { static: false }) training_remark: ElementRef;
  @ViewChild('agreement', { static: false }) agreement: ElementRef;

  constructor(
    public router: Router,
    public activeRouter: ActivatedRoute,
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
    apollo: Apollo,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    toastrService: NbToastrService
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
      page: 'user',
      module: 'training-info',
    });
    //Change management of multiple languages
    store.pipe(select(getLang)).subscribe((lang) => {
      this.currentLang = lang;
    });

    //Create form builder group
    this.userTraining = this.formBuilder.group({
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

    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }

    //個人情報の取り扱いについての同意
    if (this.mode === MODE.NEW) {
      this.userTraining.addControl(
        'agreement',
        new FormControl(false, [Validators.requiredTrue])
      );
    }
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    // Run when form value change and only in edit mode
    this.userTraining.valueChanges.subscribe((data) => {
      if (this.mode === MODE.EDIT) {
        this.checkAllowSave(data);
      }
    });

    const stateData = this.userService.getFormTraining();
    if (this.user_key) {
      const res = await this.userProfileService.findUserProfile(this.user_key);
      this.tempData = { ...res?.data[0] };
      const data = isObjectFull(stateData)
        ? stateData
        : (res?.data[0] as UserInfo);
      this.cloneData = { ...res?.data[0] };
      if (isObjectFull(data)) {
        this.userTraining.patchValue({ ...data });
        const backUpData = this.userService.getUserTrainingBackUp();
        if (!isObjectFull(backUpData)) {
          this.userService.setUserTrainingBackUp({ ...data });
        }
      }
    } else {
      if (isObjectFull(stateData)) {
        this.userTraining.patchValue({ ...stateData });
      }
    }
    this.isDataInit = true;
    this.getMappingLabel();
    this.cancelLoadingApp();
  }

  getMappingLabel() {
    Object.keys(this.userTraining.controls).forEach((key) => {
      let name = '';
      switch (key) {
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
      this.labelNameList[key] = this.setLabel(name);
    });
  }

  setLabel = (label: string) => {
    return this.translateService.translate(label);
  };

  // Take value form components and assign to form
  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.userTraining.controls[form].markAsDirty();
      this.userTraining.controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this.userTraining.controls[form].setValue(null);
    }
  }

  takeInputValue(value: string, form: string) {
    if (value) {
      this.userTraining.controls[form].markAsDirty();
      this.userTraining.controls[form].setValue(value);
    } else {
      this.userTraining.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.userTraining.controls[form].markAsDirty();
      this.userTraining.controls[form].setValue(value);
    } else {
      this.userTraining.controls[form].setValue(null);
    }
  }

  takeInputNumberValue(value: any) {
    if (value !== '' && value !== null && !isNaN(value)) {
      this.userTraining.controls['current_salary'].markAsDirty();
      this.userTraining.controls['current_salary'].setValue(Number(value));
    } else {
      this.userTraining.controls['current_salary'].setValue(null);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFiles(fileList: any[], form: string) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this.userProfileService[form + '_list'].next(fileList);
      this.userTraining.controls['current_salary'].markAsDirty();
      this.userTraining.controls[form].setValue(data);
    } else {
      this.userProfileService[form + '_list'].next(null);
      this.userTraining.controls[form].setValue(null);
    }
  }

  //Get all form errors message
  getErrors() {
    this.resetErrors();
    this.errors = this.getFormErrorMessage(
      this.userTraining,
      this.labelNameList
    );
    console.log(this.errors)
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

  async submitForm() {
    if (this.userTraining.valid) {
      this.isSubmit = true;
      setTimeout(() => {
        this.isSubmit = false;
      }, 10);
      const formInfo = this.userService.getFormInfo();
      const userBasic = isObjectFull(formInfo) ? formInfo : this.tempData;
      const data = { ...userBasic, ...this.userTraining.value } as UserInfo;
      if (this.mode === MODE.NEW) {
        this.userService.setFormTrainingInfo(data);
      }
      this.saveUserInfo(data);
    } else {
      // Form invalid, get all erros messages
      this.getErrors();
      this.scrollIntoError(this.userTraining);

      // Subscribe form status for onchange event error message
      this.subscr = this.userTraining.statusChanges.subscribe((status) => {
        if (status === 'INVALID') {
          this.getErrors();
        }
      });
    }
  }

  async saveFiles() {
    const agreement_list =
      this.userProfileService.agreement_file_list.value || [];
    const resume_list = this.userProfileService.resume_list.value || [];
    const created = this.userProfileService.created_list;
    const fileData = [...agreement_list, ...resume_list].filter(
      (data) => !created.includes(data._key)
    );
    if (isArrayFull(fileData)) {
      fileData.forEach(async (file: any) => {
        delete file.progress;
        await this.aitFileUploaderService.uploadFile(file);
      });
      this.userProfileService.agreement_file_list.next(null);
      this.userProfileService.resume_list.next(null);
    }
    this.userProfileService.created_list = fileData.map((data) => data._key);
  }

  toggle(checked: boolean) {
    this.userTraining.controls['agreement'].setValue(checked);
  }

  async saveUserInfo(data: UserInfo): Promise<void> {
    this.callLoadingApp();
    if (this.mode === MODE.NEW) {
      data.is_matching = true;
      data.agreement = ['同意する'];
      this.createSysUser(data);
    } else {
      data.agreement = ['同意する'];
      const rq = { user_id: this.user_id, _key: this.user_key };
      this.callSaveService(rq, data);
    }
  }

  createSysUser(data: UserInfo) {
    delete data._key;
    this.userProfileService.createSysUser().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const sysUser = res.data[0];
        const rq = { user_id: this.user_id, _key: sysUser._key };
        this.callSaveService(rq, data);
      } else {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }
    });
  }

  // Create request to save
  async callSaveService(rq: { user_id: string; _key: string }, data: UserInfo) {
    try {
      data['user_id'] = rq._key;
      await this.userProfileService.saveUserProfile([data]).then((res) => {
        if (res.status === RESULT_STATUS.OK) {
          this.showToastr('', this.getMsg('I0005'));
          this.userService.resetData();
          this.cancelLoadingApp();
          if (this.mode === MODE.NEW) {
            this.router.navigate([
              `/user-certificate-info/${res.data[0].user_id}`,
            ]);
          } else {
            this.router.navigate([`/user/${res.data[0].user_id}`]);
          }
        } else {
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      });
    } catch (err) {
      this.cancelLoadingApp();
      console.error(err);
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
    }
  }

  checkAllowSave(data: UserInfo) {
    const userBasic = this.userService.getFormInfo();
    const currentData = { ...data, ...userBasic };
    const cloneData = { ...this.cloneData };

    for (const prop in currentData) {
      if (this.dateField.includes(prop)) {
        if (currentData[prop]) {
          currentData[prop] = new Date(currentData[prop]).setHours(0, 0, 0, 0);
        }
        if (cloneData[prop]) {
          cloneData[prop] = new Date(cloneData[prop]).setHours(0, 0, 0, 0);
        }
      }
    }
    this.isChanged = !AitAppUtils.isObjectEqual(
      { ...currentData },
      { ...cloneData }
    );
  }

  confirmBackButton() {
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
            this.userService.resetData();
            this.navigation.back();
          }
        });
    } else {
      this.userService.resetData();
      this.navigation.back();
    }
  }

  deleteData() {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('I0004'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.onDelete();
        }
      });
  }

  // Rest form errors messages
  resetErrors() {
    this.errors = new TrainingInfoErrorsMessage();
  }

  resetForm() {
    if (this.mode === MODE.EDIT) {
      const backUpData = this.userService.getUserTrainingBackUp();
      this.userTraining.patchValue({
        ...backUpData,
      });
      const fileArray = ['agreement_file', 'resume'];
      for (const prop in this.isReset) {
        if (!this.userTraining.controls[prop].value) {
          this.isReset[prop] = true;
          setTimeout(() => {
            this.isReset[prop] = false;
          }, 100);
        } else if (fileArray.includes(prop)) {
          this.isReset[prop] = true;
          setTimeout(() => {
            this.isReset[prop] = false;
          }, 100);
        }
      }
    } else {
      this.userTraining.reset();
      for (const prop in this.isReset) {
        this.isReset[prop] = true;
        setTimeout(() => {
          this.isReset[prop] = false;
        }, 100);
      }
      this.subscr.unsubscribe();
      this.resetErrors();
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  async onDelete() {
    this.callLoadingApp();
    const result = await this.userProfileService.findByUserId(this.user_key);
    if (result.status === RESULT_STATUS.OK && result.numData > 0) {
      const data = result.data[0];
      if (isObjectFull(data)) {
        const condition = { _key: data._key };
        this.userProfileService.remove([condition]).then((res) => {
          if (res.status === RESULT_STATUS.OK) {
            const user_id = res.data[0].user_id;
            this.showToastr('', this.getMsg('I0003'));
            setTimeout(() => {
              this.cancelLoadingApp();
              this.userService.resetData();
              this.router.navigate([`/user/${user_id}`]);
            }, 200);
          } else {
            this.cancelLoadingApp();
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        });
      } else {
        this.cancelLoadingApp();
        this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
      }
    } else {
      this.cancelLoadingApp();
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
    }
  }

  backToUserProfile() {
    this.saveFiles();
    if (this.mode === MODE.NEW) {
      const data = this.userTraining.value as UserInfo;
      this.userService.setFormTrainingInfo(data);
      this.router.navigate([`/user-basic-info`]);
    } else {
      const history = this.navigation.getHistory();
      const currentPage = history[history.length - 1];
      if (currentPage === `/user-basic-info/${this.user_key}`) {
        const data = this.userTraining.value as UserInfo;
        this.userService.setFormTrainingInfo({ ...data });
        this.navigation.back();
      } else {
        this.confirmBackButton();
      }
    }
  }

  ngOnDestroy() {
    // Unsubscribe form status
    if (this.subscr) {
      this.subscr.unsubscribe();
    }
  }
}
