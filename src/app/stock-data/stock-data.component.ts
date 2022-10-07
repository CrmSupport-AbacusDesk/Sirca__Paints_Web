import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-stock-data',
  templateUrl: './stock-data.component.html',
  styleUrls: ['./stock-data.component.scss']
})
export class StockDataComponent implements OnInit {
  
  search_data:any = {};
  stock_list:any = [];
  data_not_found=false;
  skelton: any = new Array(10);   
  loader:any;
  total_page:any='';
  pagenumber:any='';
  page_limit:any=50;
  start:any=0;
  count: any;
  ware_house_listing:any=[];
  selected_ware_house_id:any='all';
  
  constructor(public serve:PearlService,public route:Router) { 
    this.get_warehouse_data();
  }
  ngOnInit() {
  }
  
  get_warehouse_data() {
    console.log("get_warehouse_data method calls");
    this.serve.fetchData({}, "Order/ware_house_listing").subscribe((response => {
      console.log(response);
      this.ware_house_listing = response['ware_house_listing']
      this.get_stock_list();
      
    }));
  }
  get_stock_list(type:any='')
  {
    
    console.log("production_plan_list method calls");
    
    if(type == 'refresh'){
      this.search_data = {};
      this.stock_list = [];
      this.start = 0;
    }
    
    this.loader=true;
    
    this.serve.fetchData({'filter':this.search_data,'start':this.start,'page_limit':this.page_limit,'ware_house_id':this.selected_ware_house_id },"Stock/ware_house_product_wise_stock_listing").subscribe((result=>{
      console.log(result);
      this.stock_list= result['ware_house_wise_product_stock'];
      console.log(this.stock_list);
      this.count=result['stock_count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      
      setTimeout (() => {
        this.loader=false;
        
      }, 700);
      if(this.stock_list.length == 0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
    }))
  }

  go_to(product_id,product_name){
    this.route.navigate(['/stock-summary/'+product_id],{ queryParams: {'product_name': product_name,'warehouse_id': this.selected_ware_house_id} });
  }
  
}
