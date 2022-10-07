import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-update-admin-model',
  templateUrl: './update-admin-model.component.html',
  styleUrls: ['./update-admin-model.component.scss']
})
export class UpdateAdminModelComponent implements OnInit {
  
  constructor(public serve:PearlService,public toast:ToastrManager,public dialog:MatDialog) { }
  data:any={}
  ngOnInit() {
    this.getCurrentDetails()
  }
  // data:any={};
  getCurrentDetails()
  {
    this.serve.fetchData({},"User/getAdminDetails").subscribe((result)=>{
      console.log(result);
      this.data.crm_user_name = result[0]['username'];
      this.data.crm_password = result[0]['password'];
      this.data.loyalty_username = result[1]['email'];
      this.data.loyalty_password = result[1]['visible_password'];
    });    
  }
  update()
  {
    let crm =  {username:this.data.crm_user_name,password:this.data.crm_password}
    let loyalty =  {username:this.data.loyalty_username,password:this.data.loyalty_password}
    this.serve.fetchData({crm:crm,loyalty:loyalty},"User/updateAdminDetails").subscribe((result)=>{
      console.log(result);
      this.toast.successToastr("sucess");
      this.dialog.closeAll();
    });    
  }
}
