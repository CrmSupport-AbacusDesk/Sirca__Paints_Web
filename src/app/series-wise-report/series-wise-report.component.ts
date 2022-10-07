import { Component, OnInit } from '@angular/core';
import { PearlService } from '../pearl.service';
import * as moment from 'moment';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';


@Component({
  selector: 'app-series-wise-report',
  templateUrl: './series-wise-report.component.html',
  styleUrls: ['./series-wise-report.component.scss']
})
export class SeriesWiseReportComponent implements OnInit {
  skelton:any={}
  today = new Date();
  date_flag:boolean=false;
  constructor(public db:PearlService,public service:PearlService) { 
    this.skelton = new Array(10);
    this.getStateList();
    this. getDistrict();
    this.getCityList();
    this.today.setDate(this.today.getDate());
    this.get_category_list();
    this. party_name();
  }
  
  ngOnInit() 
  {
    
    
    
  }
  date:any=new Date();
  loader:any=false;
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
  category_list:any=[];
  party_name_list:any=[];
  sum:any=0;
  get_category_list()
  {

    this.service.fetchData('',"Travel/categoryList").subscribe((response=>{
      console.log(response);  
      this.category_list=response;
      console.log(this.category_list);
    }));
  }
 
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

  party_name()
  {

    console.log(this.data.state);
    console.log(this.data.district);
    console.log(this.data.city);
    console.log(this.data.date_from);
    console.log(this.data.date_to);

    this.service.fetchData({"state": this.data.state,"district":this.data.district,"city":this.data.city,"type":this.data.user_type},"Travel/partyName").subscribe((response=>{
      console.log(response);  
      this.party_name_list=response;
      console.log(this.party_name_list);
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
  get_report_data(action: any = '')
  {
    
    
    this.allMonthsInPeriod=[];
    this.report_data = [];
    
    
    if (action == "refresh") {
      this.data = {};
      this.report_data = [];
      
    }
    
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



    this.loader = true;
    this.db.fetchData({"state": this.data.state,"district":this.data.district,"city":this.data.city,"type":this.data.user_type,"date_from":this.data.date_from,"date_to":this.data.date_to,"main_category":this.data.category,"data_type":this.data.data_type ,'order_type':this.data.order_type},"Travel/seriesWise")
    .subscribe(resp=>{
      console.log(resp);
      this.report_data = resp;
      // this.tmp_report_data=this.report_data;
      // console.log(this.report_data);
      // console.log(this.allMonthsInPeriod);
      // this.listLength = 0;
      // this.finalReportData = [];
      // this.showSeeMore = true;
      
      
      for(let k = 0 ;k<this.report_data.length ;k++){
        let total = 0
        for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++){
          
          if( (this.report_data[k][this.allMonthsInPeriod[j]] == null) || !(this.report_data[k].hasOwnProperty(this.allMonthsInPeriod[j]))){   
            let month = this.allMonthsInPeriod[j]  
            this.report_data[k][month]='0'            
          }
          else{
            total = total + parseInt(this.report_data[k][this.allMonthsInPeriod[j]])
            this.report_data[k].total = total;
          }
        }
      } 

      console.log(this.report_data);
      
      for(let k = 0 ;k<this.report_data.length ;k++){
        
        for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++){
          
        }
      }
      
      if(this.report_data.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
      }
      this.loader = false;
      // this.frontEndPagination(20);
      
    })
    
  }
  
  
  
  
 
    
  
  
  
  refresh(){
    this.data={};
    this.report_data=[];
    this.finalReportData=[];
    this.showSeeMore = false;
    // this.state_list=[];
    // this.district_list=[];
    // this.city_list=[];
  }
  
  
  
  // -------------------------
  
  
  
  
  
  exportAsXLSX():void
  {
    
    this.loader = true;
    this.excel_data = [];
    for(let i=0;i<this.report_data.length;i++)
    {      
      this.excel_data.push({'Catgory':this.report_data[i].main_category,'SubCategory':this.report_data[i].sub_category});
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
    this.db.exportAsExcelFile(this.excel_data,'SeriesWise Report');
    this.loader = false;
  }
  
  
  
  
  
}