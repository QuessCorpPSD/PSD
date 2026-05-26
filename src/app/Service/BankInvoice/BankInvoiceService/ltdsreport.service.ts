import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';
import { ILTDSReport } from '../../../Repository/BankInvoice/BankInvoiceRepository/ILTDSreport';

@Injectable({
  providedIn: 'root'
})
export class LTDSReportService implements ILTDSReport {
  env = environment;

  constructor(private http: HttpClient) { }

  GetFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'LTDSReport/GetFinancialYear'
    );
  }

  GetLTDSReportType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'LTDSReport/GetLTDSReportType'
    );
  }

  GetBusinessUnits(reportTypeId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'LTDSReport/GetBusinessUnits/' + reportTypeId
    );
  }

  LTDSReportExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'LTDSReport/LTDSReportExport',
      payload
    );
  }







}
