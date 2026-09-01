import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IPurchaseOrderNumber } from '../../Repository/invoice/IPurchaseOrderNumber';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderNumber implements IPurchaseOrderNumber{
  env = environment;
  constructor(private http: HttpClient) { }


  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PurchaseOrder/POSearch', payload);
  }

  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PurchaseOrder/ExportExcel', payload);
  }
 SavePurchaseOrder(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'PurchaseOrder/CreateUpdateDelete',
      payload
    );
  }
}
