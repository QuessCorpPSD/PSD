import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { Iadvanceutilizationreport } from '../../Repository/Reports/Iadvanceutilizationreport';

@Injectable({
  providedIn: 'root'
})
export class AdvanceUtilizationReportService implements Iadvanceutilizationreport {
  env = environment;
  constructor(private http: HttpClient) { }

  GetPayPeriod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/GetPayPeriod');
  }
  Exporttoexcel(PayPeriod: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}AdvanceUtilizationReport/ExportToExcel/${PayPeriod}`
    );
  }
}
