import {Component, Input} from '@angular/core';
import {User} from "../../objects/user";

@Component({
  selector: 'app-user-admin-display',
  templateUrl: './user-admin-display.component.html',
  styleUrls: ['./user-admin-display.component.scss']
})
export class UserAdminDisplayComponent {
    @Input() user: User = User.default();
}
