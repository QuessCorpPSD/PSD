import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IARKnockoffRepository } from '../../Repository/customer/IARknockOffRepository';

@Injectable({
  providedIn: 'root'
})
export class ARKnockoffService implements IARKnockoffRepository {
  env = environment
  constructor(private http: HttpClient) {
  }

  GetARInvoiceDetails(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ARKnockOff/GetAllIgnoreSubjectLine')
  }
  SaveIgnoreText(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      environment.apiUrl + 'ARKnockOff/CreateUpdateDelete_IgnoreSubjectLine',
      payload
    );
  }

}
