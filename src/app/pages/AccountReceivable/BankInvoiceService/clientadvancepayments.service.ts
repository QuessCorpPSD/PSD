import { Injectable } from '@angular/core';
import { IClientAdvancePaymets } from '../../Repository/BankInvoice/IClientAdvancepayments';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ClientadvancepaymentsService implements IClientAdvancePaymets {
  env = environment;

  constructor(private http: HttpClient) { }

  Search(companyId: any, fromDate: any, toDate: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/Search/' + companyId + '/' + fromDate + '/' + toDate
    );
  }

  ClientAdvancePaymentExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/ClientAdvancePaymentExport',
      payload
    );
  }

  GetModeOfCollections(action: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/GetModeOfCollections/' + action
    );
  }

  GetOnAccountNumbers(description: string, action: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/GetOnAccountNumbers/' + description + '/' + action
    );
  }



  GetBankNameForOnAccount(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/GetBankNameForOnAccount'
    );
  }

  SaveUpdateDeleteClientAdvancePayment(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/SaveUpdateDeleteClientAdvancePayment',
      payload
    );
  }



  GetGroupNameByCompanyID(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/GetGroupNameByCompanyID/' + companyId
    );
  }

  GetAllCompanyCodes(userId: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Common/GetAllCompanyCode/' + userId
    );
  }


  TransferClientAdvancePayment(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/TransferClientAdvancePayment',
      payload
    );
  }

  ImportClientAdvancePayment(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ClientAdvancePayment/UploadClientAdvancePayment',
      payload
    );
  }
  GetClientAdvancePaymentTemplate(flag: string, userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'BatchGeneration/GetTemplate/' + flag + '/' + userId
    );
  }




}