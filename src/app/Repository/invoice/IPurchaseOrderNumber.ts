import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IPurchaseOrderNumber {

    Search(payload: any): Observable<APIResponse>;
    Exporttoexcel(payload: any): Observable<APIResponse>;
}