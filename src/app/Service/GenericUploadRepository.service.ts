import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';
import { IGenericUploadRepository } from '../Repository/IGenericUpload.service';



@Injectable({
  providedIn: 'root'
})
export class GenericUploadService implements IGenericUploadRepository {
  env = environment
  constructor(private http: HttpClient) {
  }

  BindUploadType(userId: number): Observable<APIResponse>{
    const url = `${this.env.apiUrl}GenericUpload/masters/${userId}`;
    console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetGenericTemplate(uploadType): Observable<APIResponse>{
    const url = `${this.env.apiUrl}GenericUpload/GetGenericTemplate`;
    console.log(uploadType);
    return this.http.post<APIResponse>(url,{uploadType});
  }
  PostGenericUpload(formData): Observable<APIResponse>{
    const url = `${this.env.apiUrl}GenericUpload/PostGenericUpload`;
    return this.http.post<APIResponse>(url,formData);
  }

}