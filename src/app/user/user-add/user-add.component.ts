import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  animations: [slideToTop()]
  
})
export class UserAddComponent implements OnInit {
  
  constructor(public serve: PearlService, public rout: Router,public dialog: DialogComponent) {
    this.getStateList();
    this.get_module_data();
  }
  submit = false;
  
  state_list: any = [];
  state: any = [];
  rsm_list: any;
  data: any = {};
  district_list: any = [];
  city_list: any = [];
  area_list: any = [];
  pinCode_list: any = [];
  isslected;
  user_type;
  usertype = true;
  basicdetails = false;
  userrole;
  assign_module_data:any=[];
  login_user_data:any;
  assignModule={view_leads:0,view_distribution_n_w:0,view_orders:0,view_attendence:0,view_check_in:0,view_travel_plan:0,view_leaves:0,view_masters:0};
  ware_house_listing:any=[]
  
  ngOnInit() {
    // this.rsmassign();
    this.login_user_data = JSON.parse(sessionStorage.getItem('st_user'))
    console.log(this.login_user_data);
    this.userType('MARKET')
    
    
  }
  
  
  
  
  active: any = {};
  toggleterritory(key, action) {
    console.log(action);
    console.log(key);
    
    if (action == 'open') { this.active[key] = true; }
    if (action == 'close') { this.active[key] = false; }
    
    console.log(this.active);
  }
  
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  
  
  userType(usertype) {
    
    this.user_type = usertype.value
    console.log(this.user_type);
    
    if (this.user_type) {
      this.data.user_type = this.user_type;
      console.log(this.data.user_type);
      this.basicdetails = true;
    }
  }
  
  submitDetail() {
    this.submit = true;
    
    this.data.created_by = this.login_user_data['data']['id'];
    this.data.assignuser = this.ass_user;
    this.data.assignModule=(this.assign_module_data);
    console.log(this.data);
    this.serve.fetchData(this.data, "User/add_user").subscribe((response => {
      console.log(response);
      
      if(response['msg'] == 'success'){
        // this.dialog.success("Allowance", "Update");
        this.dialog.success("User", "Added");
      }
      else{
        this.dialog.error(response['msg']);

      }
      
      
      this.rout.navigate(['/sale-user-list']);
      
    }));
  }
  
  getStateList() {
    console.log("addUser");
    this.serve.fetchData(0, "User/state_user_list").subscribe((response => {
      console.log(response);
      this.state = response['query'];
      this.state_list = this.state['state_name'];
      console.log(this.state_list);
      
      
    }));
    
  }
  getDistrict() {
    console.log(this.data.state);
    this.serve.fetchData(this.data.state, "User/district_user_list").subscribe((response => {
      // console.log(response);
      this.district_list = response['query']['district_name'];
      console.log(this.district_list);
      
    }));
    
  }
  // getAddress() {
  //   console.log(this.data.state);
  //   this.serve.fetchData(this.data, "Distributors/getAddressList").subscribe((response => {
  //     // console.log(response);
  //     this.district_list = response['query']['district_name'];
  //     console.log(this.district_list);
  
  //   }));
  
  // }
  getCityList() {
    console.log(this.data.district);
    let value = { "state": this.data.state, "district": this.data.district }
    this.serve.fetchData(value, "User/city_user_list").subscribe((response => {
      console.log(response);
      this.city_list = response['query']['city'];
      console.log(this.city_list);
      
    }));
  }
  
  getPinCodeList() {
    console.log(this.data.state, this.data.city, this.data.district);
    let value = { "state": this.data.state, "district": this.data.district, "city": this.data.city }
    this.serve.fetchData(value, "User/pincode_user_list").subscribe((response => {
      console.log(response);
      this.pinCode_list = response['query']['pincode'];
      console.log(this.pinCode_list);
      
    }));
  }
  sales_type: any = [];
  get_sales_user_type(userType) {
    // console.log(this.data.state,this.data.city,this.data.district);
    // let value={"state":this.data.state,"district":this.data.district,"city":this.data.city}
    this.serve.fetchData({'usertype':userType}, "User/sales_type").subscribe((response => {
      console.log(response);
      console.log(response['sales']);
      
      this.sales_type = response['sales'];
      console.log(this.sales_type);
      
    }));
  }
  reporting_sales_type: any = [];
  getreporting_users(user_type) {
    console.log(user_type);
    this.serve.fetchData({ 'user_type': user_type }, "User/reportingsales_type").subscribe((response => {
      console.log(response);
      
      
      this.reporting_sales_type = response['reportingsales_type'];
      console.log(this.reporting_sales_type);
      
    }));
  }
  
  assign_users(usertype) {
    this.serve.fetchData({ 'user_type': usertype }, "User/assign_users").subscribe((response => {
      console.log(response);
      
      
      this.rsm_list = response['assign_users'];
      console.log(this.rsm_list);
      this.tmp_userList = this.rsm_list;
    }));
  }
  rsm: any = [];
  ass_user: any = [];
  product_Brand(value, index, event) {
    if (event.checked) {
      this.rsm.push(value);
      console.log(this.rsm);
      
    }
    else {
      for (var j = 0; j < this.rsm_list.length; j++) {
        if (this.rsm_list[index]['id'] == this.rsm[j]) {
          this.rsm.splice(j, 1);
        }
      }
      console.log(this.rsm);
    }
    this.ass_user = this.rsm
    
  }
  tmp_userList: any = [];
  
  search: any = {};
  tmpsearch: any = {};
  getItemsList(search) {
    console.log(search);
    
    this.rsm_list = [];
    for (var i = 0; i < this.tmp_userList.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.tmp_userList[i]['name'].toLowerCase() + ' ' + this.tmp_userList[i]['role_name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.rsm_list.push(this.tmp_userList[i]);
      }
    }
    console.log(this.rsm_list);
    
  }
  
  
  assign_module(module_name, event , index) {
    
    console.log(module_name);
    console.log(event);
    console.log(index);
    
    if (event.checked) {
      // this.assignModule[module_name]=1;
      this.assign_module_data[index][module_name] = 'true';
      // this.assign_module_data[index]['view'] = 'true';
      
    }
    else {
      // this.assignModule[module_name]=0;
      this.assign_module_data[index][module_name] = 'false';
      
    }
    
    // console.log(this.assignModule);
    console.log(this.assign_module_data);
    
  }
  
  
  
  get_module_data() {
    console.log("get_module_data method calls");
    this.serve.fetchData(0, "Product/module_master_fetch").subscribe((response => {
      console.log(response);
      this.assign_module_data = response['result'];
      console.log(this.assign_module_data);
    }));
    
  }
  
  
  get_warehouse_data() {
    console.log("get_warehouse_data method calls");
    this.serve.fetchData({}, "Order/ware_house_listing").subscribe((response => {
      console.log(response);
      this.ware_house_listing = response['ware_house_listing']
    }));
  }
  
  
}
