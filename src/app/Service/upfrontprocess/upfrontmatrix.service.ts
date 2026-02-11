import { Injectable } from '@angular/core';
import { IUpfrontMatrix } from '../../Repository/upfrontprocess/Iupfrontmatrix';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class UpfrontmatrixService implements IUpfrontMatrix {
  env = "https://qzoneerp-dev-api.quesscorp.com/api/";
  constructor(private http: HttpClient) {
  }
  Search(roletype: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env}UpfrontRequest/UpfrontViewLimit/${roletype}`)
  }

}
