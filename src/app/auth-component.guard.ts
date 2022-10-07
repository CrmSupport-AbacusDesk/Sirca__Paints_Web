import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorage } from './localstorage.service';
import { PearlService } from './pearl.service';

@Injectable({
  providedIn: 'root'
})
export class AuthComponentGuard implements CanActivate {
  constructor(public session:LocalStorage,public db:PearlService,public router:Router){
    
  }
  abq_user:any=[];
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    const expectedRole = next.data.expectedRole || [];
    
    
    
    this.session.getSession()
    .subscribe(resp=>{
      console.log(resp);
      
      this.abq_user=resp;
      console.log(state.url);
     
      console.log("stat");        
    },error=>{
      console.log("error");
    });
    
    
    if(this.abq_user.st_log && ( !expectedRole.length  || expectedRole.indexOf( this.abq_user.data.access_level ) > -1 ))
    {
      this.db.can_active="1";
      sessionStorage.setItem('login',JSON.stringify(this.abq_user));
      return true;
    }
    else
    {
      this.db.can_active = '';
      this.router.navigate([''], { queryParams: { returnUrl: state.url }});
      return false;
    }
    
  }
}
