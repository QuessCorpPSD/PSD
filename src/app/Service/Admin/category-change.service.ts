import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ICategoryChange } from '../../Repository/Admin/ICategoryChange';

@Injectable({
  providedIn: 'root'
})
export class CategoryChangeService implements ICategoryChange {
  env = environment;

  constructor(private http: HttpClient) {

  }

  SearchCategory(payload: any): Observable<any> {
    return this.http.post(
      this.env.apiUrl + 'CategoryChange/Search',
      payload
    )
  }

  GetProcessCategory(): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const config = { headers };
    return this.http.get<APIResponse>(this.env.apiUrl + "Common/GetAllProcessCategory", config);
  }
}