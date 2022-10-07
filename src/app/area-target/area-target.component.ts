import { Component, OnInit } from '@angular/core';
import { UploadFileModelComponent} from '../upload-file-model/upload-file-model.component';
import { MatDialog } from '@angular/material';
import { PearlService } from '../pearl.service';
import * as moment from 'moment';
import { DialogComponent } from '../dialog.component';
import { start } from 'repl';
import { LocalStorage } from '../localstorage.service';
import { DisOtpVarificationComponent } from '../distribution/dis-otp-varification/dis-otp-varification.component';

@Component({
  selector: 'app-area-target',
  templateUrl: './area-target.component.html',
  styleUrls: ['./area-target.component.scss']
})
export class AreaTargetComponent implements OnInit {
  
  area_target_list : any=[];
  search_val:any = {
    'list_type':'all'
  };
  skelton: any = new Array(10);   
  loader: any;
  data_not_found=false;
  selected_dr_id:any
  selected_areas: any = [];
  dr_list: any = [];
  edit_fields:any = '0';
  count: any;
  total_page:any='';
  pagenumber:any='';
  page_limit:any=50;
  start:any=0;
  index : any;  
  dr_name:any = ''
  tmpsearch: string;
  salesUserList: any[];
  dr_UserList2: any = [];
  login_data: any = [];
  sum_of_filter_data: any = '';
  show_target:boolean = false;
  selected_area_sum:any = '0';
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  download_area_excel_data: any;
  excel_data: any = [];
  excel_loader:any=false;
  
  
  
  
  constructor(public alrt:MatDialog,public serve:PearlService,public dialog: DialogComponent,public alert:DialogComponent,public session: LocalStorage) {
    
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'area target');
    console.log(index);
    
    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
    
    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);
    
    
    this.get_area_target();
    this.get_dr_list();
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    console.log(this.login_data.id);
    
  }
  
  ngOnInit() {
  }
  
  
  upload_excel()
  {
    const dialogRef = this.alrt.open(UploadFileModelComponent,{
      width: '500px',
      data:{
        'from':'area_target_list',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.get_area_target()
    });
  }
  
  get_area_target(action:any=''){
    
    this.selected_areas=[]
    this.selected_area_sum = '0';
    this.loader = 1;
    
    if(action == "refresh"){
      this.search_val = {};
      this.area_target_list = [];
      this.start = 0;
    }
    
    
    this.serve.fetchData({'search':this.search_val,'start':this.start,'pagelimit':this.page_limit},"User/area_target_excel_list").subscribe((result=>{
      console.log(result);
      this.area_target_list=result['area_target_list'];
      this.sum_of_filter_data = result['total_target']
      this.count=result['count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      this.index = parseInt(this.start) ;
      console.log(this.area_target_list);
      this.loader = '';
      if(this.area_target_list.length == 0)
      {
        this.data_not_found = true;
      }
      else
      {
        this.data_not_found = false;
      }
    }))
  }
  
  
  delete_area_row(id){
    console.log(id);
    this.alert.delete('Target Data !').then((result) => {
      if(result){
          this.serve.fetchData({'id':id},'Category_master/sendOtp').subscribe((result)=>{
            console.log(result);
              const dialogRef = this.alrt.open(DisOtpVarificationComponent,{
                width : '350px',
                data : {
                  id : id,
                  otp : result,
                  from : 'area_target_page'
                }
              });
              dialogRef.afterClosed().subscribe((result)=>{
                console.log(result);
                console.log("dailog status modal closed");
                this.get_area_target();
              })


          })
        // this.serve.fetchData({ "id": id }, "User/area_target_excel_delete").subscribe((result) => {
        //   console.log(result);
        //   this.get_area_target();
        //   if(result['msg'] == 'Successfully Deleted')
        //   {
        //     this.dialog.success("Target", "Delete");
        //   }
        //   else{
        //     this.dialog.error("Something Went Wrong");
        //   }
        // })
      }
    });
    
  }
  
  update_dr_area(){
    console.log("update_dr_area method calls");
    console.log(this.selected_areas);
    console.log(this.selected_dr_id);
    console.log(this.login_data.id);
    
    
    
    
    this.serve.fetchData({'assigned_by':this.login_data.id,'selected_area':this.selected_areas , 'selected_dr':this.selected_dr_id},"User/save_assign_area_target_to_dr").subscribe(response=>{
      console.log(response);
      if(response['msg'] == 'Successfully Updated')
      {
        this.dialog.success("Distributor Target", "Update");
      }
      else{
        this.dialog.error("Something Went Wrong");
      }
      this.get_area_target();
    });
    
  }
  
  select_areas_method(area_id){
    console.log("select_areas method calls");
    console.log(area_id);
    const index = this.area_target_list.findIndex(row => row.id == area_id);
    
    if(index != -1){
      console.log(index);
      if(this.area_target_list[index].this_area_assign_to_dr == '1'){
        this.area_target_list[index]['this_area_assign_to_dr'] = '0'
        this.selected_area_sum = parseInt(this.selected_area_sum) - parseInt(this.area_target_list[index]['monthly_target']);
        const secondary_index = this.selected_areas.findIndex(row => row == area_id);
        if(index != -1){
          this.selected_areas.splice(secondary_index, 1)
        }
        console.log(this.selected_areas);
        
      }
      
      else if (this.area_target_list[index].this_area_assign_to_dr == '0') {
        this.area_target_list[index]['this_area_assign_to_dr'] = '1';
        this.selected_area_sum = parseInt(this.selected_area_sum) + parseInt(this.area_target_list[index]['monthly_target']);
        console.log(area_id);
        this.selected_areas.push(area_id) 
        console.log(this.selected_areas);
        
      }
      
      else{
        console.log("in else");
        console.log(this.area_target_list[index].this_area_assign_to_dr);
        
      } 
    }
    else{
      console.log("in else");
      console.log(index);
    }
    
    console.log(this.area_target_list);
    
  }
  
  get_dr_list(){
    this.serve.fetchData({},"User/all_dr_list_except_dealer").subscribe((result=>{
      console.log(result);
      this.dr_UserList2 = result['dr_list_except_dealer']
      for(let i=0;i<this.dr_UserList2.length;i++){
        this.dr_UserList2[i].company_name = this.dr_UserList2[i].company_name + (this.dr_UserList2[i].city && this.dr_UserList2[i].city!= ''? ' - '+ this.dr_UserList2[i].city : ''  )
      }
      this.dr_list = this.dr_UserList2;
      this.filter_dr('');
    }))
    
  }
  
  
  update_area_details(index){
    console.log("update_area_details method calls");
    console.log(index);
    this.area_target_list[index].last_updated_by = this.login_data.id;
    console.log(this.area_target_list[index]);
    
    
    this.serve.fetchData(this.area_target_list[index], "User/area_target_excel_update").subscribe((result) => {
      console.log(result);
      this.edit_fields = '0';
      this.get_area_target();
      if(result['msg'] == 'Successfully Updated')
      {
        this.dialog.success("Area Details", "Updated Successfully");
      }
      else{
        this.dialog.error("Something Went Wrong");
      }
    })
    
    
    
    
  }
  
  show_error(){
    console.log("show_error method calls");
    this.dialog.error('Fill All The Details');
    
  }
  
  remove_assign_dr(id){
    console.log("remove_assign_dr method calls");
    console.log(id);
    this.alert.delete('Assign Distributor !').then((result) => {
      if(result){
        this.serve.fetchData({ "id": id }, "User/remove_assign_area_target_from_dr").subscribe((result) => {
          console.log(result);
          this.get_area_target();
          if(result['msg'] == 'Successfully Removed')
          {
            this.dialog.success("Distributor", "Removed");
          }
          else{
            this.dialog.error("Something Went Wrong");
          }
        })
      }
    });
  }
  
  filter_dr(dr_name){
    console.log("filter_dr method calls");
    console.log(dr_name);
    this.tmpsearch='';
    this.dr_list = [];
    for (var i = 0; i < this.dr_UserList2.length; i++) {
      dr_name = dr_name.toLowerCase();
      this.tmpsearch = this.dr_UserList2[i]['company_name'].toLowerCase();
      if (this.tmpsearch.includes(dr_name)) {
        this.dr_list.push(this.dr_UserList2[i]);
      }
    }
  }
  
  download_excel(){
    console.log("download_excel method calls");
    this.excel_data = [];
    this.excel_loader = true;
    this.serve.fetchData({'search':this.search_val},"User/dr_area_target_download_excel").subscribe((result=>{
      console.log(result);
      this.download_area_excel_data = result;
      
      for(let i=0;i<this.download_area_excel_data.length;i++){
        
        let keys_value : any = [];
        keys_value = Object.keys(this.download_area_excel_data[i])
        
        let excel_object: any = {}
        
        for(let secondary_index=0;secondary_index<keys_value.length;secondary_index++){
          excel_object[keys_value[secondary_index]]=this.download_area_excel_data[i][keys_value[secondary_index]]        
        }
        
        this.excel_data.push(excel_object)
        
      }
      
      console.log(this.excel_data);
      this.serve.exportAsExcelFile(this.excel_data,this.search_val.list_type+' -- AREA TARGET EXCEL DATA');
      
      setTimeout (() => {
        this.excel_loader = false;        
      }, 700);
    }))
    
  }
  
  
}


