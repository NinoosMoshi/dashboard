import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemHealth } from '../interface/system-health';
import { SystemCpu } from '../interface/system-cpu';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private SERVER_RUL = environment.serverUrl;

  constructor(private http:HttpClient) { }

 public getHttpTraces(): Observable<any> {
   return this.http.get<any>(`${this.SERVER_RUL}/httptrace`);
 }


 public getSystemCpu(): Observable<SystemCpu> {
  return this.http.get<SystemCpu>(`${this.SERVER_RUL}/metrics/system.cpu.count`);
}


public getProcessUptime(): Observable<any> {
  return this.http.get<any>(`${this.SERVER_RUL}/metrics/process.uptime`);
}


public getSystemHealth(): Observable<SystemHealth> {
  return this.http.get<SystemHealth>(`${this.SERVER_RUL}/health`);
}




}
