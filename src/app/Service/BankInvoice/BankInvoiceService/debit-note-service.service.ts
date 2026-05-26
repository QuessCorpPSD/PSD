import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../Models/apiresponse';
import { IdebitNoteRepository } from '../../../Repository/BankInvoice/BankInvoiceRepository/IDebitNoteRepository';


@Injectable({
  providedIn: 'root'
})
export class DebitNoteServiceService
  implements IdebitNoteRepository {

  env = environment;

  constructor(private http: HttpClient) { }

  // SEARCH

  Search(
    ClientName: any,
    EmpCode: any,
    FromDate: any,
    ToDate: any
  ): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'DebitNote/Search/' +
      ClientName + '/' +
      EmpCode + '/' +
      FromDate + '/' +
      ToDate
    );
  }
  // EXPORT TO EXCEL

  DebitNoteExport(
    payload: any
  ): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'DebitNote/DebitNoteExport',
      payload
    );
  }

}