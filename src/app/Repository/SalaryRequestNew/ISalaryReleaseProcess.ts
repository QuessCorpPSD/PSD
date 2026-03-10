import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISalaryReleaseProcess {
    Batchload(BatchType: any, userid: any): Observable<APIResponse>;
    Batchtype(userid: any): Observable<APIResponse>;
    Search(BatchType: any, BatchId: any, userid: any,): Observable<APIResponse>;
    Initiate(payload: any);
}