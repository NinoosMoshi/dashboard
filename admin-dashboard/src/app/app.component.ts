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
        this.processTraces(response);
      }
    );
  }
  processTraces(response: any) {
    // throw new Error('Method not implemented.');
  }


}
