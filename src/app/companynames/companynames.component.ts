import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PearlService } from '../pearl.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-companynames',
  templateUrl: './companynames.component.html',
  styleUrls: ['./companynames.component.scss']
})
export class CompanynamesComponent implements OnInit {
  
  skelton:any={}
  city = '';
  district='';
  state='';
  today = new Date();
  date_flag:boolean=true;

  constructor(public db:PearlService,public navparams: ActivatedRoute,public rout: Router) { 
    this.skelton = new Array(10);
  }
  
  ngOnInit() {
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
      this.city=this.searchData.city;
      this.state=this.searchData.state;
      this.district=this.searchData.district;


    }
    this.get_report_data();
  }
  searchData:any;
  date:any=new Date();
  loader:any=false;
  report_data:any=[];
  data:any={};
  strmonth:any;
  endmonth:any;
  search_val:any={};
  total_data:any=[];
  pending_val:any=[];
  allMonthsInPeriod:any=[];
  data_not_found:any=false;

 
  goback(){

    console.log("go back from city to district");
    console.log(this.searchData);

    console.log(this.searchData.start_date);
    console.log(this.searchData.end_date);
    console.log(this.searchData.data_type);
    console.log(this.searchData.user_type);

    
    
  this.rout.navigate(['/citynames', { 'start_date': this.searchData.start_date,'end_date': this.searchData.end_date,'data_type':this.searchData.data_type,'user_type':this.searchData.user_type,'state':this.searchData.state,'district':this.searchData.district}]);
   
 }

  get_report_data()
  {
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
    this.db.fetchData({"search":this.data,'state':this.state,'district':this.district,'city':this.city},"Travel/location_wise2")
    .subscribe(resp=>{
      console.log(resp);
      this.report_data = resp;
      console.log(this.report_data);
      
      console.log(this.report_data.length);
      
    

      for(let k = 0 ;k<this.report_data.length ;k++){
              
        for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++){
          
          if(!(this.report_data[k].hasOwnProperty(this.allMonthsInPeriod[j]))){   
            let month = this.allMonthsInPeriod[j]  
            this.report_data[k][month]='0'            
            
          }
        }
      } 

        console.log(this.report_data);
        
      if(this.report_data.length == 0){
        this.data_not_found=true;
      }
      else{
        this.data_not_found=false;
      }
      
      this.loader = false;
    })
  }
  
  excel_data:any=[];
  exportAsXLSX():void 
  {
    this.loader = true;
    this.excel_data = [];
    for(let i=0;i<this.report_data.length;i++){
      this.excel_data.push({'Company Name ':this.report_data[i].company_name});
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
    this.db.exportAsExcelFile(this.excel_data,'CompanyWise Report');
    this.loader = false;
  }
}
