import {Component} from '@angular/core';
import {User} from "../../objects/user";
import {NetworkingService} from "../../services/networking.service";
import {Chart, ChartConfiguration, ChartData, registerables} from "chart.js"
import {GameHistory} from "../../objects/game-history";
import {LoggerService} from "../../services/logger.service";
import {LoggingType} from "../../objects/logging-type";

Chart.register(...registerables)

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    user: User = User.default();
    histories: GameHistory[] = [];

    constructor(private http: NetworkingService, private logger: LoggerService) {
    }

    async ngOnInit() {

        console.log(NetworkingService.getAccessToken())
        // // Just for testing
        // await this.http.login("jonaspfeifer@drei.at", "532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25");

        this.http.handle(await this.http.evaluate(await this.http.getUserData()), result => {
            this.logger.log("Got user data!", LoggingType.INFORMATIONAL);
            this.user = result;
            if (!this.user.money){
                this.user.money = 0;
            }
        }, "Failed to get user with token!");

        this.http.handle(await this.http.evaluate(await this.http.getUserHistory(100)), result => {
            this.logger.log("Got user game histories!", LoggingType.INFORMATIONAL);
            this.histories = result;

            this.histories = this.histories.map(value => {
                let tmp = value;
                tmp.won = (value.won as any)["data"][0] === 1;
                return tmp;
            });

            this.renderChart();
        }, "Couldnt get user History");
    }

    renderChart() {
        const maxHistories = 20;
        const historyCount = this.histories.length < maxHistories ? this.histories.length: maxHistories;

        const labels = [];
        for (let i = historyCount; i >= 1; i--) {
            labels.push(i)
        }
        const data: ChartData = {
            labels: labels,
            datasets: [{
                label: 'Profit Curve',
                data: labels.map(value => this.histories[this.histories.length - value].profit/100),
            }]
        };

        const config: ChartConfiguration = {
            type: 'line',
            data: data,
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "Profit (€)"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "nth last Games"
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.2,
                        borderWidth: 2,
                        fill: true,
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        fullSize: true,
                        labels: {

                            // This more specific font property overrides the global property
                            font: {
                                size: 15,
                                family: "bahnschrift"
                            }
                        }
                    }
                }
            }
        };

        new Chart("chart", config);
    }

    blackjack() {

    }

    poker() {

    }

    roulette() {

    }

    slots() {

    }

    horse() {

    }

    companyIcon() {

    }

    logout() {
        NetworkingService.cleatTokens();
    }

    login() {

    }

    userIcon() {

    }
}
