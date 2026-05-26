import { Injectable } from '@angular/core';
import { IGenericUpload } from '../../Repository/BankInvoice/IgenericUpload';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class GenericUploadService implements IGenericUpload {
  env = environment;

  constructor(private http: HttpClient) { }

  getUploadType(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'GenericUpload/masters/' + userId
    );
  }
  downloadTemplate(uploadType: string): Observable<any> {
    return this.http.get<any>(
      this.env.apiUrl + 'GenericUpload/DownloadTemplate/' + uploadType
    );
  }
  Upload(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'GenericUpload/FileUpload',
        formData
      );
  }
}
