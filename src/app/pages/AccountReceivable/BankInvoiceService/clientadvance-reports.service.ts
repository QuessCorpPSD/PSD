import { Injectable } from '@angular/core';
import { IClientAdvanceReport } from '../../Repository/BankInvoice/IClientAdvanceReport';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ClientadvanceReportsService implements IClientAdvanceReport {

  env = environment;

  constructor(private http: HttpClient) { }

  Search(companyId: any, fromDate: any, toDate: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePaymentReport/Search/' + companyId + '/' + fromDate + '/' + toDate
    );
  }

  ClientAdvancePaymentReportExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePaymentReport/ClientAdvancePaymentReportExport',
      payload
    );
  }

  GetDateType(description: string, action: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePaymentReport/GetDateTypeClientAdvPay/' + description + '/' + action
    );
  }
}