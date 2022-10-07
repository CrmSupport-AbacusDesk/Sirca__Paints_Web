import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-areawisesalesreport',
  templateUrl: './areawisesalesreport.component.html',
  styleUrls: ['./areawisesalesreport.component.scss']
})
export class AreawisesalesreportComponent implements OnInit {

  data:any={};
  channel_partner_list:any=[];
  product_data:any=[];
  loader:any;
  category_list:any=[];
  data_not_found:any = false;
  user_data:any=[];
  state_list:any=[];
  district_list:any=[];
  constructor(public service:PearlService) 
  { 
    this.get_product_category_list();
  }
  
  ngOnInit() 
  {
    this.getStateList();
    this.getDistrict();
  }

  getStateList()
  {
    console.log("addUser");
    
    this.service.fetchData(0,"User/state_user_list").subscribe((response=>{
      console.log(response);  
      this.state_list=response['query']['state_name'];
      console.log(this.state_list);
    }));
    
  }
  getDistrict()
    {
      console.log(this.data.state);
      this.service.fetchData(this.data.state,"User/district_user_list").subscribe((response=>{
        // console.log(response);
        this.district_list=response['query']['district_name'];
        console.log(this.district_list);
        
      }));
        
    }
 
 
    
    get_product_category_list()
    {
      this.service.fetchData('',"product/get_product_category_list").subscribe(resp=>
        {
          console.log(resp);
          this.category_list = resp;
        });
      }
      
      submit()
      {
        this.loader = '1';
        if(this.data.start_date && this.data.end_date)
        {
          this.data.start_date = moment(this.data.start_date).format('YYYY-MM-DD');
          this.data.end_date = moment(this.data.end_date).format('YYYY-MM-DD');
        }
        console.log(this.data);
        
        this.service.fetchData(this.data,"product/get_product_report").subscribe(resp=>
          {
            console.log(resp);
            this.product_data = resp['order_item'];
            
            if(this.product_data.length == 0)
            {
              this.data_not_found = true;
            }else
            {
              this.data_not_found = false;
            }
            
            for(var i=0; i<this.product_data.length; i++)
            {
              this.product_data[i]['total_amount'] = parseInt(this.product_data[i]['total_amount']); 
            }
            this.loader = '';
            
          });
        }
        
        excel_data:any=[];
        exportAsXLSX():void 
        {
          this.loader = '1';
          this.excel_data = [];
          for(let i=0;i<this.product_data.length;i++)
          {
            this.excel_data.push({'Product Code':this.product_data[i].cat_no, 'Category':this.product_data[i].category,'Total Qty':this.product_data[i].total_qty,'Amount':this.product_data[i].total_amount});
          }
          console.log(this.excel_data);
          this.service.exportAsExcelFile(this.excel_data,'Product-Category-report');
          this.loader = '';
        }
        
      }
      
