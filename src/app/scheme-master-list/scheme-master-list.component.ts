import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DialogComponent } from '../dialog.component';
import { LocalStorage } from '../localstorage.service';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-scheme-master-list',
  templateUrl: './scheme-master-list.component.html',
  styleUrls: ['./scheme-master-list.component.scss']
})
export class SchemeMasterListComponent implements OnInit {
  
  
  skelton:any={}
  loader:any;
  search_filter:any={};
  scheme_list:any=[];
  data_not_found: any = false;
  today = new Date();
  today_formatted : any;
  
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;

  
  
  
  
  constructor(public route:Router,public serve:PearlService,public dialog:DialogComponent,public session:LocalStorage) {
    
    this.skelton = new Array(10);

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'pop master');
    console.log(index);
    
    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
     
    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);


    this.scheme_list_method();
    this.today_formatted=moment(this.today).format('YYYY-MM-DD'); 

    
  }
  
  ngOnInit() {
  }
  
  delete_scheme(id){
    console.log("delete_scheme method calls");
    
    
    this.dialog.delete('POP GIFT Data !').then((result) => {
      if(result){
        this.loader=1;
        this.serve.fetchData({'id':id},"Discount/pop_scheme_delete").subscribe((result=>{
          console.log(result);
          if(result['msg'] == 'success')
          {
            this.dialog.success("POP Scheme", "Delete");
            this.scheme_list_method()
          }
          else{
            this.dialog.error("Something Went Wrong Please Try Again");
          }
        }))
        
        setTimeout (() => {
          this.loader='';
        }, 700);
        
      }
    });
  }
  
  back() {
    window.history.go(-1);
  }
  
  public onDate(event,type): void
  {
    
    console.log(type);
    if(type == 'date_created'){
      this.search_filter.date_created=moment(event.value).format('YYYY-MM-DD'); 
      console.log(this.search_filter);
      this.scheme_list_method()
      
      
    }
    
    else if(type == 'date_from'){
      this.search_filter.date_from=moment(event.value).format('YYYY-MM-DD'); 
      console.log(this.search_filter);
      this.scheme_list_method()
    }
    
    else if(type == 'date_to'){
      this.search_filter.date_to=moment(event.value).format('YYYY-MM-DD'); 
      console.log(this.search_filter);
      this.scheme_list_method()
    }
    else{
      console.log(this.search_filter);
    }
    
    
  }
  
  scheme_list_method(){
    this.loader=true;
    
    this.serve.fetchData(this.search_filter,"Discount/pop_scheme_listing")
    .subscribe((result=>{
      console.log(result);
      this.scheme_list= result['result'];
      console.log(this.scheme_list);
      
      setTimeout (() => {
        this.loader=false;
        
      }, 700);
      if(this.scheme_list.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
    }))
  }
  
}
