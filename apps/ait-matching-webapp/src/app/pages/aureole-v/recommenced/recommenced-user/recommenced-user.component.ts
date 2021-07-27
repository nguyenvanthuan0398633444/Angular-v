import { CompanyInfoDto, isArrayFull, RESULT_STATUS } from '@ait/shared';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NbLayoutScrollService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitMasterDataService,
  AitTranslationService,
  AppState, MODULES, PAGES, TabView
} from '@ait/ui'
import { Apollo } from 'apollo-angular';
import { StoreKeywordsSearch } from '../../../../state/actions';
import { ReactionService } from '../../../../services/aureole-v/reaction.service';
import { RecommencedUserService } from '../../../../services/aureole-v/recommenced-user.service';

export enum StorageKey {
  KEYWORD = 'keyword',
  FILTER = 'filter'
}

@Component({
  selector: 'ait-recommenced-user',
  styleUrls: ['./recommenced-user.component.scss'],
  templateUrl: './recommenced-user.component.html'
})
export class RecommencedUserComponent extends AitBaseComponent implements OnInit {
  isNavigate = false;
  currentKeyword = {};
  currentCondition = {};
  master_data_fields = ['gender', 'desired_occupation', 'prefecture', 'residence_status', 'work'];
  inputVal = '';
  constructor(
    layoutScrollService: NbLayoutScrollService,
    private masterDataService: AitMasterDataService,
    private matchingCompanyService: RecommencedUserService,
    private reactionService: ReactionService,
    private translateService: AitTranslationService,
    store: Store<AppState | any>,
    authService: AitAuthService,
    private router: Router,
    env: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, null, env, layoutScrollService);
    this.setModulePage({
      page: PAGES.RECOMMENCED_USER,
      module: MODULES.RECOMMENCED_USER
    })
    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationStart) {
        this.isNavigate = true;
        // this.store.dispatch(
        //   new StoreKeywordsSearch({
        //     _key: this.company_key,
        //     value: this.companyName,
        //     dataAll: this.dataSuggestAll,
        //     filterCondition: this.filterCommon,
        //     user_id: this.user_id
        //   })
        // );
      }
    });


    store.pipe(select(this.getCaption)).subscribe(() => {
      const comma = this.translateService.translate('s_0001');
      if (comma !== 's_0001') {
        this.comma = comma;
      }
    })


    // tslint:disable-next-line: deprecation
    layoutScrollService.onScroll().subscribe((e) => {
      const path = AitAppUtils.getParamsOnUrl(true);

      if (path.includes('recommenced-user')) {

        this.loadNext(e);
      }
    });
    this.inputControlMaster = new FormControl('');
  }

  tabs: TabView[] = [
    {
      title: 't_019',
      tabIcon: 'star',
      type: 'R',
    },
    {
      title: 't_020',
      tabIcon: 'bookmark',
      type: 'S',
    },
  ];
  comma = '、';

  cardSkeleton = Array(8).fill(1);
  textDataNull = '';
  textDataNullSave = '';
  dataSuggestAll = [];
  isExpan = false;
  currentTab = 'R';
  employeeData = [];
  dataFilter = [];
  dataFilterDf = [];

  dataFilterSave = [];
  dataFilterSaveDf = [];
  dataIncludesIdSave = [];

  messageSearch = '';

  isLoading = true;
  spinnerLoading = false;
  isExpan1 = true;
  round = 1;
  currentSearch: any = {};
  companyName = '';
  dataSuggest = [];
  companySelect = [];
  addressSearch = '';
  inputControlMaster: FormControl;
  dataIncludesId = [];
  company_key = '';
  currentDataCard = [];

  filterCommon: any = {};
  filterCommonAppended: any = {};
  currentRound = 0;
  textDataEnd = '';

  company_keys = [];
  isSearchButton = false;
  isResetSalaryFrom = false;
  isResetSalaryTo = false;


  getNummberMode8 = (target: number) => {
    if (target === 0) {
      return 8;
    }
    if (target) {
      const num = target.toString();
      const lastString = num[num.length - 1];
      return 2 * 8 - Number(lastString);
    }
    return 0;
  };



  setSkeleton = (flag?: boolean) => {
    if (flag === undefined) {
      this.cardSkeleton = Array(this.getNummberMode8(0)).fill(1);
    } else if (this.currentTab === 'R') {
      this.currentDataCard = this.dataFilter;
      if (flag) {
        //
        this.cardSkeleton = Array(this.getNummberMode8(this.dataFilter.length)).fill(1);
        // // // // // //console.log(this.cardSkeleton, this.getNummberMode8(this.currentDataCard.length));
      } else {
        this.cardSkeleton = [];
        this.dataFilter = this.currentDataCard;
        //
      }
    } else {
      // // // // // //console.log(this.dataFilterSave)
      this.currentDataCard = this.dataFilterSave;
      if (flag) {
        //
        this.cardSkeleton = Array(this.getNummberMode8(this.dataFilterSave.length)).fill(1);
      } else {
        this.cardSkeleton = [];
        this.dataFilterSave = this.currentDataCard;

        //
      }
    }
  };

  isObjectEmpty = (obj) => Object.keys(obj || {}).length === 0;

  removeSearch = (isPrevented = false) => {
    if (!isPrevented) {
      this.currentSearch = {};
    }
    // this.filterCommon = {};
    // this.filterCommonAppended = {};
    this.dataFilter = [];
    this.dataIncludesId = [];
    this.dataIncludesIdSave = [];
    this.dataFilterSave = [];
    this.dataFilterSaveDf = [];
    this.dataFilterDf = [];
    this.textDataNull = '';
    this.textDataNullSave = '';
    this.textDataEnd = '';
    this.currentRound = 0;
    this.resetRound();
    this.inputControlMaster.patchValue('');
    this.store.dispatch(new StoreKeywordsSearch({}));
    localStorage.removeItem(StorageKey.KEYWORD + `_${this.user_id}`);
    localStorage.removeItem(StorageKey.FILTER + `_${this.user_id}`);
  };


  goTop = () => {
    this.gotoTop();
  };

  private matchingCompany = async (_key: string) => {
    // // //console.log(this.filterCommon);
    const filter = this.filterCommon;
    const res = await this.matchingCompanyService.matchingCompany(_key);

    if (res.status === RESULT_STATUS.OK) {
      //(res?.data || []).sort((a, b) => b.total_score - a.total_score);
      const data = res.data;
      // // //console.log(data);


      if (data && data?.length !== 0) {
        const sort_by_group = data.sort((a, b) => -b.group_no + a.group_no);
        const obj = {
          group1: sort_by_group.filter((f) => f.group_no === 1),
          group2: sort_by_group.filter((f) => f.group_no === 2),
          group3: sort_by_group.filter((f) => !f.group_no || f.group_no === 3)
        };

        const sort = {
          sort1: obj.group1.sort((a, b) => b.total_score - a.total_score),
          sort2: obj.group2.sort((a, b) => b.total_score - a.total_score),
          sort3: obj.group3.sort((a, b) => (b?.total_score || 0) - (a?.total_score || 0))
        };
        // // // //console.log(sort)
        this.dataIncludesId = [...sort.sort1, ...sort.sort2, ...sort.sort3];
        // // // //console.log(this.dataIncludesId);
        // // //console.log(filter)
        this.filterCommon = filter;

      } else {
        this.setSkeleton(false);
        this.textDataNull = '021';
      }
    }
  };

  private getDetailMatching = async (list_ids: string[]) => {
    const res = await this.matchingCompanyService.getDetailMatching(this.company_key, list_ids);
    if (res.status === RESULT_STATUS.OK) {
      // // // // // //console.log(res.data);
      if (res.data?.length === 0) {
        this.textDataNull = '021';
      }
      return res.data;
    }
  };

  getDataClone = (data) => {
    return AitAppUtils.deepCloneArray(data || []);
  };

  handleSyncData = ($event) => {
    const { user_id, is_saved } = $event;
    const find = this.dataFilterDf.find((f) => f.user_id === user_id);
    const currentFind = this.dataFilter.find((f) => f.user_id === user_id);
    if (find) {
      find.is_saved = is_saved;
    }

    if (currentFind) {
      currentFind.is_saved = is_saved;
    }
  };

  ToggleExpan = () => (this.isExpan = !this.isExpan);
  ToggleExpan1 = () => {
    // // // // // //console.log('a1')
    this.isExpan1 = !this.isExpan1;
  };

  submitSearch = () => {

    // // // // //console.log('submit')
    this.isLoading = true;
    // this.setSkeleton(true);

    this.matchingCompany(this.company_key).then((m) => {
      // //console.log(this.filterCommon);
      this.getDataByRound().then((r) => {
        // this.isLoading = false;
        // this.setSkeleton(false);
      });
    });
  };

  filterMain = () => {
    // tslint:disable-next-line: no-console

    const condition = {};

    //salary_from (nhập từ màn hình)  - 30.000 <= desired_salary <= salary_to (nhập từ màn hình) + 30.000


    // remark
    // desired_occupation
    // gender
    // prefecture
    // desired_salary
    const result = this.dataFilterDf.filter(f => {
      let check = [];

      Object.entries(this.filterCommon).forEach(([key, value]) => {
        if (value) {
          condition[key] = value;
          if (!key.includes('salary')) {
            if (this.master_data_fields.includes(key)) {
              if (isArrayFull(f[key])) {
                const map = f[key].map(m => m?.value);
                check = [...check, map.includes(value)];
              }
              else {
                check = [...check, f[key]?._key === value];
              }
            }
            else {
              check = [...check, f[key] === value];
            }
          }
          else {
            //Truong hop co cả 2 salary
            //                          110000        <= x <= 180000
            //salary_from(nhập từ màn hình) - 30.000 <= desired_salary <= salary_to(nhập từ màn hình) + 30.000
            if (this.filterCommon['salary1'] && this.filterCommon['salary2']) {
              if (!f?.desired_salary) {
                check = [...check, false];
              }
              else {
                const match = (f?.desired_salary || 0) >= this.acceptedSalary(this.filterCommon['salary1'], true) &&
                  (f?.desired_salary || 0) <= this.acceptedSalary(this.filterCommon['salary2']);
                check = [...check, match];
              }


            }
            // Truong hop chi co salary 1 salary_from (nhập từ màn hình) - 30.000 <= desired_salary
            else if (this.filterCommon['salary1']) {
              if (!f?.desired_salary) {
                check = [...check, false];
              }
              else {
                const match2 = (f?.desired_salary || 0) >= this.acceptedSalary(this.filterCommon['salary1'], true);
                check = [...check, match2];
              }

              // Truong hop chi co salary 2 desired_salary <= salary_to (nhập từ màn hình) + 30.000
            } else if (this.filterCommon['salary2']) {
              if (!f?.desired_salary) {
                check = [...check, false];

              }
              else {
                const match3 = (f?.desired_salary || 0) <= this.acceptedSalary(this.filterCommon['salary2']);
                check = [...check, match3];

              }
            }
          }
        }
      })


      return check.length !== 0 && !check.includes(false);

    });
    // console.log(result)
    // console.log(this.dataFilter)
    const res1 = AitAppUtils.getUniqueArray(this.sortByGroup(result), '_key');
    const res2 = AitAppUtils.getUniqueArray(this.sortByGroup(result), '_key');

    this.dataFilter = res1;
    this.dataFilterSave = res2;
    this.currentCondition = condition;

    // // // // //console.log(AppUtils.isObjectEmpty(condition))


    // // // // // //console.log(AppUtils.isObjectEmpty(condition))
    if (AitAppUtils.isObjectEmpty(condition)) {
      this.dataFilter = this.dataFilterDf;
      this.dataFilterSave = this.dataFilterSaveDf;
    }

    if (this.dataFilter.length === 0) {
      this.textDataNull = '021';
    }

    if (this.dataFilterSave.length === 0) {
      this.textDataNullSave = '021';
    }

    localStorage.setItem(StorageKey.FILTER + `_${this.user_id}`, JSON.stringify({ ...this.filterCommon }));

    // // // // // //console.log(condition, this.dataFilter, this.dataFilterSave);
  };


  acceptedSalary = (salary: number, isFirst?: boolean) => {
    const target = salary || 0;

    // return isFirst ? target - 30000 : target + 30000;
    return target;
  };

  filterRemark = (value) => {
    // // // // // //console.log(value)
    const filter = of(value);
    filter.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((text) => {
      // // // // //console.log(text);
      this.filterCommon = { ...this.filterCommon, remark: text };
      this.filterMain();
    });
  };

  checkValidRangeNumber = (field: string, salary) => {
    // case reset salary1
    if (field === 'salary1') {

      if (this.filterCommon['salary2'] && salary > this.filterCommon['salary2']) {
        this.isResetSalaryFrom = true;
        this.filterCommon['salary1'] = null;
      }
      else {
        this.filterCommon = { ...this.filterCommon, [field]: salary };

      }
    }
    else {
      if (this.filterCommon['salary1'] && salary < this.filterCommon['salary1']) {
        this.isResetSalaryTo = true;
        this.filterCommon['salary2'] = null;
      }
      else {
        this.filterCommon = { ...this.filterCommon, [field]: salary };
      }
    }
    this.filterMain();
  }

  filterBySalary = (salary, field) => {

    const filter = of(salary);
    filter.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((sal) => {
      this.isResetSalaryFrom = false;
      this.isResetSalaryTo = false;
      this.checkValidRangeNumber(field, sal);
    });
  };

  filterPrefecture = (val) => {
    // //console.log(val)
    const value = val?.value || [];
    const target = value[0]?._key;
    this.filterCommon = { ...this.filterCommon, prefecture: target };
    this.filterMain();
  };

  filterByGender = (val) => {
    //console.log(val);
    const value = val?.value || [];
    const target = value[0]?._key;
    this.filterCommon = { ...this.filterCommon, gender: target };
    this.filterMain();
  };

  filterByOccupation = (val) => {
    //console.log(val);

    const value = val?.value || [];
    const target = value[0]?._key;
    // // // //console.log(target);
    this.filterCommon = { ...this.filterCommon, desired_occupation: target };

    this.filterMain();
  };

  private getDetailCompany = async (name: string) => {
    const res = await this.matchingCompanyService.getCompanyProfileByName(name);
    const ret = [];
    if (res.status === RESULT_STATUS.OK) {
      if ((res?.data || []).length !== 0) {
        this.company_keys = res.data.map(m => m?._key);
        res.data.forEach((item: CompanyInfoDto) => {

          const dto: any = {};
          dto.occupation = item?.occupation?.value;
          dto.fax = item.fax;
          dto.address = item.address;
          dto.phone = item.phone;
          dto.work = item?.work?.value;
          ret.push(dto);
        });
      }
    }
    // // // // //console.log(ret)
    return ret;
  };

  getTitle = (name: string) => this.translateService.translate(name);

  handleClickViewMore = () => {
    this.router.navigate(['/company/'], {
      queryParams: {
        id: this.company_keys.join(',')
      }
    });
  };

  addCompany = (company: any, isSync = false) => {
    if (!isSync) {
      this.filterCommonAppended = {};
      this.filterCommon = {};
    }
    this.removeSearch();

    this.setSkeleton(true);

    // //save keyword to localstorage
    localStorage.setItem(StorageKey.KEYWORD + `_${this.user_id}`, JSON.stringify({ ...company }));

    // // const getDataFromCompanyValue = this.dataSuggestAll.filter(f => f?.value === company?.value).map(m => m._key);
    // // // // // // //console.log(getDataFromCompanyValue);
    this.getDetailCompany(company?.value).then((r: CompanyInfoDto[]) => {
      // // // // // //console.log(r)
      const res = {};
      const obj = {
        address: [],
        fax: [],
        occupation: [],
        phone: [],
        work: []
      };
      (r || []).forEach((dataa) => {
        Object.entries(dataa).forEach(([key, value]) => {
          if (value && !obj[key].includes(value)) {
            obj[key] = [...obj[key], value];
            // // // // // //console.log(key, obj[key]);
          }
        });
      });
      Object.entries(obj).forEach(([key, value]) => (res[key] = (value || []).join(this.comma)));
      // res = { ...res, ...obj };
      // // // // // //console.log(res)
      this.companySelect = [res];
      this.dataSuggest = [];
      this.currentSearch = company;
      this.companyName = company?.value;
      this.company_key = company?._key;
      this.submitSearch();
    });
  };

  // getValue = (v) => //console.log(v);

  ngOnInit() {
    // // //console.log(localStorage.getItem(StorageKey.KEYWORD));

    const keyword: any = JSON.parse(localStorage.getItem(StorageKey.KEYWORD + `_${this.user_id}`));
    const filter =
      localStorage.getItem(
        StorageKey.FILTER + `_${this.user_id}`)
        ? JSON.parse(localStorage.getItem(StorageKey.FILTER + `_${this.user_id}`))
        : {};
    // //console.log(this.user_id, this.authService.getUserID())
    if (keyword?._key) {
      this.filterCommon = filter;
      this.filterCommonAppended = filter;
      this.addCompany(keyword, true);

      this.filterMain()
    }
    // call api # master data
    this.inputControlMaster.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
        // tslint:disable-next-line: deprecation
      )
      .subscribe((text) => {
        this.messageSearch = '';
        // // // // // //console.log(text)
        if (text) {

          this.matchingCompanyService.searchCompany(text).then(r => {
            if (r.status === RESULT_STATUS.OK) {
              const target = r?.data
              if (target.length !== 0) {
                this.dataSuggestAll = target;
                this.dataSuggest = AitAppUtils.getUniqueArray((target || []).slice(0, 25), 'value');
              }

              else {
                this.dataSuggestAll = [];
                this.dataSuggest = [];
                this.messageSearch = 'データがありません。';
              }
            }
          })
        } else {
          this.dataSuggestAll = [];
          this.dataSuggest = [];
        }
      });
  }

  preventScroll = () => {
    window.onunload = function () { window.scrollTo(0, 500); }

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }

  loadNext = (event) => {
    // // // // // //console.log('Load next')

    if (this.companySelect.length !== 0 && this.cardSkeleton.length === 0) {
      const startPos = event.target.scrollTop;
      const pos = (event.target.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      const max = event.target.scrollHeight;
      // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
      if (pos >= max) {
        if (!this.spinnerLoading) {
          // Coding something 😋😋😋

          if (this.currentTab === 'R' && this.textDataEnd === '') {

            if (this.dataIncludesId.length >= 8) {
              this.setSkeleton(true);
              // this.spinnerLoading = true;

              this.getDataByRound().then((r) => {
                // this.filterMain();
              })
            } else {
              this.textDataEnd = '022';
              // setTimeout(() => {
              // this.setSkeleton(false);

              // }, 1000)
            }
          } else {
            if (this.dataIncludesIdSave.length >= 8) {
              // this.spinnerLoading = true;
              this.setSkeleton(true);
              this.getDataByRoundSave().then((r) => {
                // this.filterMain();
              }).finally(() => {
                this.setSkeleton(false);
              });;
            } else {
              this.textDataEnd = '022';
              // setTimeout(() => {
              //   this.setSkeleton(false);

              // }, 1000)
            }
          }
          // this.spinnerLoading = false;
        }
      }

      if (startPos !== 0) {
      }

    }
  };

  getPlaceHolder = () => (!this.isObjectEmpty(this.currentSearch) ? '' :
    this.getTitlePlaceholderSearch()
  );
  getTitleSearchBtn = () => this.translateService.translate('002');

  getTitlePlaceholderSearch = () => this.translateService.translate('001');

  handleInput = (value) => {

    this.addressSearch = value;
  };

  // Highlight name option when user type
  highlightName = (name) => {
    if (/[a-zA-Z0-9]/.test(name)) {
      const res = name.replace(new RegExp(this.addressSearch.trim(), 'gmi'), (match) => {
        // // // // // //console.log(match)
        return `<b class="hightlighted" style="background:yellow">${match}</b>`;
      });

      return res;
    }
    return name;
  };

  // Get Data by round and base on all of result
  getDataByRound = async (take = 8) => {
    // // // // //console.log(this.filterCommon);
    if (this.currentRound !== this.round) {
      this.currentRound = this.round;
      // return data by round
      const from = 0 + take * (this.round - 1);
      const to = this.round * take;
      const ids = this.dataIncludesId
        .map((d) => d.value)
        .slice(from, to)
        .filter((x) => !!x); // value is user_profile key
      // // // //console.log(this.dataIncludesId)
      const detail = await this.getDetailMatching(ids);
      if (detail.length === 0 && this.dataFilter.length !== 0) {
        this.textDataNull = '';
        this.textDataNullSave = '';
        this.textDataEnd = '022';
        this.setSkeleton(false);
      }
      if (this.dataFilter.length < this.dataIncludesId.length) {

        if (detail.length !== 0) {
          // push total score to detail

          const uq = AitAppUtils.getUniqueArray([...this.dataFilter, ...(detail || [])], '_key').filter((f) => f?.user_id);
          if (uq.length === 0) {
            this.textDataNull = '021';
          }
          const data = uq.map((d) => ({
            ...d,
            total_score: this.dataIncludesId.find((f) => f.value === d.user_id)?.total_score,
            group_no: this.dataIncludesId.find((f) => f.value === d.user_id)?.group_no
            // current_salary: 100000,
            // salary : 1000000
          }));
          this.dataFilter = data || this.dataFilterDf;
          this.dataFilterDf = data || this.dataFilterDf;

          // // // // // //console.log(this.filterCommon);
          if (!AitAppUtils.isObjectEmpty(this.filterCommon)) {
            this.filterMain();
          }

          this.setSkeleton(false);
          this.round++;

        }

      }
      else {
        this.textDataEnd = '022';
        this.setSkeleton(false);
      }
    }
    this.isSearchButton = false;
  };

  handleClickButton = () => {
    const target = this.currentSearch;
    this.removeSearch(true);
    this.addCompany(target)
  }

  // Get Data by round and base on all of result
  getDataByRoundSave = async (take = 8) => {
    // return data by round

    const from = 0 + take * (this.round - 1);
    const to = this.round * take;
    const ids = this.dataIncludesIdSave.map((m) => m?.value).slice(from, to); // value is user_profile key
    // // // // // //console.log(ids, from, to, this.dataFilterSave);
    const detail = await this.getDetailMatching(ids);

    if (detail.length === 0) {
      this.textDataNull = '';
      this.textDataNullSave = '';
      this.textDataEnd = '022';
      this.setSkeleton(false);
    }
    else {
      // push total score to detail
      const uq = AitAppUtils.getUniqueArray([...this.dataFilterSave, ...(detail || [])], '_key').filter((f) => f?.user_id);
      if (uq.length === 0) {
        this.textDataNullSave = '021';
      }
      // // // // // //console.log(uq)
      const data = uq.map((d) => ({
        ...d,
        total_score: this.dataIncludesIdSave.find((f) => f.value === d.user_id)?.total_score,
        group_no: this.dataIncludesIdSave.find((f) => f.value === d.user_id)?.group_no
      }));

      const target = (data || []).sort((a, b) => (a.group_no || 99) - (b.group_no || 99));

      this.dataFilterSave = target || this.dataFilterSave;
      this.dataFilterSaveDf = target || this.dataFilterSaveDf;
      this.round++;
      // this.setSkeleton(false);
      if (!AitAppUtils.isObjectEmpty(this.filterCommon)) {
        this.filterMain();
      }
      this.setSkeleton(false);
    }


  };

  sortByGroup = (data: any[]) => {
    if (!data) {
      return []
    }
    return data.sort((d1, d2) => d1?.group_no - d2.group_no);
  }

  // thêm nút scroll to top : TODO

  resetRound = () => (this.round = 1);

  getValue = (value) => {
    //console.log(value);
  };
  getTabSelect = (tab) => {
    this.dataFilterSave = [];
    this.dataFilterSaveDf = [];
    this.dataFilterDf = [];
    this.dataFilter = [];
    this.textDataNull = '';
    this.textDataNullSave = '';
    this.textDataEnd = '';
    this.currentRound = 0;

    this.isLoading = true;
    this.resetRound();

    // // // // // //console.log(tab);
    this.currentTab = tab.value;
    if (this.currentTab !== 'R') {
      this.setSkeleton(true);
      this.matchingCompanyService.getDataTabSave(this.company_key).then((r) => {
        if (r.status === RESULT_STATUS.OK) {
          if (r.data && r.data.length !== 0) {
            const _keys = (r.data || []).map((d) => d?.vertex?.user_profile?.user_id).filter((x) => !!x);
            // // // // // //console.log(_keys)
            if (_keys.length !== 0) {
              this.matchingCompanyService.matchingCompany(this.company_key, _keys).then((r) => {
                if (r.status === RESULT_STATUS.OK) {
                  this.dataIncludesIdSave = r.data || [];

                  if (this.dataIncludesIdSave.length !== 0) {
                    this.getDataByRoundSave().then((r) => {
                      // this.isLoading = false;
                      // this.setSkeleton(false);
                    });
                  } else {
                    this.setSkeleton(false);
                    this.textDataNullSave = '021';
                  }
                }
              });
            } else {
              this.setSkeleton(false);
              this.textDataNullSave = '021';
            }
          } else {
            this.setSkeleton(false);
            this.textDataNullSave = '021';
          }
        }
      });
    } else {
      this.setSkeleton(true);
      this.submitSearch();
      this.isLoading = false;
    }
  };
}
