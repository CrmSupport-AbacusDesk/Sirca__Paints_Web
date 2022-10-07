import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import * as moment from 'moment';
import {  Router } from '@angular/router';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { DialogComponent } from '../dialog.component';
import { LocalStorage } from '../localstorage.service';

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.scss']
})
export class AttendenceComponent implements OnInit {
  data:any={};
  start_attend_time: string;
  loader:any;
  value:any={};
  att_temp:any=[];
  data_not_foun:any=false;
  pagelimit:any=50;
  skelton:any={}
  
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  
  data_not_found=false;
  
  attendancelist:any=[];
  show_today:boolean=true;
  count_1:any;
  count_2:any;
  tmpsearch1:any={};
  
  
  constructor(public rout:Router,public serve:PearlService,public dialog:DialogComponent,public session:LocalStorage) {
    this.skelton = new Array(10);
    
    
    //not use now 
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'attendence');
    console.log(index);
    
    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
    
    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);
  }
  
  ngOnInit() {
    this.attendance_list('getattendance_today',1);
  }
  
  change_tab(fn_name,type)
  {
    this.attendancelist = [];
    this.attendance_list(fn_name,type);
  } 
  
  attendance_list(func_name,type)
  {
    this.loader=1;
    if( Object.getOwnPropertyNames(this.data).length != 0)
    {
      // this.pagelimit = 0;
      this.attendancelist = [];
    }
    
    if(this.data.date_created)
    this.data.date_created = moment(this.data.date_created).format('YYYY-MM-DD');
    
    this.serve.fetchData({'start':this.attendancelist.length,'pagelimit':this.pagelimit,'search':this.data},"Attendance/"+func_name)
    .subscribe(((result:any)=>{
      console.log(result);
      console.log(result['attendence']);
      this.attendancelist = this.attendancelist.concat(result['attendence']);
      this.att_temp = result['attendence'];
      
      if(type == 1)
      {
        this.count_1 = this.attendancelist.length;
        this.count_2 = result.count;
        this.show_today = true;    
      }
      else
      {
        this.count_1 = result.count;
        this.count_2 = this.attendancelist.length;    
        this.show_today = false;    
      }
      
      console.log(this.attendancelist);
      console.log('in');
      setTimeout (() => {
        this.loader='';
        
      }, 100);
      if(this.attendancelist.length ==0){
        this.data_not_found=true;
      }
      
    }))
    
    
  }
  
  reset_attendance(id:any){
    var value = this.dialog.reset_att().then((result) => {
      console.log(result);
      if(result)
      {
        this.serve.fetchData( {'id':id}, 'Attendance/update_attendance')
        .subscribe(res => {
          console.log(res);
          this.attendance_list('getattendance_today',1);
          this.dialog.success_att('Reset Done','Attendance has been updated.');
        },err=>{
          console.log(err);
          this.dialog.error('Something went wrong! Try Again ...');
        });
      }
    });
  }
  
  excel_data:any=[];
  exportAsXLSX():void {
    for(let i=0;i<this.attendancelist.length;i++){
      this.excel_data.push({'Date':this.attendancelist[i].attend_date,'User Name':this.attendancelist[i].name,'Start Time':this.attendancelist[i].start_time,'Start Location':this.attendancelist[i].start_address,'Stop Time':this.attendancelist[i].stop_time,'Stop Location':this.attendancelist[i].stop_address,'Work Type':this.attendancelist[i].work_type,'Travel Place':this.attendancelist[i].travel_place});
    }
    this.serve.exportAsExcelFile(this.excel_data, 'Attendance Sheet');
  }
  // tConv24(time24) {
  //   var ts = time24;
  //   var H = +ts.substr(0, 2);
  //   var h = (H % 12) || 12;
  //   h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
  //   var ampm = H < 12 ? " AM" : " PM";
  //   ts = h + ts.substr(2, 3) + ampm;
  //   return ts;
  // };
  filter_attendance(data){
    console.log(data);
    console.log(this.data);
    this.serve.fetchData({data:this.data.name,date:moment(this.data.date_created).format('YYYY-MM-DD')},"Attendance/getAttendance")
    .subscribe((result=>{
      console.log(result);
      // this.attendancelist = result;
      console.log(result['attendence']);
      this.attendancelist = result['attendence'];
      console.log(this.attendancelist);
      console.log('in');
      if(this.data.name==''){
        this.attendance_list('getAttendance',2);
      }
    }))
  }
  getItemsList(search)
  {
    console.log(search);
    this.attendancelist=[];
    
    
    for(var i=0;i<this.att_temp.length; i++)
    {
      search=search.toLowerCase();
      this.tmpsearch1=this.att_temp[i]['name'].toLowerCase();
      if(this.tmpsearch1.includes(search))
      {
        // console.log(this.orderlist);
        console.log(search);
        
        this.attendancelist.push(this.att_temp[i]);
      }     
      
    }
    
    
    
    console.log(this.attendancelist);
    
  }
  
  refresh(){
    this.attendancelist = [];
    this.data = {};
    this.show_today ? this.attendance_list('getattendance_today',1):this.attendance_list('getAttendance',2);
  }
  
}
