import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { LocalStorage } from 'src/app/localstorage.service';
import { PearlService } from 'src/app/pearl.service';
import * as moment from 'moment';
import { AlertComponent } from 'ngx-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatSelect } from '@angular/material';




@Component({
  selector: 'app-addorder',
  templateUrl: './addorder.component.html',
  styleUrls: ['./addorder.component.scss']
})
export class AddorderComponent implements OnInit {
  @ViewChild('searchdistributorlist') searchdistributorlist:MatSelect;
  constructor(public serve: PearlService, public route: ActivatedRoute, public dialog1: DialogComponent, public rout: Router, public session: LocalStorage, public alert: DialogComponent, 
      public toast : ToastrManager,
      
    ) {
      console.log(this.route);
      console.log(this.route.queryParams['_value']);
      this.orderDetail(this.route.queryParams['_value'].id)
    this.get_special_discount();
    this.userData = this.session.getSession();
    console.log(this.userData);

    this.userId = this.userData['value']['data'].id;
    console.log(this.userId);
    this.userName = this.userData['value']['data'].name;
    console.log(this.userName);
    this.get_category('','');

   
        // this.get_distributormoreItem();
    
  }

  ngOnInit() {
  }
  data: any = {};
  dr_list: any = [];
  productlist: any = [];
  noProduct: boolean = false;
  size_List: any = [];
  quotationData: any = [];
  totalQty: any = 0;
  userDetail: any = {};
  grandTotal = 0;
  totalSub_total: any = 0;
  show_add_to_list_button: boolean = false;
  totalGST_total = 0;
  productName: any;
  productCode: any;
  quotationDataErr: boolean = false;
  orderData: any = {};
  userId: any;
  userName: any;
  userData: any;
  sub_total: any = 0;
  SpecialDiscountLable: any = ''
  filter :any = {};
  product_item_array: any = [];
  product_id: any;
  search: any = {};
  tmpsearch: string;
  secondry_dr_list: any = [];
  company_namee: any;
  noSize: boolean = false;
  form: any = {};
  selected_drid: number = 0;
  product_data: any = [];
  productData: any = {};
  type: any = '';
  special_discount: any = 0;
  loader: boolean = false;
  show_price: boolean = false;
  grand_amt: any = {};
  dis_amt: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  spcl_dis_amt: any = 0
  grand_total: any = 0;
  adddMoreItem : boolean = false;
  searched:any;
  second_product_itemArray:any=[];
  searchDistributorList(event){
    console.log(event);
    if(event == ''){
      this.filter.company_namee = '';
      
      this.get_distributor_list(this.search.dr_type);
    }
    this.searched = event;
    console.log(this.searched);
      let wordSearch = this.searched;
    setTimeout(() => {
      if(wordSearch == this.searched){
        if(this.searched){
          this.filter.company_namee = event;
          this.get_distributor_list(this.search.dr_type)
        }
      }
    }, 1000);
   
    
  }
  order_detail:any=[]
  order_item:any=[]

  orderDetail(id) {
    const id1 = {'order_id': id};

    this.serve.fetchData(id1, 'Order/order_detail').subscribe((result => {
        console.log(result);
      
        
        this.order_detail = result['order_detail'];
        this.search.company_name= this.order_detail.dr_id
        this.search.dr_type= this.order_detail.type
        this.get_distributor_list(this.search.dr_type);
        this.data.distributor_id=this.order_detail.delivery_from;
        
        console.log(this.data.distributor_id);
        // console.log( this.userDetail.distributor_id);
        this.get_distributor(this.search.company_name)
        this.order_item = result['order_detail']['order_item'];
        this.quotationData=this.order_item
        for (let index = 0; index < this.quotationData.length; index++) {
          this.totalQty += parseInt(this.quotationData[index].qty);
          this.quotationData[index].product_code =(this.quotationData[index].cat_no);
          this.quotationData[index].productName =(this.quotationData[index].product_name);
          this.quotationData[index].discount_amount =(this.quotationData[index].discount_amount);
          this.quotationData[index].discountedAmount =(this.quotationData[index].discounted_amount);
          this.quotationData[index].carton_packing =(this.quotationData[index].cartoon_qty);
          this.quotationData[index].subtotal_discount =(this.quotationData[index].discount_amount);
          // this.quotationData[index].discountedAmount =(this.quotationData[index].discounted_amount);
          this.quotationData[index].subtotal_discounted = (this.quotationData[index].amount);

      }
      this.sub_total= this.order_detail.sub_total;
      console.log(this.sub_total);
      
      this.dis_amt= this.order_detail.order_discount;
      console.log(this.dis_amt);
      
      this.net_total= this.order_detail.order_total;
      console.log(this.net_total);
      
      this.grand_total= this.order_detail.order_grand_total;
      console.log(this.grand_total);
      
       
      
        
        
        let totalOrderQty = 0;
     
    }));
}
  closeSearchDistributor(){
    console.log("closed function called");
    
    this.searchdistributorlist.empty;
    this.get_distributor_list('');
  }

  get_distributor_list(id) {
    // console.log(event)
    this.dr_list = [];
    this.loader = true;
    // console.log(this.data.dr_type);
    this.serve.fetchData({ 'user_id': this.userId, 'dr_type': id, filter : this.filter }, "Distributors/get_type_list")
      .subscribe((result => {
        this.adddMoreItem = true
        this.dr_list = result;
        this.secondry_dr_list = result['result'];
        console.log(this.dr_list);
        // this.filter = {};
        setTimeout(() => {
          this.loader = false;
          this.filter = {};
        }, 1000);
        
        // for(let x=0; x<this.dr_list.length; x++){
        //   this.selected_drid = this.dr_list[x].id; 
        // }
        // console.log(this.selected_drid);

      }))
  }
  dealer_channel_partner:any=[]
  get_distributor(id) {
    console.log(this.selected_drid);
    this.loader = true;
    this.serve.fetchData({'id':id}, "Distributors/dealer_channel_partner").subscribe((result) => {
      console.log(result);
      this.dealer_channel_partner = result['dealer_channel_partner'];

      console.log(this.product_id);
      // this.filter = {};
      console.log();
      setTimeout(() => {
        this.loader = false;
      }, 1000);
      // if (this.productlist.length == 0) {
      //   this.noProduct=true;
      // }
      // else {
      //   this.noProduct=false;
      // }
    })
  }
  get_category(id,type) {
    this.selected_drid = id;
    console.log(this.selected_drid);
    this.loader = true;
    this.serve.fetchData({filter : this.filter}, "Distributors/getCategory").subscribe((result) => {
      console.log(result);
      this.productlist = result['data'];

      console.log(this.product_id);
      // this.filter = {};
      console.log();
      setTimeout(() => {
        this.loader = false;
      }, 1000);
      // if (this.productlist.length == 0) {
      //   this.noProduct=true;
      // }
      // else {
      //   this.noProduct=false;
      // }
      console.log(type);
      
      // if(this.data.distributor_id){
      this.get_distributor(this.search.company_name)
      // }
    })
  }
  get_subcategory() {
    this.loader = true;
    this.serve.fetchData({ 'dr_id': this.search.company_name, 'category': this.data.category , filter : this.filter}, "Distributors/getSubCategory").subscribe((result) => {
      console.log(result);
      this.size_List = result['data'];
      console.log(this.size_List);
      // this.filter ={};
      setTimeout(() => {
        this.loader = false;
        // this.filter = {};
      }, 1000);
    })

  }
  conInt(val) {
    // (parseFloat(val).toFixed(2)).toString()
    // console.log('value after tofixed = '+val);
    return parseFloat(val)

  }
  conFloat(val: any) {
    // (parseFloat(val).toFixed(2)).toString()
    return parseFloat(val);
  }
  addToList(qty) {
    console.log(qty);
    console.log(this.data);
    console.log("add to list method calls");
    console.log(this.quotationData);
    
    this.productData = {
      productName: this.data.product_nam,
      qty: this.data.qty,
      price: this.data.price,
      box_packing: this.data.box_packing,
      carton_packing: this.data.carton_packing,
      discount_percent: this.data.discount,
      discount_amount : this.data.discount_amount,
      product_code: this.data.product_code,
      category: this.data.category,
      sub_category: this.form.subcategory,
      cat_no: this.form.cat_no,
      discountedAmount: this.data.discountedAmount,
      sub_total: this.data.subTotal,
      subtotal_discount: this.data.subtotal_discount,
      amount: this.data.subtotal_discounted,
      stock_incoming_days: this.data.stock_incoming_days,
      stock_status: this.data.stock_status,
      material_code :this.data.material_code,
      cartoon_packing : this.data.cartoon_packing,
      unit : this.data.master_packing,
      std_packing :this.data.std_packing,
      brand  :this.data.brand,
      cn_net_price :this.data.cn_net_price,
      created_by :this.data.created_by,
      date_created :this.data.date_created,
      dd_net_price :this.data.dd_net_price,
      deactive_by :this.data.deactive_by,
      deactive_date :this.data.deactive_date,
      del :this.data.del,
      desc :this.data.desc,
      group_type :this.data.group_type,
      gst_percent :this.data.gst,
      hsn:this.data.hsn,
      id:this.data.id,
      image:this.data.image,
      last_updated: this.data.last_updated,
      last_updated_by: this.data.last_updated_by,
      last_updated_by_name:this.data.last_updated_by_name,
      latest: this.data.latest,
      master_category_id:this.data.master_category_id,
      master_packing : this.data.master_packing,
      new_arrival : this.data.new_arrival,
      pcs : this.data.pcs,
      pcs_set : this.data.pcs_set,
      picture_reference :this.data.picture_reference,
      product_name : this.data.product_name,
      reason : this.data.reason,
      status :this.data.status,
      video_link : this.data.video_link,
      subtotal_discounted : this.data.subtotal_discounted,
    }
    console.log(this.productData);
      
        if(this.check_qty() == false){
          if (this.quotationData.length == 0) {
            this.quotationData.push(this.productData)
          }
          else {
            var flag = true;
            this.quotationData.forEach(element => {
              console.log("element each" + element);
      
              if (this.productData.category = element.category && this.productData.subcategory == element.subcategory && this.productData.cat_no == element.cat_no) {
                element.subTotal = parseFloat(element.subTotal) + parseFloat(this.productData.subTotal);
                element.subtotal_discount = parseFloat(element.subtotal_discount) + parseFloat(this.productData.subtotal_discount);
                element.subtotal_discounted = parseFloat(element.subtotal_discounted) + parseFloat(this.productData.subtotal_discounted);
                element.qty = parseFloat(element.qty) + parseFloat(this.productData.qty);
                flag = false;
              }
      
            });
            if (flag) {
              this.quotationData.push(this.productData);
      
            }
          }
          this.totalQty = parseInt(this.totalQty) + parseInt(qty);
          console.log(this.totalQty);
      
          this.productData = {};
          this.cal_grand_total();
          this.data.item = '';
          this.show_price = false;
        }
        else{
          console.log("in add to cart else condition");

        }
   


  }
  deleteQuotationDetail(arrayIndex, delqty) {

    console.log(arrayIndex);
    console.log(this.quotationData[arrayIndex]);
    console.log(this.grand_total);
    console.log(this.net_total);
    
    this.totalQty = this.totalQty - delqty;
    console.log(this.sub_total);
    
    this.sub_total = parseFloat(this.sub_total) - parseFloat(this.quotationData[arrayIndex].sub_total);
    console.log(this.sub_total);

    this.dis_amt = parseFloat(this.dis_amt) - parseFloat(this.quotationData[arrayIndex].subtotal_discount);
    console.log(this.dis_amt);

    this.net_total = parseFloat(this.net_total) - parseFloat(this.quotationData[arrayIndex].subtotal_discounted);
    console.log(this.net_total);

    this.spcl_dis_amt = (this.net_total * this.special_discount) / 100;
    console.log(this.spcl_dis_amt);


    if (this.type == 'Discount') {
      this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);

    } else {
      this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
    }

    this.quotationData.splice(arrayIndex, 1);
    this.alert.success("item removed from", "List");

    this.deleteItemFromCart(arrayIndex);

  }
  deleteItemFromCart(index) {
    if(this.quotationData.length <= 0){
      this.show_add_to_list_button = false;
    }

    // this.totalQty = this.totalQty - delqty;
    // this.sub_total = parseFloat(this.sub_total) - parseFloat(this.quotationData[index].subTotal);

    // this.dis_amt = parseFloat(this.dis_amt) - parseFloat(this.quotationData[index].subtotal_discount);

    // this.net_total = parseFloat(this.net_total) - parseFloat(this.quotationData[index].subtotal_discounted);

    // this.spcl_dis_amt = (this.net_total * this.special_discount) / 100;

    // if (this.type == 'Discount') {
    //   this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
    // } else {
    //   this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
    // }

    // this.quotationData.splice(arrayIndex, 1);
    // this.alert.success("item removed from", "List");
  }

  cal_grand_total() {
    console.log(this.type);

    this.sub_total = parseFloat(this.sub_total) + parseFloat(this.data.subTotal);
    this.dis_amt = parseFloat(this.dis_amt) + (parseFloat(this.data.subtotal_discount));
    this.net_total = parseFloat(this.net_total) + parseFloat(this.data.subtotal_discounted);
    console.log(this.special_discount);

    this.spcl_dis_amt = (this.net_total * this.special_discount) / 100;
    console.log(this.spcl_dis_amt);

    if (this.type == 'Discount') {
      this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
    } else {
      this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
    }
    console.log(this.sub_total);
    console.log(this.dis_amt);
    console.log(this.gst_amount);
    console.log(this.grand_total);
    console.log(this.net_total - this.spcl_dis_amt);
  }

  
  leave:any=0;
  checkin_data_for_followup : any = []

  saveQuotation(type) {

    console.log("save quotation call");
    this.leave=1
    this.userDetail.type = this.search.dr_type;
    console.log(this.userDetail);

     
      this.userDetail.special_discount = this.special_discount;
      this.userDetail.special_discount_amount = this.spcl_dis_amt;
      this.userDetail.Disctype = this.type;
      this.userDetail.SpecialDiscountLable = this.SpecialDiscountLable
      this.userDetail.dr_id =  this.search.company_name;

      if( !this.search.company_name ){
        this.toast.errorToastr("Please Select Company Name of Channel partner / Direct Dealer");
        return;
      }

      if(this.search.company_name){
        this.userDetail.distributor_id =this.selected_drid;
        if(this.route.queryParams['_value'].comes_from == 'order_detail_page'){
        this.userDetail.distributor_id=this.data.distributor_id;

        }
        var orderData = {sub_total:this.sub_total,'dis_amt':this.dis_amt,'grand_total':this.grand_total,'net_total':this.net_total,'special_discount':this.special_discount,special_discount_amount:this.spcl_dis_amt};

        console.log(this.quotationData);
        console.log(this.userDetail);
        console.log(orderData);

          this.serve.fetchData({"order_id":this.route.queryParams['_value'].id,"cart_data":this.quotationData,"user_data":this.userDetail,'orderData':orderData , 'created_by': this.userId},'Distributors/save_orderExecutive').subscribe((resp)=>{
            console.log(resp);
            console.log("checkin_data_for_followup");
            console.log(this.checkin_data_for_followup);
            console.log(this.checkin_data_for_followup.length);
              if(resp['msg'] == 'success'){
                var toastString ='';
                if(type == 'save'){
                  toastString = 'Order Saved To Draft Successfully !';
                  // this.navCtrl.pop();
                  this.toast.successToastr(toastString)
                  
                }else{
                  toastString = 'Order Placed Successfully !';
                  // this.navCtrl.pop();
                  // this.rout.navigate(['/order-list']);

                  // this.toast.successToastr(toastString);

                }
                if(this.search.company_name){
                  console.log('Secondary');
                  // this.navCtrl.pop();
                  // this.toast.successToastr(toastString)
                  this.rout.navigate(['/secondary-order-list']);

                  if(this.checkin_data_for_followup.length){
                    this.presentAlert2();

                  }
                }else{
                  console.log('Primary');
                  // this.navCtrl.pop();

                  if(this.checkin_data_for_followup.length){
                    this.presentAlert2();
                }
                }
                // this.dbService.presentToast(toastString);
                this.rout.navigate(['/order-list']);

                this.toast.successToastr(toastString);
                
              }
          })
      }
    // if (this.quotationData.length < 1) {
    //   this.quotationDataErr = true;
    // }

    // else {

    //   this.totalQty = 0;
    //   this.grandTotal = 0;
    //   this.totalSub_total = 0;
    //   this.totalGST_total = 0;

    //   for (let i = 0; i < this.quotationData.length; i++) {
    //     this.totalQty = parseFloat(this.quotationData[i].qty) + this.totalQty;
    //     this.grandTotal = parseFloat(this.quotationData[i].total_amount) + this.grandTotal;
    //     this.totalSub_total = parseFloat(this.quotationData[i].amount) + this.totalSub_total;
    //     this.totalGST_total = parseFloat(this.quotationData[i].gst) + this.totalGST_total;


    //   }
    //   this.grandTotal = parseFloat(this.grandTotal.toFixed(2).toString());
    //   this.totalSub_total = parseFloat(this.totalSub_total.toFixed(2).toString());
    //   this.totalGST_total = parseFloat(this.totalGST_total.toFixed(2).toString());

    //   console.log(this.totalQty);
    //   console.log(this.grandTotal);
    //   console.log(this.quotationData);
    //   console.log(this.totalGST_total);
    //   console.log(this.totalSub_total);

    //   this.orderData = {
    //     'total_qty': this.totalQty,
    //     'grand_total': this.grandTotal,
    //     'total_gst_amount': this.totalGST_total,
    //     'sub_total': this.totalSub_total,
    //     'orderCreated_by': this.userId,
    //     'uname': this.userName,
    //     'dr_id': this.search.company_name
    //   }

    //   this.serve.fetchData({ 'orderData': this.orderData, 'cart_data': this.quotationData , user_data:this.userDetail }, "order/add_Primaryorder").subscribe((result) => {
    //     console.log(result);

    //     if (result['status'] == 'success') {
    //       this.dialog1.success("Order", "Added Successfully");
    //       this.rout.navigate(['/order-list']);
    //     }
    //     else {
    //       this.dialog1.error("Something went wrong");
    //       this.rout.navigate(['/order-list']);
    //     }
    //     this.rout.navigate(['/order-list']);

    //   })
    // }

  }
  presentAlert2(){
      this.alert.alert('Create Follow Up','Do you want to create Follow up for this checkin?').then((result)=>{
        this.rout.navigate(['/followup-list'],{queryParams :{'for_order':this.checkin_data_for_followup[0],'from':'end_checkin page'}})
      })
  }

  filter_dr(company_namee) {
    console.log("filter_dr method calls");
    console.log(company_namee);
    this.tmpsearch = '';
    this.dr_list = [];
    for (var i = 0; i < this.secondry_dr_list.length; i++) {
      company_namee = company_namee.toLowerCase();
      this.tmpsearch = this.secondry_dr_list[i]['company_name'].toLowerCase();
      console.log(this.tmpsearch);
      if (this.tmpsearch.includes(company_namee)) {
        this.dr_list.push(this.secondry_dr_list[i]);
      }
    }
  }

  getProductCodeSearch(search){
    console.log(search);
    this.tmpsearch='';
    this.product_item_array=[];
    for(let i=0; i<this.second_product_itemArray.length;i++){
      search= search.toLowerCase();
      this.tmpsearch= this.second_product_itemArray[i].product_name.toLowerCase();
      console.log(this.tmpsearch);
        if(this.tmpsearch.includes(search)){
          this.product_item_array.push(this.second_product_itemArray[i]);
        }
    }
  }

  back() {
    window.history.go(-1);
  }
  get_product_data(data) {
    this.form = {};

    console.log(data);
    console.log(this.selected_drid);
    
    this.loader = true;
    this.data.product_nam = data.product_name;
    // this.data.subcategory = data.subcategory;

    console.log(this.data.subcategory);

    console.log(this.form);



    this.form = {
      cat_no: data.cat_no,
      category: data.category,
      product_id: data.id,
      product_name: data.product_name,
      subcategory: data.subcategory,
      // selected_dr_id: this.selected_drid,
      user_id: this.search.company_name
    }


    console.log(this.form);

    this.serve.fetchData({ form: this.form }, 'Distributors/get_product_dataExecutive').subscribe((result) => {
      console.log(result);
      this.show_price = true;
      // this.data = this.product_data;

      this.product_data = result['prod_price'];
      console.log(this.product_data);
      this.data.product_code = this.product_data.material_code;
      this.data.material_code = this.product_data.material_code;

      this.data.price = this.product_data.price;
      this.data.discount = this.product_data.discount;
      this.data.carton_packing = this.product_data.cartoon_packing;
      this.data.unit = this.product_data.master_packing;
      this.data.box_packing = this.product_data.std_packing;
      this.data.stock_status = this.product_data.stock_status;
      this.data.stock_incoming_days = this.product_data.stock_incoming_days;
      this.std_packing =this.product_data.std_packing;
      this.data.brand  =this.product_data.brand;
      this.data.cn_net_price =this.product_data.cn_net_price;
      this.data.created_by =this.product_data.created_by;
      this.data.date_created =this.product_data.date_created;
      this.data.dd_net_price =this.product_data.dd_net_price;
      this.data.deactive_by =this.product_data.deactive_by;
      this.data.deactive_date =this.product_data.deactive_date;
      this.data.del =this.product_data.del;
      this.data.desc =this.product_data.desc;
      this.data.group_type =this.product_data.group_type;
      this.data.gst =this.product_data.gst;
      this.data.hsn=this.product_data.hsn;
      this.data.id=this.product_data.id;
      this.data.image=this.product_data.image;
      this.data.last_updated=this.product_data.last_updated;
      this.data.last_updated_by=this.product_data.last_updated_by;
      this.data.last_updated_by_name=this.product_data.last_updated_by_name;
      this.data.latest=this.product_data.latest;
      this.data.master_category_id=this.product_data.master_category_id;
      this.data.master_packing =this.product_data.master_packing;
      this.data.new_arrival =this.product_data.new_arrival;
      this.data.pcs =this.product_data.pcs;
      this.data.pcs_set =this.product_data.pcs_set;
      this.data.picture_reference =this.product_data.picture_reference;
      this.data.product_name =this.product_data.product_name;
      this.data.reason =this.product_data.reason;
      this.data.status =this.product_data.status;
      this.data.video_link =this.product_data.video_link;

      setTimeout(() => {
        this.loader = false;
      }, 1000);
    });

  }
  get_product_code(id) {
    console.log(this.size_List);
    console.log(id);
    this.loader = true;
    // for (let i = 0; i < this.size_List.length; i++) {
    //   var categoryId = this.size_List[i].id;
    // }
    var subCategoryId = id;
    // console.log(subCategoryId);

    this.serve.fetchData({ categoryId: subCategoryId , filter : this.filter }, 'Distributors/product_code').subscribe((res) => {
      console.log(res);
      this.product_item_array = res;
      this.second_product_itemArray=res;
        setTimeout(() => {
       
      this.loader = false;

        }, 1000);
    });

  }

  
  calculate_amt(type) {
    console.log(type);
    console.log(typeof (this.data.qty));
    console.log(this.data);
    console.log(this.data.carton_qty);
    console.log(this.data.carton_packing);

    if (type == 'cartoon_qty') {
      this.data.qty = this.data.carton_packing * this.data.carton_qty;
      console.log(this.data.qty);

    }
    this.data.discount_amount = 0;
    this.data.subTotal = 0;
    this.data.discountedAmount = 0;
    if (this.data.qty == null) {
      this.data.qty = 0;
    }
    if(this.data.qty < 0){
      this.dialog1.error("Quantity can't be negative");

      this.data.qty = 0;
    }
    this.data.subTotal = (this.data.price) * (this.data.qty);
    if (this.data.discount) {
      this.data.discount_amount = (this.data.price * this.data.discount) / 100;

    }
    this.data.discountedAmount = parseFloat(this.data.price) - parseFloat(this.data.discount_amount);
    this.data.subtotal_discount = this.data.discount_amount * this.data.qty;

    this.data.subtotal_discounted = parseInt(this.data.discountedAmount) * parseInt(this.data.qty);
    console.log(this.data.subtotal_discounted);

    this.data.subtotal_discounted = this.data.subtotal_discounted.toFixed(2)
    console.log(this.data);


  }
  show_add_list() {
    if ((this.data.qty == 0 && this.data.qty == '') || (this.data.carton_qty == '0' && this.data.carton_qty == '')) {
      this.show_add_to_list_button = false;
    } else {
      this.show_add_to_list_button = true;

    }
  }
  today_date = moment(new Date()).format('YYYY-MM-DD');


  date_diff(today, stock_date) {

    var a = moment(today);
    var b = moment(stock_date);
    var c = b.diff(a, 'days');
    console.log(typeof (c));
    console.log(c);
    if (c >= 0) {
      return c;
    }
    else {
      return c = -1;
    }
  }

  get_special_discount() {

    this.serve.fetchData({}, 'Distributors/special_discount').subscribe((res) => {
      console.log(res);
      if (res['special_discount'] && res['special_discount']['type'])
        this.type = res['special_discount']['type'];
      console.log(this.type);
      console.log(this.userData);
      this.special_discount = res['special_discount']['distributor_discount'];


      if (this.userData['value']['data'].type == '1') {
        if (res['special_discount'] && res['special_discount']['distributor_discount'])
          this.special_discount = res['special_discount']['distributor_discount'];
      }

      if (this.userData['value']['data'].type == '3') {
        if (res['special_discount'] && res['special_discount']['dealer_discount'])
          this.special_discount = res['special_discount']['dealer_discount'];
      }

      if (this.userData['value']['data'].type == '7') {
        if (res['special_discount'] && res['special_discount']['distributor_discount'])
          this.special_discount = res['special_discount']['distributor_discount'];
      }

      if (res['special_discount'] && res['special_discount']['lable'])
        this.SpecialDiscountLable = res['special_discount']['lable'];
      console.log(this.SpecialDiscountLable);
    })
  }
  std_packing:any;
  check_qty_flag:boolean=false;

    check_qty(){
      console.log(this.data);
      console.log(this.data.qty);
      console.log('in check_qty');
        if(this.std_packing != ''){
          console.log('in check_qty if');
          console.log( parseInt(this.data.qty) % parseInt(this.std_packing));
            if( parseInt(this.data.qty) % parseInt(this.std_packing) == 0){
              this.check_qty_flag = false;
            }
            else{
              this.check_qty_flag = true;
                  if(this.data.qty != ''){
                    this.dialog1.error('Qty should be in multiple of box packing - '+this.std_packing);
                    return
                  }
            } 
        }
        else{
          this.check_qty_flag = false
        }
        return this.check_qty_flag;
    }

    save_orderalert(type){
        console.log(type);
        var str;
        console.log(this.grand_total);
          if(this.grand_total > 20000000){
            this.dialog1.error("Max order value reached , Maximum order value is 2 Cr. ! ")
            // this.alert.alert('Max order value reached' , 'Maximum order value is 2 Cr. !');
            return
          }
            if(type == 'save'){
              str = 'You want to save this order as draft ?'
            }else{
              str = 'You want to submit order ?'
            }
            this.alert.alert('Are you Sure ' , str).then((result)=>{
              if(result){
              this.saveQuotation(type);

              }else{
                return false;
              }
            })

    }

    distributor_list:any=[];
    is_dealer_order_exist :boolean = true;
    discount_updated: boolean = false;

    get_distributormoreItem(id)
    {
        console.log(id);
        
        // this.service.show_loading();
        this.loader =true;
        this.serve.fetchData({'user_id': this.userId, 'dr_type':1 ,filter : this.filter , 'id':id},"Distributors/dealer_channel_partner").subscribe((result)=>{
            console.log(result);
            // this.distributor_list = result;
       this.dealer_channel_partner = result['dealer_channel_partner'];


            // var index = this.distributor_list.findIndex(row => row.id == this.order_data.distributor_id )
            // console.log(index);

            // console.log(this.distributor_list[index]);
            // this.data.distributor_id = this.distributor_list[index]
            // this.service.dismiss();
            // this.distributorSelectable.open();
          setTimeout(() => {
            this.loader = false;
          }, 1000);
        });
    }

    is_order_exist(event){
      console.log("is_order_exist method calls");
      console.log(event);
      // console.log(event['value']['id']);
      this.discount_updated = false


     this.loader = true;
      this.serve.fetchData({'dr_id': event},'Distributors/dealer_order_exists').subscribe((result)=>{
          console.log(result);
            this.loader = false;
          if(result['msg'] == "Order Not Exists"){
              this.is_dealer_order_exist = false;
              this.update_discount_alert();
              this.openCategory();
          }
          else{
              this.is_dealer_order_exist = true;
              this.openCategory();
          }

      });

  }
  show_update_discount_alert : boolean = false

  update_discount_alert() {
    this.show_update_discount_alert = true;
    // let alert = this.alertCtrl.create({
    //     title: 'Update Discount',
    //     message: 'You have to update discount before placing an order of this dealer',
    //     cssClass: 'alert-modal',
    //     buttons: [
    //         {
    //             text: 'Ok',
    //             role: 'cancel',
    //             handler: () => {
    //                 console.log('Cancel clicked');

    //             }
    //         }
    //     ]
    // });
    // alert.present();
    // ,'You have to update discount before placing an order of this dealer'
    this.alert.errorfr("Update Discount",'You have to update discount before placing an order of this dealer');
  }

  openCategory()
  {

      this.data.cat_no="";
      this.data.discount='';

      console.log(this.search.dr_type);
      console.log(this.search.company_name);

      this.selected_drid= this.search.company_name;
      console.log(this.selected_drid);



      if(this.search.dr_type!=3)
      {
          // this.categorySelectable.open();
      }
      else
      {
          this.get_distributormoreItem(this.search.company_name);
      }
      this.userDetail.private_marka = this.data.type_name.private_marka  ;
      this.userDetail.transport_address = this.data.type_name.transport_address  ;
      this.userDetail.transport_name = this.data.type_name.transport_name  ;
      this.userDetail.transport_mobile = this.data.type_name.transport_mobile  ;
  }

  MobileNumber1(event: any) {
    console.log('Decimal Restrit');
    console.log(event);
    
    const charCode = (event.which) ? event.which : event.keyCode;
    console.log(charCode);

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;

}
}
