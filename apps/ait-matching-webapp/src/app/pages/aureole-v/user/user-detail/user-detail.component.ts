/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  RESULT_STATUS,
} from '@ait/shared';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitMasterDataService,
  AitUserService,
  AppState,
  MODULES,
  PAGES
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserCertificateAwardService } from '../../../../services/aureole-v/user-certificate-award.service';
import { UserProfileService } from '../../../../services/aureole-v/user-profile.service';
import { UserJobQueryService } from '../../../../services/aureole-v/user-job-query.service';
import { CertificateInfoDto, UserJobSetting, UserProfileAureoleDto } from './interface';



export enum MODEPROFILE {
  SHOW = 'SHOW',
  EDIT = 'EDIT',
}

@Component({
  selector: 'ait-user-detail',
  templateUrl: 'user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent extends AitBaseComponent implements OnInit {
  constructor(
    userService: AitUserService,
    private masterDataService: AitMasterDataService,
    store: Store<AppState>,
    authService: AitAuthService,
    private router: Router,
    apollo: Apollo,
    _env: AitEnvironmentService,
    private userProfileService: UserProfileService,
    private certificateService: UserCertificateAwardService,
    private userJobSettingService: UserJobQueryService
  ) {
    super(store, authService, apollo, userService, _env);
    this.setModulePage({
      page: PAGES.USER_PROFILE,
      module: MODULES.USER_PROFILE
    })
    this.radioGender = new FormControl('');
  }
  isDevMode = false;
  currentLang = '';
  basicContent = 'common.aureole-v.user-profile.basic.content';
  techContent = 'common.aureole-v.user-profile.tech_traning.content';
  certificate = 'common.aureole-v.user-profile.certificate.content';
  job_request = 'common.aureole-v.user-profile.job_request.content';
  selectItem;
  mode: 'SHOW' | 'EDIT' = 'SHOW';
  date = Date.now();

  modeScreen: any[] = [
    {
      cardIndex: 1,
      mode: MODEPROFILE.SHOW,
    },
    {
      cardIndex: 2,
      mode: MODEPROFILE.SHOW,
    },
    {
      cardIndex: 3,
      mode: MODEPROFILE.SHOW,
    },
    {
      cardIndex: 4,
      mode: MODEPROFILE.SHOW,
    },
  ];

  gender = [];

  handleClickBtnCard = (index: number) => {
    const id = AitAppUtils.getParamsOnUrl(true);
    switch (index) {
      case 1:
        this.router.navigate([`/user-basic-info/${id}`]);
        break;
      case 2:
        this.router.navigate([`/user-training-info/${id}`]);
        break;
      case 3:
        this.userService.onFocus = true;
        this.router.navigate([`/user-certificate-info/${id}`]);
        break;
      case 4:
        this.router.navigate([`/user-certificate-info/${id}`]);
        break;
    }
  };

  getValue = (value) => {
    // // //console.log(value)
  };

  get isReadOnlyCard1(): boolean {
    return this.modeScreen[0].mode === 'SHOW';
  }

  get isReadOnlyCard2(): boolean {
    return this.modeScreen[1].mode === 'SHOW';
  }

  get isReadOnlyCard3(): boolean {
    return this.modeScreen[2].mode === 'SHOW';
  }

  handleChangeRadio = ($event) => {
    if (this.isReadOnlyCard1) {
      $event.stopPropagation();
      return false;
    }
  };

  radioGender: FormControl;
  loading = true;
  state = {} as UserProfileAureoleDto;
  stateJobSetting = {} as UserJobSetting;
  stateCertificate = {} as CertificateInfoDto;
  user_key: any = '';

  // date = Date.now();

  setStateJobSetting = (newState: any) =>
    (this.stateJobSetting = { ...this.stateJobSetting, ...newState });
  setStateCertificate = (newState: any) =>
    (this.stateCertificate = { ...this.stateCertificate, ...newState });

  ngOnInit() {
    const id = AitAppUtils.getParamsOnUrl(true);
    this.user_key = id.length > 30 ? AitAppUtils.getParamsOnUrl(true) : this.user_id;
    // //console.log(this.user_key);


    this.userJobSettingService.findByUser(this.user_key).then((r) => {
      const specialKeys = ['business', 'residence_status', 'prefecture'];


      if (r.status === RESULT_STATUS.OK) {
        const data: any = {};

        const setting = r.data[0];

        Object.entries(setting).forEach(([key, value]) => {
          const target: any = value;
          if (specialKeys.includes(key)) {
            data[key] = (target || []).map(m => m?.value)
          }
          else {
            data[key] = value;
          }
        })
        //console.log(data)
        this.setStateJobSetting(data);
      }
    });

    this.loadData(this.user_key).then(() => {
      this.getGenderData();
    });
    this.getUserCertificate();
    this.userService.resetData();
  }

  getUserCertificate = () => {
    this.certificateService.findByUser(this.user_key).then((r) => {
      if (r.status === RESULT_STATUS.OK) {
        // // // //console.log(r)
        if ((r.data || []).length !== 0) {
          this.setStateCertificate(r.data[0]);
        }
      }
    });
  };

  get genderRadio() {
    return this.state?.gender?._key;
  }

  setState = (newState: any) => (this.state = { ...this.state, ...newState });

  loadData = async (user_id?: string) => {
    // //console.log(user_id)
    const result = await this.userProfileService.findUserProfile(user_id)
    // // //console.log(result);
    if (result.status === RESULT_STATUS.OK) {
      const user = result.data[0];
      //console.log(user);
      this.setState(user);
      this.radioGender.setValue({ ...this.state?.gender, checked: true });
      this.selectItem = { ...this.state?.gender, checked: true };
    }
    this.loading = false;
  };

  getGenderData = () => {
    this.masterDataService.find({
      class: {
        value: ['GENDER']
      }
    }).then((res) => {
      if (res.status == RESULT_STATUS.OK) {
        const keyValues = (res.data || []).map((m) => ({
          _key: m._key,
          label: m.name[this.lang],
          checked: m?.code === this.state?.gender?._key,
        }));
        // // // //console.log(res.data,this.state.gender)
        this.gender = keyValues;
      }
    });
  };
}
