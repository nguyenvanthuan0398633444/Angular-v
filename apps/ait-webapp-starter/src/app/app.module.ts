import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ExtraOptions, RouterModule } from '@angular/router';
import { AitUiModule } from '@ait/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { rootReducers } from '@ait/ui';
import { AitAuthModule } from '@ait/auth';
import { AitExamplePageModule } from './pages/example/ait-example.module';
import { environment } from '../environments/environment';
import { NbMenuModule } from '@nebular/theme';
import { TestComponent } from './pager/aureole-v/job/test/test.component';
import { JComponent } from './apps/ait-matching-webap/pager/aureole-v/j/j.component';

const AIT_UI_MODULES = [];

const AIT_UI_SERVICES = [];

const STARTER_PAGES = [];

// DO NOT DELETE
const config: ExtraOptions = {
  useHash: true,
  relativeLinkResolution: 'legacy',
};
// DO NOT DELETE

//*
@NgModule({
  declarations: [AppComponent, ...STARTER_PAGES, TestComponent, JComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AitUiModule.forRoot(environment),
    RouterModule.forRoot([], config),
    AitExamplePageModule,
    AitAuthModule.forRoot(environment),
    StoreModule.forRoot(
      { ...rootReducers },
      {
        initialState: {},
      }
    ),
    ...AIT_UI_MODULES,
    NbMenuModule
  ],
  providers: [...AIT_UI_SERVICES],
  bootstrap: [AppComponent],
})
export class AppModule {
}
