import { RESULT_STATUS } from '@ait/shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  AitAppUtils,
  AitBinaryDataService,
  AitCurrencySymbolService,
  AitDateFormatService, AitNumberFormatPipe, AitTranslationService, AppState, getCaption, getEmpId
} from '@ait/ui';
import { DomSanitizer } from '@angular/platform-browser';
import * as dayjs from 'dayjs';
import { COLOR, FIELD, fields } from '../../../interface';
import { ReactionService } from '../../../../../services/aureole-v/reaction.service';


export const color = {
  green: 'linear-gradient(90deg, #78C047 50%, #97D791 84%)',
  orange: 'linear-gradient(90deg, #F5B971 50%, #ED9D3C 84%)',
  blue: 'linear-gradient(89.75deg, #002B6E 0.23%, #2288CC 99.81%)'
};



@Component({
  selector: 'ait-aureolev-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class AureoleVCardComponent implements OnInit, OnChanges {

  @Input() card;
  i18n = 'common.aureole-v.recommenced-user.list-info.'
  colorCard = COLOR.color1;
  backgroundCard = color.green;
  userId = '';
  fieldCard: any[] = fields;
  @Input() addressSearch = '';
  @Input() company_key = '';
  @Input() user_key = '';
  @Output() actionSaveEvent = new EventEmitter();
  fieldDate = ['生年月日'];
  avatarURL = 'https://ui-avatars.com/api/?name=';
  avatar = ''
  isLoadingAvatar = true;
  cardH;
  originUrl = location.origin + this.binaryService.downloadUrl;
  master_data_fields = ['gender', 'occupation', 'prefecture', 'residence_status', 'work'];
  key_avatar = '';
  timeDiff = 0;
  comma = '、'
  @Input() isJob = false;

  // testImage(URL) {
  //   // console.log(this.avatar, this.card.name)
  //   const tester = new Image();
  //   tester.onerror = this.imageNotFound;
  //   tester.src = URL;
  // }

  imageNotFound(e) {
    // // console.log('no image ' + this.card.name, e)
    this.isLoadingAvatar = false;
    this.avatar = this.card?.name ? this.avatarURL + this.card?.name.replace(' ', '+') : this.avatarURL + '';
    // // console.log(this.avatar, this.card.name)
  }

  getAvatar = () => {
    const avatar = this.card?.avatar
      && this.card?.avatar.length !== 0
      && this.card?.avatar instanceof Array
      ? this.card?.avatar[0]
      : null;
    this.avatar = this.originUrl + avatar;
  }

  getAvatarDefault = () => {
    return this.card?.name ? this.avatarURL + this.card?.name.replace(' ', '+') : this.avatarURL + '';
  }

  getDate = (d) => this.dateFormatService.formatDate(d, 'display');


  getNumberValue = (data) => {
    return this.numberFormatService.transform(data) + this.currencySymbolService.getCurrencyByLocale();
  }

  constructor(
    store: Store<AppState>,
    private reactionService: ReactionService,
    private router: Router,
    private binaryService: AitBinaryDataService,
    private santilizer: DomSanitizer,
    private translateService: AitTranslationService,
    private dateFormatService: AitDateFormatService,
    private numberFormatService: AitNumberFormatPipe,
    private currencySymbolService: AitCurrencySymbolService
  ) {
    store.pipe(select(getEmpId)).subscribe(id => this.userId = id);
    store.pipe(select(getCaption)).subscribe(() => {
      const comma = translateService.translate('s_0001');
      if (comma !== 's_0001') {
        this.comma = comma;
      }
    })
  }
  ngOnInit() {
    this.avatar = this.card?.name ? this.avatarURL + this.card?.name.replace(' ', '+') : this.avatarURL + '';
    if (!this.isJob) {
      const current = dayjs(Date.now());
      const target = this.card?.stay_period ? dayjs(this.card?.stay_period) : null;

      this.timeDiff = target ? target.diff(current, 'month', true) : null;
    }

    this.cardH = this.card;
    // this.getAvatar();
    this.addColor();
    this.fieldCard = this.fieldCard.map(m =>
      ({ key: m, value: this.card[FIELD[m]], field: FIELD[m] })).filter(v => v.value);
  }


  getFieldName = (name) => this.translateService.translate(name);

  getValueArray = (data: any[]) => {
    const source = AitAppUtils.getUniqueArray(data, 'value');
    if (source && source.length !== 0) {
      const target = source.map(d => d?.value).filter(v => v);
      return target.join(`${this.comma} `);
    }
    return null;
  }

  getTimeDif2 = () => {
    // timeDif > 1 && timeDif <= 3 thi` 1 border
    // otherwise 2 border
    if (this.timeDiff <= 0 || this.timeDiff > 3) {
      return {
        isBorder1: false,
        isBorder2: false
      }
    }
    else if (this.timeDiff > 1 && this.timeDiff <= 3) {
      return {
        isBorder1: true,
        isBorder2: false
      }
    }
    else {
      return {
        isBorder1: true,
        isBorder2: true,
        isBoth: true
      }
    }
  }


  ngOnChanges(object: SimpleChanges) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (key === 'addressSearch') {
          // // // console.log(element);
          // // // console.log(this.highlightName(element))
        }
      }
    }
  }

  navigateProfile = (user_id: string) => {
    if (!this.isJob) {
      this.router.navigateByUrl('/user/' + user_id);
    }
    else {
      this.router.navigate(['job'], {
        queryParams: {
          job_id: this.card?._key,
          company_id: this.card?.job_company
        }
      });
    }
  }

  addColor = () => {

    if (this.card?.group_no === 1) {
      this.backgroundCard = color.orange;
      this.colorCard = COLOR.color2;
    } else if (this.card?.group_no === 2) {
      this.backgroundCard = color.green;
      this.colorCard = COLOR.color1;
    } else {
      this.backgroundCard = color.blue;
      this.colorCard = COLOR.color3;
    }

  }

  // Highlight name option when user type
  highlightName = (name) => {
    // // // console.log(this.addressSearch);
    const res = name.replace(new RegExp(this.addressSearch.trim(), 'gmi'), (match) => {
      return `<b class="hightlighted" style="background:yellow">${match}</b>`;
    });
    // // // console.log(res)
    return res;

  }

  getIndustry = () => {
    return this.card.company.replace('（', ',').replace('）', '').split(',')[1];
  }


  actionButtonSave = (user_key: string) => {
    if (!this.card.is_saved) {
      if (!this.isJob) {
        this.reactionService.saveCompanyUser([{
          company_id: this.company_key,
          user_key: this.card.user_id,
        }]).then(r => {
          if (r.status === RESULT_STATUS.OK) {
            this.card.is_saved = !this.card?.is_saved;
            this.actionSaveEvent.emit({
              user_id: this.card.user_id,
              is_saved: this.card.is_saved,
            });
          }
        });
      }
      else {
        this.reactionService.saveUserJob([{
          job_id: this.card._key,
          user_key: this.user_key,
        }]).then(r => {
          if (r.status === RESULT_STATUS.OK) {
            this.card.is_saved = !this.card?.is_saved;
            this.actionSaveEvent.emit({
              job_key: this.card._key,
              is_saved: this.card.is_saved,
            });
          }
        });
      }
    } else {
      if (!this.isJob) {
        this.reactionService.removeSaveCompanyUser([{
          company_id: this.company_key,
          user_key: this.card.user_id,
        }]).then(r => {
          if (r.status === RESULT_STATUS.OK) {
            this.card.is_saved = !this.card?.is_saved;
          }
          this.actionSaveEvent.emit({
            user_id: this.card.user_id,
            is_saved: this.card.is_saved,
          });
        });
      }
      else {
        this.reactionService.removeSaveUserJob([{
          job_id: this.card._key,
          user_key: this.user_key,
        }]).then(r => {
          if (r.status === RESULT_STATUS.OK) {
            this.card.is_saved = !this.card?.is_saved;
          }
          this.actionSaveEvent.emit({
            job_key: this.card._key,
            is_saved: this.card.is_saved,
          });
        });
      }
    }


  }
}
