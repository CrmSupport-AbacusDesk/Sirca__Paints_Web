import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-add-pop-n-gift',
  templateUrl: './add-pop-n-gift.component.html',
  styleUrls: ['./add-pop-n-gift.component.scss']
})
export class AddPopNGiftComponent implements OnInit {
  
  formData=new FormData();
  data:any={};
  selectedFile: any = [];
  urls: any = [];
  loader:any;
  login_user : any;
  login_id : any;
  pop_id: any;
  
  
  constructor(public serve:PearlService,public dialog:DialogComponent,public rout: Router,public route: ActivatedRoute) {
    console.log("add pop n gift calls");
    
    this.route.params.subscribe(params => {
      console.log(params);
      this.pop_id = params.id;
      console.log(this.pop_id);
      if(this.pop_id != '0'){
        console.log("in params if");
        this.edit_detail();
      }
      else{
        console.log("in params else");
      }
    });
    
    this.login_user = JSON.parse(sessionStorage.getItem('login'));
    
    this.login_id = parseInt(this.login_user['data']['id']);
    this.login_user = this.login_user['data']['name'];
    console.log(this.login_user);
    
    console.log(this.login_id);
  }
  
  ngOnInit() {
  }
  
  back() {
    window.history.go(-1);
  }
  
  insertImage(event) {
    console.log(event);
    
    let files = event.target.files;
    console.log(files)
    if (files) {
      console.log("in if");
      for (let file of files) {
        console.log("in for");
        let reader = new FileReader();
        
        reader.onload = (e: any) => {
          console.log(e);
          
          this.urls.push(e.target.result);
          console.log(this.urls);
          for (var i = 0; i < this.urls.length; i++) {
            this.selectedFile = (this.urls[i]);
          }
          console.log(this.selectedFile);
          
        }
        reader.readAsDataURL(file);
      }
    }
    console.log(this.urls);
    
    
    
  }
  
  delete_img(index: any) {
    this.urls.splice(index, 1)
    this.selectedFile=[];
    
  }
  
  submitPopNGift(){
    
    this.loader=1;
    console.log(this.data);
    console.log(this.selectedFile);
    console.log(this.login_id);
    console.log(this.login_user);
    
    if(this.pop_id == 0){
      console.log("in Pop Gift Add");
      this.serve.fetchData({'created_by': this.login_id,'created_by_name': this.login_user,'image': this.selectedFile,'gift_description': this.data.gift_description,'gift_name': this.data.gift_name,'gift_points': this.data.gift_points,'u_o_m': this.data.u_o_m},"Product/pop_master").subscribe((result=>{
        console.log(result);
        if(result == 'Success')
        {
          this.dialog.success("POP Gift", "Added");
          window.history.go(-1);
        }
        else{
          this.dialog.error("Something Went Wrong");
        }
      }))
      
      setTimeout (() => {
        this.loader='';
      }, 700);
      
    }
    
    else if(this.pop_id != 0){
      console.log("in Pop Gift Update");
      this.serve.fetchData({'id': this.pop_id,'created_by': this.login_id,'created_by_name': this.login_user,'image': this.selectedFile,'gift_description': this.data.gift_description,'gift_name': this.data.gift_name,'gift_points': this.data.gift_points,'u_o_m': this.data.u_o_m},"Product/pop_master_edit").subscribe((result=>{
        console.log(result);
        if(result == 'Success')
        {
          this.dialog.success("POP Gift", "Update");
          window.history.go(-1);
        }
        else{
          this.dialog.error("Something Went Wrong");
        }
      }))
      
      setTimeout (() => {
        this.loader='';
      }, 700); 
    }

    else{
      this.dialog.error("Something Went Wrong");
    }
  }
  
  edit_detail() {
    this.serve.fetchData({ "id": this.pop_id }, "Product/pop_master_detail").subscribe((result => {
      console.log(result);
      this.data = result;
      this.urls.push(result['image']);
      console.log(this.urls);
      this.selectedFile = (this.urls[0]);
      console.log(this.selectedFile);
      
      
      
    }))
  }
  
  
}
