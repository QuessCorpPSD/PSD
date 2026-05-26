import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { IforeCast } from '../../Repository/BankInvoice/IforeCast';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ForeCastService implements IforeCast {
  env = environment;

  constructor(private http: HttpClient) { }


  Getmonth(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/GetPayPeriod')
  }

  SearchForecast(companyId: any, payPeriod: any, mode: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Forecast/Search/' + companyId + '/' + encodeURIComponent((payPeriod || '').trim()) + '/' + mode
    );
  }


  ForecastExport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Forecast/ForecastExport',
      payload
    );
  }
  GetSBU(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Forecast/GetSBU'
    );
  }

  GetRegion(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Forecast/GetRegion'
    );
  }

  GetInvoiceNumber(companyId: number, payPeriodId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Forecast/GetInvoiceNumber/' + companyId + '/' + payPeriodId
    );
  }

  SaveUpdateDeleteForecast(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Forecast/SaveUpdateDeleteForecast',
      payload
    );
  }

  ImportForecast(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Forecast/UploadForecast',
      payload
    );
  }
  GetForecasttemplate(flag: string, userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'BatchGeneration/GetTemplate/' + flag + '/' + userId
    );
  }



}
