import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IPOculture {
    GetAllPOCulture(companyId: number, userId: number): Observable<APIResponse>
    postPOCulture(payload: any): Observable<APIResponse>
    UploadPOCulture(formData: FormData): Observable<APIResponse>
    ExportToExcel(companyId: number,userId: number): Observable<APIResponse>
    getAllPaycode(companyId: number): Observable<APIResponse>
    GetPoNumbers(companyId: number, userId: number): Observable<APIResponse> 
}

