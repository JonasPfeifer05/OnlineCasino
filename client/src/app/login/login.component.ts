import {Component} from '@angular/core';
import {NetworkingService} from "../../services/networking.service";
import * as shajs from "sha.js";
import {Router} from "@angular/router";
import {User} from "../../objects/user";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validator,
    ValidatorFn,
    Validators
} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    login: boolean = true;

    registerForm = new FormGroup({
        username: new FormControl("", Validators.required),
        firstName: new FormControl("", Validators.required),
        lastName: new FormControl("", Validators.required),
        eMail: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(8)]),
        passwordConfirm: new FormControl("", [Validators.required, Validators.minLength(8)])
    }, {validators: passwordMatch})

    loginForm = new FormGroup({
        eMail: new FormControl("", Validators.required),
        password: new FormControl("", [Validators.required, Validators.minLength(8)])
    })


    constructor(private networkingService: NetworkingService, private router: Router) {
    }

    changeLogin(login: boolean) {
        this.login = login;
    }


    // login and signup handling temporary
    // can be changed if necessary

    async handleLogin() {

        let result = await this.networkingService.login(<string>this.getLoginEmail?.value, shajs("sha256").update(<string>this.getLoginPassword?.value).digest("hex"))

        if (!) {
            alert("E-Mail-Adresse oder Passwort ungueltig!")
        } else {
            await this.router.navigate(["dashboard"])
        }
        //     handel the login and checking if login is valid
    }

    async handleSignUp() {
        if (await this.networkingService.signUp(<string>this.getRegisterUsername?.value, <string>this.getRegisterFirstname?.value, <string>this.getRegisterLastname?.value, <string>this.getRegisterEmail?.value, shajs("sha256").update(<string>this.getRegisterPassword?.value).digest("hex"))) {
            await this.router.navigate(["dashboard"])
        } else {
            alert("Username or E-Mail already in use!")
        }

    }


    async logInSignUp() {
        if (this.login) {
            await this.handleLogin();
        } else {
            await this.handleSignUp();
        }
    }

    get getRegisterUsername() {
        return this.registerForm.get("username");
    }

    get getRegisterFirstname() {
        return this.registerForm.get("firstName");
    }

    get getRegisterLastname() {
        return this.registerForm.get("lastName");
    }

    get getRegisterEmail() {
        return this.registerForm.get("eMail");
    }

    get getRegisterPassword() {
        return this.registerForm.get("password");
    }

    get getRegisterPasswordConfirm() {
        return this.registerForm.get("passwordConfirm");
    }

    get getLoginEmail() {
        return this.loginForm.get("eMail");
    }

    get getLoginPassword() {
        return this.loginForm.get("password");
    }
}

export const passwordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get("password");
    const passwordConfirm = control.get("passwordConfirm");

    return password && passwordConfirm && password.value !== passwordConfirm.value ? {passwordsDiffer: true} : null;
}

