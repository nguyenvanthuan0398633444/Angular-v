/* eslint-disable @typescript-eslint/no-empty-function */
export const MENU_USER: MenuUser[] = [
  {
    header_title: 'c_1003',
    tabs: [
      {
        iconName: 'settings-outline',
        title: 'c_1007',
        action: () => { },
        url: '/user-setting'
      },
      {
        iconName: 'edit-outline',
        title: 'c_1005',
        action: () => { },
        url: '/change-password'
      },
      {
        iconName: 'log-out-outline',
        title: 'c_1006',
        action: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.setItem('isRemember', JSON.stringify(false));
          location.reload();
        },
      },
    ],
  },
  {
    header_title: 'c_1008',
    tabs: [
      {
        iconName: 'building',
        title: '組合員登録',
        action: () => { },
        url: '/company-new',
        pack: 'font-awesome'
      },
      {
        iconName: 'person-add-outline',
        title: '実習生情報',
        action: () => { },
        url: '/candidate',
      }
      ,
      {
        iconName: 'briefcase-outline',
        title: '求人要件登録',
        action: () => { },
        url: '/job/new',
      },
      {
        iconName: 'upload-outline',
        title: 'c_1009',
        action: () => { },
        url: '/sync-pe-api-setting'
      },
      {
        iconName: 'clock-outline',
        title: 'c_1010',
        action: () => { },
        url: '/sync-pe-api-history'
      },


    ]
  }
];

export interface MenuUser {
  header_title?: string;
  tabs?: MenuItem[]
}


export interface MenuItem {
  iconName?: string;
  title?: string;
  action?: any;
  url?: string;
  pack?: string;
}
