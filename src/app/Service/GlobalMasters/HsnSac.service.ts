import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IHsnSacRepository } from '../../Repository/GlobalMasters/IHsnSacRepository';
import { TokenService } from '../../Shared/TokenService';

@Injectable({
  providedIn: 'root'
})
export class HsnSacService implements IHsnSacRepository {
  env = environment
  constructor(private http: HttpClient, private tokenService: TokenService
  ) {
  }
  Search(val1: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'HsnSac/SearchDetails/' + val1,
    );
  }
  ExporttoExcel(val1: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'HsnSac/ExporttoExcel/' + val1,
    );
  }

  Create(payload: any): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl + 'HsnSac/Create',
      payload
    );
  }

  Edit(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'HsnSac/Edit',
      payload
    );
  }
  Delete(gstmasterid: any, userid: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}HsnSac/Delete/${gstmasterid}/${userid}`,
      {}
    );
  }

   GetGSTTypes(): Observable<any> {
    return this.http.get<any>(
     `${this.env.apiUrl}HsnSac/GetGSTtype`
    );
  }

  }

  



