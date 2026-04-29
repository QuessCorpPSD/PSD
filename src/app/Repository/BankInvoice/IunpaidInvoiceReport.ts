import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IUnpaidInvoiceReport {
    GetEntity(action: string): Observable<APIResponse>;
    UnpaidInvoiceExport(payload: any): Observable<APIResponse>;




}