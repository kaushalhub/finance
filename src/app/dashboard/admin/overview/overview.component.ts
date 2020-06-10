import { Component, OnInit, Input, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-admin-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class AdminOverviewComponent implements OnInit {
  @Input() public data;
  @Input() public profile;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
      ],
      chart: {
        type: "area"
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: "MMM dd"
        },
        categories: [
        ]
      },
      tooltip: {
        x: {
          format: "MM/dd/yy"
        }
      }
    };
  }

  ngOnInit(): void {
    const { newUsers } = this.data;
    this.chartOptions.series = [
      {
        name: "Type 1",
        data: newUsers.type1
      },
      {
        name: "Type 2",
        data: newUsers.type2
      }
    ];
    this.chartOptions.xaxis.categories = newUsers.dates;
  }

}
