import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PearlService } from '../pearl.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-topsellingitem',
  templateUrl: './topsellingitem.component.html',
  styleUrls: ['./topsellingitem.component.scss']
})
export class TopsellingitemComponent implements OnInit {
  skelton:any={}
  today = new Date();
  date_flag:boolean=false;
  
  constructor(public db:PearlService,public rout: Router,public navparams: ActivatedRoute,private location: Location) { 
    this.skelton = new Array(10);
    this.today.setDate(this.today.getDate());
  }
  
  ngOnInit() 
  {
    console.log(this.navparams['params']['_value']);
    this.searchData = (this.navparams['params']['_value']);
    console.log(this.searchData);
    if(this.searchData)
    {
      console.log("in navparams");
      this.data.date_from = this.searchData.start_date;
      this.data.date_to = this.searchData.end_date;
      this.data.data_type = this.searchData.data_type;
      this.data.user_type = this.searchData.user_type;
      this.get_report_data();
    }
  }
  date:any=new Date();topsellingitem
  loader:any=false;
  report_data:any=[];
  data:any={};
  strmonth:any;
  endmonth:any;
  search_val:any={};
  total_data:any=[];
  pending_val:any=[];
  allMonthsInPeriod:any=[];
  list:any={};
  all:any;
  listLength=0;
  finalReportData =[];
  showSeeMore:boolean=false  
  data_not_found:any = false;
  searchData:any
  
  
  goTo(date_from,date_to,state){
    
    console.log(date_from,date_to);
    console.log(this.data.data_type);
    console.log(this.data.user_type);
    
    
    this.rout.navigate(['/districtname', { 'start_date': date_from,'end_date': date_to,'data_type':this.data.data_type,'user_type':this.data.user_type,"state":state }]);
    
  }
  
  get_report_data()
  {
    
    this.allMonthsInPeriod=[];
    
    
    console.log(this.data);
    
    
    if(!this.data.user_type){
      this.data.user_type=''
    }
    console.log(this.data);
    
    
    if(this.data.date_from && this.data.date_to)
    {
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
    }
    var startDateString = this.data.date_from;
    var endDateString = this.data.date_to;
    var startDate = moment(startDateString, "YYYY-M-DD");
    var endDate = moment(endDateString, "YYYY-M-DD").endOf("month");
    
    
    
    if(this.date_flag == true){
      this.date_flag = false;
      while (startDate.isBefore(endDate)) {
        this.allMonthsInPeriod.push(startDate.format("MMMM-YYYY"));
        startDate = startDate.add(1, "month");
        
      };
    }
    
    console.log(this.allMonthsInPeriod);
    this.loader = true;
    // Dwr/monthly_work_report_data
    this.db.fetchData({"search":this.data,"all":"all"},"Travel/location_wise2")
    .subscribe(resp=>{
      console.log(resp);
      this.report_data = resp;
      console.log(this.report_data);
      this.listLength = 0;
      this.finalReportData = [];
      this.showSeeMore = true;
      
      // for(var j=0;j<this.report_data.length;j++)
      // {
      // this.report_data[j].pending_val=this.report_data[j].total_order_value - this.report_data[j].Total_Dispatch_Value;
      
      // }
      
      console.log(this.report_data);
      console.log(this.allMonthsInPeriod);
      for(let k = 0 ;k<this.report_data.length ;k++){
        
        for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++){
          
          if(!(this.report_data[k].hasOwnProperty(this.allMonthsInPeriod[j]))){   
            let month = this.allMonthsInPeriod[j]  
            this.report_data[k][month]='0'            
            
          }
        }
      } 
      console.log(this.report_data);
      
      this.frontEndPagination(20);
      
      if(this.report_data.length==0){
        this.data_not_found=true;
        
      }
      else{
        this.data_not_found=false;
      }
      
      this.loader = false;
    })
  }
  
  excel_data:any=[];
  
  
  
  frontEndPagination(value){
    this.loader = true;
    console.log(value);
    
    let i = this.listLength;
    
    this.listLength = this.listLength+value;
    console.log(this.listLength);
    
    if(this.listLength >= this.report_data.length)
    {
      this.listLength = this.report_data.length;
      this.showSeeMore = false;
      
      
    }
    
    for(i;i<this.listLength;i++){
      
      this.finalReportData.push(this.report_data[i])
    }
    
    console.log(this.finalReportData);
    
    this.loader = false;
    
  }
  
  
  refresh(){
    this.data={};
    this.report_data=[];
    this.finalReportData=[];
    this.showSeeMore = false;
    
  }
  
  
  
  exportAsXLSX():void
  {
    
    this.loader = true;
    this.excel_data = [];
    for(let i=0;i<this.report_data.length;i++)
    {      
      this.excel_data.push({'State':this.report_data[i].state});
      
    }
    
    for(let i=0;i<this.excel_data.length;i++){
      
      for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++)
      {
        if(this.report_data[i].hasOwnProperty(this.allMonthsInPeriod[j]))
        {
          let month = this.allMonthsInPeriod[j];
          this.excel_data[i][month]=this.report_data[i][month];
        }
      }
      
    }
    for(let i=0;i<this.excel_data.length;i++)
    {      
      this.excel_data[i]['Grand Total']=this.report_data[i].total
    }
    
    
    console.log(this.excel_data);
    this.db.exportAsExcelFile(this.excel_data,'LocationWise Sales Report');
    this.loader = false;
  }
  
  
  
}
