import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IUpfrontMatrix {
    Search(roletype: any): Observable<APIResponse>;
}