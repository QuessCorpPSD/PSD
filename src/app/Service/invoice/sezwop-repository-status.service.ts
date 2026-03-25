import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SEZWOPRepository, CompanyCode, PayPeriod, FinancialYear } from '../../Models/sezwop-repository.model';

@Injectable({
  providedIn: 'root'
})
export class SEZWOPRepositoryStatusService {

  private baseUrl = `${environment.apiUrl}/api/SEZWOPRepositoryStatus`;

  constructor(private http: HttpClient) { }

  /**
   * Search SEZ WOP Repository Status records
   * Replaces: GET ../SEZWOPRepositoryStatus/Search?companyId=&payPeriodId=&InvoiceNumbers=&Year=
   */
  search(companyId: number, payPeriodId: number, invoiceNumbers: string, year: number): Observable<SEZWOPRepository[]> {
    const params = new HttpParams()
      .set('companyId', companyId.toString())
      .set('payPeriodId', payPeriodId.toString())
      .set('InvoiceNumbers', invoiceNumbers || '')
      .set('Year', year.toString());

    return this.http.get<SEZWOPRepository[]>(`${this.baseUrl}/Search`, { params });
  }

  /**
   * Update approval status for selected records
   * Replaces: POST ../SEZWOPRepositoryStatus/Uploadfile (FormData)
   */
  updateApprovalStatus(approvalStatus: string, selectedRecords: string): Observable<SEZWOPRepository> {
    const formData = new FormData();
    formData.append('ApprovalStatus', approvalStatus);
    formData.append('selectedrecord', selectedRecords);
    return this.http.post<SEZWOPRepository>(`${this.baseUrl}/Uploadfile`, formData);
  }

  /**
   * Delete a repository status record
   * Replaces: POST /SEZWOPRepositoryStatus/Delete (FormData)
   */
  delete(id: number, fileName: string): Observable<string> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('fileName', fileName);
    return this.http.post<string>(`${this.baseUrl}/Delete`, formData);
  }

  /**
   * Export to Excel - returns blob
   * Replaces: POST form submit to ExportToExcel
   */
  exportToExcel(companyId: number | null, statusId: string, invoiceNumbers: string, year: number | null): Observable<Blob> {
    const body = {
      CompanyId: companyId,
      StatusId: statusId,
      InvoiceNumbers: invoiceNumbers,
      Year: year
    };
    return this.http.post(`${this.baseUrl}/ExportToExcel`, body, {
      responseType: 'blob'
    });
  }

  /**
   * Download a file
   * Replaces: GET /SEZWOPRepositoryStatus/Download?fileName=
   */
  downloadFile(fileName: string): Observable<Blob> {
    const params = new HttpParams().set('fileName', fileName);
    return this.http.get(`${this.baseUrl}/Download`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * View PDF
   */
  getPdf(filename: string): Observable<Blob> {
    const params = new HttpParams().set('filename', filename);
    return this.http.get(`${this.baseUrl}/GetPdf`, {
      params,
      responseType: 'blob'
    });
  }

  // ============================================================
  // Shared endpoints - same as SEZWOPRepositoryService
  // ============================================================

  getCompanyCodes(): Observable<CompanyCode[]> {
    return this.http.get<CompanyCode[]>(`${environment.apiUrl}/api/Company/GetAll`);
  }

  getFinancialYears(): Observable<FinancialYear[]> {
    return this.http.get<FinancialYear[]>(`${environment.apiUrl}/api/Common/GetFinancialYear`);
  }

  getPayPeriodsByCompanyId(companyId: number): Observable<PayPeriod[]> {
    const params = new HttpParams().set('CompanyID', companyId.toString());
    return this.http.get<PayPeriod[]>(`${environment.apiUrl}/api/InvoiceInitiate/GetAllPayPeriodByCompanyID`, { params });
  }
}
