import { Component, OnInit, Inject } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { LocalStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-pop-n-gift-list',
  templateUrl: './pop-n-gift-list.component.html',
  styleUrls: ['./pop-n-gift-list.component.scss']
})
export class PopNGiftListComponent implements OnInit {
  
  view_tab: any = 'all';
  value: any ={};
  
  order_status: any= [];
  total_order_val={};
  total_count={};
  total_pending_sum={};
  total_pending_count={};
  order_accepted_sum={};
  pdispatch_sum={};
  complete_dispatch_sum={};
  referred_back_sum={};
  pre_close_sum={};
  orderlist:any=[];
  exp_loader:boolean=false;
  cnt: any=0;
  loader: any ;
  tmp_list: any = [];
  tmp_orderlist: any = [];
  data: any = [];
  search_val: any = {};
  data_not_found: any = false;
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {};
  type:any=[];
  today_date: any;
  plus2date: void;
  pop_order_list:any=[];
  id:any;
  excel_data: any = [];
  
  page_limit: any = 50;
  start:any=0;
  total_page:any;
  pagenumber:any;
  count:any = 0;
  
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  constructor(   @Inject(DOCUMENT) private _document: Document ,public serve: PearlService, public route: Router, public dialog: DialogComponent, public session: LocalStorage)
  {
    this.skelton = new Array(10);
    
    
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'pop order');
    console.log(index);
    
    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
    
    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);
    
    
    this.today_date = new Date();
    this.today_date = moment(this.today_date).format('YYYY-MM-DD')
    console.log(this.today_date);
    this.plus2date = this.incDate(this.today_date)
    console.log(this.plus2date);
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    
    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }
  }
  
  ngOnInit() {
    this.poporderList();
    
  }
  
  poporderList(type : any ='') {
    
    if(type == 'refresh'){
      this.pop_order_list=[];
      this.search_val={};
      this.start=0;
    }
    
    this.loader =true;
    console.log(this.search_val);
    this.serve.fetchData({'status': this.view_tab,'search': this.search_val,'start': this.start,'pagelimit': this.page_limit},'Order/pop_master_order_list')
    .subscribe((resp => {
      console.log(resp);
      
      this.pop_order_list=resp['pop_order_list'];
      this.count=resp['list_count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      
      console.log(this.pop_order_list);
      this.id=resp['id'];
      console.log(this.id);
      setTimeout (() => {
        this.loader= false;
        
      }, 700);
      if(this.pop_order_list.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
    }))
  }
  
  filter_order_data(status){
    
    console.log(status);
    this.view_tab=status;
    
    this.poporderList();
    
    // this.orderlist =[];
    // this.tmp_orderlist=[];
    // this.serve.fetchData({'start': this.orderlist.length, 'pagelimit':  this.page_limit, 'order_status': this.view_tab,  'login_user': this.login_dr_id}, 'Order/order_list2')
    // .subscribe((result => {
    
    //   console.log(result);
    //   this.count = result['order_list']['data'];
    //   // this.sum= result[]
    
    //   this.tmp_orderlist = this.tmp_orderlist.concat(result['order_list']['result']);
    //   this.orderlist = this.orderlist.concat(JSON.parse(JSON.stringify(result['order_list']['result'])));
    //   console.log(this.tmp_orderlist);
    //   console.log(this.orderlist);
    
    
    //   setTimeout (() => {
    //     this.loader= false;
    
    //   }, 700);
    //   // tslint:disable-next-line:triple-equals
    //   if(this.orderlist.length ==0){
    //     this.data_not_found=true;
    //   }else{
    //     this.data_not_found=false;
    
    //   }
    // }));
    // if(status!='all'){
    
    //   for(var i=0;i<this.tmp_orderlist.length; i++)
    //   {
    //     // status=status.toLowerCase();
    //     this.tmpsearch=this.tmp_orderlist[i]['order_status'];
    //     if(this.tmpsearch.includes(status))
    //     {
    //       // console.log(this.orderlist);
    
    //       this.orderlist.push(this.tmp_orderlist[i]);
    //     }
    //   }
    //   console.log(this.orderlist);
    // }else if(status=='all'){
    //   this.orderlist=this.tmp_orderlist;
    // }
  }
  
  conDate(date){
    return date = (moment(date).format('YYYY-MM-DD'))
  }
  
  incDate(date){
    date = (moment(date).local().toDate());
    date.setDate(date.getDate() + 3);
    date = (moment(date).format('YYYY-MM-DD'));
    return date;
    
  }
  
  public onDate(event): void
  {
    this.search_val.date_created=moment(event.value).format('YYYY-MM-DD'); 
    this.poporderList();
  } 
  exportAsXLSX():void{
    this.exp_loader=true;
    this.excel_data=[];
    this.serve.fetchData({'status': this.view_tab,'search': this.search_val,'start': this.start,'pagelimit': this.page_limit},'Order/pop_master_order_list')
    .subscribe((resp => {
      console.log(resp);
      
      this.pop_order_list=resp['pop_order_list'];
      for(let i=0; i<this.pop_order_list.length;i++){
        this.excel_data.push({
          'DATE':this.pop_order_list[i].date_created,
          'CREATED BY':this.pop_order_list[i].created_by_name,
          'TYPE': this.pop_order_list[i].type=='1'?'Distributor':this.pop_order_list[i].type=='3'?'Dealer':this.pop_order_list[i].type=='7'?'Direct Dealer':'',
          'ORDER ID':this.pop_order_list[i].order_no,
          'TOTAL ITEM':this.pop_order_list[i].order_total_item,
          'STATUS':this.pop_order_list[i].order_status && this.pop_order_list[i].order_status!= ''? (this.pop_order_list[i].order_status == 'PDispatch'? 'Partial Dispatch' : this.pop_order_list[i].order_status) :'--',
          'ORDER POINTS':this.pop_order_list[i].order_total_points
        })
  
      }
      this.serve.exportAsExcelFile(this.excel_data,'POP N GIFT EXCEL');
     
  
    
      setTimeout (() => {
        this.exp_loader= false;
        
      }, 700);
    
    }))
  
  
  }
  
}

