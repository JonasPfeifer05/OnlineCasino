import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import {LoginComponent} from "./login/login.component";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AuthInterceptor} from "../services/auth.interceptor";


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        GameHistoryComponent,
        LoginComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        RouterModule
    ],
  providers: [
      {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
      }


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
