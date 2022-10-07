import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PearlService } from '../pearl.service';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.scss']
})
export class StockSummaryComponent implements OnInit {
  
  product_id:any='0'
  search_data:any= {
    // summary_type : 'all',
  };
  product_summary_data:[];
  start: number = 0;
  data_not_found=false;
  skelton: any = new Array(10);   
  loader:any = false ;
  total_page:any='';
  pagenumber:any='';
  page_limit:any=50;
  count: any;
  active_tab:any='Incoming';
  product_name:any='';
  warehouse_id:any='';
  
  
  
  constructor(public route : ActivatedRoute,public serve : PearlService) {
    
    console.log(this.route.queryParams['_value']);
    this.product_name = this.route.queryParams['_value']['product_name']
    this.warehouse_id = this.route.queryParams['_value']['warehouse_id']
    this.route.params.subscribe(params =>{
      console.log(params);
      this.product_id = params.id;
      console.log(this.product_id);
      this.get_selected_stock_summary();
      
    })
    
    
    
    
  }
  
  ngOnInit() {
  }
  
  get_selected_stock_summary(type:any=''){
    
    console.log("get_selected_stock_summary method calls");
    
    if(type == 'refresh'){
      this.search_data = {};
      this.product_summary_data = [];
      this.start = 0;
    }
    
    this.loader=true;
    
    this.serve.fetchData({'product_id':this.product_id,'warehouse_id':this.warehouse_id,filter:this.search_data},"Stock/item_wise_stock_summary").subscribe((result=>{
      
      console.log(result);
      this.product_summary_data=result['product_summary']
      this.count=result['count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      
      setTimeout (() => {
        this.loader=false;
      }, 700);
      
      if(this.product_summary_data.length == 0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
      }
      
    }))
    
    
  }
  
  format_date(event,type){
    
    console.log("format_date method calls");
    
    if(type == 'date'){
      this.search_data.date=moment(event.value).format('YYYY-MM-DD');    
      console.log(this.search_data.date);
      
    }
    
    this.get_selected_stock_summary();
  }
  
  go_back() {
    window.history.go(-1);
  }
  

  //for testing purpose, not use now
  test(){
    console.log("test method calls");
    
    
  }
  
  
}
