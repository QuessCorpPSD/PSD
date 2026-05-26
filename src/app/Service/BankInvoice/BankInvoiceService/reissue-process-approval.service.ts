import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';
import { IReissueProcessApproval } from '../../../pages/AccountReceivable/BankInvoiceRepository/IReissueProcessApproval';

@Injectable({
  providedIn: 'root'
})
export class ReissueProcessApprovalService implements IReissueProcessApproval {
  env = environment;

  constructor(private http: HttpClient) { }

  GetDropdown(action: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ReIssueApprove/GetDropdown/' + action
    );
  }



  SearchReIssueApprove(
    companyId: any,
    payPeriodId: any,
    reIssueTypes: any,
    fromDate: any,
    toDate: any,
    param: any,
    status: any
  ): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'ReIssueApprove/SearchReIssueApprove/' +
      companyId + '/' +
      payPeriodId + '/' +
      reIssueTypes + '/' +
      fromDate + '/' +
      toDate + '/' +
      param + '/' +
      status
    );
  }

  ExportToExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ReIssueApprove/ExportToExcel',
      payload
    );
  }
  ReissueProcessApproveBulkUpload(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'ReIssueApprove/ReissueProcessApproveBulkUpload',
      payload
    );
  }
  CreateReIssueApproveReject(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ReIssueApprove/CreateReIssueApproveReject',
      payload
    );
  }

  GetReissueApproveTemplate(flag: string, userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'BatchGeneration/GetTemplate/' + flag + '/' + userId
    );
  }
}
