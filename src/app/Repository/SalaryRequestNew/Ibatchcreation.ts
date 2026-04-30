import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBatchreation {
    Batchcreationtype(userid: any): Observable<APIResponse>;
    Batchtype(userid: any): Observable<APIResponse>;
    Entitylist(userid: any): Observable<APIResponse>;
    Search(batchtype: any, batchcreate: any, entity: any, userid: any): Observable<APIResponse>;
    Export(batchtype: any, batchcreate: any, entity: any, userid: any): Observable<APIResponse>;
    Downloadbatchfile(batchid: any);
    BatchId(batchtype: any, batchdate: any, userid: any): Observable<APIResponse>;
    generate(payload: any): Observable<APIResponse>;
    Reject(payload: any): Observable<APIResponse>;
    Downloadtemplate(flag: any, userid: any): Observable<APIResponse>;
}