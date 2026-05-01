import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IInvoiceCollection {
    InvoiceCollectionExport(payload: any): Observable<APIResponse>
    GetDateType(description: string, flag: string): Observable<APIResponse>;

}