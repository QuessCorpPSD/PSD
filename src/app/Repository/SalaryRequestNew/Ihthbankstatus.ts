import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IHthbankstatus {

    search(payload: any): Observable<APIResponse>;
    exporttoexcel(payload: any): Observable<APIResponse>;
}