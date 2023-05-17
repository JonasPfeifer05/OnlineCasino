import {Component, OnInit} from '@angular/core';
import {User} from "../../objects/user";
import {NetworkingService} from "../../services/networking.service";
import {Chart, ChartConfiguration, ChartData, registerables} from "chart.js"
import {GameHistory} from "../../objects/game-history";
import {LoggerService} from "../../services/logger.service";
import {LoggingType} from "../../objects/logging-type";
import {min} from "rxjs";

Chart.register(...registerables)

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    user: User = User.default();
    histories: GameHistory[] = [];

    historyCount = 15;

    constructor(private http: NetworkingService, private logger: LoggerService) {}

    async ngOnInit() {
        this.http.handle(await this.http.evaluate(await this.http.getUserData()), user_result => {
            this.logger.log("Got user data!", LoggingType.INFORMATIONAL);
            this.user = user_result;
            if (!this.user.money) this.user.money = 0;
        }, "Failed to get user with token!");

        this.http.handle(await this.http.evaluate(await this.http.getUserHistory(this.historyCount)), histories_result => {
            this.logger.log("Got user game histories!", LoggingType.INFORMATIONAL);
            this.histories = histories_result;

            this.histories = this.histories.map(value => {
                let tmp = value;
                tmp.won = (value.won as any)["data"][0] === 1;
                return tmp;
            });

            this.renderChart();
        }, "Couldnt get user History");
    }

    renderChart() {
        const historyCount = Math.min(this.historyCount, this.histories.length);

        const labels = Array.from({length: historyCount}, (_, i) => historyCount - i);
        const profitData = Array.from({length: historyCount}, (_, i) => this.histories[historyCount-i-1].profit/100)

        const data: ChartData = {
            labels: labels,
            datasets: [{
                label: 'profit curve',
                data: profitData
            }]
        };

        const config: ChartConfiguration = {
            type: 'line',
            data: data,
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            count: 4,
                        },
                        title: {
                            display: true,
                            text: "profit (€)"
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: "nth last game"
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4,
                        borderWidth: 3,
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
