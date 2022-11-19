import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { UserEmailModalComponent } from '../user-email-modal/user-email-modal.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { UpdateAdminModelComponent } from '../update-admin-model/update-admin-model.component';
import { LocalStorage } from 'src/app/localstorage.service';
import { UserTargetComponent } from '../user-target/user-target.component';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-sale-user-list',
  templateUrl: './sale-user-list.component.html',
  animations: [slideToTop()]

})
export class SaleUserListComponent implements OnInit {
  excel_data: any = [];
  tmp: any = [];
  date: any;
  userlist: any = [];
  start: any = 0;
  value: any = {}
  total_page: any;
  pagenumber: any;
  count: any;
  tmp_UserList: any = [];
  page_limit: any = 10
  loader: any;
  Status: boolean = true;
  data_not_found = false;
  dialog: any;
  skelton: any = {};
  datauser: any = {};
  data: any;

  assign_login_data: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  view_tab: any = 'Market';
  login_id: any;



  constructor(public alert: DialogComponent, public serve: PearlService, public rout: Router, public dialog2: MatDialog, public session: LocalStorage,
      public toastCtrl:ToastrManager , 
    ) {
    this.assign_login_data = this.session.getSession();
    console.log(this.assign_login_data);

    this.assign_login_data = this.assign_login_data.value;
    this.login_id = this.assign_login_data.data.id;
    console.log(this.login_id);

    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'executive master');
    console.log(index);

    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);




    this.datauser = JSON.parse(sessionStorage.getItem('st_user'));
    this.getUserList(0, 10, this.view_tab);
    this.salesUserLIst();
    this.skelton = new Array(10);


  }

  ngOnInit() {
  }
  public onDate(event): void {

    this.userlist[1]['updated_at'] = moment(this.userlist[1]['updated_at']).format('YYYY-MM-DD');
    console.log(this.userlist[1]['updated_at']);


  }
  getUserList(start, end, status) {
    if (this.userlist.updated_at) {

      this.userlist[1]['updated_at'] = moment(this.userlist[1]['updated_at']).format('YYYY-MM-DD');
      console.log(this.userlist[1]['updated_at']);

    }
    this.view_tab = status
    this.loader = 1;
    this.start = start;
    this.page_limit = end;
    this.serve.fetchData({ "start": this.start, "pagelimit": this.page_limit, "search": this.value, 'user_type': this.view_tab }, "User/sales_user_list").subscribe((result) => {
      this.userlist = result['sales_user_list'];
      // console.log(this.userlist[1]['updated_at']);
      // this.date=this.userlist[1]['updated_at'];
      // console.log(this.date);




      this.tmp_UserList = result['sales_user_list'];



      this.count = this.userlist.length;
      this.total_page = Math.ceil(this.count / this.page_limit);
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
      setTimeout(() => {
        this.loader = '';
      }, 700);
      if (this.userlist.length == 0) {
        this.data_not_found = true;
      }
    })


    // this.exceldata();

  }


  refresh() {
    this.getUserList(0, 10, this.view_tab);
  }
  deleteUser(id) {
    this.alert.delete('User Data !').then((result) => {
      if (result) {
        this.serve.fetchData({ "user_id": id, 'last_updated_by': this.datauser['data']['id'], 'last_updated_by_name': this.datauser['data']['name'] }, "User/delete_user").subscribe((result) => {
          if (result) {
            this.getUserList(0, 10, this.view_tab);
          }
        })
      }
    });
  }

  userDetail(id) {
    let value = { "id": id }
    this.serve.fetchData(value, "User/user_detail").subscribe((result) => {
      this.rout.navigate(['/sale-user-detail/' + id]);
    })
  }
  getItemsList(index, search) {
    this.userlist = [];
    for (var i = 0; i < this.tmp_UserList.length; i++) {
      search = search.toLowerCase();

      search = search.toLowerCase();
      if (this.tmp_UserList[i][index] != null) {
        this.tmp = this.tmp_UserList[i][index].toLowerCase();

      }
      if (this.tmp_UserList[i][index] == null) {
        this.tmp = '';

      }

      // this.tmp=this.tmp_UserList[i][index].toLowerCase();
      if (this.tmp.includes(search)) {
        this.userlist.push(this.tmp_UserList[i]);
      }
    }
  }

  asmList: any = [];
  salesUserLIst() {
    this.serve.fetchData({ 'state': 0 }, "User/sales_user_list").subscribe((result => {
      console.log(result);
      this.asmList = result['sales_user_list'];
      // this.tmp_userList=this.asmList;

      console.log(this.asmList);
    }))

  }
  // status:any={};
  userStatus(index, id) {


    console.log(id);
    console.log(index);

    console.log(this.userlist[index].status);
    if (this.userlist[index].status == "true") {
      this.userlist[index].status = "false";
      console.log(this.userlist[index].status);
    }
    else {
      this.userlist[index].status = "true";
      console.log(this.userlist[index].status);
    }
    let value = { "status": this.userlist[index].status }
    this.alert.confirm("You Want to Change Status").then((result)=>{
      if(result){
        this.serve.fetchData({ 'user_id': id, 'data': value, 'last_updated_by': this.datauser['data']['id'], 'last_updated_by_name': this.datauser['data']['name'] }, "User/update_user")
        .subscribe(resp => {
          console.log(resp);
          this.getUserList(0, 10, this.view_tab);
          this.toastCtrl.successToastr("Successfully Updated !");
        })
      }else{
        this.getUserList(0, 10, this.view_tab);

        this.toastCtrl.errorToastr("Your Data Is Safe...!")
      }
    })
   
  }
  xLXSArray: any = []
  exceldata() {
    for (let i = 0; i < this.userlist.length; i++) {
      this.excel_data[i].name = this.userlist[i].name
      this.excel_data[i].user_type = this.userlist[i].user_type
      this.excel_data[i].role_name = this.userlist[i].role_name
      this.excel_data[i].mobile = this.userlist[i].contact_01
      this.excel_data[i].reporting_manager = this.userlist[i].reporting_manager
    }
  }




  exportAsXLSX(): void {
    for (let i = 0; i < this.userlist.length; i++) {

      this.excel_data.push({
        'Employee Code': this.userlist[i].employee_id,
        Name: this.userlist[i].name,
        Type: this.userlist[i].user_type,
        Mobile: this.userlist[i].contact_01,
        Designation: this.userlist[i].role_name,
        ReportingManager: this.userlist[i].assign_user,
        'Distributor':this.userlist[i].channel_partner,
        'Primary Sale Sum': this.userlist[i].primary_sale.sum,
        'Seconday Sale Sum': this.userlist[i].secondary_sale.sum,
        'Address ': this.userlist[i].street,
        'State ': this.userlist[i].state_name,
        'District ': this.userlist[i].district_name,
        'City ': this.userlist[i].city,
        'Pincode ': this.userlist[i].pincode,
        'status': this.userlist[i].status == 'true' || this.userlist[i].status == '1' ? 'Active':'InActive', 
      });
    }
    this.serve.exportAsExcelFile(this.excel_data, 'USER SHEET');
  }

  deleteOrder(id) {
    this.dialog.delete('User Data !').then((result) => {
      if (result) {
        console.log("order deleted");

        this.serve.fetchData({ 'order_id': id }, "Order/order_delete").subscribe((result => {
          console.log(result);
          if (result) {
            this.getUserList(0, 10, this.view_tab);
          }
        }))
      }
    });
  }

  openModal() {
    console.log('test');

    const dialogRef = this.dialog2.open(UpdateAdminModelComponent, {
      width: '500px',
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');

    });

  }



  targetModal(user_id) {

    console.log("targetModal method calls");

    const dialogRef = this.dialog2.open(UserTargetComponent, {
      width: '1024px',
      data: {
        user_id
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }

}
