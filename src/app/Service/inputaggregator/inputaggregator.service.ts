import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IInputaggregator } from '../../Repository/Inputaggregator/Iinputaggregator';

@Injectable({
  providedIn: 'root'
})
export class InputaggregatorService implements IInputaggregator {
  env = environment

  constructor(private http: HttpClient) { }
  getmapname(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `CostCenterMapping/GetAllCostCentertDetails/${companyid}`
    );
  }
  SiteSearch(companyId: any, groupId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + `SiteMaster/Search/${companyId}/${groupId}`);
  }
  getQuessMasterAttributes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InputAggregator/QuessAttributeMaster'
    );
  }
  search(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `InputAggregator/Search/${companyId}`);
  }

  getClientAttributes(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `InputAggregator/ClientAttributes/${companyId}`);
  }
  Uploadcli(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'InputAggregator/ClientAttributesUpload',
        formData
      );
  }
  Upload(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'InputAggregator/AttributesMappingUpload',
        formData
      );
  }
  downloadBillableReport(companyId: number, payPeriodId: number) {
    return this.http.get(
      `${this.env.apiUrl}InputAggregator/billableReport/${companyId}/${payPeriodId}`
    );
  }
  Uploadclient(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'InputAggregator/Upload',
        formData
      );
  }

}
