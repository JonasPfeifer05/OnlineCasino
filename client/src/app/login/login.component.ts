import {Component} from '@angular/core';
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


    constructor(private networkingService: NetworkingService, private router: Router) {
    }

    changeLogin(login: boolean) {
        this.login = login;
    }


    // login and signup handling temporary
    // can be changed if necessary

    async handleLogin() {
        let result = await this.networkingService.login(this.eMailAddress, shajs("sha256").update(this.password).digest("hex"));
        if (!result[0]) {
            alert(result[1])
        } else {
            await this.router.navigate(["dashboard"])
        }
        //     handel the login and checking if login is valid
    }

    async handleSignUp() {
        let result = await this.networkingService.signUp(this.username, this.firstName, this.lastName, this.eMailAddress, shajs("sha256").update(this.password).digest("hex"));
        if (this.checkPassword()) {
            if (result[0]) {
                await this.router.navigate(["dashboard"])
            } else {
                alert(result[1])
            }
        } else {
            alert("Password Confirmation wrong!")
        }
    }

    checkPassword(): boolean {
        if (this.password !== "" && this.passwordConfirmation !== "") {
            return this.password === this.passwordConfirmation;
        }
        return false;
    }

    async logInSignUp() {
        if (this.login) {
            await this.handleLogin();
        } else {
            await this.handleSignUp();
        }
    }
}
