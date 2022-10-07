import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { LocalStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-direct-dealer',
  templateUrl: './direct-dealer.component.html',
  styleUrls: ['./direct-dealer.component.scss']
})
export class DirectDealerComponent implements OnInit {
  data_not_found = false;
  skelton: any = {};

  assign_login_data: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;

  download_brand_excel_data: any = [];

  login_data_2: any;


  constructor(public serve: PearlService, public route: Router, public dialog: DialogComponent, public session: LocalStorage , 
      public toastCtrl:ToastrManager,
    ) {

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.login_data_2 = this.assign_login_data.data;

    console.log("User Login Data :---", this.login_data_2);

    if (this.assign_login_data.assignModule.length > 0) {


      this.assign_login_data = this.assign_login_data.assignModule;
      console.log(this.assign_login_data);
      const index = this.assign_login_data.findIndex(row => row.module_name == 'distribution direct dealer');
      console.log(index);

      this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
      this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
      this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

      console.log(this.view_add);
      console.log(this.view_edit);
      console.log(this.view_delete);

    }


    // this.assign_login_data = this.assign_login_data.assignModule;
    // console.log(this.assign_login_data);
    // const index = this.assign_login_data.findIndex(row => row.module_name == 'distribution direct dealer');
    // console.log(index);

    // this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    // this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    // this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

    // console.log(this.view_add);
    // console.log(this.view_edit);
    // console.log(this.view_delete);



  }

  ngOnInit() {
    this.search_val = this.serve.directDealerListSearch
    this.distributorList();
    this.skelton = new Array(10);
  }
  value: any = {};
  dr_list_temp: any = [];

  distributor_list: any = [];
  start: any = 0;
  count: any;
  total_page: any;
  pagenumber: any;
  page_limit: any = 50
  pagination_count: any = 0;

  state_values: any = [];
  exp_loader: any;
  loader: any;
  data: any = [];
  type: any = 7
  search_val: any = {}
  dr_count: any;
  status: boolean = true;
  public onDate(event): void {
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
    this.distributorList();
  }

  distributorList(action: any = '') {

    if (action == "refresh") {
      this.search_val = {};
      this.distributor_list = [];
      this.start = 0;

    }

    console.log(this.data.search);

    // if( Object.getOwnPropertyNames(this.search_val).length != 0)
    // {
    //   this.page_limit = 0;
    //   this.distributor_list = [];
    // }

    // if((this.dr_count != 0) && (this.dr_count == this.distributor_list.length))
    // {
    //   return false;
    // }

    this.loader = true;
    this.serve.fetchData({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'type': this.type, 'user_id': this.login_data_2.id, 'user_type': this.login_data_2.user_type }, "Distributors/distributor")
      .subscribe((result => {
        console.log(result);
        this.dr_list_temp = result['distributor']['distributor'];
        this.state_values = result['distributor']['states'];

        this.dr_count = result['distributor']['count'];

        // this.distributor_list = this.distributor_list.concat(result['distributor']['distributor']);
        this.distributor_list = (result['distributor']['distributor']);

        this.pagination_count = (result['distributor']['distributor_pagination_count']);
        this.total_page = Math.ceil(this.pagination_count / this.page_limit);
        this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;

        setTimeout(() => {
          this.loader = false;

        }, 100);
        if (this.distributor_list.length == 0) {
          this.data_not_found = true;
        } else {
          this.data_not_found = false;

        }
      }))
  }

  deleteUser(id) {
    this.dialog.delete('Distributor Data !').then((result) => {
      if (result) {
        this.serve.fetchData({ "id": id, 'user_id':this.login_data_2.id }, "Distributors/distributors_delete").subscribe((result => {
          console.log(result);
          this.distributorList();

        }))
      }
    })

  }
  refresh() {
    this.distributorList();
  }
  userDetail(id) {
    this.serve.directDealerListSearch = this.search_val

    console.log(id);
    this.route.navigate(['/distribution-detail/' + id]);

  }
  getItemsList(index, search) {
    console.log(search);
    this.distributor_list = [];

    if (index == 'created_by') {
      for (var i = 0; i < this.dr_list_temp.length; i++) {
        search = search.toLowerCase();
        this.tmpsearch1 = this.dr_list_temp[i]['created_name']['name'].toLowerCase();
        if (this.tmpsearch1.includes(search)) {
          console.log(search);
          this.distributor_list.push(this.dr_list_temp[i]);
        }
      }
    }
    if (index != 'created_by') {
      for (var i = 0; i < this.dr_list_temp.length; i++) {
        search = search.toLowerCase();
        this.tmpsearch1 = this.dr_list_temp[i][index].toLowerCase();
        if (this.tmpsearch1.includes(search)) {
          console.log(search);
          this.distributor_list.push(this.dr_list_temp[i]);
        }
      }
    }
    console.log(this.distributor_list);
  }


  tmpsearch1: any = {};
  excel_data: any = [];
  exp_data: any = [];
  exportAsXLSX(): void {
    this.excel_data = [];
    this.exp_loader = true;
    this.serve.FileData({ 'search': this.search_val, 'type': this.type }, "Distributors/distributor")
      .subscribe(resp => {
        console.log(resp);
        this.exp_data = resp['distributor']['distributor'];
        console.log(this.exp_data);

        for (let i = 0; i < this.exp_data.length; i++) {
          this.excel_data.push({
            'Direct Dealer Id': this.exp_data[i].id,
            'Company Name': this.exp_data[i].company_name,
            'Mobile': this.exp_data[i].mobile,
            'Pincode ': this.exp_data[i].pincode,
            'City ': this.exp_data[i].city,
            'State ': this.exp_data[i].state,
            'District ': this.exp_data[i].district,
            'Last Order Days': this.exp_data[i].last_order_days,
            'Primary Sale Count':this.exp_data[i].primary_sale.count,
            'Primary Sale Sum': this.exp_data[i].primary_sale.sum,
            'Secondary Sale Count': this.exp_data[i].secondary_sale.count,
            'Secondary Sale Sum': this.exp_data[i].secondary_sale.sum,
            'Created Date': this.exp_data[i].date_created,
            'Created By': this.exp_data[i].created_name,
            'Created By Type': this.exp_data[i].created_by_type,
            'Converted On': this.exp_data[i].lead_converted_on,
            'Created By Name': this.exp_data[i].lead_converted_by_name,
            'Last Visit Executive': this.exp_data[i].last_visit,
            'Total Activity Count': this.exp_data[i].total_activity_count,
            'Last Activity': this.exp_data[i].last_inside_activity_days,
            'Disposition Type': this.exp_data[i].disposition_type,
            'Disposition Name': this.exp_data[i].disposition_name,
            'Status': this.exp_data[i].status == '1' ? 'Active' : 'InActive',
            'Assigned Sales User': this.exp_data[i].assign_user,
            'Assigned Inside Sales User': this.exp_data[i].assign_inside_user,
            'GST': this.exp_data[i].gst,
            'Contact Person': this.exp_data[i].name,           
            'WhatsApp No.': this.exp_data[i].whatsapp_no,            
            'Email': this.exp_data[i].email,
            'Address ': this.exp_data[i].address,
            // 'Comment': this.exp_data[i].comment,
            'Date of Birth': this.exp_data[i].date_of_birth,
            'Date of Anniversary': this.exp_data[i].date_of_anniversary,
          });
        }
        this.exp_loader = false;

        this.serve.exportAsExcelFile(this.excel_data, 'DIRECT DEALER SHEET');
        this.excel_data = [];
        this.exp_data = [];
      })
  }
  update_status(id, status) {
    console.log(id);
    console.log(status);

    if (status == 1) {
      status = '0';
    }
    else {
      status = '1'
    }

    console.log(status);
    this.dialog.confirm("You Want To Change Status").then((result)=>{
      if(result){
        this.serve.fetchData({ 'dr_id': id, 'status': status }, "Distributors/distributor_status_update").subscribe(resp => {
          console.log(resp);
          if (resp['distributor_status_update']['msg'] == "success") {
            console.log(resp['distributor_status_update']['msg']);
    
            console.log("res=success");
    
            if (status == '0') {
              setTimeout(() => {
              this.dialog.success("Direct Dealer Status ", "Deactivated");

              }, 500);
              this.distributorList();

            }
            else {
              setTimeout(() => {
              this.dialog.success("Direct Dealer Status ", "Activated");

              }, 500);
              this.distributorList();

            }
    
          }
          else {
            setTimeout(() => {
            this.dialog.success("Something Went ", "Wrong");
              
            }, 500);
            this.distributorList();

          }
        })
      }else{
        this.distributorList();
        this.toastCtrl.errorToastr("Your Data is Safe...!")
      }
    })
   

  }

  download_all_branding() {
    console.log("download_all_branding method calls");

    this.excel_data = [];
    console.log(this.data);
    this.exp_loader = true;
    this.serve.fetchData({ 'search': this.search_val, 'type': this.type }, "Distributors/get_all_branding_data_excel").subscribe((result => {
      console.log(result);
      this.download_brand_excel_data = result['branding_list'];
      console.log(this.download_brand_excel_data);

      for (let i = 0; i < this.download_brand_excel_data.length; i++) {

        let keys_value: any = [];
        keys_value = Object.keys(this.download_brand_excel_data[i])

        let excel_object: any = {}

        for (let secondary_index = 0; secondary_index < keys_value.length; secondary_index++) {
          excel_object[keys_value[secondary_index]] = this.download_brand_excel_data[i][keys_value[secondary_index]]
        }

        this.excel_data.push(excel_object)

      }
      this.exp_loader = false;
      console.log(this.excel_data);
      this.serve.exportAsExcelFile(this.excel_data, 'All Brand Data SHEET');
      this.excel_data = [];
      this.download_brand_excel_data = [];
      setTimeout(() => {

      }, 700);
    }))


  }

  //aamir change
  downloading_billing: any = [];
  excel_billing_array: any = [];
    download_billing_data() {
    console.log("download billing data");
    this.exp_loader = true;
    this.serve.fetchData({ 'search': this.search_val, 'type': this.type }, 'Tally_invoice_credit/dr_account_detail_excel').subscribe((r) => {
      console.log("result downloading xcel billing data", r);
      this.downloading_billing = r['distributors'];
      console.log(this.downloading_billing);
      for (let i = 0; i < this.downloading_billing.length; i++) {
        this.excel_billing_array.push({
          'Party Id': this.downloading_billing[i].id,
          'Company Name': this.downloading_billing[i].company_name,
          'Contact Person': this.downloading_billing[i].contact_person,
          'Mobile': this.downloading_billing[i].mobile,
          'City': this.downloading_billing[i].city,
          'District': this.downloading_billing[i].district,
          'State': this.downloading_billing[i].state,
          'Pincode': this.downloading_billing[i].pincode,
          'Credit Limit': this.downloading_billing[i].credit_limit,
          'Credit Period': this.downloading_billing[i].credit_period,
          'Opening Balance': this.downloading_billing[i].credit_opening_balance,
          'Advance Payment': this.downloading_billing[i].advance_payment,
          'Overdue Balance': this.downloading_billing[i].Overdue_balance,
          'Outstanding Balance': this.downloading_billing[i].Outstanding_balance
        });
      }
      this.exp_loader = false;
      this.serve.exportAsExcelFile(this.excel_billing_array, 'Direct Dealer Billing DATA SHEET');
      this.excel_billing_array = [];
      this.downloading_billing = [];
    });

  }

}
