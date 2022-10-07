import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { DialogComponent } from 'src/app/dialog.component';
import { FormControl } from '@angular/forms';
import { LocalStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  animations: [slideToTop()]
})
export class DiscountListComponent implements OnInit {
  
  
  discountList: any = [];
  value: any = [];
  start: any = 0;
  count: any;
  total_page: any;
  pagenumber: any;
  page_limit: any = 10;
  tmp_discountlist: any = [];
  loader: any;
  spinner_loader : boolean = false;
  skelton: any = {};
  lists: any;
  tmp: any = [];
  selected_category_list : any = [];
  selected_list_dr_type = '';
  updated_discount = '0';
  discount_type='not_select_anything';
  login:any={};

  
  
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  constructor(public rout: Router, public serve: PearlService, public dialog: DialogComponent,public session:LocalStorage) {
    this.skelton = new Array(10);

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'discount master');
    console.log(index);
    
    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
     
    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);


    this.mydiscountList();
    this.lists = new FormControl();
  }
  
  
  ngOnInit() {
    this.login= JSON.parse(sessionStorage.getItem('login'));
    console.log(this.login.data.id);      // login user ID
  }
  
  mydiscountList() {
    this.discountList = [];
    this.tmp_discountlist = [];
    // this.start=start;
    // this.page_limit=end;
    // console.log(end,start);
    this.loader = 1;
    console.log('hello discount');
    this.serve.fetchData({'start': this.start, 'pagelimit': this.page_limit}, 'Discount/discount_list').subscribe((result => {
      console.log(result);
      this.discountList = result['Discount_list']['discount_list'];
      this.count = result['Discount_list']['count'];
      // this.temp
      this.tmp_discountlist = this.discountList;
      this.total_page = Math.ceil(this.count / this.page_limit);
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
      console.log(this.total_page);
      console.log(this.pagenumber);
      setTimeout (() => {
        this.loader = '';
        
      }, 700);
    }));
    
  }
  
  discountDetail(id) {
    console.log(id);
    const value = {'id': id};
    this.serve.fetchData(value, 'Discount/discount_detail').subscribe((result => {
      console.log(result);
      // this.serve.setdiscountdata(result);
      this.rout.navigate(['/add-discount/' + id]);
      
    }));
    
  }
  
  deletediscount(id) {
    this.dialog.delete('This Category').then((result) => {
      if (result) {
        console.log(id);
        const data = {'id': id};
        this.serve.fetchData(data, 'Discount/delete_discount').subscribe((result => {
          console.log(result);
          if (result) {
            this.mydiscountList();
          }
        }));
      }
    });
  }
  getItemsList() {
    console.log(this.value.search);
    console.log(this.tmp_discountlist);
    
    this.discountList = [];
    for (let i = 0; i < this.tmp_discountlist.length; i++) {
      this.value.search = this.value.search.toLowerCase();
      
      this.tmp = this.tmp_discountlist[i]['category'].toLowerCase();
      if (this.tmp.includes(this.value.search)) {
        this.discountList.push(this.tmp_discountlist[i]);
      }
    }
  }
  
  refresh() {
    this.mydiscountList();
  }
  
  selected_category(type) {
    console.log(this.lists);
    console.log(this.lists['value']);
    this.selected_category_list = this.lists['value'];
    this.selected_list_dr_type = type;
    
  }
  
  update_selected_category_discount(){
    
    console.log(this.selected_category_list);
    console.log(this.selected_list_dr_type);
    console.log(this.updated_discount);
    
    if(this.updated_discount == '' || this.updated_discount == '0'){
      this.dialog.error(this.updated_discount == '0' ? " Discount Value Should be greater than 0 (ZERO) " : " You Enter Null Discount Value");
    }
    else if(this.updated_discount != '' && this.updated_discount != '0'){
      
      this.spinner_loader = true;
      this.serve.fetchData({'category_list':this.selected_category_list,'type':this.selected_list_dr_type,'discount_percent':this.updated_discount,'discount_type':this.discount_type,'updated_by':this.login.data.id},"Discount/update_discount_multiple").subscribe((result=>{
        console.log(result)
        if(result['msg'] == 'success'){
          this.spinner_loader = false;
          this.mydiscountList()
        }
        
      }))
      
      this.dialog.success_att(this.selected_list_dr_type+" Discount"  , "Updated");
      this.selected_category_list = [];
      this.selected_list_dr_type = '' ;
      this.updated_discount = '';
      this.lists['value'] = []
      // this.mydiscountList();
      
    }
    else{
      this.dialog.error("Please Try Again");
    }
    
  }
  
}
