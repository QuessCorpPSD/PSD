import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { ISalaryReleaseStatus } from '../../../Repository/SalaryRequestNew/ISalaryReleaseStatus';
import { APIResponse } from '../../../Models/apiresponse';
import { environment } from '../../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SalaryReleaseStatusService implements ISalaryReleaseStatus {
  env = environment

  constructor(private http: HttpClient) { }

  Batchtype(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/GetBatchTypeList/' + userid);
  }

  Search(BatchType: any, FromDate: any, Todate: any, EmployeeCode: any, userid: any,): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchGeneration/GetSalaryReleaseStatusdata/${BatchType}/${FromDate}/${Todate}/${EmployeeCode}/${userid}`
    );
  }
  ExporttoExcel(BatchType: any, FromDate: any, Todate: any, EmployeeCode: any, userid: any,): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchGeneration/GetSalaryReleaseStatusdataExport/${BatchType}/${FromDate}/${Todate}/${EmployeeCode}/${userid}`
    );
  }
  Upload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'BatchGeneration/UtrUpload',
      formData
    );
  }

  DownloadTemplate(templateid:any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/GetTemplate/UtrUpload/' + templateid)
  }


}
