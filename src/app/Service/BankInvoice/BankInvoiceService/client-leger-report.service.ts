import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../Models/apiresponse';
import { IClientLegerReport } from '../../../pages/AccountReceivable/BankInvoiceRepository/IclientLegerReport';

@Injectable({
  providedIn: 'root'
})
export class ClientLegerReportService implements IClientLegerReport {
  env = environment;

  constructor(private http: HttpClient) { }

  GetFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Clientledger/GetFinancialYear'
    );
  }

  ClientLegerExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Clientledger/ClientLedgerExport',
      payload
    );
  }

}
