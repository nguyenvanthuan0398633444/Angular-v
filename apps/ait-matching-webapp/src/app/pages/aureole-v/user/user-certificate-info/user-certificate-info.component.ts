/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitMasterDataService,
  AitNavigationService,
  AitTranslationService,
  AitUserService,
  AppState,
  getLang,
  MODE,
  UserCertificate,
} from '@ait/ui';
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
import { Apollo } from 'apollo-angular';
import { UserJobQueryService } from '../../../../services/aureole-v/user-job-query.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { CertificateInfoErrorsMessage } from '../../interface';
import { UserCertificateAwardService } from '../../../../services/aureole-v/user-certificate-award.service';

@Component({
  selector: 'ait-user-certificate-info',
  templateUrl: './user-certificate-info.component.html',
  styleUrls: ['./user-certificate-info.component.scss'],
})
export class UserCertificateInfoComponent
  extends AitBaseComponent
  implements OnInit, OnDestroy {
  // Create form group
  userCertificate: FormGroup;

  // Clone data to compare form change in edit mode
  cloneData: UserCertificate;

  // Form status change subscribe
  private subscr: Subscription;

  currentLang = '';
  user_key = '';
  mode = MODE.NEW;
  // Form error messages
  errors = new CertificateInfoErrorsMessage();
  isChanged = false;
  isDataInit = false;
  isFileReset = false;
  isSubmit = false;

  isReset = {
    residence_status: false,
    salary_type: false,
    desired_salary: false,
    business: false,
    desired_occupation: false,
    prefecture: false,
    immigration_date: false,
    japanese_skill: false,
    certificate_no1: false,
    japanese_skill_certificate: false,
    qualification_certificate: false
  };
  // List of label name by lang
  labelNameList = {} as KeyValueDto;

  @ViewChild('residence_status', { static: false })
  residence_status: ElementRef;
  @ViewChild('salary_type', { static: false }) salary_type: ElementRef;
  @ViewChild('desired_salary', { static: false }) desired_salary: ElementRef;
  @ViewChild('business', { static: false }) business: ElementRef;
  @ViewChild('prefecture', { static: false }) prefecture: ElementRef;
  @ViewChild('remark', { static: true }) remark: ElementRef;
  @ViewChild('qualification', { static: false }) qualification: ElementRef;
  @ViewChild('certificate_no1', { static: true }) certificate_no1: ElementRef;

  constructor(
    public router: Router,
    public masterData: AitMasterDataService,
    @Optional() protected ref: NbDialogRef<UserCertificateInfoComponent>,
    public activeRouter: ActivatedRoute,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private translateService: AitTranslationService,
    private navigation: AitNavigationService,
    private userJobQueryService: UserJobQueryService,
    private userCertificateAwardService: UserCertificateAwardService,
    userService: AitUserService,
    store: Store<AppState | any>,
    toastrService: NbToastrService,
    authService: AitAuthService,
    apollo: Apollo,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService
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
      module: 'certificate-info',
    });
    store.pipe(select(getLang)).subscribe((lang) => {
      this.currentLang = lang;
    });

    this.userCertificate = this.formBuilder.group({
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
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    // Run when form value change and only in edit mode
    this.userCertificate.valueChanges.subscribe((data) => {
      if (this.userCertificate.pristine) {
        this.cloneData = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave(data);
      }
    });
    // Check mode
    if (this.user_key) {
      const resJobQuery = await this.userJobQueryService.find(this.user_key);
      const resCertificate = await this.userCertificateAwardService.find(
        this.user_key
      );
      const data = {
        ...resJobQuery.data[0],
        ...resCertificate.data[0],
      } as UserCertificate;
      console.log(data);
      if (isObjectFull(data)) {
        this.userCertificate.patchValue({ ...data });
      } else {
        this.mode = MODE.NEW;
      }
    }
    this.isDataInit = true;
    this.getMappingLabel();
    this.cancelLoadingApp();
    if (this.userService.onFocus) {
      setTimeout(() => {
        this.remark.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);
      this.userService.onFocus = false;
    }
  }

  // Take value form components and assign to form
  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (value) {
      this.userCertificate.controls[form].markAsDirty();
      this.userCertificate.controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this.userCertificate.controls[form].setValue(null);
    }
  }

  // Take values form components and assign to form
  takeMasterValues(value: KeyValueDto[], form: string): void {
    if (isArrayFull(value)) {
      this.userCertificate.controls[form].markAsDirty();
      this.userCertificate.controls[form].setValue(value);
    } else {
      this.userCertificate.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.userCertificate.controls[form].markAsDirty();
      this.userCertificate.controls[form].setValue(value);
    } else {
      this.userCertificate.controls[form].setValue(null);
    }
  }

  takeSalaryValue(salary: any) {
    if (salary !== '' && salary !== null && !isNaN(salary)) {
      this.userCertificate.controls['desired_salary'].markAsDirty();
      this.userCertificate.controls['desired_salary'].setValue(Number(salary));
    } else {
      this.userCertificate.controls['desired_salary'].setValue(null);
    }
  }

  takeInputValue(value: string, form: string) {
    if (value) {
      this.userCertificate.controls[form].markAsDirty();
      this.userCertificate.controls[form].setValue(value);
    } else {
      this.userCertificate.controls[form].setValue(null);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFiles(fileList: any[], form: string) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this.userCertificate.controls[form].markAsDirty();
      this.userCertificate.controls[form].setValue(data);
    } else {
      this.userCertificate.controls[form].setValue(null);
    }
  }

  //Get all form error messages
  getErrors(): void {
    this.resetErrors();
    this.errors = this.getFormErrorMessage(
      this.userCertificate,
      this.labelNameList
    );
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

  submitForm() {
    if (this.userCertificate.valid) {
      this.isSubmit = true;
      setTimeout(() => {
        this.isSubmit = false;
      }, 10);
      this.callLoadingApp();
      const data = this.userCertificate.value as UserCertificate;
      console.log(data);
      this.saveUserJobSetting(data);
    } else {
      // Form invalid, get all erros messages
      this.getErrors();
      this.scrollIntoError(this.userCertificate);

      // Subscribe form status for onchange event error message
      this.subscr = this.userCertificate.statusChanges.subscribe((status) => {
        if (status === 'INVALID') {
          this.getErrors();
        }
      });
    }
  }

  // userJobQueryService.find(
  //   this.user_key
  // );
  // const resCertificate = await this.userCertificateAwardService.find(

  async saveUserJobSetting(data: any): Promise<void> {
    const rq = { user_id: this.user_id, _key: this.user_key };
    const userCertificate = new UserCertificateAward(
      rq._key,
      data.certificate_no1,
      data.japanese_skill,
      data.japanese_skill_certificate,
      data.qualification,
      data.qualification_certificate,
      true
    );

    const userJobQuery = new UserJobQuery(
      rq._key,
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
    // Create request to save
    try {
      const saveUserJobQuery = await this.userJobQueryService.save(
        userJobQuery
      );
      const saveUserCertificate = await this.userCertificateAwardService.save(
        userCertificate
      );

      if (
        saveUserJobQuery.status === RESULT_STATUS.OK &&
        saveUserCertificate.status === RESULT_STATUS.OK
      ) {
        this.cancelLoadingApp();
        this.showToastr('', this.getMsg('I0005'));
        this.router.navigate([`/user/${saveUserJobQuery.data[0].user_id}`]);
      } else {
        this.cancelLoadingApp();
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }
    } catch (err) {
      this.cancelLoadingApp();
      console.error(err);
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
    }
  }

  checkAllowSave(data: UserCertificate) {
    const currentData = { ...data };
    const cloneData = { ...this.cloneData };

    for (const prop in currentData) {
      if (prop === 'immigration_date') {
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
            this.navigation.back();
          }
        });
    } else {
      this.cancelLoadingApp();
      this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
    }
  }

  removeData() {
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

  async onDelete() {
    this.callLoadingApp();
    const resJobQuery = await this.userJobQueryService.findByUserId(
      this.user_key
    );
    const resCertificate = await this.userCertificateAwardService.findByUserId(
      this.user_key
    );
    if (
      resJobQuery.status === RESULT_STATUS.OK &&
      resCertificate.status === RESULT_STATUS.OK &&
      (resJobQuery.numData > 0 || resCertificate.numData > 0)
    ) {
      const dataJobQuery = resJobQuery.data[0];
      const dataCertificate = resCertificate.data[0];
      let isSuccess = false;
      let user_id = '';
      if (isObjectFull(dataJobQuery)) {
        const condition = { _key: dataJobQuery._key };
        await this.userJobQueryService.remove(condition).then((res) => {
          if (res.status === RESULT_STATUS.OK) {
            isSuccess = true;
            user_id = res.data[0]?.user_id;
          }
        });
      }
      if (isObjectFull(dataCertificate)) {
        const condition = { _key: dataCertificate._key };
        await this.userCertificateAwardService.remove(condition).then((res) => {
          if (res.status === RESULT_STATUS.OK) {
            isSuccess = true;
            user_id = res.data[0]?.user_id;
          }
        });
      }
      if (isSuccess) {
        this.showToastr('', this.getMsg('I0003'));
        setTimeout(() => {
          this.cancelLoadingApp();
          this.router.navigate([`/user/${user_id}`]);
        }, 200);
      } else {
        this.cancelLoadingApp();
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }
    } else {
      this.cancelLoadingApp();
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
    }
  }

  getMappingLabel() {
    Object.keys(this.userCertificate.controls).forEach((key) => {
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
        case 'qualification':
          name = '資格の種類(玉掛クレーン等)';
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

  resetErrors(): void {
    this.errors = new CertificateInfoErrorsMessage();
  }

  resetForm() {
    if (this.mode === MODE.EDIT) {
      this.userCertificate.patchValue({
        ...this.cloneData,
      });
      const fileArray = ['japanese_skill_certificate', 'qualification_certificate', 'certificate_no1'];
      for (const prop in this.isReset) {
        if (!this.userCertificate.controls[prop].value) {
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
      this.showToastr('', this.getMsg('I0007'));
      this.isFileReset = true;
      setTimeout(() => {
        this.isFileReset = false;
      }, 5);
    } else {
      this.userCertificate.reset();
      for (const prop in this.isReset) {
        this.isReset[prop] = true;
        setTimeout(() => {
          this.isReset[prop] = false;
        }, 100);
      }
      this.subscr.unsubscribe();
      this.resetErrors();
      this.showToastr('', this.getMsg('I0007'));
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
            this.router.navigate([`/user/${this.user_key}`]);
          }
        });
    } else {
      this.router.navigate([`/user/${this.user_key}`]);
    }
  }
  skip() {
    this.router.navigate([`/user/${this.user_key}`]);
  }

  ngOnDestroy() {
    // Unsubscribe form status
    if (this.subscr) {
      this.subscr.unsubscribe();
    }
  }
}

class UserJobQuery {
  user_id: string;
  residence_status: KeyValueDto[];
  salary_type: KeyValueDto;
  desired_salary: number;
  business: KeyValueDto[];
  desired_occupation: KeyValueDto;
  prefecture: KeyValueDto[];
  immigration_date: number;
  remark: string;
  is_matching: boolean;

  constructor(
    user_id: string,
    residence_status: KeyValueDto[],
    salary_type: KeyValueDto,
    desired_salary: number,
    business: KeyValueDto[],
    desired_occupation: KeyValueDto,
    prefecture: KeyValueDto[],
    immigration_date: number,
    remark: string,
    is_matching: boolean
  ) {
    this.user_id = user_id;
    this.residence_status = residence_status;
    this.salary_type = salary_type;
    this.desired_salary = desired_salary;
    this.business = business;
    this.desired_occupation = desired_occupation;
    this.prefecture = prefecture;
    this.immigration_date = immigration_date;
    this.remark = remark;
    this.is_matching = is_matching;
  }
}

class UserCertificateAward {
  user_id: string;
  certificate_no1: string[];
  japanese_skill: KeyValueDto;
  japanese_skill_certificate: string[];
  qualification: string;
  qualification_certificate: string[];
  is_matching: boolean;

  constructor(
    user_id: string,
    certificate_no1: string[],
    japanese_skill: KeyValueDto,
    japanese_skill_certificate: string[],
    qualification: string,
    qualification_certificate: string[],
    is_matching: boolean
  ) {
    this.user_id = user_id;
    this.certificate_no1 = certificate_no1;
    this.japanese_skill = japanese_skill;
    this.japanese_skill_certificate = japanese_skill_certificate;
    this.qualification = qualification;
    this.qualification_certificate = qualification_certificate;
    this.is_matching = is_matching;
  }
}
