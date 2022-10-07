import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';

import * as moment from 'moment';
import { LocalStorage } from 'src/app/localstorage.service';
@Component({
  selector: 'app-lead-list',
  templateUrl: './dealer-lead-list.component.html',
  styleUrls: ['./dealer-lead-list.component.scss'] ,
   animations: [slideToTop()]


})
export class DealerLeadListComponent implements OnInit {
value:any={};
  lead_List:any=[];
  leadtmp:any=[];
  start:any=0;
  count:any;
  total_page:any;
  pagenumber:any;
  page_limit:any=50;
  loader:boolean=false;
  data:any=[];
  data_not_found=false;
  search_val:any={}
  skelton:any={}

  login_data: any = {};
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  download_brand_excel_data: any;
  login_data_2 :any;

  constructor(public serve:PearlService,public dialog:DialogComponent,public session: LocalStorage) {

    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data_2 = this.login_data.data;

    if(this.login_data.assignModule.length > 0){

      this.login_data = this.login_data.assignModule;
      console.log(this.login_data);
      const index = this.login_data.findIndex(row => row.module_name == 'lead dealer');
      console.log(index);

      this.login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
      this.login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
      this.login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

      console.log(this.view_add);
      console.log(this.view_edit);
      console.log(this.view_delete);

    }

    // this.login_data = this.login_data.assignModule;
    // console.log(this.login_data);
    // const index = this.login_data.findIndex(row => row.module_name == 'lead dealer');
    // console.log(index);

    // this.login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    // this.login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    // this.login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

    // console.log(this.view_add);
    // console.log(this.view_edit);
    // console.log(this.view_delete);

    this.leadList();

    this.skelton = new Array(10);
  }

  ngOnInit() {
  }

  leadList()
  {
    this.loader=true;
    if( Object.getOwnPropertyNames(this.search_val).length != 0)
    {
      this.page_limit = 0;
      this.lead_List = [];
    }
    this.serve.fetchData({'start':this.start,'pagelimit':this.page_limit,'search':this.search_val , 'user_id':this.login_data_2.id , 'user_type': this.login_data_2.user_type},"Distributors/dealer_lead_list")
    .subscribe((result=>{
      console.log(result);
      this.leadtmp =result['lead_list']['data'];
      console.log(this.lead_List);
      // this.lead_List = this.lead_List.concat(result['lead_list']['data']);
      this.lead_List = result['lead_list']['data'];

      this.count=result['lead_list']['count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      setTimeout (() => {
        this.loader=false;

    }, 700);
    if(this.lead_List.length ==0){
      this.data_not_found=true;
    }else{
      this.data_not_found=false;

    }
    }))
  }

  deleteLead(id)
  {
    console.log("hello");

    this.dialog.delete('Lead Data !').then((result) => {
      if(result)
      {console.log(id);
        this.serve.fetchData({"id":id},"Distributors/distributors_delete").subscribe((result=>{
          console.log(result);
          if(result)
          {
            this.leadList();
          }
        }))
      }})

  }
  viewLead()
  {
    console.log("lead view");

  }
  refresh()
  {
    this.start = 0;
    this.search_val = {};
    this.leadList();
  }
  excel_data:any=[];
  exportAsXLSX():void {
    for(let i=0;i<this.lead_List.length;i++){
      this.excel_data.push({'Company Name':this.lead_List[i].company_name,'Contact Person':this.lead_List[i].name,'Mobile':this.lead_List[i].mobile,'WhatsApp No.':this.lead_List[i].whatsapp_no,Email:this.lead_List[i].email,'Created By':this.lead_List[i].created_name,'Created By Type':this.lead_List[i].created_by_type,'Converted On':this.lead_List[i].lead_converted_on,'Investment Amount':this.lead_List[i].investment_amount,'name':this.lead_List[i].name,'Lead Type':this.lead_List[i].lead_type,'Total Activity Count':this.lead_List[i].total_activity_count,'Assigned To':this.lead_List[i].assigned_to, 'Address ':this.lead_List[i].address,'State ':this.lead_List[i].state,'District ':this.lead_List[i].district,'City ':this.lead_List[i].city,'Pincode ':this.lead_List[i].pincode,'Assigned Sales User':this.lead_List[i].assigned_to,'Comment':this.lead_List[i].comment});
    }
    this.serve.exportAsExcelFile(this.excel_data, 'DEALER LEAD SHEET');
  }
  tmpsearch1:any={};

  getItemsList(index,search)
  {
    console.log(search);
    this.lead_List=[];


    if(index=='created_by'){
      for(var i=0;i<this.leadtmp.length; i++)
      {
        search=search.toLowerCase();
        this.tmpsearch1=this.leadtmp[i]['created_name']['name'].toLowerCase();
        if(this.tmpsearch1.includes(search))
        {
      // console.log(this.orderlist);
    console.log(search);


          this.lead_List.push(this.leadtmp[i]);
        }

      }
    }
    if(index!='created_by'){
      for(var i=0;i<this.leadtmp.length; i++)
      {
        search=search.toLowerCase();
        if(this.leadtmp[i][index]!=null){
        this.tmpsearch1=this.leadtmp[i][index].toLowerCase();

        }
        if(this.leadtmp[i][index]==null){
          this.tmpsearch1='';

          }
        if(this.tmpsearch1.includes(search))
        {
      // console.log(this.orderlist);
      console.log(search);

          this.lead_List.push(this.leadtmp[i]);
        }

      }
    }


    console.log(this.lead_List);

  }
  public onDate(event): void
  {
    this.search_val.date_created=moment(event.value).format('YYYY-MM-DD');
    this.leadList();
  }


  download_all_branding(){

    console.log("download_all_branding method calls");

    this.excel_data = [];
    console.log(this.data);

    this.serve.fetchData({'search':this.search_val,'type':3,'lead_type':'Lead','user_id':this.login_data_2.id , 'user_type': this.login_data_2.user_type},"Distributors/get_all_branding_data_excel").subscribe((result=>{
        console.log(result);
        this.download_brand_excel_data = result['branding_list'];
        console.log(this.download_brand_excel_data);

        for(let i=0;i<this.download_brand_excel_data.length;i++){

            let keys_value : any = [];
            keys_value = Object.keys(this.download_brand_excel_data[i])

            let excel_object: any = {}

            for(let secondary_index=0;secondary_index<keys_value.length;secondary_index++){
                excel_object[keys_value[secondary_index]]=this.download_brand_excel_data[i][keys_value[secondary_index]]
            }

            this.excel_data.push(excel_object)

        }
        console.log(this.excel_data);
        this.serve.exportAsExcelFile(this.excel_data,'All Brand Data SHEET');
        setTimeout (() => {

        }, 700);
    }))


  }


}
