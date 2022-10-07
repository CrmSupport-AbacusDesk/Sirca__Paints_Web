import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog,  } from '@angular/material';
import { Toastr, ToastrManager } from 'ng6-toastr-notifications';

import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-quotation-email-modal',
  templateUrl: './quotation-email-modal.component.html',
  styleUrls: ['./quotation-email-modal.component.scss']
})
export class QuotationEmailModalComponent implements OnInit {
  className:string='';
  showEmailError:boolean=false;
  item:any={};
  login_user:any;
  loginId:any;
  loader:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog ,public serve:PearlService , public toast:ToastrManager ) { 

    console.log('Table Modal List', data['data']);
    console.log('session Storage', JSON.parse(sessionStorage.getItem('login')));
    this.item.email_id=data['data'].email_id;
    this.item.email_cc=data['data'].email_cc;
    this.login_user=JSON.parse(sessionStorage.getItem('login'));
    this.loginId=this.login_user['data'].id;
  }

  ngOnInit() {
  }

  emailValidate(data){
    console.log(data);
    let regex=/(^[a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,3}$)/;
    
    if(regex.test(data)){
      console.log('ok');
      this.showEmailError=false;
    }else{
      this.showEmailError=true;
    }
  }

  sendEmail(){
    console.log("send email api called");
    this.loader=true;
    this.serve.fetchData({'quotation_id':this.data['data'].id,'dr_id':'','data':this.item, 'user_id':this.loginId},'Quotation/sendPdf_in_mail').subscribe((resp)=>{
      console.log(resp);
      if(resp['msg']=="mail sent successfully"){
        this.loader=false;
        this.dialog.closeAll();
      this.toast.successToastr('Email Sent SuccessFully');
      }
      else if(resp['msg']=="There is some problem"){
        this.loader=false;

        this.dialog.closeAll();

      this.toast.errorToastr('Something Went Wrong... Please Try Again..');
        
      }
      else if(resp['msg']=="Email not found"){
        this.loader=false;

        this.dialog.closeAll();

        this.toast.errorToastr('Oops.. No Mail Found...');
      
        
      }

 
      
    })
    
  }

}
