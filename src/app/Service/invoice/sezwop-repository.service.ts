import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SEZWOPRepository, DocumentTypeMaster, CompanyCode, PayPeriod, FinancialYear } from '../../Models/sezwop-repository.model';

@Injectable({
  providedIn: 'root'
})
export class SEZWOPRepositoryService {

  private baseUrl = `${environment.apiUrl}SEZWOPRepository`;

  constructor(private http: HttpClient) { }

  /**
   * Search SEZ WOP Repository records
   * Replaces: GET ../SEZWOPRepository/Search?companyId=&payPeriodId=&InvoiceNumbers=&Year=
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
   * Upload file with selected records
   * Replaces: POST ../SEZWOPRepository/Uploadfile (FormData)
   */
  uploadFile(formData: FormData): Observable<SEZWOPRepository> {
    return this.http.post<SEZWOPRepository>(`${this.baseUrl}/Uploadfile`, formData);
  }

  /**
   * Delete a repository record
   * Replaces: POST /SEZWOPRepository/Delete (FormData)
   */
  delete(id: number, fileName: string): Observable<string> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('fileName', fileName);
    return this.http.post<string>(`${this.baseUrl}/Delete`, formData);
  }

  /**
   * Export to Excel - returns blob for download
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
   * Replaces: GET /SEZWOPRepository/Download?fileName=
   */
  downloadFile(fileName: string): Observable<Blob> {
    const params = new HttpParams().set('fileName', fileName);
    return this.http.get(`${this.baseUrl}/Download`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * View PDF file
   * Replaces: GET /SEZWOPRepository/GetPdf?filename=
   */
  getPdf(filename: string): Observable<Blob> {
    const params = new HttpParams().set('filename', filename);
    return this.http.get(`${this.baseUrl}/GetPdf`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Get Document Type Master
   * Replaces: service call to DocumentTypeMaster()
   */
  getDocumentTypeMaster(): Observable<DocumentTypeMaster[]> {
    return this.http.get<DocumentTypeMaster[]>(`${this.baseUrl}/DocumentTypeMaster`);
  }

  /**
   * Get uploaded file details
   * Replaces: POST /SEZWOPRepository/FilesDetails
   */
  getFilesDetails(documentName: string, documentRemarks: string, empId: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/FilesDetails`, {
      Document_Name: documentName,
      Document_Remarks: documentRemarks,
      Empid: empId
    });
  }
}
