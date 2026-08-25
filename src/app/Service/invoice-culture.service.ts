import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';
import { Iinvoiceculture } from '../Repository/IInvoice culture';



@Injectable({
  providedIn: 'root'
})
export class InvoiceCultureService implements Iinvoiceculture {
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

  ViewInvoiceCulture(companyId: number, InvoiceCultureid: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${environment.apiUrl}InvoiceCulture/ViewInvoiceCulture/${companyId}/${InvoiceCultureid}`
    );
  }


  UploadInvoiceCulture(formData: FormData): Observable<APIResponse> {
    const url = `${environment.apiUrl}InvoiceCulture/PostUploadInvoiceCulture`;
    console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }

  ExportToExcel(comapnyId: number) {
    return this.http.post<APIResponse>(
      environment.apiUrl + `InvoiceCulture/InvoiceCultureExport`, comapnyId);
  }

  getAllPaycode(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${environment.apiUrl}InvoiceCulture/GetAllPayCodeFromCompanyOI/${companyId}`
    );
  }

  getAllPaycodes(val): Observable<APIResponse> {
    var inputval = JSON.stringify(val);
    const config = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    return this.http.post<APIResponse>(environment.apiUrl + 'Paycode/GetPayCode', inputval, { headers: config })
  }

}


