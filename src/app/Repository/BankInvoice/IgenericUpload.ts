import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';


export interface IGenericUpload {
    getUploadType(userId: number): Observable<APIResponse>;
    downloadTemplate(uploadType: string): Observable<any>;
    Upload(formData: FormData): Observable<APIResponse>;
}