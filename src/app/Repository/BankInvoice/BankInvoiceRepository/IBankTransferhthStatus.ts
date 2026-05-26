import { Observable } from "rxjs";
import { APIResponse } from "../../../Models/apiresponse";

export interface IBankTransferhthStatus {

    Search(fromDate: any, toDate: any): Observable<APIResponse>;

    ExportToExcel(fromDate: any, toDate: any): Observable<APIResponse>;

}