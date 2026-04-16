import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IreportService } from '../../Repository/Reports/Ireportservice';

@Injectable({
  providedIn: 'root'
})
export class ReportService implements IreportService {
  env = environment;
  constructor(private http: HttpClient) {
  }
  Reportlist(flag: string, username: string | number) {
    return this.http.get<any>(
      `${this.env}SalaryRequestInvoice/GetCommonDropDownList/${flag}/${username}`
    );
  }
  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env + 'Report/DownloadQzoneReports', payload);
  }
  GrossMarginReport(payload: any): Observable<APIResponse>{
    var inputval = JSON.stringify(payload);
    const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.env.apiUrl + 'Reports/GetGrossMarginReport', inputval,{ headers: config });
  }
    Accuralsupload(payload: any): Observable<APIResponse>{
    var inputval = JSON.stringify(payload);
    const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.env.apiUrl + 'Reports/AccuralsUpload', inputval,{ headers: config });
  }
   AccuralTemplate() {
    return this.http.get<any>(
      `${this.env.apiUrl}Reports/GetAccrualsTemplate`
    );
  }

}
