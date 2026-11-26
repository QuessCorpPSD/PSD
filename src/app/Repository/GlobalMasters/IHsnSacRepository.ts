import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IHsnSacRepository {
    Search(val: any): Observable<APIResponse>;
    ExporttoExcel(val: any): Observable<APIResponse>
    Create(payload: any): Observable<APIResponse>;
    Edit(payload: any): Observable<APIResponse>;
    Delete(gstmasterid: any, userid: any): Observable<APIResponse>;
    GetGSTTypes(): Observable<APIResponse>;
}