import {Component} from '@angular/core';
import {User} from "../../objects/user";
import {NetworkingService} from "../../services/networking.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-user-interface',
  templateUrl: './user-interface.component.html',
  styleUrls: ['./user-interface.component.scss']
})
export class UserInterfaceComponent {


    constructor(private networking: NetworkingService) {
    }

    user: User = User.default();

    username: string = this.user.username;
    last_name: string = this.user.last_name;
    first_name: string = this.user.first_name;
    email: string = this.user.email;
    changeActive: boolean = true;

    changeActivate() {
        this.changeActive = !this.changeActive;
    }

    async change() {

        let user: Observable<User> = await this.networking.getUserData()

        if (await this.networking.change(this.username, this.first_name, this.last_name, this.email)){
            this.changeActivate()
        } else {
            alert("Error occurred!")
        }
    }
}
