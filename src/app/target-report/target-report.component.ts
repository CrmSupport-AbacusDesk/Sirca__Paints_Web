import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PearlService } from '../pearl.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-target-report',
  templateUrl: './target-report.component.html',
})
export class TargetReportComponent implements OnInit {
  skelton:any={}

  constructor(public db:PearlService,public rout: Router) { 
    this.skelton = new Array(10);
  }
  
  ngOnInit() 
  {
    
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
  list:any={};
  all:any;
  
  goTo(date_from,date_to){

    console.log(date_from,date_to);
    this.rout.navigate(['/citynames', { 'start_date': date_from,'end_date': date_to }]);

  }
  get_report_data(action: any = '')
  {
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



while (startDate.isBefore(endDate)) {
  this.allMonthsInPeriod.push(startDate.format("MMMM-YYYY"));
  startDate = startDate.add(1, "month");
};

console.log(this.allMonthsInPeriod);
    this.loader = true;
    // Dwr/monthly_work_report_data
    this.db.fetchData({"search":this.data},"Travel/location_wise")
    .subscribe(resp=>{
      console.log(resp);
      this.report_data = resp['xyz'];
      console.log(this.report_data);
      
    for(var j=0;j<this.report_data.length;j++)
    {
    this.report_data[j].pending_val=this.report_data[j].total_order_value - this.report_data[j].Total_Dispatch_Value;
        
    }
    console.log(this.pending_val);
      
      // for(var i=0; i<this.report_data.length; i++)
      // {
      //   if(this.report_data[i].order != null)
      //   {
      //     this.report_data[i].order.total_secondary_order_amount = Math.round(this.report_data[i].order.total_secondary_order_amount);
      //   }
        
      //   if(this.report_data[i].order != null)
      //   {
      //     this.report_data[i].order.total_primary_order_amount = Math.round(this.report_data[i].order.total_primary_order_amount);
      //   }
      // }
      
      this.loader = false;
    })
  }
  
  excel_data:any=[];
  exportAsXLSX():void 
  {
    this.loader = true;
    this.excel_data = [];
    for(let i=0;i<this.report_data.length;i++){
      this.excel_data.push({'Sales Executive':this.report_data[i].name, 'Reporting Manager':this.report_data[i].reporting_manager,'Attendance Start':this.report_data[i].attendance ? this.report_data[i].attendance.start_time : 'N.A','Attendance Stop':this.report_data[i].attendance ? this.report_data[i].attendance.stop_time : 'N.A','Dealer Check-In':this.report_data[i].activity ? this.report_data[i].activity.total_dealer : 'N.A','Direct Dealer Check-In':this.report_data[i].activity ? this.report_data[i].activity.total_direct_dealer : 'N.A','Distributor Check-In':this.report_data[i].activity ? this.report_data[i].activity.total_channel_partner : 'N.A','Primery Order':this.report_data[i].order ? 'Rs. '+this.report_data[i].order.total_primary_order_amount : 'N.A','Secondary Order':this.report_data[i].order ? 'Rs. '+this.report_data[i].order.total_secondary_order_amount : 'N.A','New Lead':this.report_data[i].dr ? this.report_data[i].dr.total_dr : 'N.A'});
    }
    console.log(this.excel_data);
    this.db.exportAsExcelFile(this.excel_data, moment(this.date).format('D MMM Y')+' Work Report');
    this.loader = false;
  }
}
