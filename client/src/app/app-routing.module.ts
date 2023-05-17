import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TokenGuard} from "../services/token.guard";
import {AdminPageComponent} from "./admin-page/admin-page.component";

const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "dashboard", component: DashboardComponent, canActivate: [TokenGuard]},
    {path: "admin", component: AdminPageComponent},
    {path: "**", redirectTo: "/login", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
