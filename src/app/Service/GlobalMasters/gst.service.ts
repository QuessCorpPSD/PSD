import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IGstRepository } from '../../Repository/GlobalMasters/IGstRepository';
import { TokenService } from '../../Shared/TokenService';

@Injectable({
  providedIn: 'root'
})
export class GSTService implements IGstRepository {
  env = environment
  constructor(private http: HttpClient, private tokenService: TokenService
  ) {
  }
  Search(val1: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gst/SearchDetails/' + val1,
    );
  }
  ExporttoExcel(val1: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gst/ExporttoExcel/' + val1,
    );
  }

  Create(payload: any): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Gst/Create',
      payload
    );
  }

  Edit(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Gst/Edit',
      payload
    );
  }
  Delete(gstmasterid: any, userid: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}Gst/Delete/${gstmasterid}/${userid}`,
      {}
    );
  }


  GetEntity(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Entity/Search',
    );
  }

  GetGSTTypes(stateId: any): Observable<APIResponse> {
    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Common/GetGSTTypes/' + stateId,
      { headers: headers }
    );
  }

  GetAllState(): Observable<APIResponse> {
    const url = `${this.env.apiUrl}Common/GetAllState`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  GetAllcityBystate(stateId: any): Observable<APIResponse> {
    const url = `${this.env.apiUrl}Common/GetCityByStateId/${stateId}`;
    console.log(url);
    return this.http.get<APIResponse>(url);
  }


}

