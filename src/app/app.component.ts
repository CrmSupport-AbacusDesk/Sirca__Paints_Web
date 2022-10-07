import { Component, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { PearlService } from './pearl.service';
import { AuthGuard } from './auth.guard';
import { LocalStorage } from './localstorage.service';
import { BnNgIdleService } from 'bn-ng-idle';
import{ Router} from '@angular/router';

// import

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'abacusdesk';
  login_data:any={};
  constructor(public serve:PearlService,public session:LocalStorage,public renderer:Renderer2,public route:Router ,private bnIdle: BnNgIdleService){
    
    console.log(this.serve.can_active);
    console.log("can");
    this.session.getSession()
    .subscribe(resp=>{
      console.log(resp);
      this.login_data = resp.data;
    });
  }


  ngOnDestroy(): void {
    
    // throw new Error('Method not implemented.');

  }


  


//   @HostListener('window:unload', ['$event'])
// unloadHandler(event) {
//   console.log('unload');
//     this.PostCall();
//     // this.session.LogOutSession();
//     // this.route.navigate(['']);

// }

// @HostListener('window:beforeunload', ['$event'])
// beforeUnloadHander(event) {
//   console.log('beforeunload');

//   // this.session.LogOutSession();
//   //   this.route.navigate(['']);

//     // return false;
// }

// PostCall() {
//     console.log('PostCall');
//     this.session.LogOutSession();
//     this.route.navigate(['']);


// }


  ngOnInit(){
    console.log("in INIT");
    this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
// startWatching(10) -> 10 is in seconds here 
      if(isTimedOut){
        console.log("session Expire");
        // this.session.LogOutSession();
        // this.route.navigate(['']);
      }

    })

    // window.onunload = function () {
    //       this.session.LogOutSession();
    //       this.route.navigate(['']);
    //   };


    // if (window.closed) {
    //   this.session.LogOutSession();
    // this.route.navigate(['']);
    // } else if (!(window.closed)){
    //   alert("win not close")
    // }
    // else{
    //   alert("nothing works")

    // }

   

  }

}
