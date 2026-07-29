import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ICategoryChange {
    SearchCategory(payload: any): Observable<any>;
    GetProcessCategory(): Observable<APIResponse>;
}


