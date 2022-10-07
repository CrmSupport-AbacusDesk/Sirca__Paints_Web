import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PearlService } from '../pearl.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-distriutor-sales-report',
  templateUrl: './distriutor-sales-report.component.html',
  styleUrls: ['./distriutor-sales-report.component.scss']
})
export class DistriutorSalesReportComponent implements OnInit {
  
  data:any={};
  channel_partner_list:any=[];
  product_data:any=[];
  loader:any;
  category_list:any=[];
  pending_val:any=[];
  data_not_found:any = false;
  allMonthsInPeriod:any=[];
  action:any;
  listLength=0;
  finalReportData =[];
  showSeeMore:boolean=false  
  skelton:any={}
  state_list=[];
  sales_person:any=[];
  today = new Date();
  state:any;
  date_flag:boolean=false;
  
  constructor(public service:PearlService) 
  { 
    // this.get_sales_user_list();
    // this.get_product_category_list();
    this.today.setDate(this.today.getDate());
    
  }
  
  ngOnInit() 
  {
    this.skelton = new Array(10);
    this.getStateList();
    this.sales_person_data();
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
  sales_person_data()
  {
    console.log(this.data.state);
    
    this.service.fetchData({'state':this.data.state},"Travel/salesUserList").subscribe(resp=>
      {
        console.log(resp);
        this.sales_person = resp;
        console.log(this.sales_person);
        
      });
    }
    get_sales_user_list()
    {
      this.service.fetchData('',"Attendance/sales_user_data").subscribe(resp=>
        {
          console.log(resp);
          this.channel_partner_list = resp;
        });
      }
      
      get_product_category_list()
      {
        this.service.fetchData('',"product/get_product_category_list").subscribe(resp=>
          {
            console.log(resp);
            this.category_list = resp;
          });
        }
        refreshh(){
          this.data={};
          this.product_data=[];
          this.finalReportData = [];
        }
        submit()
        {
          
          this.allMonthsInPeriod=[];
          
          this.loader = '1';
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
          
          console.log(this.data);
          
          this.service.fetchData({'search':this.data,'person':this.data.person},"Travel/sales_person_wise").subscribe(resp=>{
            console.log(resp);

            // this.product_data = resp['xyz'].filter(row=> (row.Assigned_User_List !== null) && (row.assign_dr_id !== null) );
            this.product_data = resp['length'] != 0 ? resp['xyz'].filter(row=> row.Assigned_User_List !== null && row.company_name !== null && row.company_name !== '' && row.assign_dr_id !== null && row.assign_dr_id !== ''):'';
            this.listLength = 0;
            this.finalReportData = [];
            this.showSeeMore = true;
            
            if(this.product_data.length == 0)
            {
              this.data_not_found = true;
            }else
            {
              this.data_not_found = false;
            }
            
            for(var j=0;j<this.product_data.length;j++)
            {
              this.product_data[j].pending_val=this.product_data[j].order_value - this.product_data[j].Total_Dispatch_Value;
              
            }
            console.log(this.pending_val);
            
            for(let k = 0 ;k<this.product_data.length ;k++){
              
              for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++){
                
                if(!(this.product_data[k].hasOwnProperty(this.allMonthsInPeriod[j]))){   
                  let month = this.allMonthsInPeriod[j]  
                  this.product_data[k][month]=0            
                  
                }
              }
            } 
            console.log(this.product_data);
            
            this.frontEndPagination(20);
            
            this.loader = '';
            
          });
        }
        
        excel_data:any=[];
        
        
        
        
        frontEndPagination(value){
          this.loader = true;
          console.log(value);
          
          let i = this.listLength;
          
          this.listLength = this.listLength+value;
          console.log(this.listLength);
          
          if(this.listLength >= this.product_data.length)
          {
            this.listLength = this.product_data.length;
            this.showSeeMore = false;
            
            
          }
          
          for(i;i<this.listLength;i++){
            
            this.finalReportData.push(this.product_data[i])
          }
          
          console.log(this.finalReportData);
          
          this.loader = false;
          
        }
        
        
        
        
        
        exportAsXLSX():void
        {
          
          this.loader = true;
          this.excel_data = [];
          for(let i=0;i<this.product_data.length;i++)
          {      
            this.excel_data.push({'SALES PERSON':this.product_data[i].Assigned_User_List,'STATE':this.product_data[i].state,'CITY':this.product_data[i].city,'COMPANY NAME':this.product_data[i].company_name,'OLD/NEW':this.product_data[i].new_dr && this.product_data[i].new_dr!=''?(this.product_data[i].new_dr=='No') ? 'OLD' : 'New':'N/A','COMPANY TYPE':this.product_data[i].type && this.product_data[i].type!= '' ?this.product_data[i].type == '1' ? 'Channel Partner' : this.product_data[i].type == '7' ? 'Direct Delaer' : 'Reatil Partner' :'N/A'});
            
          }
          
          for(let i=0;i<this.excel_data.length;i++){
            
            for(let j = 0 ;j<this.allMonthsInPeriod.length ;j++)
            {
              if(this.product_data[i].hasOwnProperty(this.allMonthsInPeriod[j]))
              {
                let month = this.allMonthsInPeriod[j];
                this.excel_data[i][month]=this.product_data[i][month];
              }
            }
            
          }
          for(let i=0;i<this.excel_data.length;i++)
          {      
            this.excel_data[i]['Grand Total']=this.product_data[i].total
          }
          console.log(this.excel_data);
          this.service.exportAsExcelFile(this.excel_data,'SalesPersonWise Sales Report');
          this.loader = false;
        }
        
        
        
      }
      