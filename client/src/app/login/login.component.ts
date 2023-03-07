import { Component } from '@angular/core';
import {NetworkingService} from "../../services/networking.service";
import * as shajs from "sha.js";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    login: boolean = true;
    username: string = "";
    firstName: string = "";
    lastName: string = "";
    eMailAddress: string = "";
    password: string = "";
    passwordConfirmation: string = "";


    constructor(private networkingService: NetworkingService, private router : Router) {
    }

    changeLogin(login: boolean){
        this.login = login;
    }


    // login and signup handling temporary
    // can be changed if necessary

    async handleLogin() {

        // console.log( shajs("sha256").update(this.password).digest("hex"));

        console.log(this.eMailAddress)
        console.log(this.password);

        if (!await this.networkingService.login(this.eMailAddress, shajs("sha256").update(this.password).digest("hex"))){
            alert("E-Mail-Adresse oder Passwort ungueltig!")
        } else {
            await this.router.navigate(["dashboard"])
        }
        //     handel the login and checking if login is valid
    }

    handleSignUp() {
        if (this.checkPassword()){

        }
    }

    checkPassword() : boolean{
        if (this.password !== "" && this.passwordConfirmation !== ""){
            return this.password === this.passwordConfirmation;
        }
        return false;
    }

    async logInSignUp() {
        if (this.login) {
            await this.handleLogin();
        } else {
            this.handleSignUp();
        }
    }
}
