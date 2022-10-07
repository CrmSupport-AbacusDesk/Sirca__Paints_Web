import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { LocalStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {

  leave_list:any=[];
  loader:any;
  search:any={};
  skelton:any={}
  data_not_found = false;


  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;

  login_data_2 :any;


  constructor(public serve:PearlService,public dialog:DialogComponent, public dialogs: MatDialog,public session:LocalStorage)
  {
    this.skelton = new Array(10);


    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;

    this.login_data_2 = this.assign_login_data.data;

    console.log("User Login Data :---",this.login_data_2);

    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'leaves');
    console.log(index);

    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);

  }

  ngOnInit()
  {
    this.leaveList();
    this.search = {};
  }

  openDialog(leave_id): void {

    const dialogRef = this.dialogs.open(ChangeStatusComponent, {
      width: '550px', data:{

        id : leave_id,
        reason: ''
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.leaveList();
    });
  }

  leaveList(type : any ='')
  {

    if(type == 'refresh'){
      this.search = {};
      this.leave_list = [];
    }


    if(this.search.date_created)
    {
      this.search.date_created = moment(this.search.date_created).format('YYYY-MM-DD');
    }

    this.loader=true;
    this.serve.fetchData({filter:this.search , 'user_id':this.login_data_2.id , 'user_type':this.login_data_2.user_type},"Leaves/leave_list").subscribe((result=>
    {
      this.loader=false;
      console.log(result);
      this.leave_list = result;

      console.log(this.leave_list.length);


      if(this.leave_list.length == 0)
      {
        this.data_not_found = true;
      }
      else
      {
        this.data_not_found = false;
      }
    }));
  }

}
