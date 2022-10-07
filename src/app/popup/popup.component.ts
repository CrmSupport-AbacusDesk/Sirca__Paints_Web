import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PearlService} from '../pearl.service';
import {DatabaseService} from '../../_services/DatabaseService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';
import {LeadDetailComponent} from '../lead/lead-detail/lead-detail.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { LocalStorage } from '../localstorage.service';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  lead_detail: any = {};
  lead_detail1: any = {};
  distributor_list: any = [];
  all_distributor: any = [];
  private alert: any;
  sales_id: any;
  lead: any = {};
  // savingData :any = false;
  lead_id: any;
  company_name: any;
  id: any;
  // all_distributor: any={};

  all_distributors: any;

  assignUserList: any = [];
  leaddata: any;
  row1: any;
  login_data: any = [];

  constructor(public route: ActivatedRoute , public session: LocalStorage,public serve: PearlService, public router: Router, public db: DatabaseService, @Inject(MAT_DIALOG_DATA) public data,
  private dialogRef: MatDialogRef<PopupComponent>, public toast:ToastrManager) {
    console.log(data);
    this.lead_detail1 = data;
    // tslint:disable-next-line:no-unused-expression
    this.lead_detail.lead_id = data.lead_id , data.company_name;
    this.lead_detail1.company_name = data.company_name;

    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    console.log(this.login_data.id);

    this.get_lead_status_listing_data();

  }

  ngOnInit() {

    console.log("DATA : ",this.data);


    this.lead_detail = this.data;
    console.log(this.lead_detail);
    this.sales_id = this.route.snapshot.params.id;

    this.route.params.subscribe(params => {
      console.log(params);
      // this.lead.id = params.id;
      // this.franchise_id = this.db.crypto(params['id'],false);
      // this.invoiceData.franchise_id = this.db.crypto(params['id'],false);
      // this.invoiceData.order_id = this.db.crypto(params['orderId'],false);
      // console.log(this.invoiceData.order_id);
      // this.invoiceData.shipping_charges = 0;
      // this.invoiceData.extra_discount = 0;
      // this.invoiceData.apply_extra_discount = 0;
      // this.invoiceData.mode = 'None';
      // this.change_invoice_id();
      //
      // if (this.franchise_id) {
      //   this.getFranchiseList(this.franchise_id);
      // } else {
      //   this.getFranchiseList(0);
      // }
      // this.getCaegoryList();
      // if (this.invoiceData.order_id)
      // {
      //   this.getOrderItemList(this.invoiceData.order_id);
      // }

    });

  }




  onSubmit() {
    alert('success');
  }



  submit_sales_invoice1() {

    // this.alert.confirm('').then((result) => {

    // if (result) {
    // console.log(type);
    // tslint:disable-next-line:no-shadowed-variable
    // this.leaddetail.addStock(this.result);
    console.log(this.lead_detail);
    // Distributors/confirm_lead


    if(this.lead_detail.lead_convert == 3) {

      const companyIndex = this.lead_detail.leaddata.findIndex(row => row.id == this.lead_detail.dr_id);
      this.lead_detail.company_name = this.lead_detail.leaddata[companyIndex].company_name;

    } else {

      this.lead_detail.company_name = '';

    }

    this.lead_detail.lead_converted_by = this.login_data.id;
    this.serve.fetchData(this.lead_detail , 'Distributors/confirm_lead').subscribe((result => {
      console.log(result);

      this.toast.successToastr("Lead Converted Successfully");

      this.dialogRef.close();

      // tslint:disable-next-line:triple-equals
      if (this.lead_detail.lead_convert == 1) {
        this.router.navigate(['distribution-list']);
        // tslint:disable-next-line:triple-equals
      } else if (this.lead_detail.lead_convert == 7) {
        this.router.navigate(['direct-dealer']);

        // tslint:disable-next-line:triple-equals
      } else if (this.lead_detail.lead_convert == 3) {

        console.log(this.lead_detail1.company_name);
        this.router.navigate(['dealer']);
      }

      console.log(this.lead);
      // console.log(this.invoiceItemList);

    }));


  }

  lead_status_listing_array : any = [];

  lead_status_data : any = {};

  dead_reason_listing_array : any = [];

  get_lead_status_listing_data(){
    console.log("get_lead_status_listing_data method calls");
    this.lead_status_listing_array = [];
    this.serve.fetchData({},"Distributors/social_media_lead_status_listing").subscribe((result=>{
        console.log(result);
        this.lead_status_listing_array = result['social_media_lead_status_listing'];

    }))

  }

  get_dead_reason_list() {

    console.log("get_dead_reason_list method calls");

    console.log("Select Lead Status Value: ", this.lead_status_data);
    this.dead_reason_listing_array = [];
    this.serve.fetchData({}, 'Distributors/social_media_lead_dead_reason_listing').subscribe((result => {

      console.log(" dead reason ", result);


      this.dead_reason_listing_array = result['social_media_lead_dead_reason_listing'];
      console.log("array dead reason",this.dead_reason_listing_array);
    }));

  }

  update_lead_status(){

    this.serve.fetchData({'lead_status_data':this.lead_status_data,'updated_by':this.login_data.id , 'id':this.data.id} , 'Distributors/social_media_lead_status_update').subscribe((result => {

      console.log(result);

      if(result['msg'] == 'success'){

        this.toast.successToastr("Status Updated Successfully");

      }else{



      }


      this.dialogRef.close();

    }));

  }

  // get_dead_reason_list() {
  //   console.log("get_dead_reason_list method calls");
  //   this.serve.fetchData({}, 'Distributors/social_media_lead_dead_reason_listing').subscribe((result => {

  //     console.log(" dead reason ", result);


  //     this.dead_reason_listing_array = result['social_media_lead_dead_reason_listing'];
  //     console.log("array dead reason",this.dead_reason_listing_array);
  //   }

  // ));
  // }









}
