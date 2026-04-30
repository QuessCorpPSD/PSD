import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IGenericUploadRepository {
    BindUploadType(userid): Observable<APIResponse>;
    GetGenericTemplate(uploadType): Observable<APIResponse>;
    PostGenericUpload(formData): Observable<APIResponse>;
}