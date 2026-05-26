import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IBankTransferhthStatus } from '../../Repository/BankInvoice/IBankTransferhthStatus';


@Injectable({
  providedIn: 'root'
})
export class BanktransferhthstatusService implements IBankTransferhthStatus {

  env = environment;

  constructor(private http: HttpClient) { }

  // SEARCH

  Search(fromDate: any, toDate: any): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'BankTransferhth/Search/' +
      fromDate + '/' +
      toDate
    );
  }

  // EXPORT TO EXCEL

  ExportToExcel(fromDate: any, toDate: any): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'BankTransferhth/ExportToExcel/' +
      fromDate + '/' +
      toDate
    );
  }

}