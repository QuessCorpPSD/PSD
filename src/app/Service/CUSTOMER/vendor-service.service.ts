import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IVendorServiceCharge } from '../../Repository/customer/ivendor-service';
@Injectable({
  providedIn: 'root'
})
export class VendorServiceChargeService implements IVendorServiceCharge {
  env = environment
  constructor(private http: HttpClient) {
  }
 
  getAllVendorServiceCharge(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'VendorServiceCharge/GetAllVendorServiceCharge/' + companyId)
  }
  GetSearch(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'VendorServiceCharge/GetAllServiceCharge/' + companyId
    );
  }
 GetAllVendorServiceType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'VendorServiceCharge/GetAllVendorServiceType'
   
    );
       console.log(  this.env.apiUrl + 'VendorServiceCharge/GetAllVendorServiceType');
  }
   GetAllBillingTypes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'VendorServiceCharge/GetAllBillingTypes'
    );
  }
  saveVendorServiceCharge(request: any): Observable<APIResponse> {
      console.log('📡 API HIT METHOD');
    return this.http.post<APIResponse>(
       this.env.apiUrl +  'VendorServiceCharge/Create',
      request
    );
   
}
 importVendorServiceCharge(request: any): Observable<APIResponse> {
  return this.http.post<APIResponse>(
     this.env.apiUrl + 'VendorServiceCharge/FileUpload',
    request
  );   
} 


}