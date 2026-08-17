import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';
import { IPOculture } from '../Repository/IPOculture';



@Injectable({
  providedIn: 'root'
})
export class POCultureService implements IPOculture {
  env = environment
  constructor(private http: HttpClient) {
  }
  

  postPOCulture(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'PoCulture/Create',
      payload
    );

  }
  GetPoNumbers(companyId: number, userId: number): Observable<APIResponse> {
      //alert('GetPoNumbers API called with companyId: ' + companyId + ' and userId: ' + userId);
   
  return this.http.get<APIResponse>(
    `${this.env.apiUrl}PoCulture/GetAllPoNumbers?companyId=${companyId}&userId=${userId}`
  );
  }

  GetAllPOCulture(companyId: number, userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
       `${this.env.apiUrl}PoCulture/GetAllPOCulture/${companyId}/${userId}`
    );
  }


  UploadPOCulture(formData: FormData): Observable<APIResponse> {
    const url = `${environment.apiUrl}PoCulture/PostUploadPOCulture`;
    console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }

 ExportToExcel(companyId: number, userId: number): Observable<APIResponse> {
 return this.http.post<APIResponse>(
    `${this.env.apiUrl}PoCulture/POCultureExport/${companyId}/${userId}`,
    null
  );
}

  getAllPaycode(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${environment.apiUrl}PoCulture/GetAllPayCodeFromCompanyOI/${companyId}`
    );
  }

}


