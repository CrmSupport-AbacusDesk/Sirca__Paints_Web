import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PearlService } from '../pearl.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-districtname',
  templateUrl: './districtname.component.html',
  styleUrls: ['./districtname.component.scss']
})
export class DistrictnameComponent implements OnInit {

  skelton:any={}
  state='';
  district='';
  date_flag:boolean=true;
  today = new Date();

  
  constructor(public db:PearlService,public navparams: ActivatedRoute,public rout: Router,private location: Location) {
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
      this.state=this.searchData.state;
    }
    this.get_report_data();
  }
  // goBack() {
    
  //   window.history.go(-1);

  // }
  goTo(date_from,date_to,state,district){

     console.log(date_from,date_to);
    console.log(this.data.data_type);
    console.log(this.data.user_type);
    console.log(date_from,date_to);
    this.rout.navigate(['/citynames', { 'start_date': date_from,'end_date': date_to,'data_type':this.data.data_type,'user_type':this.data.user_type,'state':state,'district':district }]);
    
  }

  goback(){

    console.log("go back from district to state");
    console.log(this.searchData);

    console.log(this.searchData.start_date);
    console.log(this.searchData.end_date);
    console.log(this.searchData.data_type);
    console.log(this.searchData.user_type);

    this.rout.navigate(['/topsellingitem', { 'start_date': this.searchData.start_date,'end_date': this.searchData.end_date,'data_type':this.searchData.data_type,'user_type':this.searchData.user_type}]);
    this.get_report_data();
 }

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
  searchData:any
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
    this.db.fetchData({"search":this.data,'state':this.state},"Travel/location_wise2")
    .subscribe(resp=>{
      console.log(resp);
      this.report_data = resp;


      for(let k = 0 ;k<this.report_data.length ;k++){
              
        for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++){
          
          if(!(this.report_data[k].hasOwnProperty(this.allMonthsInPeriod[j]))){   
            let month = this.allMonthsInPeriod[j]  
            this.report_data[k][month]='0'            
            
          }
        }
      } 

    console.log(this.report_data);
  
      this.loader = false;
    })
  }
  
  excel_data:any=[];
  



  exportAsXLSX():void
  {
    
    this.loader = true;
    this.excel_data = [];
    for(let i=0;i<this.report_data.length;i++)
    {      
      this.excel_data.push({'District':this.report_data[i].district});
      
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
    this.db.exportAsExcelFile(this.excel_data,'DistrictWise Sales Report');
    this.loader = false;
  }
  
  
}
