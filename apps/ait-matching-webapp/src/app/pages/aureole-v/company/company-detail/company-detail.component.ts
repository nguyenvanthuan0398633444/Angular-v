/* eslint-disable @typescript-eslint/member-ordering */
import { CompanyInfoDto, RESULT_STATUS } from '@ait/shared';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitMasterDataService,
  AitTranslationService,
  AitUserService,
  AppState,
  getCaption,
  MODULES,
  PAGES,
  TYPE
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { environment } from '../../../../../environments/environment';
import { CompanyService } from '../../../../services/aureole-v/company.service';
import { JobService } from '../../../../services/aureole-v/job.service';
import { RecommencedUserService } from '../../../../services/aureole-v/recommenced-user.service';
import { JobInfoDto } from '../interface';


@Component({
  selector: 'ait-company-detail',
  templateUrl: 'company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})

export class CompanyDetailComponent extends AitBaseComponent implements OnInit {
  loading = false;
  comma = '、';
  constructor(
    store: Store<AppState | any>,
    authService: AitAuthService,
    apollo: Apollo,
    userService: AitUserService,
    _env: AitEnvironmentService,
    private companyService: RecommencedUserService,
    private jobService: JobService,
    private translateService: AitTranslationService,
    private activeRouter: ActivatedRoute,
    private masterDataService: AitMasterDataService,
    private router: Router,
    private compService: CompanyService,
    private route: ActivatedRoute
  ) {
    super(store, authService, apollo, userService, _env);
    this.setModulePage({
      module: MODULES.COMPANY,
      page: PAGES.COMPANY_INFO
    });
    store.pipe(select(getCaption)).subscribe(() => {

      const t = translateService.translate('s_0001');
      if (t && t !== 's_0001') {
        this.comma = t;
      }
    })
  }
  state: any = {
    company_name: ''
  }

  actionBtn = [
    {
      title: '追加',
      icon: 'plus'
    }
  ];
  editBtns = [
    {
      title: 'c_2001',
      icon: 'edit'
    }
  ];
  isDev = !environment.production;
  linkWeb = [];
  listCompanyKey = [];
  job_companys = [];


  stateCompanyInfo = {} as CompanyInfoDto;
  stateJobInfo = {} as JobInfoDto;
  dataJobInfo = [] as JobInfoDto[] | any[];
  companyList = [];

  setState = (newState: any, key: string) => this[key] = { ...this[key], ...newState };

  getArrayFromString = (string: string) => {
    return (string || '').split(this.comma).filter(x => !!x);
  }

  getUniqueArray = (arr) => AitAppUtils.getUniqueArray(arr, 'name').filter(x => x?.url);

  navigateToAddJob = (event?: any) => {
    console.log(event);
    if (event?.clicked) {
      this.router.navigateByUrl('/job/new');
    }
  }
  navigateToEditJob = (job_key: string) => {
    this.router.navigateByUrl('/job/' + job_key)
  };
  navigateToEditCompany = () => {
    const key = this.activeRouter.snapshot.paramMap.get('id');
    this.router.navigate([`/company-basic-info/${key}`]);
  }

  getFiles = (file) => {
    // console.log(file)
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        const list = params.id ? params.id.split(',') : []
        this.listCompanyKey = list;
      }
      );
    const urlHash: any = AitAppUtils.getParamsOnUrl(true);
    // // console.log(decodeURIComponent(urlHash))
    this.setState({ company_name: decodeURIComponent(urlHash) }, 'state');
    this.getCompanyInfo();
    // this.getJobInfo();
  }
  sortJobsByGroup = (jobs) => {
    // // // console.log(jobs)
    const job = {
      募集中: [],
      準備中: [],
      終了: [],
      一時中止: [],
      blank: []
    }
    let ret = [];
    // const specialText = ['募集中','準備中','終了','一時中止']

    Object.keys(job).forEach(key => {
      const filter = jobs.filter(f => f.status?.value === key);
      // // console.log(filter)
      job[key] = filter || [];
      ret = [...ret, ...job[key]]
      if (key === 'blank') {
        const fil = jobs.filter(f => !f.status?.value);
        job[key] = fil || [];
        ret = [...ret, ...job[key]]
      }
    });
    return ret;
  }

  getSumaryInfo = (company_key) => {
    const company: CompanyInfoDto = this.companyList.find(f => f._key === company_key);
    return [
      { field: '住所', value: company?.address },
      { field: '職種', ...company?.occupation },
      { field: '作業', ...company?.work },
    ]
  }

  statusText = (status: string) => {
    const target = status ? status : '一時中止';
    return this.translateService.translate(target);
  }


  getStatuJob = (value) => {
    const target = value ? `${value}` : '一時中止';
    return this.translateService.translate(target);
  };

  getCompanyInfo = () => {
    this.loading = true;
    // this.compService.findCompanyByName(this.state.company_name).then(r => console.log(r));
    this.compService.findCompanyByListKeys(this.listCompanyKey).then(res => {
      const specialFields = ['business', 'occupation', 'representative_position', 'work', 'size']
      const ret = [];

      if (res.status === RESULT_STATUS.OK) {
        if ((res?.data || []).length !== 0) {
          // // console.log(res.data)
          this.companyList = res.data;
          res.data.forEach((item: CompanyInfoDto) => {
            const dto: any = { ...item };
            this.listCompanyKey = AitAppUtils.getArrayNotFalsy([...this.listCompanyKey, dto?._key]);
            Object.entries(item).forEach(([key, val]) => {
              if (val) {
                if (specialFields.includes(key)) {
                  dto[key] = val?.value
                }
                else {
                  dto[key] = val
                }
              }
            })

            this.linkWeb = [...this.linkWeb, item.website];
            this.job_companys = [...this.job_companys, item._key]
            ret.push(dto);
          })
          this.setupData(ret);

        }

      }
    }).finally(() => this.loading = false)
  }

  setupData = (ret: any[]) => {
    // // console.log(ret)
    const obj = {
    };
    Object.keys(ret[0]).forEach(key => obj[key] = [])

    const result = {}
    ret.forEach(item => {

      Object.entries(item).forEach(([key, value]) => {
        if (value && !obj[key].includes(value)) {
          // // // console.log(key, value)
          obj[key] = [...obj[key], value];
          // // // console.log(obj)
        }
      })
    })
    // // console.log(obj)

    Object.entries(obj).forEach(([key, value]) => {
      const target: any = value || [];
      result[key] = target.join(this.comma);
    });
    console.log(result)
    this.setState({
      ...result
    }, 'stateCompanyInfo')
    this.getJobInfo()
  }

  toggleExpan = (index) => {
    const act = this.dataJobInfo[index];
    act.isOpen = !act.isOpen;
  }

  private getNumber = (num: string) => {
    return num.length > 1 ? num : `0${num}`
  }

  getValueFromTo = (from_hour: number, to_hour: number, from_minute: number, to_minute: number) => {
    if (from_minute === null || to_hour === null || from_minute === null || to_minute === null) {
      return '';
    }

    const time = {
      from_hour: this.getNumber(from_hour ? from_hour.toString() : `0`),
      to_hour: this.getNumber(to_hour ? to_hour.toString() : `0`),
      from_minute: this.getNumber(from_minute ? from_minute.toString() : `0`),
      to_minute: this.getNumber(to_minute ? to_minute.toString() : `0`)
    }
    return `${time.from_hour}：${time.from_minute} ～ ${time.to_hour}：${time.to_minute}`
  }

  getJobInfo = () => {
    this.loading = true;
    this.jobService.findJobByCompanys(Array.from(new Set(this.listCompanyKey))).then(r => {
      // // // console.log(r)
      if (r.status === RESULT_STATUS.OK) {
        this.setState(r.data[0], 'stateJobInfo');
        const data = r.data.map(d => {
          return {
            ...d,
            business: (d?.business || []).map(v => v?.value),
            residence_status: (d?.residence_status || []).map(v => v?.value),
            prefecture: (d?.prefecture || []).map(v => v?.value),
          }
        });
        // console.log(data)
        // this.dataJobInfo = r.data.map(m => ({ ...m, isOpen: false }));
        // this.settingJobData(r.data);
        this.dataJobInfo = this.sortJobsByGroup(
          [...data.map(m => ({ ...m, isOpen: false, field: m?.status?.value ? m?.status?.value : '一時中止' }))]);
        this.loading = false;
      }
    })
  }

  getValueFromArray = (array: any[]) => {
    const filter = Array.from(new Set(array))
    return (filter || []).join(this.comma)
  }
}
