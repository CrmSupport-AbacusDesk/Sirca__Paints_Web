import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PearlService } from './pearl.service';
import { ElementSchemaRegistry } from '@angular/compiler';
import { LocalStorage } from './localstorage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  pearluser:any=[];
  constructor(public session:LocalStorage,public rout:Router,public db:PearlService)
  {

  }
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    this.session.getSession()
      .subscribe((response)=>{
        console.log(response);
        console.log("auth g");
        
        this.pearluser=response;
        console.log(this.pearluser);
      },error=>{
        console.log("error");        
      });


      if(this.pearluser.st_log)
      {
        if(state.url!='/')
        {

        }
        else{
          this.rout.navigate(['/dashboard']);
        }
        this.db.can_active='1';
        return false;
      }
      else
      {

        console.log('hello');
        this.db.can_active='';
        return true;
      }
  }
}
