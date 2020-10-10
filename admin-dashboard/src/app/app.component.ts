import { DashboardService } from './services/dashboard.service';
import { SystemCpu } from './interface/system-cpu';
import { SystemHealth } from './interface/system-health';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import * as Chart from 'chart.js';
  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  public traceList: any[];
  public selectedTrace: any;
  public systemHealth: SystemHealth;
  public systemCpu: SystemCpu;
  public processUptime: string;
  public http200Traces: any[] = [];
  public http400Traces: any[] = [];
  public http404Traces: any[] = [];
  public http500Traces: any[] = [];
  public httpDefaultTraces: any[] = [];
  public timestamp: number;


  constructor(private dashboardService:DashboardService){}

  ngOnInit(): void {
    this.getTraces();
    this.getCpuUsage();
    this.getSystemHealth();
    this.getProcessUpTime(true);
  }

  private getTraces():void {
    this.dashboardService.getHttpTraces().subscribe(
      (response:any) => {
        console.log(response.traces);
        this.processTraces(response.traces);
        this.initializeBarChart();
        this.initializePieChart();
      },
      (error:HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }


  private initializeBarChart(): void {
     const barChartElement = document.getElementById('barChart');
     return new Chart(barChartElement, {
      type: 'bar',
      data: {
          labels: ['200', '404', '400', '500'],
          datasets: [{
              data: [this.http200Traces.length, this.http404Traces.length, this.http400Traces.length, this.http500Traces.length],
              backgroundColor: ['rgb(40, 167,69)','rgb(0,123,255)','rgb(253,126,20)','rgb(220,53,69)'],
              borderColor: ['rgb(40, 167,69)','rgb(0,123,255)','rgb(253,126,20)','rgb(220,53,69)'],
              borderWidth: 3
          }]
      },
      options: {
          title: {display:true, test: [`Last 100 Requests as of ${`Last 100 Requests as of ${this.formatDate(new Date())}`}`]},
          legend: {display:false},
          scales: {
              yAxes: [{ ticks: {beginAtZero: true } }]
          }
      }
  });

  }



  private initializePieChart(): void {
    const pieChartElement = document.getElementById('pieChart');
    return new Chart(pieChartElement, {
     type: 'pie',
     data: {
         labels: ['200', '404', '400', '500'],
         datasets: [{
             data: [this.http200Traces.length, this.http404Traces.length, this.http400Traces.length, this.http500Traces.length],
             backgroundColor: ['rgb(40, 167,69)','rgb(0,123,255)','rgb(253,126,20)','rgb(220,53,69)'],
             borderColor: ['rgb(40, 167,69)','rgb(0,123,255)','rgb(253,126,20)','rgb(220,53,69)'],
             borderWidth: 3
         }]
     },
     options: {
         title: {display:true, test: [`Last 100 Requests as of  ${this.formatDate(new Date())}`]},
         legend: {display:true},
         display:true
     }
 });

 }


 private formatDate(date: Date): string {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const year = date.getFullYear();
  if (dd < 10) {
    const day = `0${dd}`;
  }
  if (mm < 10) {
    const month = `0${mm}`;
  }
  return `${mm}/${dd}/${year}`;
}



  private getCpuUsage():void {
    this.dashboardService.getSystemCpu().subscribe(
      (response:SystemCpu) => {
        console.log(response);
        this.systemCpu = response;
      },
      (error:HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }


  private getSystemHealth():void {
    this.dashboardService.getSystemHealth().subscribe(
      (response:SystemHealth) => {
        console.log(response);
        this.systemHealth = response;
        this.systemHealth.components.diskSpace.details.free = this.formatBytes(this.systemHealth.components.diskSpace.details.free);
      },
      (error:HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }

   private formatBytes(bytes: any): string {
    if (bytes === 0) {
       return '0 Bytes';
      }
    const k = 1024;
    const dm = 2 < 0 ? 0 : 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


public onRefreshDate():void{
  this.http200Traces = [];
  this.http400Traces = [];
  this.http404Traces = [];
  this.http500Traces = [];
  this.httpDefaultTraces= [];
  this.getTraces();
  this.getCpuUsage();
  this.getSystemHealth();
  this.getProcessUpTime(false);
}



private getProcessUpTime(isUpdateTime: boolean):void {
  this.dashboardService.getProcessUptime().subscribe(
    (response:any) => {
      console.log(response);
      this.timestamp = Math.round(response.measurements[0].value);
      this.processUptime = this.formateUptime(this.timestamp);
      if(isUpdateTime){
        this.updateTime();
      }
      
    },
    (error:HttpErrorResponse) => {
      alert(error.message)
    }
  );
}

  private updateTime(): void {
    setInterval( () =>{
      this.processUptime = this.formateUptime(this.timestamp + 1);
      this.timestamp++;
    }, 1000 );
  }


private formateUptime(timestamp: number): string {
  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60) - (hours * 60);
  const seconds = timestamp % 60;
  return hours.toString().padStart(2, '0') + 'h' +
  minutes.toString().padStart(2, '0') + 'm' + seconds.toString().padStart(2, '0') + 's';
}





  processTraces(traces: any) {
    this.traceList = traces;
    this.traceList.forEach(trace =>{
      switch(trace.response.status){
       case 200:
          this.http200Traces.push(trace);
          break;
      
        case 200:
          this.http200Traces.push(trace);
          break;  

        case 400:
          this.http400Traces.push(trace);
          break;

        case 404:
          this.http404Traces.push(trace);
          break;  


        case 500:
          this.http500Traces.push(trace);
          break; 

          default:
            this.httpDefaultTraces.push(trace);
             
      }
    });
  }



public onSelectTrace(trace:any): void{
  this.selectedTrace = trace;
  document.getElementById('trace-modal').click();
}






}
