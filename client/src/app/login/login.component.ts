import { Component } from '@angular/core';

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


    changeLogin(login: boolean){
        this.login = login;
    }


    // login and signup handling temporary
    // can be changed if necessary

    handleLogin() {
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
}
