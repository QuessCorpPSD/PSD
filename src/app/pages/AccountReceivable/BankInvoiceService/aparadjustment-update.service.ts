import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IAPARAdjustmentUpdateService } from '../../Repository/BankInvoice/APARAdjustment.service';


@Injectable({
  providedIn: 'root'
})
export class APARAdjustmentUpdateService implements IAPARAdjustmentUpdateService {

  env = environment

  constructor(private http: HttpClient) { }

  search(CompanyId: any, fromdate: any, todate: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}APARAdjustment/APARAdjustmentSearch/${CompanyId}/${fromdate}/${todate}`);
  }

  exportToExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.env.apiUrl}APARAdjustment/APARAdjustmentExport`, payload);
  }

  importAPARAdjustment(file: File, user: string): Observable<APIResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', user);

    return this.http.post<APIResponse>(this.env.apiUrl + 'APARAdjustment/UploadAPARAdjustment', formData);
  }

  importAPARAdjustmentCancel(file: File, user: string): Observable<APIResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', user);

    return this.http.post<APIResponse>(
      this.env.apiUrl + 'APARAdjustment/UploadAPARAdjustmentCancel',
      formData
    );
  }


}
