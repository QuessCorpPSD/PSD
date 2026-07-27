import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISkilltypeMapping {
    search(companyId: any, siteId: any): Observable<APIResponse>;
    createUpdateSkillMapping(request: any): Observable<APIResponse>;
    delete(companyid: any, siteid: any, userid: any): Observable<APIResponse>;
    getponumber(companyId: any): Observable<APIResponse>;
}