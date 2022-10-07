import { Component, OnInit,Pipe, PipeTransform } from '@angular/core';
import { PearlService } from '../pearl.service';
import * as moment from 'moment';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';






@Component({
  selector: 'app-monthly-dwr',
  templateUrl: './monthly-dwr.component.html',
  styleUrls: ['./monthly-dwr.component.scss']
})




export class MonthlyDwrComponent implements OnInit {
  skelton:any={}
  today = new Date();
  constructor(public db:PearlService,public service:PearlService) { 
    this.skelton = new Array(10);
    this.getStateList();
    this. getDistrict();
    this.getCityList();
    this.today.setDate(this.today.getDate());
  }
  
  ngOnInit() 
  {
    
    
    
  }
  date:any=new Date();
  loader:any
  report_data:any=[];
  data:any={};
  search_val:any={};
  total_data:any=[];
  pending_val : any=[];
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  data_not_found: any = false;
  allMonthsInPeriod:any=[];
  tmp_report_data:any=[];
  finalReportData =[];
  finalReportData2 =[];
  showSeeMore:boolean=false  
  excel_data:any=[];
  listLength=0;
  date_flag:boolean=false;
  
  
  
  getStateList()
  {
    console.log("addUser");
    
    this.service.fetchData(this.data,"User/state_user_list").subscribe((response=>{
      console.log(response);  
      this.state_list=response['query']['state_name'];
      console.log(this.state_list);
    }));
    
  }
  getDistrict()
  {
    console.log(this.data.state);
    this.service.fetchData(this.data.state,"User/district_user_list").subscribe((response=>{
      this.district_list=response['query']['district_name'];
      console.log(this.district_list);
      
    }));
    
  }
  getCityList()
  {
    
    this.finalReportData = [];
    this.tmp_report_data = [];
    
    
    let value = {"state": this.data.state,"district":this.data.district}
    this.service.fetchData(value,"User/city_user_list").subscribe((response=>{
      console.log(response);
      this.city_list=response['query']['city'];
      console.log(this.city_list);
    }));
  }
  onClick(){
    console.log(this.data);
  }
  
  search:any={};
  tmpsearch:any={};
  getitemlist(search)
  {
    console.log(search);
    this.report_data=[];
    for(var i=0;i<this.tmp_report_data.length;i++)
    {
      search=search.toLowerCase()
      this.tmpsearch=this.tmp_report_data[i]['company_name'].toLowerCase();
      if(this.tmpsearch.includes(search))
      {
        this.report_data.push(this.tmp_report_data[i]);
        
      }
    }
    console.log(this.report_data);
    
    
  }
  get_report_data()
  {
    
    this.allMonthsInPeriod=[];
    this.report_data = [];
    
    if(this.data.date_from && this.data.date_to)
    {
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
    }
    
    var startDateString = this.data.date_from;
    var endDateString = this.data.date_to;
    var startDate = moment(startDateString, "YYYY-M-DD");
    var endDate = moment(endDateString, "YYYY-M-DD").endOf("month");
    
    console.log(startDate);
    console.log(endDate);
    
    if(this.date_flag == true){
      this.date_flag = false;
      while (startDate.isBefore(endDate)) {
        this.allMonthsInPeriod.push(startDate.format("MMMM-YYYY"));
        startDate = startDate.add(1, "month");
        
      };
    }
    
    this.loader = true;
    console.log( this.allMonthsInPeriod);

    this.db.fetchData({search:this.data},"Travel/Party_Wise")
    .subscribe(resp=>{
      console.log(resp);
      this.report_data = resp['xyz'];
      this.tmp_report_data=this.report_data;
      console.log(this.report_data);
      console.log(this.report_data.length);
      console.log(typeof(this.report_data.length));


      console.log(this.allMonthsInPeriod);
      this.listLength = 0;

      this.finalReportData = [];
      this.showSeeMore = true;
      
      
      
      for(let k = 0 ;k<this.report_data.length ;k++){
        
        for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++){
          
          if(!(this.report_data[k].hasOwnProperty(this.allMonthsInPeriod[j]))){   
            let month = this.allMonthsInPeriod[j]  
            this.report_data[k][month]=0            
            
          }
        }
      } 
      console.log(this.report_data);
      
      
      if(this.report_data.length == 0){
        console.log("length = zero");
        this.data_not_found=true;
      }
      // this.loader = false;
      this.frontEndPagination(20);
      // this.loader = false;
    })
    
  }
  
  
  
  
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
    else{
    this.loader = false;
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
  
  
  
  // -------------------------
  
  
  
  
  exportAsXLSX():void
  {

    
    this.loader = true;
    this.excel_data = [];
    for(let i=0;i<this.report_data.length;i++)
    {      
      this.excel_data.push({'Company Name':this.report_data[i].company_name});
      
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
    this.db.exportAsExcelFile(this.excel_data,'PartyWise Sales Report');
    this.loader = false;
  }
  
  
  
  
  
}