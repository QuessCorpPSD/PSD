import { Injectable } from '@angular/core';
import { IClienGSTList } from '../../Repository/customer/IClientGstlist';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { TokenService } from '../../Shared/TokenService';

@Injectable({
  providedIn: 'root'
})
export class ClientGSTListService implements IClienGSTList {

  env = environment;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  Search(userId: any): Observable<APIResponse> {

    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientGST/GetAllClientGSTDetails/' + userId,
      { headers: headers }
    );
  }

  Export(userId: any): Observable<APIResponse> {
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientGST/ClientGSTExport/' + userId,
      { headers: headers }
    );
  }

  GetInvoiceCategory(): Observable<APIResponse> {
    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Common/GetInvoiceCategory',
      { headers: headers }
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

  SaveClientGST(payload: any): Observable<APIResponse> {

    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ClientGST/PostAddClientGST',
      payload,
      { headers: headers }
    );
  }

  DeleteClientGST(clientGSTId: number, userId: number): Observable<any> {

    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(
      this.env.apiUrl + `ClientGST/PostDeleteClientGST/${clientGSTId}/${userId}`,
      { headers: headers }
    );
  }

  PostClientGSTUpload(formData: FormData): Observable<any> {

    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(
      this.env.apiUrl + 'ClientGST/PostClientGSTUpload',
      formData,
      { headers: headers }
    );
  }

  VendorSearch(userId: any): Observable<APIResponse> {

    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'VendorClientGST/GetAllVendorClientGSTDetails/' + userId,
      { headers: headers }
    );
  }

  VendorExport(userId: any): Observable<APIResponse> {
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'VendorClientGST/VendorClientGSTExport/' + userId,
      { headers: headers }
    );
  }

  SaveVendorClientGST(payload: any): Observable<APIResponse> {

    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<APIResponse>(
      this.env.apiUrl + 'VendorClientGST/PostAddVendorClientGST',
      payload,
      { headers: headers }
    );
  }

  DeleteVendorClientGST(VendorclientGSTId: number, userId: number): Observable<any> {

    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(
      this.env.apiUrl + `VendorClientGST/PostDeleteVendorClientGST/${VendorclientGSTId}/${userId}`,
      { headers: headers }
    );
  }

  PostVendorClientGSTUpload(formData: FormData): Observable<any> {

    const token = this.tokenService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(
      this.env.apiUrl + 'VendorClientGST/PostVendorClientGSTUpload',
      formData,
      { headers: headers }
    );
  }

}