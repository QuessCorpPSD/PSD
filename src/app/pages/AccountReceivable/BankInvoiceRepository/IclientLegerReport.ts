import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';

export interface IClientLegerReport {
    GetFinancialYear(): Observable<APIResponse>;
    ClientLegerExport(payload: any): Observable<APIResponse>;

}