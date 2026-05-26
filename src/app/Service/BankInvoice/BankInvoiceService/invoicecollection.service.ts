import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IInvoiceCollectionService } from '../../../Repository/BankInvoice/BankInvoiceRepository/InvoiceCollection.service';



@Injectable({
  providedIn: 'root'
})
export class InvoicecollectionService implements IInvoiceCollectionService {
  env = environment

  constructor(private http: HttpClient) { }

  search(companyId: number, payPeriodId: number, invoiceCollectionId: number, mode: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}InvoiceCollection/SearchEditInvoiceCollection`,
      {
        params: {
          companyId: companyId.toString(),
          payPeriodId: payPeriodId.toString(),
          invoiceCollectionId: invoiceCollectionId.toString(),
          mode: mode
        }
      }
    );
  }

  exportToExcel(companyId: number, payPeriodId: number): Observable<APIResponse> {
    const payload = {
      companyId: companyId,
      payPeriodId: payPeriodId
    };

    return this.http.post<APIResponse>(
      `${this.env.apiUrl}InvoiceCollection/ExportInvoiceCollectionToExcel`,
      payload
    );
  }

  importInvoiceCollection(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'InvoiceCollection/InvoiceCollectionBulkUpload', payload)
  }

  GetClientAdvancePaymentTemplate(flag: string, userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'BatchGeneration/GetTemplate/' + flag + '/' + userId
    );
  }
}
