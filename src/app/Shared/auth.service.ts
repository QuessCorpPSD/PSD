
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
   
    if(localStorage.getItem('token')!=undefined)
    {
      return true;
    }
    else{
      return true; //!!localStorage.getItem('token'); // Example check
    }
    
  }
}