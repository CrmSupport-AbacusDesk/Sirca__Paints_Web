import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { LocalStorage } from 'src/app/localstorage.service';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { PearlService } from 'src/app/pearl.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {

  start_attend_time: string;
  loader:any = '';
  data_not_found=false;
  data:any = {};
  activity:any = [];
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
  login_data: any = {};
  search_val:any={};


  constructor(public serve:PearlService,public location: Location,public navparams: ActivatedRoute,public route:Router,public dialog:DialogComponent,public popup_dialog: MatDialog,public session:LocalStorage) {

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.login_data = this.assign_login_data.data;

    console.log("User Id :",this.login_data);

    this.assign_login_data = this.assign_login_data.assignModule;
    // this.assign_login_data = this.assign_login_data.data;

    console.log("User Login Data : ",this.assign_login_data);

    // // this.login_data = this.session.getSession();
    // // this.login_data = this.login_data.data;

    // // console.log("Login result",this.login_data);

    // const index = this.assign_login_data.findIndex(row => row.module_name == 'check in');
    // console.log(index);

    // this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    // this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    // this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

    // console.log(this.view_add);
    // console.log(this.view_edit);
    // console.log(this.view_delete);

    console.log(this.navparams['params']['_value']['selectedUser']);
    this.searchData = (this.navparams['params']['_value']);
    console.log(this.searchData);


    if (this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.selected_company_name) {
      this.backButton = true;
      if(this.searchData.selectedDate == this.today_date){
        this.activity = [];
        this.data.user_name = this.searchData.selectedUser;
        this.data.company_name = this.searchData.selected_company_name;
        this.distributorList('get_today_activity_list',1);
      }
      else{
        this.activity = [];
        this.data.user_name = this.searchData.selectedUser;
        this.data.date_created = this.searchData.selectedDate;
        this.data.company_name = this.searchData.selected_company_name;

        this.distributorList('get_all_activity_list',2);
      }
      console.log("in navparams");

    }


    this.distributorList('get_today_activity_list',1);
    console.log('gfvdb');
    this.skelton = new Array(10);
  }

  ngOnInit() {
  }


  distributorList(func_name,type:any='')
  {



    if(func_name == 'refresh'){
      this.data = {};
      this.activity = [];
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
      this.activity = [];
    }
    if(this.data.date_created || this.data.date_from || this.data.date_to)
    {
      this.data.date_created ? this.data.date_created=moment(this.data.date_created).format('YYYY-MM-DD') : '';
      this.data.date_from ? this.data.date_from = this.data.date_from=moment(this.data.date_from).format('YYYY-MM-DD') : '';
      this.data.date_to ? this.data.date_to = this.data.date_to=moment(this.data.date_to).format('YYYY-MM-DD') : '';

    }

    this.serve.fetchData({'start':this.start,'pagelimit':this.pagelimit,'search':this.data , 'user_id':this.login_data.id , 'user_type':this.login_data.user_type},"Distributors/"+func_name)
    .subscribe(((result:any)=>{
      console.log(result);
      // this.activity = (result['today_activity_list']);
      this.activity = (result['result']);

      // alert(result.today_count);
      this.count_1 = result.today_count;
      this.count_2 = result.all_count;

      this.count=result['count'];
      this.total_page = Math.ceil(this.count/this.pagelimit);
      this.pagenumber = Math.ceil(this.start/this.pagelimit)+1;


      if(func_name == 'get_today_activity_list')
      this.show_today = true;


      console.log(this.activity);
      if(this.activity.length ==0){
        this.data_not_found=true;
      } else {
        this.data_not_found=false;
      }
      setTimeout (() => {
        this.loader='';

      }, 100);
    }))
  }


  change_tab(fn_name,type)
  {
    this.activity = [];
    this.data = {};
    this.distributorList(fn_name,type);

  }
  excel_data:any=[];
  excel_activity_from_api:any = [];
  // exportAsXLSX():void {

  //   let func_name = this.show_today==true ? 'get_today_activity_list' : 'get_all_activity_list';

  //   this.excel_checkins_from_api = [];
  //   this.excel_data = [];

  //   this.spinner_enable = true
  //   this.serve.fetchData({'search':this.data},"Distributors/"+func_name).subscribe(((result:any)=>{

  //     console.log(result);
  //     this.excel_checkins_from_api = result['result'];

  //     for(let i=0;i<this.excel_checkins_from_api.length;i++){
  //       this.excel_data.push({
  //         'Date':this.excel_checkins_from_api[i].activity_date,
  //         'Sales User':this.excel_checkins_from_api[i].exec_name,
  //         'Type':this.excel_checkins_from_api[i].dr_type==3?'Dealer':(this.excel_checkins_from_api[i].dr_type==''?'other':'Distributor'),
  //         'Company Name':this.excel_checkins_from_api[i].other_name==''?this.excel_checkins_from_api[i].company_name:this.excel_checkins_from_api[i].other_name,
  //         'Contact Person':this.excel_checkins_from_api[i].contact_person && this.excel_checkins_from_api[i].contact_person!='' ? this.excel_checkins_from_api[i].contact_person : '--' ,
  //         'Contact No.':this.excel_checkins_from_api[i].dr_mobile && this.excel_checkins_from_api[i].dr_mobile!='' ? this.excel_checkins_from_api[i].dr_mobile : '--' ,
  //         'Check In':this.excel_checkins_from_api[i].visit_start +' '+ this.excel_checkins_from_api[i].start_address  ,
  //         'Check Out':this.excel_checkins_from_api[i].visit_end+' '+ this.excel_checkins_from_api[i].address,
  //         'Remark':this.excel_checkins_from_api[i].description,
  //         'Verification':this.excel_checkins_from_api[i].checkin_verification_status && this.excel_checkins_from_api[i].checkin_verification_status!= ''?(this.excel_checkins_from_api[i].checkin_verification_status == 'to_be_re_verified' ? 'To Be Verified' : 'Verified'):'--',
  //         'Verified By':this.excel_checkins_from_api[i].status_update_by_name && this.excel_checkins_from_api[i].status_update_by_name!= '' && this.excel_checkins_from_api[i].status_update_by_name!= null?this.excel_checkins_from_api[i].status_update_by_name:'--',
  //         'Verification Date':this.excel_checkins_from_api[i].checkin_verification_on != '0000-00-00' ? (this.excel_checkins_from_api[i].checkin_verification_on) : '--',
  //         'Verification Remark':this.excel_checkins_from_api[i].checkin_verification_remark,
  //         'Company Status':this.excel_checkins_from_api[i].checkin_status});
  //       }
  //       console.log(this.excel_data);
  //       this.serve.exportAsExcelFile(this.excel_data, 'Check IN  Sheet');

  //       this.spinner_enable = false;


  //     }))


  //   }


    // filter_checkins(data)
    // {
    //   console.log(data);
    //   this.serve.fetchData({company_name:this.data.company_name,user_name:this.data.user_name},"Distributors/get_all_checkin").subscribe((result=>{
    //     console.log(result);
    //     this.checkins = result;
    //     console.log(this.checkins);
    //   }))
    // }

  exportAsXLSX(fn_name,type) : void{
    this.spinner_enable = true

    console.log(type);
    console.log(fn_name);
    // console.log(data);
    this.excel_data = [];
    this.serve.fetchData({'start':this.start,'pagelimit':this.pagelimit,'search':this.data , 'user_id':this.login_data.id , 'user_type':this.login_data.user_type},"Distributors/"+fn_name).subscribe((res)=>{
      console.log(res);
      this.excel_activity_from_api = res['result'];
      console.log(this.excel_activity_from_api);

      for(let x=0; x<this.excel_activity_from_api.length; x++){
        this.excel_data.push({
            'Date': this.excel_activity_from_api[x].date_created,
            'Created by': this.excel_activity_from_api[x].created_by_name,
            'Company Name': this.excel_activity_from_api[x].company_name,
            'City': this.excel_activity_from_api[x].dr_city,
            'Contact Person': this.excel_activity_from_api[x].contact_person,
            'Contact No.': this.excel_activity_from_api[x].mobile,
            'Activity Type': this.excel_activity_from_api[x].activity_type,
            'Distributor Name': this.excel_activity_from_api[x].distributor_name,
            'Disposition Type': this.excel_activity_from_api[x].disposition_type_value,
            'Disposition Name': this.excel_activity_from_api[x].disposition_name,
            'Product Quality': this.excel_activity_from_api[x].product_quality,
            'Working Tenure': this.excel_activity_from_api[x].working_tenure,
            'Purchase Frequency': this.excel_activity_from_api[x].purchase_frequency,
            'Segment in Sirca': this.excel_activity_from_api[x].segments_in_Sirca,
            'Why Not ALL Segments of Sirca ': this.excel_activity_from_api[x].why_not_all_segments_of_Sirca,
            'Dealing In How Many Brands': this.excel_activity_from_api[x].dealing_in_how_many_brands,
            'Most Selling Brands': this.excel_activity_from_api[x].most_selling_brands,
            'Status': this.excel_activity_from_api[x].status,
            'Remark': this.excel_activity_from_api[x].remark,

        })

      }
      this.serve.exportAsExcelFile(this.excel_data,'Activity Sheet');
    this.spinner_enable = false;

    })


  }

    openDialog(id,checkin_status): void {
      const dialogRef = this.popup_dialog.open(StatusModalComponent, {
        width: '400px', data: {
          'data' : 'Change Status from checkin',
          'checkin_verification_status' : checkin_status,
          'checkin_id' : id,
        }
      });
      this.loader = 1;
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.loader = '';
        this.activity = [];
        this.distributorList((this.show_today==false?'get_all_activity_list':'get_today_activity_list'),(this.show_today==false?2:1));

      },err => {
        this.loader = '';
      });
    }


    back(): void {
      console.log("location back method calls");
      console.log(this.location);
      this.location.back()
    }

}
