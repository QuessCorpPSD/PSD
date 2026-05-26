import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';

export interface IBatchConsolidationReport {
    GetBusinessUnit(): Observable<APIResponse>;
    InvoiceBatchConsolidationExport(payload: any): Observable<Blob>;
}