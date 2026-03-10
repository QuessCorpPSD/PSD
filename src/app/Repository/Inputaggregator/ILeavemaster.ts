import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ILeaveMaster {
    LeavemasterSave(payload: any): Observable<APIResponse>;
    getLeavetypes(): Observable<APIResponse>;
    Searchleavetypemapping(companyid: any): Observable<APIResponse>;
    getquessmaster(): Observable<APIResponse>;
    LeavemastermappingSave(payload: any): Observable<APIResponse>;
}