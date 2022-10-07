import { Component, OnInit, Inject } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { MAT_DIALOG_DATA, MatDialog, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { LocalStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html'
})
export class StatusModalComponent implements OnInit {
  // data:any={};
  login:any={};
  login_user_data:any;
  tmpOrderStatus='';
  status_flag:any = 'no_data';
  reason_reject:any
  selected_survey_report_basic_info: any = [];
  selected_survey_report_area_info: any = [];
  overall_all_total: any = {};
  show_follow_fields:boolean=false;
  page_limit:any=50;
  start:any=0;
  area_target_list: any = [];
  area_target_list_count: any = 0;
  total_page:any='';
  pagenumber:any='';
  secondary_box_detail_list:any = []
  warehouse_to_warehouse_transfer_summary_product_detail : any = []
  open_row_id:any=0;
  branding_data:any={};
  today_date: any = {};
  organiser_name: any = {};
  branding_list:any =[];
  loader:any ;
  formDataArray:any =[];
  selectedFile: any = [];
  urls: any = [];
  type_retailer :any = '';
  plumber_meet_plumbers_list:any=[];
  
  formData = new FormData();

  branding_items : any = ["Glow signboard","Nonlit board","Vinyl","ACP (LED Board)","One way vision","Gravity display"];

  lists: any;
  retail_partner_array :any =[];

  selected_branding_item_list : any = [];
  failed_upload_lead_array_to_display:any=[];
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:PearlService,public dialog_component:DialogComponent, public storage:LocalStorage) {

    this.today_date = new Date().toISOString().slice(0, 10);
    
    this.lists = new FormControl();
    console.log("the lists", this.lists)

    console.log("table modal list",this.data);
    if(this.data.from == "distributor_detail_page_to_add_branding_data"){
      this.type_retailer = this.data.type;
      console.log(this.type_retailer);      
      this.get_branding_data();
    }
    if(this.data.data){
      this.status_flag=this.data.data;
    }
    
    if(this.data.from){
      this.status_flag=data.from; 
      this.failed_upload_lead_array_to_display = data.failed_upload_lead_array;
    
    }
    if(this.data.from == "plumber_meet_detail_page"){
        this.status_flag = data.from;
        this.organiser_name.name = data.name;
        console.log(this.organiser_name);
        
    }
      console.log(this.status_flag)
    
    if(this.data.image){
      this.status_flag='image_model_open';
    }
    console.log( this.status_flag);
    console.log(this.data.image);

    this.tmpOrderStatus =  this.data.order_status;
    console.log(this.tmpOrderStatus);
    if(this.tmpOrderStatus){
      this.data.order_status = '';
      this.data.reason = '';
      
    }
    
    // if(this.data.from == 'expense_detail_page' && this.data.change_status_of && this.data.expense_id){
    if((this.data.from == 'expense_detail_page' || this.data.from == 'expense_list_page') && this.data.change_status_of && this.data.expense_id){
      
      console.log(this.data);
      
      // console.log('data comes from expese detail');
      console.log('data comes from',this.data.from);
      this.status_flag=this.data.from;
      
    }
    
    if(this.data.from == 'travel_plan_detail_page' && this.data.travel_id){
      console.log(this.data);
      console.log('data comes from travel plan detail');
      this.status_flag=this.data.from;
      
    }
    
    if(this.data.from == 'distributor_detail_page' && this.data.dr_id && this.data.dr_id != ''  && this.data.credit_limit && this.data.dr_code && this.data.credit_opening_balance && this.data.credit_period){
      console.log(this.data);
      console.log('data comes from distributor_detail_page');
      this.status_flag=this.data.from;
    }
    
    if(this.data.from == 'area_target_survey_report' && this.data.survey_id){
      console.log(this.data);
      console.log('data comes from area_target_survey_report');
      this.status_flag=this.data.from;
      this.get_survey_data_of_particular_id();
      
    }
    
    if(this.data.from == 'dashboard' && this.data.data_type){
      console.log(this.data);
      console.log('data comes from dashboard');
      this.status_flag=this.data.from;
      this.get_targt_vs_achievement_list();
      
    }
    
    if((this.data.from == 'plumber-meet-list-page' || this.data.from == 'plumber-meet-detail-page') && this.data.plumber_meet_id && this.data.plumber_meet_status){
      console.log(this.data);
      console.log('data comes from plumber-meet-list-page');
      this.status_flag=this.data.from;
      
    }
    
    if((this.data.from == 'order_detail_page') && this.data.master_cart_id){
      console.log(this.data);
      console.log('data comes from order_detail_page');
      this.status_flag=this.data.from;
      this.get_secondary_box_data_from_master_box(this.data.master_cart_id);
      
    }
    
    if((this.data.from == 'warehouse_to_warehouse_summary_detail') && this.data.master_box_qr_code_id){
      console.log(this.data);
      console.log('data comes from warehouse_to_warehouse_summary_detail page');
      this.status_flag=this.data.from;
      this.get_warehouse_to_warehouse_transfer_summary_product_detail(this.data.master_box_qr_code_id);
      
    }
    
    if((this.data.from == 'distributor_detail_page_to_add_branding_data' || this.data.from == 'lead_detail_page_to_add_branding_data') && this.data.dr_id && this.data.dr_id != ''){
      console.log(this.data);
      console.log('data comes from distributor_detail_page_to_add_branding_data');
      this.status_flag=this.data.from;
      this.get_branding_data();

    }
    
    if((this.data.from == 'plumber_meet_report') && this.data.plumber_meet_id && this.data.plumber_meet_id!='0'){
      console.log(this.data);
      console.log('data comes from plumber_meet_report');
      this.status_flag=this.data.from;
      this.get_plumber_meet_plumbers_list_data()
      
    }
    
    if(this.data.from == 'update_status_of_follow_up'){
      console.log(this.data);
      this.status_flag=this.data.from;
      this.data.followup_status = this.data.status;
    }

    this.get_sales_user_list();
    
  }
  
  ngOnInit() {
    this.login= JSON.parse(sessionStorage.getItem('login'));
    console.log(this.login.data.id);
  }
  
  order_status_change(reason,status){
    console.log(reason);
    console.log(status);
    this.serve.fetchData({'reason':reason,'status':status,'id':this.data.order_id,'action_by':this.login.data.id},"Order/orderstatus_change").subscribe((result=>{
      console.log(result);
    }))
    this.dialog.closeAll();
  }
  
  update_pop_order_status(){
    console.log(this.data.reason);
    console.log(this.data.order_status);
    this.serve.fetchData({'reason':this.data.reason,'status':this.data.order_status,'id':this.data.order_id,'action_by':this.login.data.id},"Order/pop_order_status_change").subscribe((result=>{
      console.log(result);
    }))
    this.dialog.closeAll();
  }
  userlist:any=[];
  user_id:any=[];
  userCheck: any = [];

  get_sales_user_list(){

    this.serve.fetchData({},'Attendance/sales_user_list_for_forllowups').subscribe((result)=>{
      this.userlist=result['sales_user_list'];


    })
  }
  
  user_assign_check(index) {
    this.userCheck = false;
    
    this.data.user_id = [];
    
    console.log(index);
    this.data.user_id = this.userlist[index]['id'];
    console.log(this.data.user_id);
    console.log(this.data.user_id.length);
  }
  
  update_checkin_status(){
    
    if(this.show_follow_fields == true){
     
      console.log(this.data.checkin_verification_remark);
      this.data.next_followup_date = moment(this.data.next_followup_date).format('YYYY-MM-DD');
      console.log(this.data.next_followup_date);  
      this.userCheck=false;
      // console.log(this.data.checkin_verification_status);
      console.log(this.data.checkin_id);
     

      this.serve.fetchData({'checkin_verification_status' : this.data.checkin_verification_status, 'checkin_verification_remark':this.data.checkin_verification_remark,'followup_type':this.data.followup_type,'followup_date':this.data.next_followup_date,'description':this.data.followup_remark, 'checkin_id':this.data.checkin_id,'status_update_by':this.login.data.id},"Attendance/verified_checkin_status").subscribe((result=>{
        console.log(result);
      }))
      this.dialog.closeAll();

    }else{

      this.serve.fetchData({'checkin_verification_status' : this.data.checkin_verification_status, 'checkin_verification_remark':this.data.checkin_verification_remark,'checkin_id':this.data.checkin_id,'status_update_by':this.login.data.id},"Attendance/verified_checkin_status").subscribe((result=>{
        console.log(result);
      }))
      this.dialog.closeAll();

    }
   
    
  }
  
  
  update_expense_status(){
    
    console.log("update_expense_status method calls");
    console.log(this.data);
    console.log('status change by = '+this.login.data.id);
    this.serve.fetchData({'reason':this.data.reason,'status':this.data.expense_status,'expense_id':this.data.expense_id,'status_changed_by':this.login.data.id,'type':this.data.change_status_of, 'total_approved_amount' : (this.data.change_status_of == 'accounts' && this.data.expense_status == 'Approved' ? this.data.approved_amount : '' ) },"Expense/expense_status_update").subscribe((result=>{
      console.log(result);
      
      if(result['msg'] == 'success')
      {
        this.dialog_component.success("Expense Status", "Update");
        this.data.from == 'expense_detail_page' ? window.history.go(-1) : "";
      }
      else{
        this.dialog_component.error("Something Went Wrong");
      }
      
    }))
    this.dialog.closeAll();
    
  }
  
  conInt(amount){
    amount = parseInt(amount)
    return amount;
  }
  
  update_travel_plan_status(){
    console.log("update_travel_plan_status method calls");
    
    console.log(this.data);
    console.log('status change by = '+this.login.data.id);
    this.serve.fetchData({'reason':this.data.reason,'status':this.data.travel_status,'travel_id':this.data.travel_id,'status_changed_by':this.login.data.id},"Travel/update_travel_plan_status").subscribe((result=>{
      console.log(result);
      
      if(result['msg'] == 'success')
      {
        this.dialog_component.success("Travel Plan Status", "Update");
        window.history.go(-1);
      }
      else{
        this.dialog_component.error("Something Went Wrong");
      }
      
    }))
    this.dialog.closeAll();
    
    
  }
  
  update_billing_details(){
    console.log("update_travel_plan_status method calls");
    
    console.log(this.data);
    console.log('Credit Data Change By = '+this.login.data.id);
    this.serve.fetchData({'dr_id':this.data.dr_id,'credit_limit':this.data.credit_limit,'dr_code':this.data.dr_code,'credit_opening_balance':this.data.credit_opening_balance,'credit_period':this.data.credit_period,'credit_data_changed_by':this.login.data.id,'display_billing_status':this.data.display_billing_status},"Distributors/bill_credit_limit_data_save").subscribe((result=>{
      console.log(result);
      
      if(result['msg'] == 'success')
      {
        this.dialog_component.success("Billing Details", "Update");
      }
      else{
        this.dialog_component.error("Something Went Wrong");
      }
      
    }))
    this.dialog.closeAll();
  }
  
  get_survey_data_of_particular_id(){
    console.log("get_survey_data_of_particular_id method calls");
    
    this.serve.fetchData({'survey_id':this.data.survey_id},"User/dr_area_target_survey_data_detail").subscribe((result=>{
      console.log(result);
      this.selected_survey_report_basic_info=result['survey_detail'];
      this.selected_survey_report_area_info=result['survey_item_detail'];
      this.overall_all_total=result['overall_all_total'];
      
    }))
    
  }
  
  get_targt_vs_achievement_list(){
    console.log("get_targt_vs_achievement_list method");
    this.serve.fetchData({'start':this.start,'pagelimit':this.page_limit,'type':this.data.data_type},"User/assigned_area_target_list_for_dashboard").subscribe((result=>{
      console.log(result);
      this.area_target_list = result['assigned_area_target_list']
      this.area_target_list_count = result['area_target_list_count']
      this.total_page = Math.ceil(this.area_target_list_count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      
      
    }))
    
  }
  
  update_plumber_meet_status(){
    console.log("update_plumber_meet_status method");
    console.log(this.data);
    console.log('status change by = '+this.login.data.id);
    this.serve.fetchData({'remarks':this.data.reason,'status':this.data.plumber_meet_status,'plumber_meet_id':this.data.plumber_meet_id,'organiser_name':this.data.organiser_name, 'status_changed_by':this.login.data.id},"PlumberMeet/plumber_meet_status_change_for_web").subscribe((result=>{
      console.log(result);
      
      if(result == 'Updated Successfully')
      {
        this.dialog_component.success("Plumber Meet Status", "Update");
      }
      else{
        this.dialog_component.error("Something Went Wrong, Please Try Again !");
      }
      
    }))
    this.dialog.closeAll();
    
  }
  
  get_secondary_box_data_from_master_box(master_cart_id){
    
    console.log("get_secondary_box_data_from_master_box method");
    this.serve.fetchData({'master_cart_id':master_cart_id},"order/secondary_box_detail").subscribe((result=>{
      console.log(result);
      this.secondary_box_detail_list = result['secondary_box_detail_list']
    }))
    
    
  }
  
  get_warehouse_to_warehouse_transfer_summary_product_detail(master_box_qr_code_id){
    
    console.log("get_warehouse_to_warehouse_transfer_summary_product_detail method");
    this.serve.fetchData({'master_box_qr_code_id':master_box_qr_code_id},"Stock/warehouse_to_warehouse_transfer_product_wise_detail").subscribe((result=>{
      console.log(result);
      this.warehouse_to_warehouse_transfer_summary_product_detail = result['product_wise_detail_list']
    }))
    
    
  }
  
  public conDate(event): void{
    
    this.branding_data.branding_date=moment(event.value).format('YYYY-MM-DD'); 
    console.log(this.branding_data);
    
    
  }

  selected_branding_items() {
    console.log(this.lists);
    console.log(this.lists['_pendingValue']);
    this.selected_branding_item_list = this.lists['_pendingValue'];
    
    console.log("Selected Branding Item List ", this.selected_branding_item_list);

  }
  fileChange(event:any) {
      
    console.log(event.target.files);
    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFile.push(event.target.files[i]);
      
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.urls.push(e.target.result);
        console.log(this.urls);
        
        for (let index = 0; index < this.selectedFile.length; index++) {
          
          for (let urlIndex = 0; urlIndex < this.urls.length; urlIndex++) {
            
            if(index == urlIndex) {
              this.selectedFile[index]['path'] = this.urls[urlIndex];
            }
          }
        }
        
        console.log(this.selectedFile);
        
      }
      
      reader.readAsDataURL(event.target.files[i]);
      
    }
  }
  insertImage(event) {
    console.log(event);

    let files = event.target.files;
    console.log(files);
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        console.log(file);
        reader.onload = (e: any) => {
          console.log(e);

          let file_data = {
            file_path : e.target.result,
            file_type : file.type
          }

          // this.urls.push(e.target.result);
          this.urls.push(file_data);

           console.log(this.urls);

          console.log(e);

        }
        reader.readAsDataURL(file);
      }
    }
    console.log(this.urls);

    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFile.push(event.target.files[i]);
    }
    console.log(this.selectedFile);

  }
  
  add_branding_details(){
    console.log("add_branding_details method calls");
      this.loader = true;
    console.log(this.branding_data);
    console.log('branding add by = '+this.login.data.id);
    this.branding_data['branding_image'] = this.urls[0];
    this.branding_data['branding_item'] = this.selected_branding_item_list;
    console.log("Select", this.branding_data);

    this.serve.fetchData({'branding_data':this.branding_data,'created_by':this.login.data.id,'dr_id':this.data.dr_id},"Distributors/save_branding_data").subscribe((result=>{
      console.log(result);
      
      if(result['msg'] == 'Added Successfully')
      {

        this.branding_data = {};
        this.lists = [];
        this.urls = [];

        let id=result['inserted_id'];
        console.log(id);

        for(var i=0; i < this.selectedFile.length; i++)
        {
          // console.log(this.selectedFile[i]);
          // let file =  this.selectedFile[i];
          // console.log(file);
          
          this.formData.append("image"+ i,this.selectedFile[i],this.selectedFile[i].name);
          console.log(this.formData);

        }

        this.formData.append('id',id);
        console.log(this.formData);

        if(this.selectedFile && this.selectedFile.length > 0)
        {
        
          this.serve.upload_image(this.formData,"Distributors/insert_brand_file").subscribe((resp)=>
          {
            console.log(resp);
          });
          

        }
        this.loader = false;
        this.dialog_component.success("Branding Data", "Add Successfully");
        // this.dialog.closeAll();
        this.get_branding_data()
        
      }
      else{
        this.loader = false;
        this.dialog_component.error("Something Went Wrong, Please Try Again !");
        this.dialog.closeAll();
        
      }
      
    }));
    
  }
  
  // insertImage(event) {
  //   console.log(event);
    
  //   let files = event.target.files;
  //   console.log(files)
  //   if (files) {
  //     console.log("in if");
  //     for (let file of files) {
  //       console.log("in for");
  //       let reader = new FileReader();
        
  //       reader.onload = (e: any) => {
  //         console.log(e);
          
  //         this.urls[0] = (e.target.result);
  //         console.log(this.urls);
  //       }
  //       reader.readAsDataURL(file);
  //     }
  //   }
  //   console.log(this.urls);
    
  // }

 
  
  delete_img(index: any) {
    this.urls.splice(index, 1)
    
  }
  
  get_plumber_meet_plumbers_list_data(){
    console.log("get_plumber_meet_plumbers_list_data method calls");
    
    this.serve.fetchData({'id':this.data.plumber_meet_id},"PlumberMeet/plumber_meet_participent_report").subscribe((result=>{
      console.log(result);
      this.plumber_meet_plumbers_list = result
    }))
    
    
    
  }
  
  retail_partner_list(){
    console.log("retail partner method calls");
    this.loader = true;
    this.serve.fetchData({'distributor_id':this.data.dr_id},'Distributors/assign_dealers_for_branding').subscribe((res)=>{
      console.log(res);
        this.retail_partner_array = res;
      setTimeout(() => {
        this.loader =false;
      }, 1000);
      
    })
    
  }
  
  // check_amount(){
  //   console.log("check_amount method calls");
  //   console.log(typeof(this.data.expense_amount)+ this.data.expense_amount);
  //   console.log(typeof(this.data.approved_amount)+ this.data.approved_amount);
  
  //   if (this.data.approved_amount == null || this.data.approved_amount == '') {
  //     console.log("in if primary");
  //     this.data.approved_amount = 0;
  //   }
  
  //   if (parseInt(this.data['approved_amount']) > parseInt(this.data['expense_amount'])) {
  //     console.log("in if secondary"); 
  //     (this.data['approved_amount']) = parseInt(this.data['expense_amount']);
  //   }
  
  //   console.log(typeof(this.data.expense_amount)+ this.data.expense_amount);
  //   console.log(typeof(this.data.approved_amount)+ this.data.approved_amount);
  
  
  // }
  delete_branding_data(branding_id){
    console.log("delete_branding_data method calls ");

    
            this.serve.fetchData({ "id": branding_id }, "Distributors/remove_branding_data").subscribe((result) => {
                console.log(result);
                if(result['msg'] == 'Deleted Successfully')
                {
                    this.dialog_component.success("Selected Branding Data", "Delete");
                    this.get_branding_data();
                }
                else{
                    this.dialog_component.error("Something Went Wrong");
                }

            })
    


}
  
  
  show_follow_fields_function(event){
    if(event.checked ==true){

      this.show_follow_fields =true;
    }
    else{
      this.show_follow_fields =false
      this.data.followup_type = '';
      this.data.next_followup_date = '';
      this.data.followup_remark = '';
      this.data.user_id = '';
    }
    console.log("show follow fields"+ this.show_follow_fields)
  }
  get_branding_data(){
    console.log("get_branding_data method calls");
    this.serve.fetchData({'dr_id': this.data.dr_id},"Distributors/get_branding_data").subscribe((result=>{
        console.log(result);
        this.branding_list = result['branding_list'];
        console.log( this.branding_list);


    }))

  }
  delete_brand(index){
    console.log(index);
    this.branding_list.splice(index ,1);
  }
  imageModal(image){
    console.log(image);
    window.open(image);
  }
  save_organiser_name(new_name){
    console.log(new_name);
      this.loader  = true;

      this.serve.fetchData({'login_id':this.login.data.id , 'plumber_meet_id':this.data.plumber_meet_id, 'organiser_name':new_name},'PlumberMeet/plumber_meet_organiser_name_update').subscribe(result => {
        console.log(result);
           if(result['msg']== 'Successfully Updated'){
             this.dialog_component.success("Successfully Changed"," Oragniser Name");
             this.loader = false;
             this.dialog.closeAll();
           }else{
            this.dialog_component.error("Something Went Wrong");
            this.loader = false;

            this.dialog.closeAll();
           }
      })
    
  }

  update_followup_data(reason,status){
      console.log(status);
      console.log(reason);
    this.loader=true;
      this.serve.fetchData({'reason':reason ,'status':status ,'created_by':this.login.data.id , 'id':this.data.id},'Distributors/follow_up_status_change').subscribe((res)=>{
        console.log(res);
          if(res['msg']=='Status Updated Successfully'){
            this.dialog_component.success('Successfully','Updated');
            this.dialog.closeAll();
          }else{
            this.dialog_component.error('Something Went Wrong .....');
            this.dialog.closeAll();
          }
          setTimeout(() => {
            this.loader=false;
          }, 1000);
      })
      
  }

}