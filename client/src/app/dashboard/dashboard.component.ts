import {Component} from '@angular/core';
import {User} from "../../objects/user";
import {NetworkingService} from "../../services/networking.service";
import {Chart, ChartConfiguration, ChartData, registerables} from "chart.js"
import {GameHistory} from "../../objects/game-history";

Chart.register(...registerables)

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    user: User = User.default();
    histories: GameHistory[] = [];

    constructor(private http: NetworkingService) {
    }

    async ngOnInit() {
        this.http.handle(await this.http.evaluate(this.http.getTestUser()), (result) => {
            this.user = result;
        }, "Could not get User!");

        this.http.handle(await this.http.evaluate(this.http.getTestLastNGames(100)), (result) => {
            this.histories = result;
            this.renderChart();
        }, "Could not get Game History!")
    }

    renderChart() {
        const maxHistories = 30;
        const historyCount = this.histories.length < maxHistories ? this.histories.length: maxHistories;

        const labels = [];
        for (let i = historyCount; i >= 1; i--) {
            labels.push(i)
        }
        const data: ChartData = {
            labels: labels,
            datasets: [{
                label: 'Profit Curve',
                data: labels.map(value => this.histories[this.histories.length - value].profit),
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
}
