import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-warehouse-to-warehouse-summary',
  templateUrl: './warehouse-to-warehouse-summary.component.html',
  styleUrls: ['./warehouse-to-warehouse-summary.component.scss']
})
export class WarehouseToWarehouseSummaryComponent implements OnInit {

  search_data:any= {};
  start: number = 0;
  data_not_found=false;
  skelton: any = new Array(10);
  loader:any = false ;
  total_page:any='';
  pagenumber:any='';
  page_limit:any=50;
  count: any;
  warehouse_to_warehouse_transfer_list:any = [];



  constructor(public serve:PearlService,public dialog: MatDialog,public route:Router) {
    this.get_warehouse_to_warehouse_transfer_list()
  }

  ngOnInit() {
  }

  get_warehouse_to_warehouse_transfer_list(type : any=''){
    console.log("get_warehouse_to_warehouse_transfer_list method calls");

    if(type == 'refresh'){
      this.search_data = {};
      this.warehouse_to_warehouse_transfer_list = [];
      this.start = 0;
      this.search_val = {};
    }

    this.loader=true;

    this.serve.fetchData({'search':this.search_val},"Stock/ware_house_to_ware_house_transaction_log").subscribe((result=>{
      console.log(result);
      this.warehouse_to_warehouse_transfer_list= result['ware_house_to_ware_house_transaction_log'];
      console.log(this.warehouse_to_warehouse_transfer_list);
      this.count=result['count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;

      setTimeout (() => {
        this.loader=false;

      }, 700);
      if(this.warehouse_to_warehouse_transfer_list.length == 0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;

      }
    }))

  }

  view_details_of_warehouse_to_warehouse_transfer(summary_id){
    console.log("view_details_of_warehouse_to_warehouse_transfer method calls");

    this.route.navigate(['/warehouse-to-warehouse-summary-detail'],{ queryParams: {'summary_id': summary_id,'from': 'warehouse_to_warehouse_summary'} });

  }

  //aamir change
  search_val:any={};

  onDate(date){
    this.search_val.date_created=moment(date.value).format("YYYY-MM-DD");
    this.get_warehouse_to_warehouse_transfer_list();
  }

}
