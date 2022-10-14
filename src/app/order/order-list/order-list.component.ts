import {Component, Inject, OnInit} from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { LocalStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  animations: [slideToTop()]

})
export class OrderListComponent implements OnInit {
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
  start:any=0;
  count:any;
  total_page:any;
  pagenumber:any;
  cnt: any=0;
  page_limit: any = 50;
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
  excel_button_disabled:boolean = false;

  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  list_count: any = 0;
  constructor(   @Inject(DOCUMENT) private _document: Document ,public serve: PearlService, public route: Router, public dialog: DialogComponent, public session: LocalStorage)
  {

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'order to Sirca');
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
    this.skelton = new Array(10);

    // tslint:disable-next-line:triple-equals
    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }
  }

  ngOnInit() {
    this.search_val = this.serve.orderFilterPrimary;
    this.orderList();

  }

  orderList(type : any = '')
  {

    if(type == 'refresh'){
      this.search_val = {}
    }
    this.loader=1;

    console.log(this.data.search);
    if ( Object.getOwnPropertyNames(this.search_val).length != 0)
    {
      this.page_limit = 50;
      this.orderlist = [];
      this.tmp_orderlist=[];
    }
    // tslint:disable-next-line:max-line-length
    this.serve.fetchData({'start': this.start, 'search': this.search_val, 'pagelimit': this.page_limit,'order_status': this.view_tab, 'login_user': this.login_dr_id}, 'Order/order_list2')
    .subscribe((result => {



      this.tmp_orderlist=[];
      console.log(result);

      this.list_count=result['order_list']['list_count'];
      this.total_page = Math.ceil(this.list_count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;

      this.count = result['order_list']['data'];
      console.log(this.count);

      this.total_order_val=result['order_list']['data']['sum'];
      console.log(this.total_order_val);
      this.total_count=result['order_list']['data']['count'];
      console.log(this.total_count);
      this.total_pending_count=result['order_list']['data']['pending_count'];
      this.total_pending_sum=result['order_list']['data']['pending_sum'];
      this.order_accepted_sum=result['order_list']['data']['approve_sum'];
      this.pdispatch_sum=result['order_list']['data']['PDispatch_sum'];
      this.complete_dispatch_sum=result['order_list']['data']['dispatch_sum'];
      this.referred_back_sum=result['order_list']['data']['rej_sum'];
      this.pre_close_sum=result['order_list']['data']['preclose_sum'];
      this.orderlist = result['order_list']['result'];

      // for (let index = 0; index < result['order_list']['result'].length; index++) {

      //   const orderExistIndex = this.orderlist.findIndex(row => row.id == result['order_list']['result'][index].id);

      //   if(orderExistIndex === -1) {

      //     this.tmp_orderlist = this.tmp_orderlist.concat(JSON.parse(JSON.stringify(result['order_list']['result'][index])))
      //     this.orderlist = this.orderlist.concat(JSON.parse(JSON.stringify(result['order_list']['result'][index])))
      //   }
      // }

      console.log(this.tmp_orderlist);
      this.tmp_orderlist = this.tmp_orderlist.filter((el, i, a) => i === a.indexOf(el));
      this.orderlist = this.orderlist.filter((el, i, a) => i === a.indexOf(el));

      setTimeout (() => {
        this.loader='';

      }, 700);
      // tslint:disable-next-line:triple-equals
      if(this.orderlist.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;

      }
    }))
  }
  refresh()
  {
    this.orderlist();
    // this.orderlist = this.orderList();
    // this.orderlist = this.orderlist.filter((el, i, a) => i === a.indexOf(el));



    this.orderList();
  }
  detailOrder(id)
  {
    this.serve.orderFilterPrimary = this.search_val ;
    this.route.navigate(['/order-detail/'+id]);
  }

  deleteOrder(id)
  {
    this.dialog.delete('Order Data !').then((result) => {
      if(result){
        console.log("order deleted");

        this.serve.fetchData({'order_id':id,'deleted_by':this.login_data.id},"Order/order_delete").subscribe((result=>{
          console.log(result);
          if(result)
          {
            const orderIndex = this.orderlist.findIndex(row => row.id == id);
            this.orderlist.splice(orderIndex, 1);

            const tmpOrderIndex = this.tmp_orderlist.findIndex(row => row.id == id);
            this.tmp_orderlist.splice(tmpOrderIndex, 1);
          }
        }))
      }});
    }
    tmpsearch:any={};
    tmpsearch1:any={};
    check_cnt =0
    check_tal=0;
    sum=0;

    filter_order_data(status){
      console.log("in filter function");

      this.loader = 1;
      // this.check_cnt = this.count.count;
      // this.sum= this.count.sum;



      console.log(status);
      this.view_tab=status;
      console.log(this.view_tab);

      this.start = 0;
      this.orderlist =[];
      this.tmp_orderlist=[];
      this.serve.fetchData({'start': this.start, 'pagelimit':  this.page_limit, 'order_status': this.view_tab,  'login_user': this.login_dr_id}, 'Order/order_list2')
      .subscribe((result => {

        console.log(result);
        this.count = result['order_list']['data'];
        // this.sum= result[]

        this.list_count=result['order_list']['list_count'];
        this.total_page = Math.ceil(this.list_count/this.page_limit);
        this.pagenumber = Math.ceil(this.start/this.page_limit)+1;



        // this.tmp_orderlist = this.tmp_orderlist.concat(result['order_list']['result']);
        // this.orderlist = this.orderlist.concat(JSON.parse(JSON.stringify(result['order_list']['result'])));

        this.tmp_orderlist = (result['order_list']['result']);
        this.orderlist = (result['order_list']['result']);

        console.log(this.tmp_orderlist);
        console.log(this.orderlist);

        // if(status == 'Pending'){

        //   this.check_cnt = this.count.pending_count;

        //   this.sum= this.count.pending_sum;

        // }
        // if(status == 'Pre Close'){

        //   this.check_cnt = this.count.pre_close_count;
        //   this.sum= this.count.preclose_sum;

        //   // this.sum=  this.count.pre_close_count+ this.count.pre_close_count;


        // }
        // if(status == 'Approved'){

        //   this.check_cnt = this.count.approved_count;
        //   this.sum= this.count.approve_sum;

        //   // this.sum=this.
        //   // this.sum= this.count.approved_count+ this.count.approved_count;

        // }
        // if(status == 'Dispatch'){

        //   this.check_cnt = this.count.dispatch_count;
        //   this.sum= this.count.dispatch_sum;

        //   // this.sum= this.count.dispatch_count+ this.count.dispatch_count;


        // }
        // if(status == 'Reject'){

        //   this.check_cnt = this.count.reject_count;
        //   this.sum= this.count.rej_sum;

        // }
        // if(status == 'all'){
        //   console.log("in all");

        //   this.check_cnt = this.count.count;
        //   this.sum= this.count.sum;

        // }
        // if(status == 'Hold'){

        //   this.check_cnt = this.count.hold_count;
        //   this.sum= this.count.hold_sum;

        // }
        // if(status == 'readyToDispatch'){

        //   this.check_cnt = this.count.ready_to_dispatch_count;
        //   this.sum= this.count.ready_to_dispatch_sum;

        // }
        // if(status == 'PDispatch'){

        //   this.check_cnt = this.count.PDispatch_count;
        //   this.sum= this.count.PDispatch_sum;

        // }

        setTimeout (() => {
          this.loader= '';

        }, 700);
        // tslint:disable-next-line:triple-equals
        if(this.orderlist.length ==0){
          this.data_not_found=true;
        }else{
          this.data_not_found=false;

        }
      }));
      if(status!='all'){

        for(var i=0;i<this.tmp_orderlist.length; i++)
        {
          // status=status.toLowerCase();
          this.tmpsearch=this.tmp_orderlist[i]['order_status'];
          if(this.tmpsearch.includes(status))
          {
            // console.log(this.orderlist);

            this.orderlist.push(this.tmp_orderlist[i]);
          }
        }
        console.log(this.orderlist);
      }else if(status=='all'){
        this.orderlist=this.tmp_orderlist;
      }
    }

    getItemsList(index,search)
    {
      console.log(search);
      this.orderlist=[];
      for(var i=0;i<this.tmp_orderlist.length; i++)
      {
        search=search.toLowerCase();
        this.tmpsearch1=this.tmp_orderlist[i][index].toLowerCase();
        if(this.tmpsearch1.includes(search))
        {
          // console.log(this.orderlist);

          this.orderlist.push(this.tmp_orderlist[i]);
        }
      }
      console.log(this.orderlist);

    }

    allCount:any;
    selected_order:any ='';

    allOrderdata(){
      this.allCount = 0;

      if( !this.search_val.allStates ){
        for (let i = 0; i < this.orderlist.length; i++) {
          if(this.orderlist[i].selected_order = false)
          {
            this.allCount++;
          }
          console.log(this.allCount);
        }

      }else{
        for (let i = 0; i < this.orderlist.length; i++) {
          if(this.orderlist[i].selected_order = true)
          {
            this.allCount++;
          }
          console.log(this.allCount);
        }
      }
    }

    countSelected(){
      this.allCount = 0;
      for (let i = 0; i < this.orderlist.length; i++) {
        if( this.orderlist[i].selected_order )
        {
          this.allCount++;
        }
      }
    }



    deletecheckavailable() {
      this.dialog.delete('').then((result) => {
        if(result) {
          this.serve.fetchData({ 'check' : this.orderlist } , 'Order/primary_delete')
          .subscribe(result => {
            if(result)
            {
              this.orderList();
            }
          });
        }
      });
    }


    exp_loader:any=false;
    exp_data:any=[];
    excel_data:any=[];
    p: string | number;
    last: any;
    new_excel_data:any=[];
    newexp_loader:any=false;
    pending_val : any=[];
    name : string;
    itemvalue : any=[];
    pending_quantity : any=[];
    exportAsXLSX():void
    {
      this.exp_loader = true;

      this.serve.FileData({'search':this.search_val,'order_status': this.view_tab},"Order/primary_order_excel")
      .subscribe(resp=>{
        console.log(resp);
        this.exp_data = resp['primary_order_excel'].result;
        console.log(this.exp_data);

        for(let i=0;i<this.exp_data.length;i++)
        {

          let orderStatus = '';

          if (this.exp_data[i].order_status == 'Pending') {

            orderStatus = 'Order Placed';

          } else if (this.exp_data[i].order_status == 'Approved') {

            orderStatus = 'Order Accepted';


          } else if (this.exp_data[i].order_status == 'readyToDispatch') {

            orderStatus = 'Ready To Dispatch';

          }

          else if (this.exp_data[i].order_status == 'PDispatch') {

            orderStatus = 'Partially Dispatched';

          }

          else if (this.exp_data[i].order_status == 'Dispatch') {

            orderStatus = 'Dispatched';

          }
          else if (this.exp_data[i].order_status == 'Reject' || this.exp_data[i].order_status == 'Rejected') {

            orderStatus = 'Reffered Back';


          }
          else if (this.exp_data[i].order_status == 'Pre Close') {

            orderStatus = 'Pre Closed';

          }
          else{
            orderStatus = this.exp_data[i].order_status;    //for Hold and and future status
          }


          this.excel_data.push({
            'Date':this.exp_data[i].date_created,
            // 'Created By':this.exp_data[i].created_by_type == 'channel partner' ? this.exp_data[i].ord_created_by : this.exp_data[i].ord_user_created_by,
            'Created By':this.exp_data[i].created_by_type == 'Executive' ? this.exp_data[i].created_by_name : this.exp_data[i].ord_created_by,

            'Order Id':this.exp_data[i].order_no,
            'Type': (this.exp_data[i].type == 7 ? 'Direct Dealer' : (this.exp_data[i].type == 1 ? 'Distributor' : '')),
            'Company Name':this.exp_data[i].company_name,
            'Total Item':this.exp_data[i].order_item,
            'Order Total Qty':this.exp_data[i].sum_item_order_qty,
            'Dispatch Qty':this.exp_data[i].sum_item_order_qty_dispatch ? this.exp_data[i].sum_item_order_qty_dispatch : 0,
            'Order Value':this.exp_data[i].order_grand_total,
            'Sales User':this.exp_data[i].assigned_sales_users,
            'Status': orderStatus,
            'Action By':orderStatus =='Hold'?this.exp_data[i].hold_by_name:this.exp_data[i].approved_by_name,
          });
        }


        this.exp_loader = false;
        this.serve.exportAsExcelFile(this.excel_data, 'Primary-Order');

        this.excel_data = [];
        this.exp_data = [];
      });
    }

    public onDate(event): void
    {

      this.search_val.date_created=moment(event.value).format('YYYY-MM-DD');


      this.orderList();
    }


    // submit1()
    // {

    //   for(var i=0;i<this.new_excel_data;i++)
    //   {
    //     this.new_excel_data[i].pending_val=this.new_excel_data[i].order_value - this.new_excel_data[i].Dispatch_Value;
    //     console.log(this.pending_val);

    //   }

    //   if(this.search_val.date_from){
    //     this.search_val.date_from=moment(this.search_val.date_from).format('YYYY-MM-DD');
    //     console.log(this.search_val.date_from);

    //   }
    //   if(this.search_val.date_to){
    //     this.search_val.date_to=moment(this.search_val.date_to).format('YYYY-MM-DD');
    //     console.log(this.search_val.date_to);

    //   }
    //   this.newexp_loader= true;
    //   this.serve.FileData({'search':this.search_val,'type':this.type},"Order/primary_order_excel_2")
    //   .subscribe(resp=>{
    //     console.log(resp);
    //     this.new_excel_data = resp['primary_order_excel_2'].result;
    //     console.log(this.new_excel_data);

    //     for(let i=0;i<this.new_excel_data.length;i++)
    //     {
    //       for(let j=0;j<this.new_excel_data[i].item_Details.length;j++)
    //       {

    //         this.excel_data.push({
    //           'Date':this.new_excel_data[i].date_created,
    //           'Created By':this.new_excel_data[i].created_by_type,
    //           'Order Id':this.new_excel_data[i].order_no,
    //           'Company Name':this.new_excel_data[i].company_name,
    //           'Contact Person':this.new_excel_data[i].contact_person,
    //           'Contact Number':this.new_excel_data[i].mobile,
    //           'Whatsapp Number':this.new_excel_data[i].whatsapp_no,
    //           'Assigned Sales User':this.new_excel_data[i].contact_person,
    //           'Email Id':this.new_excel_data[i].email,
    //           'State':this.new_excel_data[i].state,
    //           'District':this.new_excel_data[i].district,
    //           'City':this.new_excel_data[i].city,
    //           'Pincode':this.new_excel_data[i].pincode,
    //           'Address':this.new_excel_data[i].address,
    //           // 'Category':this.new_excel_data[i].item_Details[j]['category'],
    //           // 'Sub Category':this.new_excel_data[i].item_Details[j]['sub_category'],
    //           // 'Item Name':this.new_excel_data[i].item_Details[j]['item_name'],
    //           'Order Quantity':this.new_excel_data[i].sum_item_order_qty,
    //           'Dispatch Quantity':this.new_excel_data[i].sum_item_order_qty_dispatch ? this.new_excel_data[i].sum_item_order_qty_dispatch:0,
    //           // 'Pending Quantity':this.new_excel_data[i].item_Details[j]['order_quantity']-this.new_excel_data[i].item_Details[j]['dispatch_qty'],
    //           // 'Item Value':this.new_excel_data[i].item_Details[j]['order_value'],
    //           'Order Value':this.new_excel_data[i].Total_order_value,
    //           'Approved By':this.new_excel_data[i].approved_by_name,
    //           'Order Status':this.new_excel_data[i].order_status,
    //           // 'Dispatch value':this.new_excel_data[i].item_Details[j]['Dispatch_Value']  ? this.new_excel_data[i].item_Details[j]['Dispatch_Value']:0,
    //           // 'Pending Value':this.new_excel_data[i].item_Details[j]['order_value']-this.new_excel_data[i].item_Details[j]['Dispatch_Value'],

    //         });


    //       }


    //     }
    //     this.newexp_loader = false;

    //     this.serve.exportAsExcelFile(this.excel_data, 'Datewise-Orders Whole_wise ');
    //     this.excel_data = [];
    //     this.new_excel_data = [];
    //   });
    // }




    submit(type)
    { 
        this.exp_loader = true;
        this.excel_button_disabled = true;
      console.log(type);

      if(type == 'item_wise'){

        for(var i=0;i<this.new_excel_data;i++)
        {
          this.new_excel_data[i].pending_val=this.new_excel_data[i].order_value - this.new_excel_data[i].Dispatch_Value;
          console.log(this.pending_val);

        }

        if(this.search_val.date_from){
          this.search_val.date_from=moment(this.search_val.date_from).format('YYYY-MM-DD');
          console.log(this.search_val.date_from);

        }
        if(this.search_val.date_to){
          this.search_val.date_to=moment(this.search_val.date_to).format('YYYY-MM-DD');
          console.log(this.search_val.date_to);

        }
        this.newexp_loader= true;
        this.search_val.type = type;


        this.serve.FileData({'search':this.search_val},"Order/primary_order_excel_2")
        .subscribe(resp=>{
          console.log(resp);
          this.new_excel_data = resp['primary_order_excel_2'].result;
          console.log(this.new_excel_data);


          for(let i=0;i<this.new_excel_data.length;i++)
          {
            for(let j=0;j<this.new_excel_data[i].item_Details.length;j++)
            {


              this.excel_data.push({
                'Date':this.new_excel_data[i].date_created,
                // 'Created By':this.new_excel_data[i].created_by_type,
                'Created By':this.new_excel_data[i].created_by_type == 'Executive' ? this.new_excel_data[i].created_by_name : this.new_excel_data[i].ord_created_by,
                'Company Name':this.new_excel_data[i].company_name,
                'Contact Person':this.new_excel_data[i].contact_person,
                'Contact Number':this.new_excel_data[i].contact_number,
                'Whatsapp Number':this.new_excel_data[i].whatsapp_no,
                'Assigned Sales User':this.new_excel_data[i].contact_person,
                'Email Id':this.new_excel_data[i].email,
                'State':this.new_excel_data[i].state,
                'District':this.new_excel_data[i].district,
                'City':this.new_excel_data[i].city,
                'Pincode':this.new_excel_data[i].pincode,
                'Address':this.new_excel_data[i].address,
                'Category':this.new_excel_data[i].item_Details[j]['category'],
                'Sub Category':this.new_excel_data[i].item_Details[j]['sub_category'],
                'Item Name':this.new_excel_data[i].item_Details[j]['item_name'],
                'Item Code':this.new_excel_data[i].item_Details[j]['item_code'],
                'Order Quantity':this.new_excel_data[i].item_Details[j]['order_quantity'],
                'Dispatch Quantity':this.new_excel_data[i].item_Details[j]['dispatch_qty'] ? this.new_excel_data[i].item_Details[j]['dispatch_qty']:0,
                'Item Value':this.new_excel_data[i].item_Details[j]['price'],
                'Order Value':this.new_excel_data[i].item_Details[j]['order_value'],
                'Approved By':this.new_excel_data[i].approved_by_name,
                'Order Status':this.new_excel_data[i].order_status,

              });


            }


          }
          this.newexp_loader = false;

          this.serve.exportAsExcelFile(this.excel_data, 'Datewise-Orders Item_wise ');
          this.excel_data = [];
          this.new_excel_data = [];
        });

      }//if end

      else if ( type =='whole_wise'){

        for(var i=0;i<this.new_excel_data;i++)
        {
          this.new_excel_data[i].pending_val=this.new_excel_data[i].order_value - this.new_excel_data[i].Dispatch_Value;
          console.log(this.pending_val);

        }

        if(this.search_val.date_from){
          this.search_val.date_from=moment(this.search_val.date_from).format('YYYY-MM-DD');
          console.log(this.search_val.date_from);

        }
        if(this.search_val.date_to){
          this.search_val.date_to=moment(this.search_val.date_to).format('YYYY-MM-DD');
          console.log(this.search_val.date_to);

        }
        this.newexp_loader= true;
        this.search_val.type = type;


        this.serve.FileData({'search':this.search_val},"Order/primary_order_excel_2")
        .subscribe(resp=>{
          console.log(resp);
          this.new_excel_data = resp['primary_order_excel_2'].result;
          console.log(this.new_excel_data);


          for(let i=0;i<this.new_excel_data.length;i++)
          {


            this.excel_data.push({
              'Date':this.new_excel_data[i].date_created,
              // 'Created By':this.new_excel_data[i].created_by_type,
              'Created By':this.new_excel_data[i].created_by_type == 'Executive' ? this.new_excel_data[i].created_by_name : this.new_excel_data[i].ord_created_by,

              'Order Id':this.new_excel_data[i].order_no,
              'Company Name':this.new_excel_data[i].company_name,
              'Contact Person':this.new_excel_data[i].contact_person,
              'Contact Number':this.new_excel_data[i].contact_number,
              'Whatsapp Number':this.new_excel_data[i].whatsapp_no,
              'Assigned Sales User':this.new_excel_data[i].contact_person,
              'Email Id':this.new_excel_data[i].email,
              'State':this.new_excel_data[i].state,
              'District':this.new_excel_data[i].district,
              'City':this.new_excel_data[i].city,
              'Pincode':this.new_excel_data[i].pincode,
              'Address':this.new_excel_data[i].address,
              // 'Category':this.new_excel_data[i].category,
              // 'Sub Category':this.new_excel_data[i].sub_category,
              // 'Item Name':this.new_excel_data[i].item_name,
              'Order Quantity':this.new_excel_data[i].sum_item_order_qty,
              'Dispatch Quantity':this.new_excel_data[i].sum_item_order_qty_dispatch ? this.new_excel_data[i].sum_item_order_qty_dispatch:0,
              // 'Item Value':this.new_excel_data[i].,
              'Order Value':this.new_excel_data[i].Total_order_value,
              'Approved By':this.new_excel_data[i].approved_by_name,
              'Order Status':this.new_excel_data[i].order_status,

            });



          }
          this.newexp_loader = false;

          this.serve.exportAsExcelFile(this.excel_data, 'Datewise-Orders Whole_wise ');
          this.excel_data = [];
          this.new_excel_data = [];
        });

      }
      //else end
      else{
        console.log("end");

      }
      setTimeout(() => {
          this.exp_loader = false;
          this.excel_button_disabled = false;
      }, 1000);
    }

    Order(refresh: string) {


      this.allOrderdata();
      this.search_val = {};
      this.tmp_orderlist = {};

      this.orderList();

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
  }
