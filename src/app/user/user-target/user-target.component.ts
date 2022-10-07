import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { parse } from 'querystring';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user-target',
  styleUrls: ['./user-target.component.scss'],
  templateUrl: './user-target.component.html',
})
export class UserTargetComponent implements OnInit {
  
  target_list:any=[];
  login_user: any={};
  login_id: any = '0';
  today_date = new Date()
  current_year = new Date().getFullYear();
  one_year_from_now = (this.today_date.getFullYear() + 1);
  
  
  constructor(public route:ActivatedRoute,public serve:PearlService,public dialog:DialogComponent,@Inject(MAT_DIALOG_DATA)public data) { 
    
    console.log(this.current_year);
    console.log(this.one_year_from_now);
    this.login_user = JSON.parse(sessionStorage.getItem('login'));
    console.log(this.login_user);
    this.login_id = parseInt(this.login_user['data']['id']);
    console.log(this.login_id);
    this.data.created_by = this.login_id;
    console.log(this.data);
    this.getTargetList();
    this.disable_month(2021,'1')
    
  }
  
  ngOnInit() {
    
  }
  
  
  add_target(){
    console.log(this.data);
    this.serve.fetchData(this.data,"User/submit_target")
    .subscribe(resp=>{
      console.log(resp);
      this.getTargetList();
      var user_id = this.data.user_id;
      this.data = {};
      this.data.user_id = user_id;
      this.data.created_by = this.login_id;
      
    })
    
  }
  
  getTargetList()
  {
    this.serve.fetchData({'id':this.data.user_id},"User/target_list").subscribe((result)=>{
      console.log(result);
      this.target_list=result['target_list'];
    });
  }
  
  
  deleteTarget(id){
    
    console.log(id);
    this.serve.fetchData({'id':parseInt(id)},"User/delete_target").subscribe((result)=>{
      console.log(result);
      this.getTargetList();
    });
  }
  
  
  disable_month(year,month){
   
    if(year == this.today_date.getFullYear()){
      
      if(month < this.today_date.getMonth()){
        return true;
      }
      else{
        return false;
      }
    }
    
    else{
      return false;
    }
    
  }
  
  
}
