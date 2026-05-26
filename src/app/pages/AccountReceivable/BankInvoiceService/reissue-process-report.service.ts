import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReissueProcessReport } from '../../Repository/BankInvoice/IReissueProcessReport';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ReissueProcessReportService implements IReissueProcessReport {
  env = environment;

  constructor(private http: HttpClient) { }

  ReissueProcessSearch(fromdate: any, todate: any, status: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ReissueProcessReport/ReissueProcessSearch/' +
      fromdate + '/' +
      todate + '/' +
      status
    );
  }
  // reissue-process-report.service.ts

  ReissueProcessReportExport(
    fromdate: any,
    todate: any,
    status: any
  ): Observable<APIResponse> {

    const payload = {
      fromdate: fromdate,
      todate: todate,
      status: status
    };

    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'ReissueProcessReport/ReissueProcessReportExport',
      payload
    );
  }
  ImportReissueProcess(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'ReissueProcessReport/ImportReissueProcess',
      payload
    );
  }


  GetReissueDeleteTemplate(flag: string, userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'BatchGeneration/GetTemplate/' + flag + '/' + userId
    );
  }



}
