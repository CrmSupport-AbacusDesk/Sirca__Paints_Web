import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { LocalStorage } from 'src/app/localstorage.service';
import { PearlService } from 'src/app/pearl.service';
import { UploadFileModelComponent } from 'src/app/upload-file-model/upload-file-model.component';

@Component({
  selector: 'app-invoice-billing',
  templateUrl: './invoice-billing.component.html',
  styleUrls: ['./invoice-billing.component.scss']
})
export class InvoiceBillingComponent implements OnInit {
  
  
  billing_list:any=[];
  skelton: any = new Array(10);
  loader: any ;
  data_not_found: any = false;
  search:any={};
  
  assign_login_data: any = [];
  login_data: any = [];
  credit_note:any=[];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  
  last_synchronised_data_date : any = '';
  payment_list: any=[];
  active_tab:any = 'Billing';
  overall_total_sum: any = {};
  overall_total_payment_amount: any = '0';
  excel_data: any = [];
  download_billing_excel_data: any = [];
  download_payment_excel_data: any;

  
  
  
  constructor(public serve: PearlService,public dialog:DialogComponent,public session:LocalStorage,public dialog_box:MatDialog,public secondry_route:Router) {
    
    
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;

    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'billing');
    console.log(index);
    
    if(index != -1){
      this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
      this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
      this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
      console.log(this.view_add);
      console.log(this.view_edit);
      console.log(this.view_delete);
      
    }
    this.get_billing_data_list()
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    console.log(this.login_data.id);
  }
  
  ngOnInit() {
  }
  
  get_billing_data_list(action:any=''){
    console.log("get_billing_data_list method calls");
    
    if(action == "refresh"){
      this.search = {};
      this.billing_list = [];
    }
    
    this.loader=true;
    this.serve.fetchData({'filter':this.search},"Tally_invoice_credit/tally_invoice_credit_billing_listing")
    .subscribe((result=>{
      console.log(result);
      this.billing_list = result['credit_billing_list'];
      this.last_synchronised_data_date = result['last_synchronised_data_date'];
      this.overall_total_sum = result['overall_total_sum'];
      
      setTimeout (() => {
        this.loader=false;
        
      }, 700);
      if(this.billing_list.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
      }
    }))
    
  }
  
  get_payment_data_list(action:any=''){
    console.log("get_payment_data_list method calls");
    
    if(action == "refresh"){
      this.search = {};
      this.payment_list = [];
    }
    
    this.loader=true;
    this.serve.fetchData({'filter':this.search},"Tally_invoice_credit/invoice_payment_listing")
    .subscribe((result=>{
      console.log(result);
      this.payment_list = result['list'];
      this.last_synchronised_data_date = result['last_synchronised_data_date'];
      this.overall_total_payment_amount = result['overall_total_payment_amount']
      
      setTimeout (() => {
        this.loader=false;
        
      }, 700);
      if(this.payment_list.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
      }
    }))
    
  }
  
  
  upload_excel()
  {
    const dialogRef = this.dialog_box.open(UploadFileModelComponent,{
      width: '500px',
      data:{
        'from':'invoice_billing_list',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.get_billing_data_list();
      this.get_payment_data_list();
      this.get_credit_note_data_list();
    });
  }
  
  con_date(date){
    
    this.search.date = moment(date).format('YYYY-MM-DD');
    console.log(this.search.date);
    this.active_tab == 'Billing' ? this.get_billing_data_list() :this.active_tab == 'Payment'?this.get_payment_data_list():this.get_credit_note_data_list();
    
  }
  
  go_to(id,type){
    this.secondry_route.navigate(['/invoice-billing-detail/'+id],{ queryParams: { id,type} });
  }
  
  deletebilling(id)
  {
    this.dialog.delete('Billing Data !').then((result) => {
      if(result){
        this.serve.fetchData({"id":id,'deleted_by':this.login_data.id},"Tally_invoice_credit/remove_bill_with_adjust_of_bill_received_amount").subscribe((result=>{
          console.log(result);
          this.get_billing_data_list();
          
        }))
      }})
      
    }
    deleteCreditNote(id)
  {
    this.dialog.delete('Credit Note Data !').then((result) => {
      if(result){
        this.serve.fetchData({"id":id,'deleted_by':this.login_data.id},"Tally_invoice_credit/remove_credit_note").subscribe((result=>{
          console.log(result);
          if(result['msg']=='Data deleted successfully'){
          this.dialog.success("Deleted","Successfully");

          }else{
          this.dialog.error("Something Went Wrong");

          }

          this.get_credit_note_data_list();
          
        }))
      }})
      
    }
    deletepayment(id)
  {
    this.dialog.delete('Payment Data !').then((result) => {
      if(result){
        this.serve.fetchData({"id":id,'deleted_by':this.login_data.id},"Tally_invoice_credit/remove_payment_slip_with_adjust_payment_amount").subscribe((result=>{
          console.log(result);
          this.get_payment_data_list();
          
        }))
      }})
      
    }
  download_excel():void {
    
    console.log(this.active_tab);
    this.excel_data = [];
    if(this.active_tab == 'Billing'){
      
      this.serve.fetchData({'filter':this.search},"Tally_invoice_credit/tally_invoice_credit_billing_listing_excel")
      .subscribe((result=>{
        console.log(result);
        this.download_billing_excel_data = result['credit_billing_list'];
        
        for(let i=0;i<this.download_billing_excel_data.length;i++){
          
          let keys_value : any = [];
          keys_value = Object.keys(this.download_billing_excel_data[i])
          
          let excel_object: any = {}
          
          for(let secondary_index=0;secondary_index<keys_value.length;secondary_index++){
            excel_object[keys_value[secondary_index]]=this.download_billing_excel_data[i][keys_value[secondary_index]]        
          }
          this.excel_data.push(excel_object)
          
        }
        console.log(this.excel_data);
        this.serve.exportAsExcelFile(this.excel_data, this.active_tab+' EXCEL');
        
        setTimeout (() => {
          this.loader=false;
        }, 700);
      }))
      
      
    }
    else if(this.active_tab=='Credit Note'){
      this.serve.fetchData({'filter':this.search},"Tally_invoice_credit/invoice_payment_credit_note_listing")
      .subscribe((result=>{
        console.log(result);
        this.download_payment_excel_data = result['list'];
        
        for(let i=0;i<this.download_payment_excel_data.length;i++){
          
          let keys_value : any = [];
          keys_value = Object.keys(this.download_payment_excel_data[i])
          
          let excel_object: any = {}
          
          for(let secondary_index=0;secondary_index<keys_value.length;secondary_index++){
            excel_object[keys_value[secondary_index]]=this.download_payment_excel_data[i][keys_value[secondary_index]]        
          }
          
          this.excel_data.push(excel_object)
          
        }
        
        console.log(this.excel_data);
        this.serve.exportAsExcelFile(this.excel_data, this.active_tab+' EXCEL');
        
        setTimeout (() => {
          this.loader=false;
        }, 700);
      }))
    }
    
    else{
      
      
      this.serve.fetchData({'filter':this.search},"Tally_invoice_credit/invoice_payment_listing_excel")
      .subscribe((result=>{
        console.log(result);
        this.download_payment_excel_data = result['list'];
        
        for(let i=0;i<this.download_payment_excel_data.length;i++){
          
          let keys_value : any = [];
          keys_value = Object.keys(this.download_payment_excel_data[i])
          
          let excel_object: any = {}
          
          for(let secondary_index=0;secondary_index<keys_value.length;secondary_index++){
            excel_object[keys_value[secondary_index]]=this.download_payment_excel_data[i][keys_value[secondary_index]]        
          }
          
          this.excel_data.push(excel_object)
          
        }
        
        console.log(this.excel_data);
        this.serve.exportAsExcelFile(this.excel_data, this.active_tab+' EXCEL');
        
        setTimeout (() => {
          this.loader=false;
        }, 700);
      }))
      
      
    }
    
  }
  

  convert_integer(val){
    return parseInt(val);
  }

  get_credit_note_data_list(action:any=''){
    console.log("get_payment_data_list method calls");
    
    if(action == "refresh"){
      this.search = {};
      this.credit_note=[];
    }

    if(this.search.voucher_date){
      this.search.voucher_date=moment(this.search.voucher_date).format('YYYY-MM-DD');
    }
    if(this.search.bill_date){
      this.search.bill_date=moment(this.search.bill_date).format('YYYY-MM-DD');
    }
    this.loader=true;
    this.serve.fetchData({'filter':this.search},"Tally_invoice_credit/invoice_payment_credit_note_listing")
    .subscribe((result=>{
      console.log(result);
      this.credit_note = result['list'];
      this.last_synchronised_data_date = result['last_synchronised_data_date'];
      this.overall_total_payment_amount = result['overall_total_payment_amount']
      
      setTimeout (() => {
        this.loader=false;
        
      }, 700);
      if(this.credit_note.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
      }
    }))
    
  }

  
  
}