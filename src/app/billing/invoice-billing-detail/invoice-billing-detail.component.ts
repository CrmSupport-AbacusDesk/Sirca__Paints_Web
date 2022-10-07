import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { Location } from '@angular/common'


@Component({
  selector: 'app-invoice-billing-detail',
  templateUrl: './invoice-billing-detail.component.html',
  styleUrls: ['./invoice-billing-detail.component.scss']
})
export class InvoiceBillingDetailComponent implements OnInit {
  bill_id: any = '0';
  payment_id: any = '0';
  type : any = 'nothing'
  
  loader: any;
  invoice_bill_detail: any = {};
  invoice_bill_item: any = [];
  payment_list:any = [];
  payment_detail_summary:any = [];

  
  
  constructor(public route: ActivatedRoute,public serve: PearlService,public location: Location) { 
    
    console.log(this.route);
    console.log(this.route.queryParams);
    console.log(this.route.queryParams['_value']);
    this.type = this.route.queryParams['_value']['type']
    
    this.route.params.subscribe( params => {
      console.log(params);
      console.log(params.id);
      console.log(params['id']);
      // this.payment_id = params.id
      // console.log("this.payment_id = "+ this.payment_id);
      
      this.route.queryParams['_value']['type'] == 'Billing' ?  this.bill_detail() : (this.payment_id = params['id'] && this.payment_detail());
      console.log("this.bill_id = "+ this.bill_id);
      console.log("this.payment_id = "+ this.payment_id);
    });
    
  }
  
  ngOnInit() {
  }
  
  bill_detail(){
    console.log("bill_detail method calls");
    this.route.params.subscribe( params => {
      console.log(params);
      this.bill_id = params.id
      this.loader = 1;
      this.serve.fetchData({'bill_id': this.bill_id}, 'Tally_invoice_credit/tally_invoice_credit_billing_detail').subscribe((result => {
        console.log(result);
        this.invoice_bill_detail = result['invoice_bill'];
        this.invoice_bill_item = result['invoice_bill_item'];
        this.payment_list = result['payment_list']
        
        setTimeout (() => {
          this.loader = '';
          
        }, 700);
      }));
      
    });
    
  }
  
  payment_detail(){
    console.log("payment_detail method calls");
    this.route.params.subscribe( params => {
      console.log(params);
      this.payment_id = params['id']
      this.loader = 1;
      this.serve.fetchData({'payment_id': this.payment_id}, 'Tally_invoice_credit/invoice_payment_detail_with_summary').subscribe((result => {
        console.log(result);
        this.invoice_bill_detail = result['payment_detail'];
        this.payment_detail_summary = result['payment_detail_summary'];
       
        
        setTimeout (() => {
          this.loader = '';
          
        }, 700);
      }));
    });
  }
  
  back(): void {
    console.log("location back method calls");
    console.log(this.location);
    this.location.back()
  }
  
}
