import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { StatusModalComponent } from '../status-modal/status-modal.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { splitClasses } from '@angular/compiler';
import { LocalStorage } from 'src/app/localstorage.service';
import { OrderEditModalComponent } from '../order-edit-modal/order-edit-modal.component';
import { OrderDispatchComponent } from '../order-dispatch/order-dispatch.component';
import * as $ from 'jquery';
import { Button } from 'protractor';
import * as moment from 'moment';


@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    animations: [slideToTop()]
})
export class OrderDetailComponent implements OnInit {
    
    data: any = {};
    login_data: any = [];
    order_id: any;
    order_item: any = [];
    order_detail: any = [];
    login_dr_id: any;
    disp_qty: false;
    loader: any;
    edit_cash_discount: any = false;
    totalOrderQty: any = 0;
    type:any;
    order_billing_details :any =[];
    today_date = moment(new Date()).format('YYYY-MM-DD');
    order_detail1: any = {};
    editqty: any = false;
    
    amount: any = 0;
    gst_amount: any = 0;
    subtotal: any = 0;
    second_subtotal: any = 0;
    cd_amount: any = 0;
    reason
    list: any;
    order_status_change_log: any= {};
    panelOpenState:any=false;
    dispatched_box_detail:any = [];
    constructor(public route: ActivatedRoute, public router:Router, public serve: PearlService, public dialog: MatDialog, public session: LocalStorage) {
        
        this.login_data = this.session.getSession();
        this.login_data = this.login_data.value.data;
        console.log(this.login_data);
        
        if (this.login_data.access_level != '1') {
            this.login_dr_id = this.login_data.id;
            console.log(this.login_dr_id);
        }
        
        this.route.params.subscribe( params => {
            console.log(params);
            this.order_id = params.id;
            console.log(this.order_id);
            
        });
        this.orderDetail();
    }
    
    
    ngOnInit() {
        
        
    }
    
    openDialog(): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '400px', data: {
                order_status : this.order_detail.order_status,
                order_id : this.order_id,
                reason: this.order_detail.reason_reject
            }
        });
        
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.orderDetail();
        });
    }
    
    open_dipatch_model(): void {
        
        
        const dialogRef = this.dialog.open(OrderDispatchComponent, {
            
            width: '1000px', data: {
                order_status : this.order_detail.order_status,
                order_id : this.order_id,
                reason: ''
            }
        });
        
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.orderDetail();
        });
    }
    
    openEditDialog(user_id, type): void {
        const dialogRef = this.dialog.open(OrderEditModalComponent, {
            width: '550px', data: {
                order_id : this.order_id,
                type : type,
                user_id: user_id
            }
            
        });
        
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.orderDetail();
            
        });
    }
    
    orderDetail() {
        this.loader = 1;
        const id = {'order_id': this.order_id};
        this.serve.fetchData(id, 'Order/order_detail').subscribe((result => {
            console.log(result);
            this.order_detail.order_status_change_log = result['order_detail']['order_status_change_log'];
            this.order_billing_details = result['order_detail']['order_billing'];
            this.dispatched_box_detail = result['order_detail']['dispatched_box_detail'];
            
            this.order_detail = result['order_detail'];
            this.order_item = result['order_detail']['order_item'];
            
            
            this.order_detail.order_cgst = this.order_detail.order_gst / 2;
            this.order_detail.order_cgst = parseFloat(this.order_detail.order_cgst).toFixed(2);
            this.order_detail.netBreakup = (parseFloat(this.order_detail.order_grand_total) / 1.18);
            this.order_detail.gstBreakup = parseFloat(this.order_detail.order_grand_total) - parseFloat(this.order_detail.netBreakup);
            this.order_detail.gstBreakup = this.order_detail.gstBreakup.toFixed(2);
            this.order_detail.netBreakup = this.order_detail.netBreakup.toFixed(2);
            this.order_item.map((row) => {
                console.log(row);
                row.editqty = false;
                
            });
            setTimeout (() => {
                this.loader = '';
                
            }, 700);
            
            
            let totalOrderQty = 0;
            for (let index = 0; index < this.order_item.length; index++) {
                totalOrderQty += parseInt(this.order_item[index].qty);
            }
            
            this.totalOrderQty = totalOrderQty;
        }));
    }
    deleteOrderitem(id, index) {
        this.serve.fetchData(id, 'Order/order_item_delete')
        .subscribe((result => {
            console.log(result);
            this.order_item.splice(index, 1);
            
        }));
    }
    calc(id, qty) {
        
        console.log("calc method calls");
        console.log("order detail array = ");
        console.log(this.order_detail1);
        
        console.log("order Item array = ");
        console.log(this.order_item);
        
        
        
        
        const index = this.order_item.findIndex(row => row.id === id);
        
        // this.order_item[index].sub_total = this.order_item[index].price * qty
        // this.order_item[index].amount = (this.order_item[index].price * qty) - (this.order_item[index].discount_amount * this.order_item[index].qty)
        
        this.order_item[index].sub_total = this.order_item[index].price * this.order_item[index].qty;
        this.order_item[index].discount_amount = this.order_item[index].price * this.order_item[index].discount_percent / 100;
        this.order_item[index].discounted_amount = this.order_item[index].price - this.order_item[index].discount_amount;
        // this.order_item[index].gst_amount = this.order_item[index].discounted_amount * this.order_item[index].gst_percent / 100;
        this.order_item[index].amount = parseFloat(this.order_item[index].discounted_amount) *  this.order_item[index].qty;
        
        this.order_item[index].sub_total = parseFloat(this.order_item[index].sub_total);
        this.order_item[index].discount_amount = parseFloat(this.order_item[index].discount_amount);
        this.order_item[index].discounted_amount = parseFloat(this.order_item[index].discounted_amount);
        this.order_item[index].gst_amount = parseFloat(this.order_item[index].gst_amount);
        this.order_item[index].amount = parseFloat(this.order_item[index].amount);
        // this.order_item[index].discount_amount * this.order_item[index].qty
        // this.order_item[index].discount_percent
        
        
        this.order_detail1.sub_total = 0;
        this.order_detail1.discount = 0;
        this.order_detail1.gst = 0;
        this.order_detail1.order_total = 0;
        // this.order_detail1.special_discount_amount =0
        
        
        console.log(this.order_item);
        
        
        for (let i = 0; i < this.order_item.length; i++) {
            this.order_detail1.sub_total += parseFloat(this.order_item[i]['sub_total']);
            this.order_detail1.order_total += parseFloat(this.order_item[i]['amount']);
    
            this.order_detail1.discount += parseFloat(this.order_item[i].sub_total) - parseFloat(this.order_item[i].amount);
            
            this.order_detail1.gst += parseFloat(this.order_item[i]['gst_amount']);
            
            this.order_detail.sub_total = this.order_detail1.sub_total;
            this.order_detail.order_total = this.order_detail1.order_total;
            this.order_detail.order_discount = this.order_detail1.discount;
            this.order_detail.order_gst = this.order_detail1.gst;
        }
        
        
        console.log("order detail array = ");
        console.log(this.order_detail1);
        
        console.log("order Item array = ");
        console.log(this.order_item);
        
        
        
        this.order_detail1.special_discount_amount = (this.order_detail1.order_total * parseFloat(this.order_detail.special_discount_percentage) ) / 100;
        this.order_detail.special_discount_amount = this.order_detail1.special_discount_amount;
        if (this.order_detail.DiscType == 'Discount') {
            this.order_detail1.order_grand_total = this.order_detail1.order_total - this.order_detail1.special_discount_amount;
        } else {
            this.order_detail1.order_grand_total = this.order_detail1.order_total - this.order_detail1.special_discount_amount;
            
        }
        
        
        this.order_detail.order_grand_total = this.order_detail1.order_grand_total;
        this.order_detail.order_grand_totalAfterRoundOff = Math.round(this.order_detail.order_grand_total);
        this.order_detail.netBreakup = (parseFloat(this.order_detail.order_grand_total) / 1.18);
        this.order_detail.gstBreakup = parseFloat(this.order_detail.order_grand_total) - parseFloat(this.order_detail.netBreakup);
        
        // if(del==true)
        // {
        
        // this.update_order(this.order_item[index].id,index)
        // }
        
    }
    update_order(id) {
        console.log(id);
        const index = this.order_item.findIndex(row => row.id === id);
        console.log(index);
        
        this.serve.fetchData({'order_id': this.order_detail.id, 'order_item_id': id, 'item': this.order_item[index], 'order': this.order_detail}, 'Order/update_order_item')
        .subscribe((result) => {
            console.log(result);
            this.editqty = false;
            this.orderDetail();
        });
    }
    Orderitemedit(id, qty) {
        console.log(id + ' ' + qty);
        
        // this.serve.fetchData({'id':id,'qty':qty},"Order/order_item_edit")
        // .subscribe((result)=>
        // {
        //     console.log(result);
        //     this.editqty=false;
        //     this.orderDetail();
        // });
    }
    
    edit_qty() {
        this.editqty = true;
    }
    
    print1() {
        let printContents, popupWin;
        printContents = document.getElementById('print-section1').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <head>
        <title>Print tab</title>
        <style>
        body
        {
            font-family: 'arial';
        }
        .print-section
        {
            width: 1024px;
            background: #fff;
            padding: 15px;
            margin: 0 auto
        }
        .print-section table
        {
            width: 1024px;
            box-sizing: border-box;
            table-layout: fixed;
        }
        .print-section table tr table.table1 tr td h2
        {
            font-size: 4px;
            line-height: 10px;
        }
        .print-section table tr table.table1 tr td p
        {
            font-size: 1px;
            line-height: 10px;
        }
        table .table3 tr td
        {
            background: #ccc;
        }
        .print-section table tr table.table1 tr td:nth-child(1){width: 324px;}
        .print-section table tr table.table1 tr td:nth-child(2){width: 700px;}
        </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
        </html>`
        );
        
        setTimeout(() => {
            popupWin.document.print();
            popupWin.document.close();
        }, 1000);
    }
    
    change_cash_discount() {
        this.subtotal = this.order_detail.sub_total - this.order_detail.order_discount;
        this.cd_amount = (this.subtotal * this.order_detail.cd_percentage) / 100;
        this.second_subtotal = this.subtotal - this.cd_amount;
        
        if (this.order_detail.delivery_from == 'Sirca') {
            this.gst_amount = (this.second_subtotal * 18) / 100;
        } else {
            this.gst_amount = 0;
        }
        
        this.amount = this.second_subtotal + this.gst_amount;
        this.order_detail.order_total = parseFloat(this.amount).toFixed(2);
        this.order_detail.order_gst = parseFloat(this.gst_amount).toFixed(2);
        this.order_detail.cd_amount = parseFloat(this.cd_amount).toFixed(2);
        
        this.order_detail.order_cgst = this.gst_amount / 2;
        this.order_detail.order_cgst = parseFloat(this.order_detail.order_cgst).toFixed(2);
    }
    
    save_cash_discount() {
        this.loader = 1;
        this.serve.fetchData(this.order_detail, 'Order/update_cash_discount')
        .subscribe((result) => {
            console.log(result);
            
            setTimeout (() => {
                this.loader = '';
            }, 700);
        });
    }
    back() {
        console.log("window.history order detail page = ");
        console.log(window.history);
        window.history.go(-1);
    }
    changeStatusToDispatch(orderId)
    {
        console.log("inside");
        console.log(this.order_detail);
        
        console.log(orderId);
        console.log(this.order_detail.disp_qty);
        
        this.loader = 1;
        this.serve.fetchData({orderId: orderId,'action_by':this.login_data.id}, 'Distributors/changeStatusToDispatch')
        .subscribe((result) => {
            console.log(result);
            
            this.loader = '';
            this.orderDetail();
            
        }, err => {
            this.loader = '';
            
        });
        
    }
    
    onPrintPage(type) {
        
        console.log(type);
        
        if(type=='without_image'){
            
            const printContents = document.getElementById('printData').innerHTML;
            console.log(printContents);
            
            const originalContents = document.body.innerHTML;
            console.log(originalContents);
            
            
            document.body.innerHTML = printContents;
            
            window.print();
            
            document.body.innerHTML = originalContents;
            
            setTimeout(() => {
                
                $('#printData').hide();
                
            }, 1000);
        }
        else if(type=='with_image')
        {
            const printContents = document.getElementById('printDataWithImage').innerHTML;
            console.log(printContents);
            
            const originalContents = document.body.innerHTML;
            console.log(originalContents);
            
            
            document.body.innerHTML = printContents;
            
            window.print();
            
            document.body.innerHTML = originalContents;
            
            setTimeout(() => {
                
                $('#printDataWithImage').hide();
                
            }, 1000);
        }
        else{
            console.log("no data");
        }
        // location.reload();
    }
    
    downloadOrderPdf(type:any){
        this.loader = 1;
        console.log(type);
        
        if(type=='without_image')
        {
            this.serve.fetchData({'order_id':this.order_id,'pdf_type':type},"Cron/order_pdf").subscribe(result=>{
                this.loader = '';
                console.log(result);
                
                if(result=='success')
                {
                    var url = this.serve.myurl+'api/uploads/orderPdf/'+this.order_id+'.pdf';
                    window.open(url);
                }
                
                
            });
        }
        else if(type=='with_image')
        {
            this.serve.fetchData({'order_id':this.order_id,'pdf_type':type},"Cron/order_pdf").subscribe(result=>{
                this.loader = '';
                console.log(result);
                
                if(result=='success')
                {
                    var url = this.serve.myurl+'api/uploads/orderPdf/'+this.order_id+'_image.pdf';
                    window.open(url);
                }
                
                
            });
        }
        else
        {
            console.log("no data found");
        }
        
        
    }
    alert() {
        alert('Please enter dispatch quantity first from Dispatch Item');
        return false;
    }
    
    
    imageModel(image){
        const dialogRef = this.dialog.open( StatusModalComponent, {
            data:{
                image,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            
        });
        
    }
    
    
    date_diff(today,stock_date){
        
        var a = moment(today);
        var b = moment(stock_date);
        console.log(b.diff(a, 'days'));
        var c = b.diff(a, 'days');
        console.log(typeof(c));
        if(c >= 0)
        {
            return c;
        }
    }
    
    view_dispatch_item_details(master_cart_id){
        console.log("view_dispatch_item_details method calls");
        const dialogRef = this.dialog.open(StatusModalComponent, {
            maxWidth: '55vw', data: {
                'master_cart_id' : master_cart_id,
                'from' : 'order_detail_page'
            }
        });
        
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.orderDetail();
        });
        
    }

        open_dipatch_model1(order_detail){
            console.log(order_detail)
            const id=this.order_id
            console.log(id);

            this.router.navigate(['/app-addorder'],{ queryParams: {'id':id , 'comes_from':'order_detail_page'} });

    }
    
    
}



