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
}import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IClienGSTList {
    Search(userId: any): Observable<APIResponse>;
    Export(userId: any): Observable<APIResponse>;
    GetInvoiceCategory(): Observable<APIResponse>;
    GetGSTTypes(stateId: any): Observable<APIResponse>;
    SaveClientGST(payload: any): Observable<APIResponse>;
    DeleteClientGST(clientGSTId: number, userId: number): Observable<any>;
    PostClientGSTUpload(formData: FormData): Observable<any>;
    VendorSearch(userId: any): Observable<APIResponse>;
    VendorExport(userId: any): Observable<APIResponse>;
    SaveVendorClientGST(payload: any): Observable<APIResponse>;
    DeleteVendorClientGST(clientGSTId: number, userId: number): Observable<any>;
    PostVendorClientGSTUpload(formData: FormData): Observable<any>;
}