
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { LocalStorage } from 'src/app/localstorage.service';
import { PearlService } from 'src/app/pearl.service';
import { UploadFileModelComponent } from 'src/app/upload-file-model/upload-file-model.component';


@Component({
  selector: 'app-social-media-lead-list',
  templateUrl: './social-media-lead-list.component.html',
  styleUrls: ['./social-media-lead-list.component.scss']
})
export class SocialMediaLeadListComponent implements OnInit {
  area_target_list: any = [];
  search_val: any = {
    'list_type': 'all'
  };
  //aamir changes
  loader: any;
  page_limit: any = 50;
  lead_List: any = [];
  leadtmp: any = [];
  login_data_2: any;
  count: any;
  data_not_found = false;
  total_page: any = '';
  start: any = 0;
  pagenumber: any = '';
  skelton: any = new Array(10);

  selected_user_id: any;

  tmpsearch: string;

  user_name: any = '';
  assign_login_data: any = [];

  login_data: any = [];
  view_delete: boolean = true;
  view_edit: boolean = false;
  edit_fields: any = '0';
  state_values: any = [];



  constructor(public alrt: MatDialog, public serve: PearlService, public dialog: DialogComponent, public session: LocalStorage, public alert: DialogComponent) {

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);

    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    console.log(this.login_data.id);

    this.search_val = this.serve.socialMediaLeadFilter;

    this.get_social_media_list();
    // this.get_social_media_update_list();
    this.get_social_media_searchbox_list();

    this.get_lead_status_listing_data();

    this.get_dead_reason_list();



  }

  ngOnInit() {
  }
  update_edit_detail(comment,order_amount,order_won_date,payment_status,id ) {
    console.log("update comment detail");

    this.serve.fetchData({ 'last_updated_by':this.login_data.id , 'id':id ,'comment': comment, 'order_won_date':order_won_date,'payment_status':payment_status, 'order_amount':order_amount }, "Distributors/social_media_lead_fields_update").subscribe((res) => {
      console.log("res", res);
      this.edit_fields = '0';
      this.get_social_media_list();
      if (res['msg'] == 'success') {
        this.dialog.success("social media lead list edit", "updated successfully");
      }
      else {
        this.dialog.error("something went wrong");
      }
    })
  }

  upload_excel() {
    const dialogRef = this.alrt.open(UploadFileModelComponent, {
      width: '500px',
      data: {
        'from': 'from_social_media_leads',
        'created_by': this.login_data.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      console.log("Dailog Box Closed Now : ");
      // this.get_area_target()
      this.get_social_media_list();
    });
  }

  social_lead_data: any = [];
  socail_media_lead_list: any = [];
  socail_media_update_list: any = [];

  //metcheckbox program
  inside_user_list: any = [];

  selected_social_media_leads: any = [];

  lead_status_listing_array: any = [];

  dead_reason_listing_array: any = [];


  select_social_media_list(event) {

    console.log("matcheckbox", event);

  }

  public onDate(event): void {
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
    this.get_social_media_list();
  }

  goToDetailPage() {

    this.serve.socialMediaLeadFilter = this.search_val;

  }

  // public onLeadDate(event): void
  // {
  //   this.search_val.lead_date=moment(event.value).format('YYYY-MM-DD');
  //   this.get_social_media_list();
  // }

  get_social_media_list(action: any = '') {
    this.loader = true;

    if (action == "refresh") {
      this.search_val = {};
      this.socail_media_lead_list = [];
      this.start = 0;
    }

    this.serve.fetchData({ 'search': this.search_val, 'start': this.start, 'pagelimit': this.page_limit, 'user_id': this.login_data.id, 'user_type': this.login_data.user_type }, "Distributors/social_media_lead_list")
      .subscribe((result => {
        console.log("Api response :", result);
        this.socail_media_lead_list = result['social_media_lead_list']['data'];
        console.log(this.socail_media_lead_list);
        // this.lead_List = this.lead_List.concat(result['lead_list']['data']);
        this.state_values = result['social_media_lead_list']['state_arr'];

        console.log("state list : ", this.state_values);

        this.count = result['social_media_lead_list']['count'];
        this.total_page = Math.ceil(this.count / this.page_limit);
        this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        setTimeout(() => {
          this.loader = false;

        }, 700);
        if (this.lead_List.length == 0) {
          this.data_not_found = true;
        } else {
          this.data_not_found = false;

        }
      }))
  }
  //api called when page load



  //get the data in search box
  get_social_media_searchbox_list() {
    this.serve.fetchData({}, "User/inside_sales_user_list").subscribe((result => {
      console.log("get search box ", result);
      this.inside_user_list = result['inside_sales_list']
      for (let i = 0; i < this.inside_user_list.length; i++) {
        this.inside_user_list[i].name = this.inside_user_list[i].name + ' - ' + '( ' + this.inside_user_list[i].role_name + ' ) ';
      }
      this.socail_media_update_list = this.inside_user_list;
      this.filter_dr('');
    }))

  }


  select_social_lead_method(social_media_lead_id) {

    console.log("select_areas method calls");
    console.log(social_media_lead_id);
    const index = this.socail_media_lead_list.findIndex(row => row.id == social_media_lead_id);


    if (index != -1) {

      console.log("index: ", index);

      if (this.socail_media_lead_list[index].lead_assign_to_inside_user_flag == '1') {
        this.socail_media_lead_list[index]['lead_assign_to_inside_user_flag'] = '0'
        const secondary_index = this.selected_social_media_leads.findIndex(row => row == social_media_lead_id);
        if (index != -1) {
          this.selected_social_media_leads.splice(secondary_index, 1)
        }
        console.log("select social media leads: ", this.selected_social_media_leads);

      }

      else if (this.socail_media_lead_list[index].lead_assign_to_inside_user_flag == '0') {
        this.socail_media_lead_list[index]['lead_assign_to_inside_user_flag'] = '1';
        console.log(social_media_lead_id);
        this.selected_social_media_leads.push(social_media_lead_id)
        console.log("Second If : ", this.selected_social_media_leads);

      }

      else {
        console.log("in else");
        console.log(this.socail_media_lead_list[index].lead_assign_to_inside_user_flag);

      }
    }
    else {
      console.log("in else");
      console.log(index);
    }

    console.log("end social media leads : ", this.socail_media_lead_list);

  }

  filter_dr(user_name) {
    console.log("filter_dr method calls");
    console.log(user_name);
    this.tmpsearch = '';
    this.socail_media_update_list = [];
    for (var i = 0; i < this.inside_user_list.length; i++) {
      user_name = user_name.toLowerCase();
      this.tmpsearch = this.inside_user_list[i]['name'].toLowerCase();
      if (this.tmpsearch.includes(user_name)) {
        this.socail_media_update_list.push(this.inside_user_list[i]);
      }
    }
  }


  update_lead_assign() {


    console.log("update_lead_assign method calls");
    console.log(this.selected_social_media_leads);
    console.log(this.selected_user_id);
    console.log(this.login_data.id);

    this.serve.fetchData({ 'assigned_by': this.login_data.id, 'selected_lead_dr': this.selected_social_media_leads, 'selected_user_id': this.selected_user_id }, "Distributors/social_media_lead_assign_to_inside_sales_user").subscribe(response => {
      console.log(response);
      if (response['msg'] == 'Successfully Updated') {
        this.dialog.success("Lead Assigned Successfully", "Assigned");
      }
      else {
        this.dialog.error("Something Went Wrong");
      }
      this.get_social_media_list();
    });

  }

  //re assign
  remove_assign_dr(id) {

    console.log("remove_assign_dr method calls");
    console.log(id);
    this.alert.unassign('To Unassign Lead !').then((result) => {
      if (result) {
        this.serve.fetchData({ "social_media_lead_id": id }, "Distributors/unassign_social_media_lead").subscribe((result) => {
          console.log(result);
          this.get_social_media_list();
          if (result['msg'] == 'Successfully Unassigned') {
            this.dialog.success("Successfully Unassigned :", "Unassigned");
          }
          else {
            this.dialog.error("Something Went Wrong");
          }
        })
      }
    });
  }

  delete_social_media_row(id) {
    console.log(id);
    this.alert.delete('Target Data !').then((result) => {
      if (result) {
        this.serve.fetchData({ "id": id }, "Distributors/distributors_delete").subscribe((result) => {
          console.log(result);
          this.get_social_media_list();
          if (result['distributors_delete']['msg'] == 'success') {
            this.dialog.success("Lead Removed Successfully", "Removed");
          }
          else {
            this.dialog.error("Something Went Wrong");
          }
        })
      }
    });

  }

  get_lead_status_listing_data() {
    console.log("get_lead_status_listing_data method calls");
    this.lead_status_listing_array = [];
    this.serve.fetchData({}, "Distributors/social_media_lead_status_listing").subscribe((result => {
      console.log(result);
      this.lead_status_listing_array = result['social_media_lead_status_listing'];

    }))

  }

  get_dead_reason_list() {

    console.log("get_dead_reason_list method calls");

    // console.log("Select Lead Status Value: ", this.lead_status_data);
    this.dead_reason_listing_array = [];
    this.serve.fetchData({}, 'Distributors/social_media_lead_dead_reason_listing').subscribe((result => {

      console.log(" dead reason ", result);


      this.dead_reason_listing_array = result['social_media_lead_dead_reason_listing'];
      console.log("array dead reason", this.dead_reason_listing_array);
    }));

  }

  exp_data: any = [];
  excel_data: any = [];

  exportAsXLSX(): void {
    this.loader = true;

    this.serve.fetchData({ 'search': this.search_val, 'user_id': this.login_data.id, 'user_type': this.login_data.user_type }, "Distributors/social_media_lead_list")
      .subscribe(resp => {
        console.log(resp);
        console.log(this.exp_data);
        console.log("Api response :", resp);
        this.exp_data = resp['social_media_lead_list']['data'];

        console.log(this.exp_data);
        for (let i = 0; i < this.exp_data.length; i++) {

          this.excel_data.push({

            'DATE': this.exp_data[i].date_created,
            'LEAD DATE': this.exp_data[i].lead_date,
            'CREATED BY': this.exp_data[i].created_by_name,
            'CREATED BY TYPE': this.exp_data[i].created_by_type,
            'COMPANY NAME': this.exp_data[i].company_name,
            'CONTACT PERSON': this.exp_data[i].name,
            'CONTACT NO.': this.exp_data[i].mobile,
            'Assigned To Inside User':this.exp_data[i].assigned_inside_username,
            'Address':this.exp_data[i].address,
            'Total Activity Count':this.exp_data[i].total_activity_count,
            'CAMPAIGN TYPE': this.exp_data[i].campaign_type,
            'BUSINESS TYPE': this.exp_data[i].bussiness_type,
            'REMARKS BY PARTY': this.exp_data[i].remarks_by_party,
            'Credit Limit':this.exp_data[i].credit_limit,
            'Credit Opening Balance':this.exp_data[i].credit_opening_balance,
            'Credit Period':this.exp_data[i].credit_period,
            'ASSIGNED TO INSIDE USER': this.exp_data[i].assigned_inside_username,
            'ADDRESS': this.exp_data[i].address,
            // 'LAST ACTIVITY': this.exp_data[i].activity_performed ? this.exp_data[i].last_inside_activity_days + ' days' : '',
            'LAST ACTIVITY DAYS': this.exp_data[i].last_inside_activity_days,
            'Lead Asssin To':this.exp_data[i].lead_assign_to,
            'Lead Convert By':this.exp_data[i].lead_converted_by,
            'Lead Converted On':this.exp_data[i].lead_converted_on,
            'Lead Status':this.exp_data[i].lead_status,
            'STATE': this.exp_data[i].state,
            'Sale Type':this.exp_data[i].sale_type,
            'CITY': this.exp_data[i].city,
            'PIN CODE': this.exp_data[i].pincode,
            'ORDER WON DATE': this.exp_data[i].order_won_date,
            'PAYMENT STATUS': this.exp_data[i].payment_status,
            'ORDER AMOUNT': this.exp_data[i].order_amount,
            'LEAD STATUS': this.exp_data[i].lead_status,
            'DEAD REASON': this.exp_data[i].dead_reason,
            'COMMENT': this.exp_data[i].comment

          });

        }


        this.loader = false;
        this.serve.exportAsExcelFile(this.excel_data, 'Social-Media-Lead');

        this.excel_data = [];
        this.exp_data = [];

      });
  }

}
