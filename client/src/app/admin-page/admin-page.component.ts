import {Component, OnInit} from '@angular/core';
import {NetworkingService} from "../../services/networking.service";
import {User} from "../../objects/user";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit{
    usernamePart: string = "";
    activateStatus: string = "all";

    allUsers: User[] =[];
    filteredUsers: User[] = [];

    constructor(private api: NetworkingService) {}

    async ngOnInit(){
        this.api.handle(await this.api.evaluate(await this.api.getUserData()), user => {
            this.filteredUsers = [user]
        }, "Failed to get user data!")

        this.api.handle(await this.api.evaluate(await this.api.getAllUserData()), users => {
            this.allUsers = users;
        }, "Failed to get all users!");
    }

    search() {
        console.log(this.activateStatus !== "activated");
        this.filteredUsers = this.allUsers.filter(user => user.username.toLowerCase().includes(this.usernamePart.toLowerCase()));
        if (this.activateStatus === "all") return;
        this.filteredUsers = this.filteredUsers.filter(user => {
            return user.deactivated == (this.activateStatus !== "activated");
        })
    }

    handlePress(event: KeyboardEvent) {
        if (event.code.toLowerCase() !== "enter") return;
        this.search();
    }
}
