import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBatchreation } from '../../../Repository/SalaryRequestNew/Ibatchcreation';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../Models/apiresponse';


@Injectable({
  providedIn: 'root'
})
export class BatchcreationService implements IBatchreation {
  env = environment

  constructor(private http: HttpClient) { }

  Entitylist(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/EntityListbg/' + userid);
  }
  Batchtype(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/GetBatchTypeList/' + userid);
  }
  Batchcreationtype(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/BatchCreationTypelist/' + userid);
  }

  Search(batchtype: any, batchcreate: any, entity: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchGeneration/GetApproveInvoices/${batchtype}/${batchcreate}/${entity}/${userid}`
    );
  }

  generate(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'BatchGeneration/BatchGenerate',
        payload
      );
  }

  Reject(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'BatchGeneration/RejectBankAdvice',
        payload
      );
  }

  Export(batchtype: any, batchcreate: any, entity: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchGeneration/GetApproveInvoicesExport/${batchtype}/${batchcreate}/${entity}/${userid}`
    );
  }

  BatchId(batchtype: any, batchdate: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchGeneration/GetBatchList/${batchtype}/${batchdate}/${userid}`
    );
  }

  Downloadbatchfile(batchid: any) {
    return this.http.get(
      this.env.apiUrl + 'BatchGeneration/DownloadBatchFile/' + batchid,
      {
        responseType: 'blob',
        observe: 'response'
      }
    );
  }

}
