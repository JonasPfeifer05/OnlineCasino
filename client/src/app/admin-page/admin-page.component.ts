import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent {
    usernamePart: string = "";
    activateStatus: string = "all";

    search() {

    }

    handlePress(event: KeyboardEvent) {
        if (event.code.toLowerCase() !== "enter") return;
        this.search();
    }
}
