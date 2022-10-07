import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-warehouse-to-warehouse-summary-detail',
  templateUrl: './warehouse-to-warehouse-summary-detail.component.html',
  styleUrls: ['./warehouse-to-warehouse-summary-detail.component.scss']
})
export class WarehouseToWarehouseSummaryDetailComponent implements OnInit {
  
  warehouse_to_warehouse_transfer_summary_detail:any=[];
  summary_id:any='0';
  skelton: any = new Array(10);   
  loader:any = false ;
  from:any='no_Where'
  
  constructor(public serve:PearlService,public route : ActivatedRoute,public dialog: MatDialog) {
    
    console.log(this.route.queryParams['_value']);
    this.summary_id = this.route.queryParams['_value']['summary_id']
    this.from = this.route.queryParams['_value']['from']
    this.get_warehouse_to_warehouse_transfer_summary_detail();
    
  }
  
  ngOnInit() {
  }
  
  go_back() {
    window.history.go(-1);
  }
  
  
  get_warehouse_to_warehouse_transfer_summary_detail(){
    console.log("get_warehouse_to_warehouse_transfer_summary_detail method");
    this.serve.fetchData({'summary_id':this.summary_id},"Stock/ware_house_to_ware_house_transaction_log_detail").subscribe((result=>{
      console.log(result);
      this.warehouse_to_warehouse_transfer_summary_detail = result['ware_house_to_ware_house_transaction_log_detail']
    }))
    
    
  }
  
  go_to(master_box_qr_code_id){
    console.log("go_to method calls");
    
     const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '1000px', data: {
        'master_box_qr_code_id' : master_box_qr_code_id,
        'from' : 'warehouse_to_warehouse_summary_detail'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.get_warehouse_to_warehouse_transfer_summary_detail();
    });

  }
}
