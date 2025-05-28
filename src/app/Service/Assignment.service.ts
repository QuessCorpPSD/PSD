import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { APIResponse } from "../Models/apiresponse";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IAssignmentService } from "../Repository/IAssignment.service";


@Injectable({
  providedIn: 'root'
})
export class AssignmentService implements IAssignmentService {
    environment=environment;
    constructor(private http:HttpClient)
    {

    }
    GetAssignmentLot(userid):Observable<APIResponse>{
        console.log(this.http.get<APIResponse>(this.environment.apiUrl+'Assignment/GetAssignmentLot/'+userid));
      return  this.http.get<APIResponse>(this.environment.apiUrl+'Assignment/GetAssignmentLot/'+userid)        
    }
    GetAllotment(val):Observable<APIResponse>
    {
        var inputval=JSON.stringify(val);           
            const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'Assignment/GetAllotment',inputval, { headers: config })
    }
    PayRegisterDownload(val):Observable<APIResponse>{
        var inputval=JSON.stringify(val);           
        const config = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'PayRegister/GetPayRegister',inputval, { headers: config })
    }
 ReconPayRegisterDownload(val):Observable<APIResponse>{
        var inputval=JSON.stringify(val);           
        const config = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'PayRegister/GetReconPayRegister',inputval, { headers: config })
    }
    InputFileDownload(val):Observable<APIResponse>{

     var inputval=JSON.stringify(val);           
        const config = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'Assignment/InputLotDownload',inputval, { headers: config })
    }
    
    GetSOP_QA(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetCustomerSOPQuestionAnswer');
    }

    PayRegisterUpload(val:any):Observable<APIResponse>{
        var inputval=JSON.stringify(val);               
        const config = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'PayRegister/PayRegisterUpload',inputval, { headers: config })
    }

    LotStatus(val):Observable<APIResponse>{
        var inputval=JSON.stringify(val);        
        const config = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'Assignment/LotStatus',inputval, { headers: config })
    }
    QCLotVerify(val):Observable<APIResponse>{
     var inputval=JSON.stringify(val);        
        const config = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'Assignment/QCLotVerify',inputval, { headers: config })
    }
}