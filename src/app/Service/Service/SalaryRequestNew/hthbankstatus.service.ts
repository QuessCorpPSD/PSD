import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';
import { IHthbankstatus } from '../../../Repository/SalaryRequestNew/Ihthbankstatus';

@Injectable({
  providedIn: 'root'
})
export class HthbankstatusService implements IHthbankstatus {

 env = environment

  constructor(private http: HttpClient) { }

  search(payload: any): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.env.apiUrl + 'InvoiceBatchConsolidation/searchnew', payload)
    }
  
    exporttoexcel(payload: any): Observable<APIResponse> {
      return this.http.post<APIResponse>(this.env.apiUrl + 'InvoiceBatchConsolidation/exporttoexcel', payload)
    }
  
}
