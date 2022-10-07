import { Component, OnInit, Inject } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-dis-otp-varification',
  templateUrl: './dis-otp-varification.component.html',
  styleUrls: ['./dis-otp-varification.component.scss']
})
export class DisOtpVarificationComponent implements OnInit {
    dynamic_no :any=0;
  constructor(public serve: PearlService, public rout: Router, @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public alert: DialogComponent) {
    console.log(data);
    this.dynamic_no_require();
  }

  ngOnInit() {
  }
  form: any = {}
  convert() {
    this.form.submitted = true;
    console.log(this.form);

    // this.form.otpCheckIsCorrect=true
    // this.form.otpEnteredotpEntered=true
    // this.form.maxlength=true
    setTimeout(() => {
      if (!this.form.otp) {
        // alert(1)
        this.form.otpEntered = false
        return;

      }
      if (this.form.otp.length != 6) {
        // alert(2)

        this.form.maxlength = false
        return;

      }
      if (this.data.otp != this.form.otp) {
        // alert(3)

        this.form.otpCheckIsCorrect = false
        return;
      }
      console.log(this.data);

      this.serve.fetchData({ type: this.data.type, dr_id: this.data.id }, "Category_master/dr_type_update").subscribe((result => {
        console.log(result);
        this.dialog.closeAll();

        if (this.data.type == 1) {
          this.rout.navigate(['/distribution-list']);
        }
        if (this.data.type == 7) {
          this.rout.navigate(['/direct-dealer']);

        }
        if (this.data.type == 3) {
          this.rout.navigate(['/dealer']);

        }


      }))
    }, 200);
  }
  delete_area_row() {
    console.log("delete method calls");
    console.log(this.form);

    this.form.submitted = true;
    setTimeout(() => {

      if (!this.form.otp) {
        this.form.otpEntered = false;
        return;
      }
      if (this.form.otp.length != 6) {
        this.form.maxlength = false;
        return;
      }
      if (this.data.otp != this.form.otp) {
        this.form.otpCheckIsCorrect = false;
        return;
      }
      console.log(this.data);
      this.serve.fetchData({ "id": this.data.id }, "User/area_target_excel_delete").subscribe((result => {
        console.log(result);
        this.dialog.closeAll();

        if (result['msg'] == 'Successfully Deleted') {
          this.alert.success("Target", "Delete");
        }
        else {
          this.alert.error("Something Went Wrong");
        }
      }));
    }, 200);

  }

    dynamic_no_require(){
      this.serve.fetchData({},'Distributors/send_otp_number').subscribe((result)=>{
        console.log(result);
        this.dynamic_no = result;
      });
    }
}
