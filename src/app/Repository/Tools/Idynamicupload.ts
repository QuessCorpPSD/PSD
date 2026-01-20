import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IDynamicUpload {
    getuploadtype(): Observable<APIResponse>;
    Upload(formData: FormData): Observable<APIResponse>;
    getallcolumns(uploadtype: any): Observable<APIResponse>;
}