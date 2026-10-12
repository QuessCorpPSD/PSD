import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IARKnockoffRepository {
    GetARInvoiceDetails(): Observable<APIResponse>;
    SaveIgnoreText(payload: any): Observable<APIResponse>;
}