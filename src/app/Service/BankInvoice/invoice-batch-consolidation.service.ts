import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { IBatchConsolidationReport } from '../../Repository/BankInvoice/IInvoiceBatchConsolidation';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class InvoiceBatchConsolidationService implements IBatchConsolidationReport {
  env = environment;

  constructor(private http: HttpClient) { }

  GetBusinessUnit(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceBatchConsolidation/GetBusinessUnit'
    );
  }

  InvoiceBatchConsolidationExport(payload: any): Observable<any> {
    return this.http.post(
      this.env.apiUrl + 'InvoiceBatchConsolidation/InvoiceBatchConsolidationExport',
      payload
    );
  }

}
