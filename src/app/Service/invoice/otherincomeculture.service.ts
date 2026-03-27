import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IOtherIncomeCulture } from '../../Repository/invoice/IOtherIncomeCulture';

@Injectable({
  providedIn: 'root'
})
export class OtherincomecultureService implements IOtherIncomeCulture {

  env = environment
  constructor(private http: HttpClient) {
  }

  GetStates(companyId: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllStatebyCompanyId/' + companyId
    );
  }

  ServiceChargeMaster(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllServiceChargeMaster/'
    );
  }

  CreateNewPO(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllStatebyCompanyId/'
    );
  }

  postInvoiceCulture(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/Create',
      payload
    );

  }

  InvoiceType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllInvoiceType'
    );
  }
  InvoiceCategory(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllInvoiceCategories'
    );
  }

  InvoicecultureSearch(companyId: number, spiltTypeId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${environment.apiUrl}InvoiceCulture/GetAllInvoiceCulture/${companyId}/${spiltTypeId}`
    );
  }


  UploadInvoiceCulture(formData: FormData): Observable<APIResponse> {
    const url = `${environment.apiUrl}InvoiceCulture / PostUploadInvoiceCulture`;
    console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }

  ExportToExcel(userId: number) {
    return this.http.get<APIResponse>(
      environment.apiUrl + `InvoiceCulture / InvoiceCultureExport / ` + userId);
  }
  
  getAllPaycode(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${environment.apiUrl}InvoiceCulture/GetAllPayCodeFromCompanyOI/${companyId}`
    );
  }


}
