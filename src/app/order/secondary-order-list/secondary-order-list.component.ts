import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { LocalStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-secondary-order-list',
  templateUrl: './secondary-order-list.component.html',
  styleUrls: ['./secondary-order-list.component.scss']
})
export class SecondaryOrderListComponent implements OnInit {
  
  view_tab:any='all';
  orderlist:any=[];
  tmp_orderlist:any=[];
  start:any=0;
  count:any=0;
  total_page:any;
  pagenumber:any;
  page_limit:any=50
  loader:any;
  tmp_list:any=[];
  data:any=[];
  value:any={};
  search_val:any={}
  data_not_found:any=false;
  login_data:any=[];
  login_dr_id:any;
  skelton:any={}
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
  list_count: any = 0;
  
  
  
  
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  constructor(public serve:PearlService,public route:Router,public dialog:DialogComponent,public session:LocalStorage)
  {
    
    this.skelton = new Array(10);
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'order to channel partner');
    console.log(index);
    
    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
    
    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);
    
    
    
    
    
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    
    if(this.login_data.access_level !='1')
    {
      this.login_dr_id = this.login_data.id;
    }
    this.search_val =this.serve.orderFilterSecondary;
    this.orderList();
  }
  
  ngOnInit() {
  }
  
  orderList(type : any = '')
  {
    if(type == 'refresh'){
      this.search_val = {}
    }
    this.loader=1;
    console.log(this.data.search);
    if( Object.getOwnPropertyNames(this.search_val).length != 0)
    {
      // this.page_limit = 0;
      this.orderlist = [];
    }
    this.serve.fetchData({'start':this.start,'pagelimit':this.page_limit, 'order_status': this.view_tab , 'search':this.search_val,'login_user':this.login_dr_id},"Order/secondary_order_list2")
    .subscribe((result=>{
      
      console.log(result);
      
      this.list_count=result['order_list']['list_count'];
      this.total_page = Math.ceil(this.list_count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      
      
      this.tmp_orderlist=result['order_list']['result'];
      this.count=result['order_list']['data'];
      
      this.total_order_val=result['order_list']['data']['sum'];
      this.total_pending_sum=result['order_list']['data']['pending_sum'];
      this.order_accepted_sum=result['order_list']['data']['approve_sum']; 
      this.pdispatch_sum=result['order_list']['data']['PDispatch_sum']; 
      this.complete_dispatch_sum=result['order_list']['data']['dispatch_sum'];
      this. referred_back_sum=result['order_list']['data']['rej_sum'];
      this. pre_close_sum=result['order_list']['data']['preclose_sum'];
      this.orderlist = result['order_list']['result'];
      
      
      // for (let index = 0; index < result['order_list']['result'].length; index++) {
      
      //   const orderExistIndex = this.orderlist.findIndex(row => row.id == result['order_list']['result'][index].id);
      
      //   if(orderExistIndex === -1) {
      
      //     this.orderlist = this.orderlist.concat(JSON.parse(JSON.stringify(result['order_list']['result'][index])));
      //   }
      // }
      
      
      setTimeout (() => {
        this.loader='';
        
      }, 700);
      if(this.orderlist.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
    }))
  }
  refresh()
  {
    this.orderlist = this.orderList();
    this.orderlist = this.orderlist.filter((el, i, a) => i === a.indexOf(el));
  }
  detailOrder(id)
  {
    this.serve.orderFilterSecondary = this.search_val ;
    
    this.route.navigate(['/order-detail/'+id]);
  }
  
  deleteOrder(id)
  {
    this.dialog.delete('Order Data !').then((result) => {
      if(result){
        console.log("order deleted");
        
        this.serve.fetchData({'order_id':id},"Order/order_delete").subscribe((result=>{
          console.log(result);
          if(result)
          {
            this.orderList();
          }
        }))
      }});
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
    tmpsearch1:any={};
    // getItemsList(search)
    // {
    //   console.log(search);
    //   this.orderlist=[];
    //   for(var i=0;i<this.tmp_list.length; i++)
    //   {
    //     search=search.toLowerCase();
    //     this.tmpsearch=this.tmp_list[i]['company_name'].toLowerCase();
    //     if(this.tmpsearch.includes(search))
    //     {
    //       this.orderlist.push(this.tmp_list[i]);
    //     }
    //   }
    //   console.log(this.orderlist);
    
    // }
    new_excel_data:any=[];
    excel1_data:any=[];
    pending_val:any=[];
    newexp_loader:any=false;
    type:any=[];
    

    excel_button_disabled:boolean = false;
    submit(type)
    {
      this.exp_loader = true;
      this.excel_button_disabled = true;
      if(type=='item_wise'){
        
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
        this.serve.FileData({'search':this.search_val},"Order/secondary_order_excel_2")
        .subscribe(resp=>{
          console.log(resp);
          this.new_excel_data = resp['secondary_order_excel_2'].result;
          console.log(this.new_excel_data);
          
          for(let i=0;i<this.new_excel_data.length;i++)
          {
            
            for(let j=0;j<this.new_excel_data[i].item_Details.length;j++) 
            {
              // for(let k=0;k<this.new_excel_data[k].Assigned_User_List.length;k++){
              
              this.excel1_data.push({
                'Date':this.new_excel_data[i].date_created,
                'Created By':this.new_excel_data[i].created_by_type == 'Executive' ? this.new_excel_data[i].created_by_name : this.new_excel_data[i].ord_created_by,
                'Order Id':this.new_excel_data[i].order_no,
                'Company Name':this.new_excel_data[i].company_name,
                'Contact Person':this.new_excel_data[i].contact_person,
                'Contact Number':this.new_excel_data[i].contact_number,
                'Whatsapp Number':this.new_excel_data[i].whatsapp_no,
                // 'Assigned Sales User':this.new_excel_data[i].Assigned_User_List[k],
                'Email Id':this.new_excel_data[i].email,
                'State':this.new_excel_data[i].state,
                'District':this.new_excel_data[i].district,
                'City':this.new_excel_data[i].city,
                'Pincode':this.new_excel_data[i].pincode,
                'Address':this.new_excel_data[i].address,
                'Category':this.new_excel_data[i].item_Details[j]['category'],
                'Sub Category':this.new_excel_data[i].item_Details[j]['sub_category'],
                'Item Name':this.new_excel_data[i].item_Details[j]['item_name'],
                'Order Quantity':this.new_excel_data[i].item_Details[j]['sum_item_order_qty'],
                'Dispatch Quantity':this.new_excel_data[i].item_Details[j]['sum_item_order_qty_dispatch'],
                // 'Pending Quantity':this.new_excel_data[i].item_Details[j]['order_quantity']-this.new_excel_data[i].item_Details[j]['dispatch_qty'],
                'Item Value':this.new_excel_data[i].item_Details[j]['price'],
                'Order Value':this.new_excel_data[i].item_Details[j]['order_value'],
                'Channel Partner':this.new_excel_data[i].Delivered_By,
                // 'Approved By':this.new_excel_data[i].approved_by,
                'Order Status':this.new_excel_data[i].order_status,
                // 'Dispatch value':this.new_excel_data[i].item_Details[j]['Dispatch_Value']  ? this.new_excel_data[i].item_Details[j]['Dispatch_Value']:0,
                // 'Pending Value':this.new_excel_data[i].item_Details[j]['order_value']-this.new_excel_data[i].item_Details[j]['Dispatch_Value'],
                
              });
              
              // }   
              
            }   
            
          }
          this.newexp_loader = false;
          
          this.serve.exportAsExcelFile(this.excel1_data, 'Datewise-Orders Item_wise');
          this.excel1_data = [];
          this.new_excel_data = [];
        });
        
      }//end if 
      
      
      else if( type=='whole_wise'){
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
        this.serve.FileData({'search':this.search_val},"Order/secondary_order_excel_2")
        .subscribe(resp=>{
          console.log(resp);
          this.new_excel_data = resp['secondary_order_excel_2'].result;
          console.log(this.new_excel_data);
          
          for(let i=0;i<this.new_excel_data.length;i++)
          {
            
            // for(let j=0;j<this.new_excel_data[i].Assigned_User_List.length;j++){
            
            this.excel1_data.push({
              'Date':this.new_excel_data[i].date_created,
              // 'Created By':this.new_excel_data[i].ord_user_created_by,
              'Created By':this.new_excel_data[i].created_by_type == 'Executive' ? this.new_excel_data[i].created_by_name : this.new_excel_data[i].ord_created_by,

              'Order Id':this.new_excel_data[i].order_no,
              'Company Name':this.new_excel_data[i].company_name,
              'Contact Person':this.new_excel_data[i].contact_person,
              'Contact Number':this.new_excel_data[i].contact_number,
              'Whatsapp Number':this.new_excel_data[i].whatsapp_no,
              // 'Assigned Sales User':this.new_excel_data[i].Assigned_User_List[j],
              'Email Id':this.new_excel_data[i].email,
              'State':this.new_excel_data[i].state,
              'District':this.new_excel_data[i].district,
              'City':this.new_excel_data[i].city,
              'Pincode':this.new_excel_data[i].pincode,
              'Address':this.new_excel_data[i].address,
              // 'Category':this.new_excel_data[i].item_Details[j]['category'],
              // 'Sub Category':this.new_excel_data[i].item_Details[j]['sub_category'],
              // 'Item Name':this.new_excel_data[i].item_Details[j]['item_name'],
              'Order Quantity':this.new_excel_data[i].sum_item_order_qty,
              'Dispatch Quantity':this.new_excel_data[i].sum_item_order_qty_dispatch,
              // 'Pending Quantity':this.new_excel_data[i].item_Details[j]['order_quantity']-this.new_excel_data[i].item_Details[j]['dispatch_qty'],
              // 'Item Value':this.new_excel_data[i].item_Details[j]['price'],
              'Order Value':this.new_excel_data[i].Total_order_value,
              'Channel Partner':this.new_excel_data[i].Delivered_By,
              // 'Approved By':this.new_excel_data[i].approved_by,
              'Order Status':this.new_excel_data[i].order_status,
              // 'Dispatch value':this.new_excel_data[i].item_Details[j]['Dispatch_Value']  ? this.new_excel_data[i].item_Details[j]['Dispatch_Value']:0,
              // 'Pending Value':this.new_excel_data[i].item_Details[j]['order_value']-this.new_excel_data[i].item_Details[j]['Dispatch_Value'],
              
            });
            
            // }
            
          }
          this.newexp_loader = false;
          
          this.serve.exportAsExcelFile(this.excel1_data, 'Datewise-Orders Whole_wise');
          this.excel1_data = [];
          this.new_excel_data = [];
        });
      }
      setTimeout(() => {
        this.exp_loader = false;
      this.excel_button_disabled = false;
        
      }, 1000);
      
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
    //   this.serve.FileData({'search':this.search_val},"Order/secondary_order_excel_2")
    //     .subscribe(resp=>{
    //       console.log(resp);
    //       this.new_excel_data = resp['secondary_order_excel_2'].result;
    //       console.log(this.new_excel_data);
    
    //       for(let i=0;i<this.new_excel_data.length;i++)
    //       {
    
    //        for(let j=0;j<this.new_excel_data[i].item_Details.length;j++) 
    //        {
    
    //           this.excel1_data.push({
    //             'Date':this.new_excel_data[i].date_created,
    //             'Created By':this.new_excel_data[i].ord_user_created_by,
    //             'Order Id':this.new_excel_data[i].order_no,
    //             'Company Name':this.new_excel_data[i].company_name,
    //             'Contact Person':this.new_excel_data[i].contact_person,
    //             'Contact Number':this.new_excel_data[i].contact_number,
    //             'Whatsapp Number':this.new_excel_data[i].whatsapp_no,
    //             // 'Assigned Sales User':this.new_excel_data[i].Assigned_User_List[j],
    //             'Email Id':this.new_excel_data[i].email,
    //             'State':this.new_excel_data[i].state,
    //             'District':this.new_excel_data[i].district,
    //             'City':this.new_excel_data[i].city,
    //             'Pincode':this.new_excel_data[i].pincode,
    //             'Address':this.new_excel_data[i].address,
    //             // 'Category':this.new_excel_data[i].item_Details[j]['category'],
    //             // 'Sub Category':this.new_excel_data[i].item_Details[j]['sub_category'],
    //             // 'Item Name':this.new_excel_data[i].item_Details[j]['item_name'],
    //             'Order Quantity':this.new_excel_data[i].item_Details[j]['order_quantity'],
    //             'Dispatch Quantity':this.new_excel_data[i].item_Details[j]['dispatch_qty'],
    //             // 'Pending Quantity':this.new_excel_data[i].item_Details[j]['order_quantity']-this.new_excel_data[i].item_Details[j]['dispatch_qty'],
    //             'Item Value':this.new_excel_data[i].item_Details[j]['order_value'],
    //             'Order Value':this.new_excel_data[i].item_Details[j]['order_value'],
    //             'Approved By':this.new_excel_data[i].approved_by,
    //             'Order Status':this.new_excel_data[i].order_status,
    //             // 'Dispatch value':this.new_excel_data[i].item_Details[j]['Dispatch_Value']  ? this.new_excel_data[i].item_Details[j]['Dispatch_Value']:0,
    //             // 'Pending Value':this.new_excel_data[i].item_Details[j]['order_value']-this.new_excel_data[i].item_Details[j]['Dispatch_Value'],
    
    //         });
    
    
    
    //       }   
    
    //  }
    //       this.newexp_loader = false;
    
    //       this.serve.exportAsExcelFile(this.excel1_data, 'Datewise-Orders channel_partner');
    //       this.excel1_data = [];
    //       this.new_excel_data = [];
    //     });
    // }
    
    
    
    
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
          this.serve.fetchData({ 'check' : this.orderlist } , 'Order/secondary_delete')
          .subscribe(d => {
            console.log(d);
            this.orderList();
            // this.dialog.successfully();
          });
        }
      });
    }
    
    exp_loader:any=false;
    exp_data: any = [];
    excel_data:any=[];
    
    exportAsXLSX():void
    {
      this.exp_loader = true;
      
      this.serve.FileData({'search':this.search_val},"Order/secondary_order_excel")
      .subscribe(resp=>{
        console.log(resp);
        this.exp_data = resp['order_list'].result;
        
        for(let i=0;i<this.exp_data.length;i++)
        {
          this.excel_data.push({'Date':this.exp_data[i].date_created,'Created By':this.exp_data[i].created_by_name,'Order Id':this.exp_data[i].id,'Company Name':this.exp_data[i].company_name,'Company Id':this.exp_data[i].dr_id,'Total Item':this.exp_data[i].order_item,'Dealer Order Value':this.exp_data[i].order_total,'Company Order Value':this.exp_data[i].sec_ord_background_amt,'Channel Partner':this.exp_data[i].distributor_name,'Status':this.exp_data[i].order_status});
        }
        this.exp_loader = false;
        
        this.serve.exportAsExcelFile(this.excel_data, 'Secondary-Order');
        this.excel_data = [];
        this.exp_data = [];
      });
    }
    
    public onDate(event): void
    {
      this.search_val.date_created=moment(event.value).format('YYYY-MM-DD');
      this.orderList();
    }
    tmpsearch:any={};
    check_cnt =0
    check_tal=0;
    
    sum=0;
    
    filter_order_data(status) {
      
      this.loader = 1;
      
      this.check_cnt = this.count.count;
      this.sum= this.count.sum;
      this.check_cnt = this.count.count;
      
      
      this.view_tab=status;
      
      if ( Object.getOwnPropertyNames(this.search_val).length != 0)
      {
        // this.page_limit = 0;
        this.orderlist = [];
        this.tmp_orderlist=[];
      }
      
      
      
      this.start = 0;
      this.orderlist = [];
      this.tmp_orderlist = [];
      // tslint:disable-next-line:max-line-length
      this.serve.fetchData({'start':this.start,'pagelimit':this.page_limit, 'order_status': this.view_tab , 'search':this.search_val,'login_user':this.login_dr_id},"Order/secondary_order_list2")
      .subscribe((result=>{
        
        console.log(result);
        
        this.list_count=result['order_list']['list_count'];
        this.total_page = Math.ceil(this.list_count/this.page_limit);
        this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        
        this.tmp_orderlist=result['order_list']['result'];
        this.count=result['order_list']['data'];
        
        // this.orderlist = this.orderlist.concat(result['order_list']['result']);
        // this.orderlist = this.orderlist.filter((el, i, a) => i === a.indexOf(el));
        
        this.tmp_orderlist = (result['order_list']['result']);
        this.orderlist = (result['order_list']['result']);
        
        
        
        if(status == 'Pending'){
          
          this.check_cnt = this.count.pending_count;
          this.sum= this.count.pending_sum;
          
        }
        if(status == 'Pre Close'){
          
          this.check_cnt = this.count.pre_close_count;
          this.sum= this.count.preclose_sum;
          
        }
        if(status == 'Approved'){
          
          this.check_cnt = this.count.approved_count;
          this.sum= this.count.approve_sum;
          
        }
        if(status == 'Dispatch'){
          
          this.check_cnt = this.count.dispatch_count;
          this.sum= this.count.dispatch_sum;
          
        }
        if(status == 'Reject'){
          
          this.check_cnt = this.count.reject_count;
          this.sum= this.count.rej_sum;
          
        }
        
        
        if(status == 'all'){
          
          this.check_cnt = this.count.count;
          this.sum= this.count.sum;
          
        }
        
        
        
        
        setTimeout (() => {
          this.loader='';
          
        }, 700);
        if(this.orderlist.length ==0){
          this.data_not_found=true;
        }else{
          this.data_not_found=false;
          
        }
      }));
      
      
      
      
      
      if(status!='all'){
        this.orderlist =[];
        for(var i=0;i< this.tmp_orderlist.length; i++)
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
      } else if(status=='all'){
        this.orderlist=this.tmp_orderlist;
      }
    }
    
    Order(refresh: string) {
      
      this.filter_order_data(status);
      this.search_val = {};
      this.tmp_orderlist = {};
      
      this.orderList();
    }
  }
  
  
  
  
  