import { KeyValueDto, isArrayFull, KEYS, RESULT_STATUS, isObjectFull } from '@ait/shared';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
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
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Store, select } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { CompanyInfo, CompanyInfoErrorsMessage } from '../interface';
import { CompanyService } from '../../../../services/aureole-v/company.service';

@Component({
  selector: 'ait-company-basic-info',
  templateUrl: './company-basic-info.component.html',
  styleUrls: ['./company-basic-info.component.scss'],
})
export class CompanyBasicInfoComponent
  extends AitBaseComponent
  implements OnInit, OnDestroy {
  // Create form group
  companyInfo: FormGroup;

  // Clone data to compare form change in edit mode
  cloneData: CompanyInfo;

  // Form status change subscribe
  private subscr: Subscription;
  currentLang = '';

  // Form error messages
  errors = new CompanyInfoErrorsMessage();

  labelNameList = {} as KeyValueDto;

  company_name = '';
  mode = MODE.NEW;
  isChanged = false;
  isDataInit = false;
  isReset = {
    occupation: false,
    work: false,
    business: false,
    size: false
  };

  @ViewChild('name', { static: false }) name: ElementRef;
  @ViewChild('address', { static: false }) address: ElementRef;
  @ViewChild('website', { static: false }) website: ElementRef;
  @ViewChild('phone', { static: false }) phone: ElementRef;
  @ViewChild('fax', { static: false }) fax: ElementRef;
  @ViewChild('representative', { static: false }) representative: ElementRef;
  @ViewChild('representative_katakana', { static: false })
  representative_katakana: ElementRef;
  @ViewChild('representative_position', { static: false })
  representative_position: ElementRef;
  @ViewChild('representative_email', { static: false })
  representative_email: ElementRef;
  @ViewChild('acceptance_remark', { static: false })
  acceptance_remark: ElementRef;
  @ViewChild('agreement', { static: false }) agreement: ElementRef;

  constructor(
    public router: Router,
    public activeRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    public store: Store<AppState>,
    private translateService: AitTranslationService,
    private element: ElementRef,
    private navigation: AitNavigationService,
    private companyService: CompanyService,
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

    //Change management of multiple languages
    store.pipe(select(getLang)).subscribe((lang) => {
      this.currentLang = lang;
    });

    //Create form builder group
    this.companyInfo = this.formBuilder.group({
      //社名
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(400),
      ]),
      //住所
      address: new FormControl(null, [Validators.maxLength(1000)]),
      //分野・業務区分
      business: new FormControl(null),
      //職種
      occupation: new FormControl(null),
      //作業
      work: new FormControl(null),
      // 会社（URL）
      website: new FormControl(null, [Validators.maxLength(200)]),
      //電話番号
      phone: new FormControl(null, [Validators.maxLength(20)]),
      //FAX番号
      fax: new FormControl(null, [Validators.maxLength(20)]),
      //会社人数規模
      size: new FormControl(null),
      //担当者情報（漢字）
      representative: new FormControl(null, [Validators.maxLength(400)]),
      //担当者情報（カタカナ）
      representative_katakana: new FormControl(null, [Validators.maxLength(400)]),
      //担当者の役職
      representative_position: new FormControl(null, [Validators.maxLength(400)]),
      //担当者のメールアドレス
      representative_email: new FormControl(null, [
        Validators.email,
        Validators.maxLength(100),
      ]),
      //現在の給料(雇用契約書)
      acceptance_remark: new FormControl(null, [Validators.maxLength(4000)]),
      // 個人情報の取り扱いについての同意
      agreement_file: new FormControl(null),
    });

    this.company_name = this.activeRouter.snapshot.paramMap.get('id');
    if (this.company_name) {
      this.mode = MODE.EDIT;
    }

    //個人情報の取り扱いについての同意
    if (this.mode === MODE.NEW) {
      this.companyInfo.addControl(
        'agreement',
        new FormControl(false, [Validators.requiredTrue])
      );
    }
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    // Run when form value change and only in edit mode
    this.companyInfo.valueChanges.subscribe((data) => {
      if (this.companyInfo.pristine) {
        this.cloneData = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave(data);
      }
    });

    if (this.company_name) {
      // await this.companyService
      //   .getCompanyProfileByName(this.company_name)
      //   .then((res) => {
      //     if (res.status === RESULT_STATUS.OK) {
      //       //TODO
      //       // const data = res?.data[0] as CompanyInfo;
      //       // this.cloneData = { ...res?.data[0] };
      //       // if (isObjectFull(data)) {
      //       //   this.companyInfo.patchValue({ ...data });
      //       //   this.cloneData = { ...data };
      //       // }
      //     }
      //   });
    }
    this.isDataInit = true;
    this.getMappingLabel();
    this.cancelLoadingApp();
  }

  // Take value form components and assign to form
  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.companyInfo.controls[form].markAsDirty();
      this.companyInfo.controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this.companyInfo.controls[form].setValue(null);
    }
  }

 
  takeInputValue(value: string, form: string): void {
    if (value) {
      this.companyInfo.controls[form].markAsDirty();
      this.companyInfo.controls[form].setValue(value);
    } else {
      this.companyInfo.controls[form].setValue(null);
    }
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFiles(fileList: any[]) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this.companyInfo.controls['agreement_file'].setValue(data);
    } else {
      this.companyInfo.controls['agreement_file'].setValue(null);
    }
  }

  //Get all form error messages
  getErrors(): void {
    this.resetErrors();
    this.errors = this.getFormErrorMessage(
      this.companyInfo,
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
        }
      }
    }
  }

  submitForm(): void {
    
    // if (this.companyInfo.valid) {
    //   const data = this.companyInfo.value;
    //   if (this.mode === MODE.NEW) {
    //     const saveData = { ...data } as CompanyInfo;
    //     saveData.name = {
    //       en_US: data.name,
    //       ja_JP: data.name,
    //       vi_VN: data.name,
    //     };
    //     saveData.website = {
    //       name: data.website,
    //       url: data.website,
    //     };
    //     saveData.is_matching = true;
    //     saveData.agreement = ['同意する'];
    //     this.saveCompanyInfo(saveData);
    //   } else {
    //     //TODO
    //   }
    // } else {
    //   // Because form invalid, get all erros messages and focus on erros
    //   this.getErrors();
    //   this.scrollIntoError(this.companyInfo);
    //   // Subscribe form status for onchange event error message
    //   !this.subscr &&
    //     (this.subscr = this.companyInfo.statusChanges.subscribe((status) => {
    //       if (status === 'INVALID') {
    //         this.getErrors();
    //       }
    //     }));
    // }
  }

  async saveCompanyInfo(data: CompanyInfo): Promise<void> {
    this.callLoadingApp();
    try {
      await this.companyService.save(data).then((res) => {
        if (res.status === RESULT_STATUS.OK) {
          this.cancelLoadingApp();
          const company_key = res.data[0]?._key;
          if (company_key) {
            this.showToastr('', this.getMsg('I0005'));
            this.router.navigate(['/company/'], {
              queryParams: {
                id: company_key
              }
            });
          } else {
            this.resetForm();
          }
        } else {
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      });
    } catch (err) {
      this.cancelLoadingApp();
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
    }
  }

  checkAllowSave(data: CompanyInfo) {
    const currentData = { ...data };
    const cloneData = { ...this.cloneData };
    this.isChanged = !AitAppUtils.isObjectEqual(currentData, cloneData);
  }

  getMappingLabel() {
    Object.keys(this.companyInfo.controls).forEach((key) => {
      let name = '';
      switch (key) {
        case 'name':
          name = '社名';
          break;
        case 'address':
          name = '住所（登記上）';
          break;
        case 'website':
          name = '会社（URL）';
          break;
        case 'phone':
          name = '電話番号';
          break;
        case 'fax':
          name = 'FAX番号';
          break;
        case 'representative':
          name = '担当者情報（漢字）';
          break;
        case 'representative_katakana':
          name = '担当者情報（カタカナ）';
          break;
        case 'representative_position':
          name = '担当者の役職';
          break;
        case 'representative_email':
          name = '担当者のメールアドレス';
          break;
        case 'acceptance_remark':
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

  toggle(checked: boolean) {
    this.companyInfo.controls['agreement'].setValue(checked);
  }

  // Rest form errors messages
  resetErrors() {
    this.errors = null;
  }

  back() {
    this.navigation.back();
    // return;
    // if (this.mode === MODE.EDIT) {
    //   this.router.navigate([`/company/${this.company_name}`]);
    // } else {
    //   this.navigation.back();
    // }
  }
  
  resetForm() {
    if (this.mode === MODE.NEW) {
      this.companyInfo.reset();
      for (const prop in this.isReset) {
        this.isReset[prop] = true;
        setTimeout(() => {
          this.isReset[prop] = false;
        }, 10);
      }
      // this.subscr.unsubscribe();
      // this.resetErrors();
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  ngOnDestroy() {
    // Unsubscribe form status change
    if (this.subscr) {
      this.subscr.unsubscribe();
    }
  }
}
