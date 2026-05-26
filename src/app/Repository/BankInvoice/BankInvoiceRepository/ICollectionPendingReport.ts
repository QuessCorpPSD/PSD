import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';

export interface ICollectionPendingReport {

    GetFinancialYear(id?: number): Observable<APIResponse>;
    GetEntity(action: string): Observable<APIResponse>;
    CollectionPendingExport(payload: any): Observable<APIResponse>;
}