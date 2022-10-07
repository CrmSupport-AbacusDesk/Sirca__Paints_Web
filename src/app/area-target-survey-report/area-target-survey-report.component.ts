import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-area-target-survey-report',
  templateUrl: './area-target-survey-report.component.html',
  styleUrls: ['./area-target-survey-report.component.scss']
})
export class AreaTargetSurveyReportComponent implements OnInit {
  
  loader:boolean=false;
  survey_report_data:any = [];
  search_val: any = {};
  
  count: any;
  total_page:any='';
  pagenumber:any='';
  page_limit:any=50;
  start:any=0;
  skelton: any = new Array(10);
  
  download_survey_excel_data: any;
  excel_data: any = [];
  excel_loader:any=false;
  
  constructor(public serve:PearlService, public dialogs: MatDialog,) {
    this.get_survey_report_data()
  }
  
  ngOnInit() {
  }
  
  
  get_survey_report_data(action:any=''){
    
    if(action == 'refresh'){
      this.search_val = {};
      this.start = 0
    }
    
    this.loader = true;
    
    this.serve.fetchData({'search':this.search_val,'start':this.start,'pagelimit':this.page_limit},"User/dr_area_target_survey_data_list").subscribe((result=>{
      console.log(result);
      this.survey_report_data=result['survey_list'];
      this.count=result['survey_list_count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      this.loader = false;
      
    }))
  }
  
  
  view_details(survey_id): void {
    
    console.log('view_details method calls');
    const dialogRef = this.dialogs.open(StatusModalComponent, {
      width: '850px', data:{
        'survey_id' : survey_id,
        'from' : 'area_target_survey_report'
      }
      
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.get_survey_report_data();
    });
  }
  
  con_date(date){
    this.search_val.date_created = moment(date).format('YYYY-MM-DD');
    console.log(this.search_val.date_created);
    this.get_survey_report_data();
    
  }
  
  download_excel(){
    console.log("download_excel method calls");
    this.excel_data = [];
    this.excel_loader = true;
    this.serve.fetchData({'search':this.search_val},"User/dr_area_target_survey_data_list_for_excel").subscribe((result=>{
      console.log(result);
      this.download_survey_excel_data = result['survey_list'];
      
      for(let i=0;i<this.download_survey_excel_data.length;i++){
        
        let keys_value : any = [];
        keys_value = Object.keys(this.download_survey_excel_data[i])
        
        let excel_object: any = {}
        
        for(let secondary_index=0;secondary_index<keys_value.length;secondary_index++){
          excel_object[keys_value[secondary_index]]=this.download_survey_excel_data[i][keys_value[secondary_index]]        
        }
        
        this.excel_data.push(excel_object)
        
      }
      
      console.log(this.excel_data);
      this.serve.exportAsExcelFile(this.excel_data,'AREA TARGET SURVEY REPORT EXCEL DATA');
      
      setTimeout (() => {
        this.excel_loader = false;        
      }, 700);
    }))
    
  }
  
  
}
