import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../Models/apiresponse';
import { IBatchConsolidationReport } from '../../../Repository/SalaryRequestNew/IInvoiceBatchConsolidation';


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
