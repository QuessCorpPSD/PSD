import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';
import { ICreditNoteMatrix } from '../../../Repository/BankInvoice/BankInvoiceRepository/ICreditNoteMatrix';


@Injectable({
  providedIn: 'root'
})
export class CreditNoteMatrixService implements ICreditNoteMatrix {
  env = environment;

  constructor(private http: HttpClient) { }

  Search(): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'CreditNoteMatrix/Search'
    );
  }

  ExportToExcel(): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'CreditNoteMatrix/ExportToExcel'
    );

  }

  Create(data: any): Observable<any> {

    return this.http.post<any>(
      this.env.apiUrl +
      'CreditNoteMatrix/Create',
      data
    );

  }

  Update(data: any): Observable<any> {

    return this.http.put<any>(
      this.env.apiUrl +
      'CreditNoteMatrix/Update',
      data
    );

  }

  Delete(data: any): Observable<any> {

    return this.http.request<any>(
      'delete',
      this.env.apiUrl +
      'CreditNoteMatrix/Delete',
      {
        body: data
      }
    );

  }
  GetCommonDropDownList(
    Flag: any,
    UserId: any
  ): Observable<any> {

    return this.http.get<any>(
      this.env.apiUrl +
      'CreditNoteMatrix/GetCommonDropDownList/' +
      Flag + '/' +
      UserId
    );

  }
}
