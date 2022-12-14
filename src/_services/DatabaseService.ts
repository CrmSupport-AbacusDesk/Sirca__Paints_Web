    import { Injectable, OnInit  } from '@angular/core';
    import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
    import { Location } from '@angular/common';
    // import {DialogComponent} from './../dialog/dialog.component';
    import { catchError, retry } from 'rxjs/operators';
    import { throwError } from 'rxjs';
    import { Router, ActivatedRoute } from '@angular/router';
    // import { Crypto } from '../_Pipes/Crypto.pipe';
    // import { DatePikerFormat } from '../_Pipes/DatePikerFormat.pipe';
    import { DialogComponent } from 'src/app/dialog.component';
    // import { PushNotificationsService} from 'ng-push';
    
    @Injectable({ providedIn: 'root' })
    export class DatabaseService implements OnInit {
        

        myurl = 'https://devcrm.abacusdesk.com/sircapaints/dd_api/';
        myurl2= 'https://devcrm.abacusdesk.com/sircapaints/crm/api/index.php/';

        can_active = '';
        datauser: any = {};
        loading: any;
        
        customer_name: any;
        franchise_name: any;
        franchise_id;
        franchise_location;
        challans : any = [];
        
        constructor(
            public location: Location, 
            public http: HttpClient,
            public dialog: DialogComponent,
            private router: Router,
            public route: ActivatedRoute,
            // public _pushNotificationService: PushNotificationsService
            ) {
            }
            
            ngOnInit(){
                // this._pushNotificationService.requestPermission();
                
            }
            
            
            
            private extractData(res: Response) {
                const body = res;
                return body || {};
            }
            auth_rqust(request_data: any, fn: any) {
                let headers = new HttpHeaders().set('Content-Type', 'application/json');
                return this.http.post(this.myurl + fn , request_data, {headers: headers});
            }
            
            
       
            
            
            
            post_rqst(request_data: any, fn: any):any {
                if( !this.chek_seission() )
                return false;
                // this.noificaton();
                let headers = new HttpHeaders().set('Content-Type', 'application/json');
                headers = headers.set('Token', 'Bearer ' + this.datauser.token);
                return this.http.post(this.myurl + fn, JSON.stringify(request_data), {headers: headers}).
                pipe(
                    retry(3), 
                    // retry a failed request up to 3 times
                    // catchError(this.handleError) // then handle the error
                    );
                }
                




                // post_rqst1(request_data: any, fn: any):any {
                //     if( !this.chek_seission() )
                //     return false;
                //     // this.noificaton();
                //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
                //     headers = headers.set('Token', 'Bearer ' + this.datauser.token);
                //     return this.http.post(this.myurl2 + fn, JSON.stringify(request_data), {headers: headers}).
                //     pipe(
                //         retry(3), 
                //         // retry a failed request up to 3 times
                //         // catchError(this.handleError) // then handle the error
                //         );
                //     }


                    // post_rqst2(request_data2: any, fn1: any):any {
                        // if( !this.chek_seission() )
                        // return false;
                        // this.noificaton();
                        // let headers = new HttpHeaders().set('Content-Type', 'application/json');
                        // headers = headers.set('Token', 'Bearer ' + this.datauser.token);
                        // return this.http.post(this.myurl2 + fn1, JSON.stringify(request_data2), {headers: headers}).
                        // pipe(
                            // retry(3), 
                            // );
                        // }




                get_rqst(request_data: any, fn: any):any {
                    if( !this.chek_seission() )
                    return false;
                    // this.noificaton();
                    
                    let headers = new HttpHeaders().set('Content-Type', 'application/json');
                    headers = headers.set('Token', 'Bearer ' + this.datauser.token);
                    return this.http.get(this.myurl + fn, {headers: headers}).
                    pipe(
                        retry(3),
                        // retry a failed request up to 3 times
                        // catchError(this.handleError ) ,
                        // then handle the error
                        );
                    }
                    
                    
                    
                    
                    login_get_rqst(request_data: any, fn: any):any {
                        
                        let headers = new HttpHeaders().set('Content-Type', 'application/json');
                        return this.http.get(this.myurl + fn, {headers: headers}).
                        pipe(
                            retry(3),
                            // retry a failed request up to 3 times
                            // catchError(this.handleError ) ,
                            // then handle the error
                            );
                        }
                        
                        
                        insert_rqst(request_data: any, fn: any):any {
                            if( !this.chek_seission() )
                            return false;
                            let headers = new HttpHeaders().set('Content-Type', 'application/json');
                            headers = headers.set('Token', 'Bearer ' + this.datauser.token);
                            return this.http.post(this.myurl + fn, JSON.stringify(request_data), {headers: headers})
                            
                        }
                        
                        
                        
                        
                        header = new HttpHeaders();
                        
                        fileData(request_data:any,fn:any):any{
                            
                            //console.log( request_data );
                            this.header.append('Content-Type', undefined);
                            
                            return this.http.post(this.myurl + fn, request_data , {headers: this.header})
                            
                        }
                        
                        
                        
                        
                        public share_data:any;
                        
                        set_fn(val:any){
                            this.share_data = val;
                        }
                        
                        get_fn(){
                            return this.share_data;
                        }    
                        
                        
                        
                        chek_seission(){
                            this.datauser = JSON.parse(sessionStorage.getItem('users')) || {};
                            if(this.datauser.id){
                                return true;
                            }else{
                                this.dialog.error("You'r session logged out ! Please Login agian");
                                // this.dialog.alert("info","Session Logged Out","You'r session logged out ! Please Login agian");
                                this.router.navigate([''] , { queryParams: { returnUrl: this.router.url }});
                                return false;
                                
                            }
                            
                        }
                        
                        
                        
                        
                        
                        // crypto(val, mode:any = true){
                        //     if(val) return new Crypto().transform( val, mode);
                        //     else return '';
                        // }
                        
                        // pickerFormat(val, format:any = 'Y-M-D'){
                        //     if(val) return new DatePikerFormat().transform( val, format);
                        // }
                        
                        goBack() {
                            window.history.back();
                        }
                        
                        
                        noificaton_rqst():any {
                            let headers = new HttpHeaders().set('Content-Type', 'application/json');
                            headers = headers.set('Token', 'Bearer ' + this.datauser.token);
                            return this.http.post(this.myurl + 'stockdata/getNotification', JSON.stringify({'login_id': this.datauser.id}), {headers: headers}).
                            pipe(
                                retry(3), 
                                );
                            }
                            
                            notifications:any = [];
                            all_notifications:any = [];
                            noificaton(){
                                this.noificaton_rqst().subscribe(d => { 
                                    //console.log(d);
                                    this.all_notifications =  d.notifications;
                                    if( d.notify.length > 0 && !this.offNotifiy){
                                        this.offFlag = false;
                                        this.notifications = d.notify;
                                        this.sendNotify(0);
                                    }
                                }); 
                            }
                            
                            offFlag:any = false;
                            offNotifiy:any = false;
                            sendNotify( index ) {
                                if(this.offFlag)return;
                                var e = this.notifications[ index ];
                                //console.log(index);
                                
                                //console.log(e);
                                if(!e)return;
                                
                                const title = e.title;
                                let options = {
                                    body : e.message,
                                    icon : 'favicon.ico'
                                }
                                
                                // this._pushNotificationService.create(title, options).subscribe((notif) => {
                                //     if (notif.event.type === 'show') {
                                //         //console.log('onshow');
                                //         setTimeout(() => {
                                //             notif.notification.close();
                                //             this.sendNotify(++index);
                                //             //console.log(index);
                                
                                //         }, 3000);
                                //     }
                                //     if (notif.event.type === 'click') {
                                //         //console.log('click');
                                //         this.offFlag = true;
                                //         notif.notification.close();
                                
                                //     }
                                //     if (notif.event.type === 'close') {
                                //         //console.log('close');
                                //     }
                                // },
                                // (err) => {
                                //     //console.log(err);
                                // });
                            }
                            
                            
                            
                            
                            
                            
                            
                            numeric_Number(event: any) {
                                const pattern = /[0-9\+\-\ ]/;
                                let inputChar = String.fromCharCode(event.charCode);
                                // //console.log(event.keyCode);
                                if (event.keyCode != 8 && !pattern.test(inputChar)) {
                                    event.preventDefault();
                                }
                            }
                            
                            
                            
                            
                            
                            
                            
                            
                            
                        }
                        
                        
                        
                        
                        