import { Injectable } from '@angular/core';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IClientTDSMasterService } from '../../Repository/BankInvoice/ClientTDSMaster.service';


@Injectable({
  providedIn: 'root'
})
export class ClientTDSMasterService implements IClientTDSMasterService {

  env = environment

  constructor(private http: HttpClient) { }

  search(CompanyId: any, FinancialYearId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}TDSSlab/Search/${CompanyId}/${FinancialYearId}`);
  }

  exportToExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.env.apiUrl}TDSSlab/ExportToExcel`, payload);
  }

  importClientTds(file: File, createdBy: string): Observable<APIResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('createdBy', createdBy);

    return this.http.post<APIResponse>(this.env.apiUrl + 'TDSSlab/UploadTDSSlab', formData);
  }

  addClientTDS(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'TDSSlab/TdsSlabCreate', payload)
  }

}
