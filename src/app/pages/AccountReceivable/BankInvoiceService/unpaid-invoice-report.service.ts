import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { IUnpaidInvoiceReport } from '../../Repository/BankInvoice/IunpaidInvoiceReport';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class UnpaidInvoiceReportService implements IUnpaidInvoiceReport {

  env = environment;

  constructor(private http: HttpClient) { }

  GetEntity(action: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CollectionPendingReport/GetEntity/' + action
    );
  }

  UnpaidInvoiceExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'UnpaidInvoice/UnpaidInvoiceExport',
      payload
    );
  }

}
