import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';
import { ICollectionPendingReport } from '../../../Repository/BankInvoice/BankInvoiceRepository/ICollectionPendingReport';

@Injectable({
  providedIn: 'root'
})
export class CollectionPendingReportService implements ICollectionPendingReport {
  env = environment;

  constructor(private http: HttpClient) { }

  GetFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CollectionPendingReport/GetFinancialYear'
    );
  }

  GetEntity(action: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CollectionPendingReport/GetEntity/' + action
    );
  }

  CollectionPendingExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'CollectionPendingReport/CollectionPendingExport',
      payload
    );
  }




}
