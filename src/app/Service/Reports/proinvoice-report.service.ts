import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IproinvoiceSummaryReport } from '../../Repository/Reports/IproinvoiceSummaryReport';

@Injectable({
  providedIn: 'root'
})
export class ProInvoiceSummaryReportService implements IproinvoiceSummaryReport {
  env = environment
  constructor(private http: HttpClient) {
  }
  ExporttoExcel(
    CompanyId: any,
    FromDate: string,
    ToDate: string,
  ): Observable<APIResponse> {

    return this.http.get<APIResponse>(
  `${this.env.apiUrl}ProInvoiceSummary/ExportToExcel/${CompanyId}/${FromDate}/${ToDate}`
);
  }

}
