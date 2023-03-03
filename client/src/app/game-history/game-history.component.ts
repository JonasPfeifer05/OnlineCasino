import {Component, Input} from '@angular/core';
import {GameHistory} from "../../objects/game-history";

@Component({
  selector: 'game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent {
    @Input() history: GameHistory = GameHistory.getDefault();
    img: string = "assets/increase.png";

    constructor() {

    }

    ngOnInit() {
        this.img = this.history.won ? "assets/increase.png" : "assets/decrease.png";
    }
}
