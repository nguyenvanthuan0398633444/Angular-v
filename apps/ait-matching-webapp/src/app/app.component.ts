/* eslint-disable @typescript-eslint/no-empty-function */
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AitLayoutService, AitUserService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { MENU_USER } from './@constants';

@Component({
  selector: 'ait-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends AitBaseComponent implements OnInit {
  title = 'ait-matching-webapp';
  excludeScreens = [
    'sign-in',
    'sign-up',
    'reset-password',
    'user-setting',
    'company-basic-info',
    'change-password'];

  menu_actions = [
    {
      icon: 'home-outline',
      title: 'c_1001',
      action: () => { },
      isI18n: true,
      link: '/',
    },
    {
      icon: 'building',
      title: '企業に相応な実習生を検索',
      action: () => { },
      isI18n: true,
      link: '/recommenced-user',
      pack: 'font-awesome'
    },
    {
      icon: 'user',
      title: '実習生に相応な企業/仕事を検索',
      action: () => { },
      isI18n: true,
      link: '/recommenced-job',
      pack: 'font-awesome'
    },
  ]
  constructor(
    layoutService: AitLayoutService,
    store: Store<AppState | any>,
    authService: AitAuthService,
    userService: AitUserService,
    apollo: Apollo,
    _env: AitEnvironmentService) {
    super(store, authService, apollo, userService, _env);
    layoutService.menuUserInput = MENU_USER;
    // localStorage.setItem('link', '/');
    // console.log = () => { };
  }

  ngOnInit() {
    this.initBaseComponent();
  }
}
