import { Component, OnInit } from '@angular/core';
import { PearlService } from '../pearl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import * as moment from 'moment';
import { LocalStorage } from '../localstorage.service';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
  start_attend_time: string;
  loader:any = '';
  data_not_found=false;
  data:any = {};
  checkins:any = [];
  show_today:boolean = true;
  count_1:any;
  count_2:any;
  pagelimit:any=50;
  skelton:any={}
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  test_variable:string = 'pending';
  searchData: any = {};
  backButton: boolean = false;
  today_date = new Date().toISOString().slice(0,10);
  previous_function_name : any = ''
  excel_checkins_from_api:any=[]
  spinner_enable:any=false;

  total_page:any='';
  pagenumber:any='';
  start:any=0;
  count: any;
  verification_status:any = '';


  constructor(public serve:PearlService,public location: Location,public navparams: ActivatedRoute,public route:Router,public dialog:DialogComponent,public popup_dialog: MatDialog,public session:LocalStorage , public toast:ToastrManager) {

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'check in');
    console.log(index);

    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);

    console.log(this.navparams['params']['_value']['selectedUser']);
    this.searchData = (this.navparams['params']['_value']);
    console.log(this.searchData);


    if (this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.selected_company_name) {
      this.backButton = true;
      if(this.searchData.selectedDate == this.today_date){
        this.checkins = [];
        this.data.user_name = this.searchData.selectedUser;
        this.data.company_name = this.searchData.selected_company_name;
        this.distributorList('get_today_checkin_new',1);
      }
      else{
        this.checkins = [];
        this.data.user_name = this.searchData.selectedUser;
        this.data.date_created = this.searchData.selectedDate;
        this.data.company_name = this.searchData.selected_company_name;

        this.distributorList('get_all_checkin_new',2);
      }
      console.log("in navparams");

    }


    this.distributorList('get_today_checkin_new',1);
    console.log('gfvdb');
    this.skelton = new Array(10);
  }

  ngOnInit() {
  }


  distributorList(func_name,type:any='')
  {
    this.spinner_enable = true;

    if(func_name == 'refresh'){
      this.data = {};
      this.checkins = [];
      this.start = 0;
    }
    else{
      this.previous_function_name = func_name;
    }

    func_name = this.previous_function_name;


    console.log(this.pagelimit);
    this.loader=1;
    console.log(Object.getOwnPropertyNames(this.data).length);



    if( Object.getOwnPropertyNames(this.data).length != 0)
    {
      console.log("yes");

      // this.pagelimit = 0;
      this.checkins = [];
    }
    if(this.data.date_created || this.data.date_from || this.data.date_to)
    {
      this.data.date_created ? this.data.date_created=moment(this.data.date_created).format('YYYY-MM-DD') : '';
      this.data.date_from ? this.data.date_from = this.data.date_from=moment(this.data.date_from).format('YYYY-MM-DD') : '';
      this.data.date_to ? this.data.date_to = this.data.date_to=moment(this.data.date_to).format('YYYY-MM-DD') : '';

    }
   
    this.serve.fetchData({'start':this.start,'pagelimit':this.pagelimit,'search':this.data},"Distributors/"+func_name)
    .subscribe(((result:any)=>{
      console.log(result);
      this.checkins = (result['result']);

      // alert(result.today_count);
      this.count_1 = result.today_count;
      this.count_2 = result.all_count;

      this.count=result['count_for_pagination'];
      this.total_page = Math.ceil(this.count/this.pagelimit);
      this.pagenumber = Math.ceil(this.start/this.pagelimit)+1;


      if(func_name == 'get_today_checkin_new')
      this.show_today = true;


      console.log(this.checkins);
      if(this.checkins.length ==0){
        this.data_not_found=true;
      } else {
        this.data_not_found=false;
      }
      setTimeout (() => {
        this.loader='';
      this.spinner_enable = false;

      }, 100);
    }))
  }


  change_tab(fn_name,type)
  {
    this.checkins = [];
    this.data = {};
    this.distributorList(fn_name,type);
  }
  excel_data:any=[];
  exportAsXLSX():void {

    let func_name = this.show_today==true ? 'get_today_checkin_new' : 'checkin_all_new_excel';

    this.excel_checkins_from_api = [];
    this.excel_data = [];

    this.spinner_enable = true
    this.serve.fetchData({'search':this.data},"Distributors/"+func_name).subscribe(((result:any)=>{

      console.log(result);
      this.excel_checkins_from_api = result['result'];

      for(let i=0;i<this.excel_checkins_from_api.length;i++){

        if(this.excel_checkins_from_api[i].checkin_verification_status && this.excel_checkins_from_api[i].checkin_verification_status!= '' && this.excel_checkins_from_api[i].checkin_verification_status == 'verified'){

          this.verification_status = 'Verified';

        }else if(this.excel_checkins_from_api[i].checkin_verification_status && this.excel_checkins_from_api[i].checkin_verification_status!= '' && this.excel_checkins_from_api[i].checkin_verification_status == 'to_be_re_verified'){

          this.verification_status = 'To Be Verified';

        }else if(this.excel_checkins_from_api[i].checkin_verification_status && this.excel_checkins_from_api[i].checkin_verification_status!= '' && this.excel_checkins_from_api[i].checkin_verification_status == 'not_connected'){

          this.verification_status = 'Not Connected';
        }
        else{

          this.verification_status = 'Pending';

        }

        this.excel_data.push({
          'Date':this.excel_checkins_from_api[i].activity_date,
          'Sales User':this.excel_checkins_from_api[i].exec_name,
          'Company Name':this.excel_checkins_from_api[i].other_name==''?this.excel_checkins_from_api[i].company_name:this.excel_checkins_from_api[i].other_name,
          'Contact Person':this.excel_checkins_from_api[i].contact_person && this.excel_checkins_from_api[i].contact_person!='' ? this.excel_checkins_from_api[i].contact_person : '--' ,
          'Contact No.':this.excel_checkins_from_api[i].dr_mobile && this.excel_checkins_from_api[i].dr_mobile!='' ? this.excel_checkins_from_api[i].dr_mobile : '--' ,
          'Check In':this.excel_checkins_from_api[i].visit_start +' '+ this.excel_checkins_from_api[i].start_address  ,
          'Check Out':this.excel_checkins_from_api[i].visit_end+' '+ this.excel_checkins_from_api[i].address,
          'Remark':this.excel_checkins_from_api[i].description,
          'Type':this.excel_checkins_from_api[i].dr_type==3?'Retail Partner':(this.excel_checkins_from_api[i].dr_type==''?'other':'Channel Partner'),
          // 'Verification':this.excel_checkins_from_api[i].checkin_verification_status && this.excel_checkins_from_api[i].checkin_verification_status!= '' && this.excel_checkins_from_api[i].checkin_verification_status != 'Pending'?(this.excel_checkins_from_api[i].checkin_verification_status == 'to_be_re_verified' ? 'To Be Verified' : 'Verified'):'Pending',
          'Verification': this.verification_status,
          'Verified By':this.excel_checkins_from_api[i].status_update_by_name && this.excel_checkins_from_api[i].status_update_by_name!= '' && this.excel_checkins_from_api[i].          status_update_by_name!= null?this.excel_checkins_from_api[i].status_update_by_name:'--',
          'Verification Date':this.excel_checkins_from_api[i].checkin_verification_on != '0000-00-00' ? (this.excel_checkins_from_api[i].checkin_verification_on) : '--',
          'Verification Remark':this.excel_checkins_from_api[i].checkin_verification_remark,
          'Available Brands':this.excel_checkins_from_api[i].available_brands,
          'Company Status':this.excel_checkins_from_api[i].checkin_status});  
        }
        console.log(this.excel_data);
        this.serve.exportAsExcelFile(this.excel_data, 'Check IN  Sheet');

        this.spinner_enable = false;


      }))


    }


    // filter_checkins(data)
    // {
    //   console.log(data);
    //   this.serve.fetchData({company_name:this.data.company_name,user_name:this.data.user_name},"Distributors/get_all_checkin").subscribe((result=>{
    //     console.log(result);
    //     this.checkins = result;
    //     console.log(this.checkins);
    //   }))
    // }


    openDialog(id,checkin_status,sales_user_name): void {
      const dialogRef = this.popup_dialog.open(StatusModalComponent, {
        width: '800px', data: {
          'data' : 'Change Status from checkin',
          'checkin_verification_status' : checkin_status,
          'checkin_id' : id,
          'sales_user_name':sales_user_name
        }
      });
      this.loader = 1;
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.loader = '';
        this.checkins = [];
        this.distributorList((this.show_today==false?'get_all_checkin_new':'get_today_checkin_new'),(this.show_today==false?2:1));

      },err => {
        this.loader = '';
      });
    }

    // copyText(){
    //   var copyTextarea = document.getElementById('copytext') ;
    //   var textarea = document.createElement("textarea");
    //   textarea.value = copyTextarea.textContent;
    //   document.body.append(textarea);
    //   textarea.select();
    //   document.execCommand("copy");
    //   textarea.remove();
      
    // }

    back(): void {
      console.log("location back method calls");
      console.log(this.location);
      this.location.back()
    }

  }
