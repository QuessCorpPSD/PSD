import { Injectable } from "@angular/core";
import { IPayProcessRepository } from "../Repository/IPayProcessRepository";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { APIResponse } from "../Models/apiresponse";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PayProcessRepository implements IPayProcessRepository {
    environment = environment;
    constructor(private http: HttpClient) {
    }
    GetITCalenderCompany(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}PayProcess/GetITCalenderCompany`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers:config });
    }
}