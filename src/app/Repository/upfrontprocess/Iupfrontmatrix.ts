import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IUpfrontMatrix {
    Search(roletype: any): Observable<APIResponse>;
    GetRole(): Observable<APIResponse>;
    GetUserlist(userid: any, suserid: any): Observable<APIResponse>;
    GetZone(): Observable<APIResponse>;
    save(payload: any): Observable<APIResponse>;
}