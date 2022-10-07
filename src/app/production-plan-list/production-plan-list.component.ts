import { Component, OnInit } from '@angular/core';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-production-plan-list',
  templateUrl: './production-plan-list.component.html',
  styleUrls: ['./production-plan-list.component.scss']
})
export class ProductionPlanListComponent implements OnInit {
  
  search_data:any = {};
  production_plan_product_list:any = [];
  data_not_found=false;
  skelton: any = new Array(10);   
  loader:any;
  total_page:any='';
  pagenumber:any='';
  page_limit:any=50;
  start:any=0;
  count: any;


  constructor(public serve:PearlService,) { 
    this.production_plan_list();
  }
  
  ngOnInit() {
  }
  
  
  production_plan_list(type:any='')
  {
    
    console.log("production_plan_list method calls");
    
    if(type == 'refresh'){
      this.search_data = {};
      this.production_plan_product_list = [];
      this.start = 0;
    }
    
    this.loader=true;
    
    this.serve.fetchData({'filter':this.search_data,'start':this.start,'page_limit':this.page_limit},"Order/production_plan_listing").subscribe((result=>{
      console.log(result);
      this.production_plan_product_list= result['in_stock_product_list'];
      console.log(this.production_plan_product_list);
      this.count=result['pagination_count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      
      setTimeout (() => {
        this.loader=false;
        
      }, 700);
      if(this.production_plan_product_list.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
    }))
  }
  
}
