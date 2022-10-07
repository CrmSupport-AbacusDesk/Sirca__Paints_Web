import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { DialogComponent } from '../dialog.component';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-scheme-master-add',
  templateUrl: './scheme-master-add.component.html',
  styleUrls: ['./scheme-master-add.component.scss']
})
export class SchemeMasterAddComponent implements OnInit {
  
  
  scheme_id: any;
  loader:any;
  scheme_data:any={};
  today = new Date();
  login_user : any;
  login_id : any;
  
  
  constructor( public route: ActivatedRoute,public dialog:DialogComponent,public serve:PearlService) {
    
    this.login_user = JSON.parse(sessionStorage.getItem('login'));
    
    this.login_id = parseInt(this.login_user['data']['id']);
    this.login_user = this.login_user['data']['username'];
    console.log(this.login_user);
    console.log(this.login_id);
    this.scheme_data = {
      'created_by' : this.login_id,
    }
    
    
    
    this.route.params.subscribe(params => {
      console.log(params);
      this.scheme_id = params.id;
      console.log(this.scheme_id);
      if(this.scheme_id != '0'){
        console.log("in params if");
        this.get_scheme_detail()
      }
      else{
        console.log("in params else");
      }
    });
    
    
  }
  
  ngOnInit() {
  }
  
  
  back() {
    window.history.go(-1);
  }
  
  submit_pop_scheme(){
    this.loader=1;
    console.log("submit_pop_scheme method calls");
    console.log(this.scheme_data);
    
    
    if(this.scheme_id == 0){
      this.serve.fetchData(this.scheme_data,"Discount/insert_pop_scheme").subscribe((result=>{
        console.log(result);
        if(result['msg'] == 'success')
        {
          this.dialog.success("POP Gift", "Added");
          window.history.go(-1);
        }
        else if (result['msg'] == 'Scheme Exist'){
          this.dialog.error("Scheme Already Exist Of Current Date");
          
        }
        else{
          this.dialog.error("Something Went Wrong Please Try Again");
        }
      }))
      
      setTimeout (() => {
        this.loader='';
      }, 700);
    }
    
    else if(this.scheme_id != 0){
      this.serve.fetchData(this.scheme_data,"Discount/pop_scheme_edit").subscribe((result=>{
        console.log(result);
        if(result['msg'] == 'success')
        {
          this.dialog.success("POP Gift", "Update");
          window.history.go(-1);
        }
        else if (result['msg'] == 'Scheme Exist'){
          this.dialog.error("Scheme Already Exist Of Current Date");
          
        }
        else{
          this.dialog.error("Something Went Wrong Please Try Again");
        }
      }))
      
      setTimeout (() => {
        this.loader='';
      }, 700);
    }
    else{
      this.dialog.error("Something Went Wrong Please Try Again");
    }
    
  }
  
  get_scheme_detail(){
    this.serve.fetchData({ "id": this.scheme_id }, "Discount/pop_scheme_detail").subscribe((result => {
      console.log(result);
      this.scheme_data= {
        'type' : result[0]['type'],
        'scheme_percentage' : result[0]['point_percentage'],
        'start_scheme_date' : result[0]['start_date'],
        'end_scheme_date' : result[0]['end_date'],
        'created_by' : this.login_id,
        "id": this.scheme_id,
      } 
    }))
  }
  
  public onDate(event,type): void
  {
    
    console.log(type);
    if(type == 'start_scheme_date'){
      this.scheme_data.start_scheme_date=moment(event.value).format('YYYY-MM-DD'); 
      console.log(this.scheme_data);
      
    }
    
    else if(type == 'end_scheme_date'){
      this.scheme_data.end_scheme_date=moment(event.value).format('YYYY-MM-DD'); 
      console.log(this.scheme_data);
      
    }
    
    else{
      console.log(this.scheme_data);
    }
    
    
  }
  
  
}
