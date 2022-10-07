import { Component, OnInit } from '@angular/core';
import { Console, log } from 'console';
import { DialogComponent } from '../dialog.component';
import { LocalStorage } from '../localstorage.service';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-allowance-master',
  templateUrl: './allowance-master.component.html',
  styleUrls: ['./allowance-master.component.scss']
})
export class AllowanceMasterComponent implements OnInit {
  sales_user_list: any;
  loader:any
  allowanceData: any = [];
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  search_val:any={};
  view_delete : boolean = true;
  
  constructor(public serve:PearlService,public dialog: DialogComponent,public session:LocalStorage) { 
    

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'allowance master');
    console.log(index);
    
    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
     
    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);

    this.get_sales_user();
    
  }
  
  ngOnInit() {
  }
  
  get_sales_user()
  {
    this.loader = 1;
    console.log("get_sales_user method calls");
    this.serve.fetchData({'username':this.search_val.name},"Allowance/sales_type").subscribe((result=>{
      console.log(result);
      this.sales_user_list=result['sales'];
      this.salesuserLits=result['sales']
      console.log(this.sales_user_list);
    }))
    
    this.get_allowance_data();
  }
  salesuserLits:any=[]
  // filter_name(){
  //   console.log("filter name method calls");
  //   console.log();
    
  //   let search = this.search_val.name.toUpperCase();
  //   console.log(search);
    
  //   for (let i = 0; i < this.sales_user_list.length; i++) {
  //   // console.log(this.sales_user_list[i].user_name)
  //     let username=this.sales_user_list[i].user_name.toUpperCase();
  //     console.log(username);
  //     if(username.indexOf(search) > -1){
  //       this.sales_user_list=[];
  //       console.log("work if");
  //       this.sales_user_list.push(this.sales_user_list[i]);
  //       console.log(this.sales_user_list);
  //     }else{
  //       console.log("not work if");
        
  //     }
  //   } 


  // }
  tmp_search:any={}
filter_name(search){
  console.log("filter name work method calls");
    // console.log(search);
    
   let searchname=search.toUpperCase();
   this.sales_user_list=[];

  
   console.log(searchname);
   if(search != ""){
     for (let i = 0; i < this.salesuserLits.length; i++) {
      console.log("for loop work");
      console.log(this.salesuserLits[i].user_name);
      let username=this.salesuserLits[i].user_name.toUpperCase();
          console.log(username);
      this.tmp_search =this.sales_user_list[i];
          
          if(username.includes(searchname) ){
            console.log("if works");
            
            this.sales_user_list.push(this.salesuserLits[i])
            console.log(this.sales_user_list);
          }else if(search == " " || this.search_val.name == ''){
            console.log("if not works");
            
            this.get_sales_user()
          }
       
     }
   }
}
  get_allowance_data(){
    console.log("get_allowance_data method calls");
    this.serve.fetchData({},"Allowance/getAllowanceData").subscribe((result=>{
      console.log(result);
      console.log(result);
      this.allowanceData = result['allowance'];
      console.log(this.allowanceData);  
      this.loader = '';
      this.loader=1;
      setTimeout(() => {
        for(var i=0; i<this.sales_user_list.length; i++)
        {
          const index = this.allowanceData.findIndex(row => ((row.user_id).toString()) == this.sales_user_list[i].user_id);
          if(index != -1){
            console.log(this.sales_user_list[i]['user_id'] , this.allowanceData[index]['user_id']);
            this.sales_user_list[i]['id'] = this.allowanceData[index]['id'];
            this.sales_user_list[i]['flight'] = this.allowanceData[index]['flight'];
            this.sales_user_list[i]['trainSleeperClass'] = this.allowanceData[index]['trainSC'];
            this.sales_user_list[i]['train3Tier'] = this.allowanceData[index]['train3Tier'];
            this.sales_user_list[i]['train2Tier'] = this.allowanceData[index]['train2Tier'];
            this.sales_user_list[i]['busAC'] = this.allowanceData[index]['busAC'];
            this.sales_user_list[i]['busNonAC'] = this.allowanceData[index]['busNonAC'];
            this.sales_user_list[i]['auto'] = this.allowanceData[index]['auto'];
            this.sales_user_list[i]['taxi'] = this.allowanceData[index]['taxi'];
            this.sales_user_list[i]['car'] = this.allowanceData[index]['car'];
            this.sales_user_list[i]['bike'] = this.allowanceData[index]['bike'];
            this.sales_user_list[i]['hotel'] = this.allowanceData[index]['hotel'];
            this.sales_user_list[i]['food'] = this.allowanceData[index]['food'];
          }
          else{
            console.log("in else");
            console.log(index);
          }
          
        }
        this.loader='';
      }, 2000);

      console.log(this.sales_user_list);
      
    }))
  }
  
  updateAllowance(){
    console.log("updateAllowance method calls");
    console.log(this.sales_user_list);
    
    this.dialog.confirm("You Want Change ?").then((result)=>{
      if(result){
        this.serve.fetchData({'data':this.sales_user_list},"Allowance/update_allowance").subscribe((result=>{
          console.log(result);
          if(result ['allowance'] == 'success'){
            this.dialog.success("Allowance", "Update");
          }
          else{
            this.dialog.error("Something Went Wrong");
          }
          
        }));
      }else{
        this.get_sales_user();
        this.dialog.success("Allowance","Data Is Safe..")
      }
    })

  
    
  }
  
}
