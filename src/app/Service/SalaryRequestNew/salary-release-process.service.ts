import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ISalaryReleaseProcess } from '../../Repository/SalaryRequestNew/ISalaryReleaseProcess';

@Injectable({
  providedIn: 'root'
})
export class SalaryReleaseProcessService implements ISalaryReleaseProcess {
  env = environment

  constructor(private http: HttpClient) { }

  Batchload(BatchType: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/GetSRPBatchList/' + BatchType + '/' + userid);
  }

  Batchtype(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/GetBatchTypeList/' + userid);
  }

  Search(BatchType: any, BatchId: any, userid: any,): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchGeneration/GetSRPBatchData/${BatchType}/${BatchId}/${userid}`
    );
  }

  // salary-release.service.ts
  Initiate(payload: any) {
    return this.http.post(this.env.apiUrl + 'BatchGeneration/BatchIntitiate', payload, {
      responseType: 'blob',
       observe: 'response' 
    });
  }

}
