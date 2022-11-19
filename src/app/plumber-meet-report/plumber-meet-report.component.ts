import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-plumber-meet-report',
  templateUrl: './plumber-meet-report.component.html',
  styleUrls: ['./plumber-meet-report.component.scss']
})
export class PlumberMeetReportComponent implements OnInit {
  
  
  plumber_meet_report_data:any=[];
  search:any={};
  skelton: any = {};
  loader: any ;
  data_not_found: any = false;
  data:any={}
  today = new Date();
  
  total_page:any='';
  pagenumber:any='';
  start:any=0;
  count: any;
  page_limit:any=50;
  
  excel_data:any=[]
  plumber_meet_data_for_excel_download:any=[]
  
  
  
  
  constructor(public serve:PearlService,public dialog: MatDialog) { }
  
  ngOnInit() {
  }
  
  get_plumber_meet_report_data(action:any='')
  {
    
    if(action == "refresh"){
      this.search = {};
      this.plumber_meet_report_data = [];
      
    }
    
    this.loader =true;
    this.serve.fetchData({'search':this.search},"PlumberMeet/plumber_meet_report").subscribe((result=>{
      console.log(result);
      this.plumber_meet_report_data=result['plumber_meet_list'];
      console.log(this.plumber_meet_report_data);
      
      this.count=result['plumber_meet_list_count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      setTimeout (() => {
        this.loader= false;
      }, 700);
      
      if(this.plumber_meet_report_data.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
      }
      
    }))
  }
  
  con_date(date){
    return moment(date).format('YYYY-MM-DD');
  }
  
  view_plumber_details(plumber_meet_id){
    console.log("view_plumber_details method calls");
    
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '800px', data: {
        'plumber_meet_id' : plumber_meet_id,
        'from' : 'plumber_meet_report'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.get_plumber_meet_report_data();
    });
    
  }
  
  download_excel():void {
    
    console.log("download_excel method calls");
    
    this.plumber_meet_data_for_excel_download = [];
    this.excel_data = [];
    
    // this.spinner_enable = true
    this.serve.fetchData({'search':this.search},"PlumberMeet/plumber_meet_report_excel").subscribe(((result:any)=>{
      
      console.log(result);
      this.plumber_meet_data_for_excel_download = result['plumber_meet_list'];
      
      for(let i=0;i<this.plumber_meet_data_for_excel_download.length;i++){
        this.excel_data.push({
          'Distributor':this.plumber_meet_data_for_excel_download[i].created_by_type == 'dr_login' ? (this.plumber_meet_data_for_excel_download[i].type == '1' ? this.plumber_meet_data_for_excel_download[i].created_by_dr_name : this.plumber_meet_data_for_excel_download[i].distributor_name) : (this.plumber_meet_data_for_excel_download[i].company_name && this.plumber_meet_data_for_excel_download[i].company_name!= '' ? this.plumber_meet_data_for_excel_download[i].company_name : '--'),
          'DEALER':this.plumber_meet_data_for_excel_download[i].created_by_type == 'dr_login' && this.plumber_meet_data_for_excel_download[i].type == '3' ?  this.plumber_meet_data_for_excel_download[i].created_by_dr_name : '--',
          'PLUMBER COUNT':this.plumber_meet_data_for_excel_download[i].total_member,
          'DATE OF MEETING':this.plumber_meet_data_for_excel_download[i].date_of_meeting,
          'STATE':this.plumber_meet_data_for_excel_download[i].dr_state,
          'CITY':this.plumber_meet_data_for_excel_download[i].dr_city,
          'PINCODE':this.plumber_meet_data_for_excel_download[i].dr_pincode,
          'SALES EXECUTIVE':this.plumber_meet_data_for_excel_download[i].created_by_type =='Executive' ? this.plumber_meet_data_for_excel_download[i].created_by_name :'--',
          'EXPECTED BUDGET':this.plumber_meet_data_for_excel_download[i].total_budget,
          'ACTUAL EXPENSE	':this.plumber_meet_data_for_excel_download[i].expense,
          'ALL PARTICIPENT	':this.plumber_meet_data_for_excel_download[i].all_participent,
        });
      }
      console.log(this.excel_data);
      this.serve.exportAsExcelFile(this.excel_data, 'Plumber Meet Sheet');
      
      // this.spinner_enable = false;
      
      
    }))
    
    
  }
  
  
  
}
