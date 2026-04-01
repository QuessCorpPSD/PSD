import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISEZRepositoryService {
    Search(companyId: number, payperiodId: number, InvoiceNumber: string, year: number): Observable<APIResponse>;
    //UploadSEZDocument(formData: FormData): Observable<APIResponse>;
    GetUploadedFile(invoice_Id: number): Observable<APIResponse>;
    BulkApproveSEZ(payload: any): Observable<APIResponse>;
}   