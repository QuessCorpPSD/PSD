import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";


export interface IPayProcessRepository  {
    GetITCalenderCompany(val):Observable<APIResponse>;
}