import { DashboardService } from './services/dashboard.service';
import { SystemCpu } from './interface/system-cpu';
import { SystemHealth } from './interface/system-health';
import { Component, OnInit } from '@angular/core';

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


  constructor(private dashboardService:DashboardService){}

  ngOnInit(): void {
    this.getTraces();
  }

  private getTraces():void {
    this.dashboardService.getHttpTraces().subscribe(
      (response:any) => {
        console.log(response.traces);
        this.processTraces(response.traces);
      }
    );
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


}
