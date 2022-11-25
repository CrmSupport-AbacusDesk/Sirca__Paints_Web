import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment/moment';
import { DialogComponent } from '../dialog.component';
import { LocalStorage } from '../localstorage.service';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { PearlService } from '../pearl.service';


@Component({
  selector: 'app-plumber-meet',
  templateUrl: './plumber-meet.component.html',
  styleUrls: ['./plumber-meet.component.scss']
})
export class PlumberMeetComponent implements OnInit {
  search:any={};
  active_tab:any = 'All';
  plumber_meet_List:any = [];
  skelton: any = new Array(10);
  loader: any ;
  data_not_found: any = false;
  plumber_data_count:any ={}

  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  login_id:any='0';


  excel_data:any=[]
  plumber_meet_data_for_excel_download:any=[]


  constructor(public serve: PearlService,public session:LocalStorage,public dialog: MatDialog ,public alert : DialogComponent) {

    this.assign_login_data = this.session.getSession();
    console.log(this.assign_login_data.value.data.id);
    this.login_id = this.assign_login_data.value.data.id;
    this.assign_login_data = this.assign_login_data.value;

    this.assign_login_data = this.assign_login_data.assignModule;
    // this.login_id = this.assign_login_data['data'].id;
    // console.log(this.login_id);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'plumber meet');
    console.log(index);

    if(index != -1){
      this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
      this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
      this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
      console.log(this.view_add);
      console.log(this.view_edit);
      console.log(this.view_delete);

      this.search = this.serve.plumberMeetFilter;

      this.get_plumber_meet_List();

      // this.get_expense_list();

    }


  }

  ngOnInit() {
    this.get_plumber_meet_state_List();
  }


  con_date(date,type){
    this.search[type] = moment(date).format('YYYY-MM-DD');
    this.get_plumber_meet_List();
  }

  get_plumber_meet_List(action : any = ''){
    console.log("get_plumber_meet_List method caLLs");
    console.log(this.active_tab);

    if(action == "refresh"){
      this.search = {};
      this.plumber_meet_List = [];
    }

    this.loader=true;
    this.serve.fetchData({'search':this.search,'status':this.active_tab},"PlumberMeet/plumber_meet_listing_for_web")
    .subscribe((result=>{
      console.log(result);
      this.plumber_meet_List = result['plumber_meet_list']
      this.plumber_data_count = result['count_data']

      setTimeout (() => {
        this.loader=false;
      }, 700);
      if(this.plumber_meet_List.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
      }
    }))

  }

  change_plumber_meet_status(plumber_meet_id,plumber_meet_status){
    console.log("change_plumber_meet_status method calls");
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px', data: {
        'plumber_meet_id' : plumber_meet_id,
        'plumber_meet_status' : plumber_meet_status,
        'from' : 'plumber-meet-list-page'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.get_plumber_meet_List();
    });

  }

  exportAsXLSX():void {

    this.plumber_meet_data_for_excel_download = [];
    this.excel_data = [];

    // this.spinner_enable = true
    this.serve.fetchData({'search':this.search,'status':this.active_tab},"PlumberMeet/plumber_meet_list_for_excel").subscribe(((result:any)=>{

      console.log(result);
      this.plumber_meet_data_for_excel_download = result;

      for(let i=0;i<this.plumber_meet_data_for_excel_download.length;i++){
        this.excel_data.push({'Date Created':this.plumber_meet_data_for_excel_download[i].date_created,'CREATED BY':this.plumber_meet_data_for_excel_download[i].created_by_type=='Executive' ? (this.plumber_meet_data_for_excel_download[i].created_by_name && this.plumber_meet_data_for_excel_download[i].created_by_name!='' ? this.plumber_meet_data_for_excel_download[i].created_by_name : '--'):(this.plumber_meet_data_for_excel_download[i].created_by_dr_name && this.plumber_meet_data_for_excel_download[i].created_by_dr_name!='' ? this.plumber_meet_data_for_excel_download[i].created_by_dr_name : '--'),'Type':this.plumber_meet_data_for_excel_download[i].created_by_type=='Executive' ? 'Executive' : (this.plumber_meet_data_for_excel_download[i].type && this.plumber_meet_data_for_excel_download[i].type !='' && this.plumber_meet_data_for_excel_download[i].type != null ? this.plumber_meet_data_for_excel_download[i].type == '1' ? 'Distributor' : this.plumber_meet_data_for_excel_download[i].type == '3' ? 'Dealer' : 'Direct Dealer' : '--'),'Company Name':this.plumber_meet_data_for_excel_download[i].company_name,'CONTACT PERSON NAME':this.plumber_meet_data_for_excel_download[i].contact_person_name && this.plumber_meet_data_for_excel_download[i].contact_person_name !='' ? this.plumber_meet_data_for_excel_download[i].contact_person_name : '--' ,'MEETING DATE':this.plumber_meet_data_for_excel_download[i].date_of_meeting ,'TOTAL MEMBER':this.plumber_meet_data_for_excel_download[i].total_member,'TOTAL BUDGET':"&#8377; " +this.plumber_meet_data_for_excel_download[i].total_budget,'DESCRIPTION':this.plumber_meet_data_for_excel_download[i].description,'STATUS':this.plumber_meet_data_for_excel_download[i].status});
      }
      console.log(this.excel_data);
      this.serve.exportAsExcelFile(this.excel_data, 'Plumber Meet Sheet');

      // this.spinner_enable = false;


    }))


  }
  state_values:any=[];
  get_plumber_meet_state_List(){
    this.serve.fetchData({'search':this.search.state},"PlumberMeet/state_list").subscribe(((result)=>{
      console.log(result);
      this.state_values=result

    }))


















  }

  deletePlumberMeet(id){
    console.log(id);
    this.serve.fetchData({'id':id},'PlumberMeet/delete_plumber_meet').subscribe((res)=>{
      console.log(res['msg']['msg']);
      
        if(res['msg']['msg'] == 'meet deleted successfully'){
          this.alert.success("Plumber Meet","Successfully Deleted");
          this.get_plumber_meet_List();
        }else{
          this.alert.error("Something Went Wrong");
        }
    })
    
  }

}