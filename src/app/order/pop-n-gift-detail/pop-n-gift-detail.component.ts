import { Component, OnInit } from '@angular/core';
import { StatusModalComponent } from '../status-modal/status-modal.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { OrderDispatchComponent } from '../order-dispatch/order-dispatch.component';

@Component({
  selector: 'app-pop-n-gift-detail',
  templateUrl: './pop-n-gift-detail.component.html',
  styleUrls: ['./pop-n-gift-detail.component.scss']
})
export class PopNGiftDetailComponent implements OnInit {
  
  order_id:any;
  loader: any;
  order_detail : any = {};
  cart_data : any =[];
  image : any = [];
  
  
  
  
  
  
  constructor(public dialog: MatDialog,public route: ActivatedRoute,public serve: PearlService) { 
    console.log("pop gift detail call");
    
    this.route.params.subscribe( params => {
      console.log(params);
      this.order_id = params.id;
      console.log(this.order_id);
      this.get_pop_order_detail()
      
      
    });
    
  }
  
  ngOnInit() {
  }
  
  
  openDialog(): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px', data: {
        'data' : 'Change Status from pop and gift',
        'order_status' : this.order_detail.order_status,
        'order_id' : this.order_id,
        'reason': this.order_detail.reason_reject
        
      }
    });
    this.loader = 1;
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loader = '';
      this.get_pop_order_detail();
    },err => {
      this.loader = '';
      
    });
  }
  
  
  back(){
    window.history.back();
  }
  
  get_pop_order_detail(){
    console.log("get_pop_order_detail method calls");
    console.log( this.order_id);
    
    this.loader = 1;
    const id = {'order_id': this.order_id};
    this.serve.fetchData(id, 'Order/pop_master_order_detail').subscribe((result => {
      console.log(result);
      this.loader = '';
      this.order_detail=result['pop_order_data'];
      this.image = (this.order_detail['image']);
      console.log(this.image);
      this.cart_data=result['pop_order_item'];
      console.log(this.cart_data);
    }));
    
    
  }
  
  
  open_dipatch_model(): void {
    
    const dialogRef = this.dialog.open(OrderDispatchComponent, {
      
      width: '1000px', data: {
        'data' : 'Change Status from pop and gift',
        'order_status' : this.order_detail.order_status,
        'order_id' : this.order_id,
        'reason': this.order_detail.reason_reject
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.get_pop_order_detail();
    });
  }
  
  
  imageModel(image){
    const dialogRef = this.dialog.open( StatusModalComponent, {
      data:{
        image,
      }});
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
        
    });
      
  }
  
  
}
