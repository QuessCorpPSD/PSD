import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ICreditNoteUpdate } from '../../Repository/BankInvoice/IcreditNoteUpdate';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteUpdateService implements ICreditNoteUpdate {

  env = environment;

  constructor(private http: HttpClient) { }

  CreditnoteSearch(companyId: any, fromDate: any, toDate: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CreditNoteUpdate/CreditnoteSearch/' + companyId + '/' + fromDate + '/' + toDate
    );
  }
  CreditNoteExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'CreditNoteUpdate/CreditNoteExport',
      payload
    );
  }

  ImportCreditNoteCancel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'CreditNoteUpdate/CreditNoteCancelUpload',
      payload
    );
  }

  BulkDownload(payload: any): Observable<Blob> {
    return this.http.post(
      this.env.apiUrl + 'CreditNoteUpdate/BulkDownload',
      payload,
      {
        responseType: 'blob' 
      }
    );
  }
  BulkDownloadCreditNote(BulkInvoices: any): Observable<HttpResponse<Blob>> {
    const url = `${this.env.apiUrl}CreditNoteUpdate/BulkDownload`;
    console.log(url);
    console.table(BulkInvoices);

    return this.http.post(url, BulkInvoices, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  UpdateCreditNote(payload: any): Observable<any> {
    return this.http.post<any>(
      this.env.apiUrl + 'CreditNoteUpdate/EditCreditNote',
      payload
    );
  }

  GetCreditNoteUpdate(flag: string, userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'BatchGeneration/GetTemplate/' + flag + '/' + userId
    );
  }

  GetCreditNoteDetails(creditNoteNo: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CreditNoteUpdate/CreditnoteEmployeeSearch?creditNoteNo=' + creditNoteNo
    );
  }
}
