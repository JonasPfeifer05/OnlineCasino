import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import {AuthInterceptor} from "../services/auth.interceptor";


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GameHistoryComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
      {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
