import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PearlService } from 'src/app/pearl.service';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit {
  login_user : any;
  login_id : any;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:PearlService) 
  {
  console.log(this.data);
  this.login_user = JSON.parse(sessionStorage.getItem('login'));
    
  this.login_id = parseInt(this.login_user['data']['id']);
  }

  ngOnInit() 
  {
  }

  changeStatus()
  {
  
    this.serve.fetchData({'reason':this.data.reason,'status':this.data.status,'id':this.data.id,'updated_by':this.login_id},"Leaves/statusChange").subscribe((result=>{
      console.log(result);
    }))
    this.dialog.closeAll();

  }

}
