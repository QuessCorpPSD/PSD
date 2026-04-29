import { Injectable } from '@angular/core';
import { IInvoiceCollection } from '../../Repository/BankInvoice/IInvoiceCollection';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class InvoiceCollectionServiceService implements IInvoiceCollection {
  env = environment;

  constructor(private http: HttpClient) { }

  GetDateType(description: string, flag: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCollectionReport/GetGENTabledata/' + description + '/' + flag
    );
  }


  InvoiceCollectionExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'InvoiceCollectionReport/InvoiceCollectionExport',
      payload
    );
  }



}
