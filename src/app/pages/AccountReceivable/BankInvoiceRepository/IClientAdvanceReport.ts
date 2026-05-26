import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IClientAdvanceReport {
    Search(companyId: any, fromDate: any, toDate: any): Observable<APIResponse>;
    ClientAdvancePaymentReportExport(payload: any): Observable<APIResponse>;
    GetDateType(description: string, action: string): Observable<APIResponse>;
}