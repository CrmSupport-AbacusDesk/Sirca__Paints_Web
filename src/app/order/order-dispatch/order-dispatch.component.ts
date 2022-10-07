import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { PearlService } from 'src/app/pearl.service';

@Component({
    selector: 'app-order-dispatch',
    templateUrl: './order-dispatch.component.html',
})
export class OrderDispatchComponent implements OnInit {
    loader: any = 1;
    order_id: any = 0;
    disable: boolean = false;
    order_detail: any = [];
    order_item: any = [];
    dispatchStatusFlag: number = 0;
    status_flag: any;
    login:any={};
    
    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: PearlService,public dialogctrl:DialogComponent) {
        console.log(data);
        this.status_flag=this.data.data;
        this.order_id = data['order_id'];
        
        this.login= JSON.parse(sessionStorage.getItem('login'));
        console.log(this.login.data.id);
        
        
    }
    
    ngOnInit() {
        if(this.status_flag != 'Change Status from pop and gift'){
            this.orderDetail();
            this.select_all();
        }
        else if(this.status_flag == 'Change Status from pop and gift'){
            this.get_pop_order_detail()
        }
        else{
            
        }
    }
    
    orderDetail() {
        this.loader = 1;
        let id = { 'order_id': this.order_id }
        this.serve.fetchData(id, "Order/order_detail").subscribe((result => {
            console.log(result);
            this.order_detail = result['order_detail'];
            this.order_item = result['order_detail']['order_item'];
            this.order_detail.order_cgst = this.order_detail.order_gst / 2;
            this.order_detail.order_cgst = parseFloat(this.order_detail.order_cgst).toFixed(2);
            // let index=this.order_item.findIndex(row=>row.Precloseqty=="0");
            // console.log(index);
            // this.order_item[index].precloseQty=this.order_item[index].Precloseqty;            
            setTimeout(() => {
                this.loader = '';
                
            }, 700);
        }))
    }
    
    
    
    update_order() {
        
        
        
        
        this.disable = true;
        // console.log('inside API');
        console.log(this.order_item);
        
        for (let i = 0; i < this.order_item.length; i++) {
            if ((parseInt(this.order_item[i]['dispatchQty'])) == (parseInt(this.order_item[i]['qty']))) {
                status='Dispatch';  
            }
            else {
                this.dispatchStatusFlag = 1;
                status='PDispatch';
                break;
            }
        }
        
        console.log(this.dispatchStatusFlag);
        console.log(status);
        
        if(this.status_flag != 'Change Status from pop and gift'){
            this.serve.fetchData({ 'order_id': this.order_id, "data": this.order_item , 'Status':status,'action_by':this.login.data.id}, "Order/dispatch_order2")
            .subscribe(resp => {
                console.log(resp);
                if (resp['dispatch_order'] == 'success') {
                    this.dialog.closeAll();
                }
            });
        }
        else if(this.status_flag == 'Change Status from pop and gift'){
            this.serve.fetchData({ 'order_id': this.order_id, "data": this.order_item , 'Status':status}, "Order/pop_order_dispatch_item")
            .subscribe(resp => {
                console.log(resp);
                if (resp['result'] == 'success') {
                    this.dialog.closeAll();
                }
            });
        }
        else{
            
        }
        
    }
    
    check_qty(indx) {
        console.log(this.order_item[indx]);
        
        if (this.order_item[indx]['dispatchQty'] == null) {
            this.order_item[indx]['dispatchQty'] = 0;
        }   
        if(this.order_item[indx]['precloseQty']+this.order_item[indx]['dispatchQty']>this.order_item[indx]['pending_qty']){
            this.order_item[indx]['precloseQty']=0;
            this.order_item[indx]['dispatchQty']=0;
            this.dialogctrl.error("Sum Of Preclose Qty And Dispatch Qty Is Greater Than Pending Qty. Which Is Not Possible");

        }
        
        if (parseInt(this.order_item[indx]['dispatchQty']) > parseInt(this.order_item[indx]['pending_qty'])) {
            this.order_item[indx]['dispatchQty'] = parseInt(this.order_item[indx]['pending_qty']);
        }
    }
    
    check_qty2(index){
        console.log(this.order_item[index]);
        if(this.order_item[index]['precloseQty']==null){
            this.order_item[index]['precloseQty']=0;
        }
        if(this.order_item[index]['precloseQty']+this.order_item[index]['dispatchQty']>this.order_item[index]['pending_qty']){
            this.order_item[index]['precloseQty']=0;
            this.order_item[index]['dispatchQty']=0;
            this.dialogctrl.error("Sum Of Preclose Qty And Dispatch Qty Is Greater Than Pending Qty. Which Is Not Possible");

        }
        
        if (parseInt(this.order_item[index]['precloseQty']) > parseInt(this.order_item[index]['pending_qty'])) {
            this.order_item[index]['precloseQty'] = parseInt(this.order_item[index]['pending_qty']);
        }
    }

    select_all() {
        for (let i = 0; i < this.order_item.length; i++) {
            // console.log(this.order_item[i]['pending_qty']);
            // console.log();
            // this.order_item[i]['precloseQty']=0;
            // console.log(this.order_item[i]['dispatchQty']);
            // this.order_item[i]['dispatchQty']=0;
            // if( this.order_item[i]['precloseQty'] == this.order_item[i]['pending_qty']){
            //     console.log("order item",this.order_item[i]['dispatchQty']);
                
            //     this.order_item[i]['dispatchQty']=0 ;
            //     console.log("order item",this.order_item[i]['precloseQty']);
            //     this.dialogctrl.error("Preclose Qty Is Equal To Pending Qty.. So 0 Qty Left For Dispatch Qty.");
            // }else{
            //     this.order_item[i]['dispatchQty'] = this.order_item[i]['pending_qty']

            // }
            this.order_item[i]['dispatchQty'] = this.order_item[i]['pending_qty'];

            // if(this.order_item[i]['precloseQty'] + this.order_item[i]['dispatchQty']>this.order_item[i]['pending_qty']){
            //     this.order_item[i]['dispatchQty']=0 ;
            //     this.order_item[i]['precloseQty']=0 ;
            //     this.dialogctrl.error("Sum Of Preclose Qty And Dispatch Qty Is Greater Than Pending Qty. Which Is Not Possible");

            // }

        }
        
        
        
    }
    select_all2() {
      
        for (let i = 0; i < this.order_item.length; i++) {
            // console.log(this.order_item[i]['pending_qty']);
            // console.log(this.order_item[i]['precloseQty']);
            // this.order_item[i]['precloseQty']=0;
            // console.log(this.order_item[i]['dispatchQty']);
            // this.order_item[i]['dispatchQty']=0;
            // if( this.order_item[i]['dispatchQty'] == this.order_item[i]['pending_qty']){
            //     console.log("order item",this.order_item[i]['dispatchQty']);
                
            //     this.order_item[i]['precloseQty']=0 ;
            //     console.log("order item",this.order_item[i]['precloseQty']);
            //     this.dialogctrl.error("Dispatch Qty Is Equal To Pending Qty.. So 0 Qty Left For Preclose Item.");

            // }else{
            // this.order_item[i]['precloseQty'] = this.order_item[i]['pending_qty'];

            // }
            this.order_item[i]['precloseQty'] = this.order_item[i]['pending_qty'];

            // if(this.order_item[i]['precloseQty'] + this.order_item[i]['dispatchQty']>this.order_item[i]['pending_qty']){
            //     this.order_item[i]['dispatchQty']=0 ;
            //     this.order_item[i]['precloseQty']=0 ;
            //     this.dialogctrl.error("Sum Of Preclose Qty And Dispatch Qty Is Greater Than Pending Qty. Which Is Not Possible");

            // }

        }
        
        
        
    }
    
    get_pop_order_detail(){
        console.log("get_pop_order_detail method calls");
        console.log( this.order_id);
        
        const id = {'order_id': this.order_id};
        this.loader = 1;
        this.serve.fetchData(id, 'Order/pop_master_order_detail').subscribe((result => {
            console.log(result);
            this.order_detail=result['pop_order_data'];
            this.order_item=result['pop_order_item'];
            console.log(this.order_item);
            setTimeout(() => {
                this.loader = '';
                
            }, 700);
        }))
        
        
    }
    
    
}
