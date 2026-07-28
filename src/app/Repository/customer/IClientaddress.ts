import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IClientaddress {
    ExporttoExcel(userid: any): Observable<APIResponse>;
    // Search(payload: any): Observable<APIResponse>;
    Search(payload: any): Observable<APIResponse>;
    SearchVendoraddress(payload: any): Observable<APIResponse>;
    clientaddressaddsave(payload: any): Observable<string>;
    getcostcenter(): Observable<APIResponse>;
    PostClientAddressUpload(payload: any): Observable<APIResponse>;
    PostClientAddressDelete(clientaddressid: any, userid: any): Observable<string>
    VendorExporttoExcel(userid: any): Observable<APIResponse>;
    VendorSearch(payload: any): Observable<APIResponse>;
    Vendorclientaddressaddsave(payload: any): Observable<string>;
    PostVendorClientAddressUpload(payload: any): Observable<APIResponse>;
    PostVendorClientAddressDelete(clientaddressid: any, userid: any): Observable<string>
}