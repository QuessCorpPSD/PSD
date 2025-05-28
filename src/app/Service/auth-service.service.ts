import { EnvironmentInjector, Injectable, signal } from '@angular/core';
import { IAuthServiceService } from '../Repository/iauth-service.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService implements IAuthServiceService {
   environment=environment;
   private usernameSubject = new BehaviorSubject<string>('');
   username$ = this.usernameSubject.asObservable();
   private usernameSignal = signal<string | null>(null);
  constructor(private http:HttpClient) { }

  ValidateLogin(login):Observable<APIResponse>{
    var inputval=JSON.stringify(login);
   
    const config = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl+"Authendicate/UserLogin",inputval, { headers: config }).pipe(
      map(userInfo=> {
        let data=userInfo.Data;       
        return userInfo;
        //return userInfo.headers.get('authorization');
      }));
  }

  GetCompanyData():Observable<APIResponse>{
    return this.http.get<APIResponse>(this.environment.apiUrl+'Authendicate/GetData');
  }
  
  setUsername(username: string) {
    
    this.usernameSubject.next(username); // Set username
  }
  PayRegisterDownload(): Observable<Blob> {
    return this.http.get<Blob>(this.environment.apiUrl + 'Authendicate/PayRegisterDownload')
  }
  
}
