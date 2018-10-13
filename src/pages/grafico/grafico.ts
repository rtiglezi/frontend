import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import chartJs from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-grafico',
  templateUrl: 'grafico.html',
})
export class GraficoPage {

  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
    setTimeout(()=>{
      this.lineChart = this.getLineChart();
    }, 150);

  }


  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getLineChart(){
    const data = {
      labels: this.navParams.data.meses,
      datasets: [{
        label: 'Receitas Correntes',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'blue',
        borderColor: 'blue',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.navParams.data.receitas,
        scanGaps: false,
      },
      {
        label: 'Despesas Correntes',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'red',
        borderColor: 'red',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.navParams.data.despesas,
        scanGaps: false,
      }
    ]}

    return this.getChart(this.lineCanvas.nativeElement, 'line', data)
  };

}
