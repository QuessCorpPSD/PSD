import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPAycodeService } from '../../Repository/GlobalMasters/Ipaycode.service';

@Injectable({
  providedIn: 'root'
})
export class PaycodeserviceService implements IPAycodeService {
  env = environment

  constructor(private http: HttpClient) { }
  GetPayType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Paycode/GetPayType')
  }

  SearchPayCode(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Paycode/Search', payload)
  }

  CreatePayCode(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Paycode/Create', payload)
  }

  GetPageType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Paycode/GetPageType')
  }
  GetAllPTRule(val):Observable<APIResponse>{
    var inputval = JSON.stringify(val);
        const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            
        return this.http.post<APIResponse>(this.env.apiUrl + 'Paycode/SearchFlexirule', inputval, { headers: config })
  }
    CreateFlexiState(val):Observable<APIResponse>{
    var inputval = JSON.stringify(val);
        const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            
        return this.http.post<APIResponse>(this.env.apiUrl + 'Paycode/CreateFlexidetails', inputval, { headers: config })
  }
  GetAllPTPayCode(companyId):Observable<APIResponse>{
    return this.http.get<APIResponse>(this.env.apiUrl + 'Paycode/GetPayCodeByCompanyId/'+companyId) 
  }
}
