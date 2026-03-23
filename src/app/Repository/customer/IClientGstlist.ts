import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IClienGSTList {
    Search(userId: any): Observable<APIResponse>;
    Export(userId: any): Observable<APIResponse>;
    GetInvoiceCategory(): Observable<APIResponse>;
    GetGSTTypes(stateId: any): Observable<APIResponse>;
    SaveClientGST(payload: any): Observable<APIResponse>;
    DeleteClientGST(clientGSTId: number, userId: number): Observable<any>;
    PostClientGSTUpload(formData: FormData): Observable<any>;
}