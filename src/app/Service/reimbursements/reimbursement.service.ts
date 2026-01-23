import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IReimbursementService } from '../../Repository/reimbursement/IReimbursement.service';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService implements IReimbursementService {

  env = environment
  constructor(private http: HttpClient) { }


  getEmployeeCode(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}CompanyProvidedBenefits/GetEmployeesList/${companyId}`)
  }

  search(companyId: any, financialYearId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}Reimbursement/Search/${companyId}/${financialYearId}/${employeeId}`);
  }

  exportToExcel(companyId: any, financialYearId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}Reimbursement/Search/${companyId}/${financialYearId}/${employeeId}`);
  }

  importReimbursement(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Reimbursement/Upload', payload)
  }

  bindPayPeriod(companyId: any, financialYearId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}Reimbursement/GetAllFrequency/${companyId}/${financialYearId}`);
  }

  bindReimbursementCode(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}Reimbursement/GetAllRembPaycodes/${companyId}`);
  }

  addReimbursement(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Reimbursement/Create', payload)
  }
}
