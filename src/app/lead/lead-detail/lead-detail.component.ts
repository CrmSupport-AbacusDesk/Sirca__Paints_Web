import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute , Router } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { MatDialog } from '@angular/material';
import { EditleadComponent } from 'src/app/editlead/editlead.component';
import { DialogComponent } from 'src/app/dialog.component';
import {PopupComponent} from '../../popup/popup.component';
import { LocalStorage } from 'src/app/localstorage.service';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  animations: [slideToTop()]
})
export class LeadDetailComponent implements OnInit {
  public static all_distributors:any = [];
  public static lead_id: any;
  assign_user: any={};
  login_data: any;
  lead_type_id : any ;

  view_tab: any = 'Activity';
  get_dr_activity_list:any = [];

  // tslint:disable-next-line:max-line-length
  constructor( public matDialog: MatDialog,  public route: ActivatedRoute, public serve: PearlService, public session: LocalStorage ,public router: Router , public dialog: MatDialog, public alert: DialogComponent) {


    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);

    this.route.params.subscribe( params => {
      console.log(params);
      this.lead_id = params.id;
      this.lead_type_id = params.type;
      console.log("Lead Type ID : ",this.lead_type_id);

    });
    this.leadDetail();

    this.salesUserLIst();

    this.get_branding_data();

    this.insideExecutive();

    this.get_activity_data();

    // this.get_activity_data();



    // this.get_dead_reason_list();
    // this.get_lead_status_list();


  }

  asmList: any = [];
  assignUserList: any = [];
  assignUser: any = [];

  lead_id: any;
  active: any = {};

  lead_detail: any = [];
  lead_detail1: any = [];
  sales_executive_update: any;
  loader: any;
  search: any = {};
  tmpsearch: any = {};
  tmp_userList: any = [];
  rsm: any = [];
  ass_user: any = [];
  showPortal: any;


  all_distributor: any = [];

  branding_list:any=[];

  excel_data:any=[];

  download_brand_excel_data:any=[];

  inside_executive_update: any;

  inside_sales_executive: any;

  inside_sales_list : any;

  ass_user2: any = [];

  assignInsideUserId: any = [];
  inside_sale_array: any = [];
  assignInsideUserList: any=[];

  tmp_InsideUserList: any = [];

  lead_status_listing: any = [];

  ngOnInit() {



    this.route.params.subscribe(params => {
      console.log(params);
      this.lead_detail.sales_primary_id = params.id;
      // this.franchise_id = this.db.crypto(params['id'],false);
      // this.invoiceData.franchise_id = this.db.crypto(params['id'],false);
      // this.invoiceData.order_id = this.db.crypto(params['orderId'],false);
      // console.log(this.invoiceData.order_id);
      // this.invoiceData.shipping_charges = 0;
      // this.invoiceData.extra_discount = 0;
      // this.invoiceData.apply_extra_discount = 0;
      // this.invoiceData.mode = 'None';
      // this.change_invoice_id();
      //
      // if (this.franchise_id) {
      //   this.getFranchiseList(this.franchise_id);
      // } else {
      //   this.getFranchiseList(0);
      // }
      // this.getCaegoryList();
      // if (this.invoiceData.order_id)
      // {
      //   this.getOrderItemList(this.invoiceData.order_id);
      // }

    });






  }

  toggleterritory(key, action) {
    console.log(action);
    console.log(key);

    if (action == 'open') { this.active[key] = true; }
    if (action == 'close') { this.active[key] = false; }

    console.log(this.active);
    this.salesUserLIst();

  }

  inside_search_box : any = {};

  toggleterritory2(key, action) {
    console.log(action);
    console.log(key);

    if (action == 'open') { this.inside_search_box[key] = true; }
    if (action == 'close') { this.inside_search_box[key] = false;
    }

    console.log("Inside Search Box: ",this.inside_search_box);
  }

  leadDetail() {
    this.loader = 1;

    this.serve.fetchData({'id': this.lead_id}, 'Distributors/distributor_detail').subscribe((result => {
      console.log(result);
      this.lead_detail = result['distributor_detail']['result'];
      this.assignUserList = result['distributor_detail']['result']['assign_user'];
      this.assignInsideUserList = result['distributor_detail']['result']['assign_inside_user'];
      console.log(this.assignUserList);
      setTimeout (() => {
        this.loader = '';

      }, 700);
    }));
  }


  add_branding_detail(){

    console.log("add_branding_detail method calls");

    const dialogRef = this.dialog.open(StatusModalComponent, {
        width: '10000px', data: {
            'dr_id' : this.lead_id,
            'from' : 'lead_detail_page_to_add_branding_data'
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.get_branding_data();

    });


  }



  get_branding_data(){
    console.log("get_branding_data method calls");
    this.serve.fetchData({'dr_id': this.lead_id},"Distributors/get_branding_data").subscribe((result=>{
        console.log(result);
        this.branding_list = result['branding_list'];

    }))

  }

  imageModel(image){

    //   window.open('http://phpstack-83335-1824785.cloudwaysapps.com/crm/api/uploads/branding_doc/'+image);
    window.open(image);

  }

  delete_branding_data(branding_id){
    console.log("delete_branding_data method calls ");

    this.alert.delete('Branding Data !').then((result) => {
        if(result){
            this.serve.fetchData({ "id": branding_id }, "Distributors/remove_branding_data").subscribe((result) => {
                console.log(result);
                if(result['msg'] == 'Deleted Successfully')
                {
                    this.alert.success("Selected Branding Data", "Delete");
                    this.get_branding_data();
                }
                else{
                    this.alert.error("Something Went Wrong");
                }

            })
        }
    });


  }


  exportAsXLSX(){
    console.log("download_excel method calls");
    this.excel_data = [];
    // console.log(this.data);

    this.serve.fetchData({'dr_id':this.lead_id},"Distributors/get_branding_data_excel").subscribe((result=>{
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
        this.serve.exportAsExcelFile(this.excel_data,'Brand Data SHEET');
        setTimeout (() => {

        }, 700);
    }))

  }






  getItemsList(search) {
    console.log(search);

    this.asmList = [];
    for (let i = 0; i < this.tmp_userList.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.tmp_userList[i]['name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.asmList.push(this.tmp_userList[i]);
      }
    }
    console.log(this.asmList);

  }

  // Search Filter For Assigned Inside Sales User Start Here :----

  getItemsList2(search) {
    console.log(search);

    // this.asmList = [];
    this.inside_sales_list = [];

    for (let i = 0; i < this.tmp_InsideUserList.length; i++) {
        search = search.toLowerCase();
        console.log(this.tmp_InsideUserList[i]['name']);

        this.tmpsearch = this.tmp_InsideUserList[i]['name'].toLowerCase();
        if (this.tmpsearch.includes(search)) {
            this.inside_sales_list.push(this.tmp_InsideUserList[i]);
        }
    }
    console.log("After Search Matched Inside User Data ",this.inside_sales_list);

  }

  // Search Filter For Assigned Inside Sales User End Here :----


  salesUserLIst() {
    this.serve.fetchData({'state':0}, 'User/active_sales_user_list').subscribe((result => {
      console.log(result);
      this.asmList = result['sales_user_list'];
      this.tmp_userList = this.asmList;
      console.log(this.assignUserList);


      //   for(let i=0;i<this.asmList.length;i++)
      //   {

      //     for(let j=0;j<this.assignUserList.length;j++)
      //     {
      //       if(this.asmList[i].id==this.assignUserList[j])
      //       {
      //         this.asmList[i].check=true;
      //         this.assignUser.push(this.asmList[i]);
      //         console.log(this.asmList[i].check);

      //       }
      //     }

      //   }
      //   console.log(this.assignUser);
      // }))
      console.log(this.assignUserList);

      // console.log(this.assignUserList[0]);


      for (let i = 0; i < this.asmList.length; i++) {
        console.log('in');
        console.log(this.assignUserList);

        for (let j = 0; j < this.assignUserList.length; j++) {
          console.log('in2');

          if (this.asmList[i].id == this.assignUserList[j]['sales_executive']) {
            console.log('in23');

            this.asmList[i].check = true;
            this.rsm.push(this.asmList[i].id);
            console.log(this.rsm);

          }
          console.log(this.rsm);
          this.ass_user =  this.rsm;


        }

      }
      console.log(this.assignUser);
    }));


  }

  insideExecutive() {
    this.serve.fetchData({'state':0}, 'User/inside_sales_user_list')
    .subscribe((result) => {
        console.log(result);
        this.inside_sales_list = result['inside_sales_list'];
        this.tmp_InsideUserList = result['inside_sales_list'];

        console.log(this.assignUser);

        for (let i = 0; i < this.inside_sales_list.length; i++) {
            for (let j = 0; j < this.assignInsideUserList.length; j++) {
              if (this.inside_sales_list[i].id ==  this.assignInsideUserList[j]['sales_executive']) {
                console.log('in23');
                  this.inside_sales_list[i].check = true;
                  console.log(this.inside_sales_list[i].id);
                  this.inside_sale_array.push(this.inside_sales_list[i].id);
                  console.log(this.inside_sale_array);

              }
            }

        }
        console.log(this.assignUser);
    });

  }

  editDilog(value, type) {
    console.log('hello');

    const dialogRef = this.dialog.open(EditleadComponent, {
      width: '350px',
      data: {
        value,
        type,
        id: this.lead_id
      }});
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
        this.leadDetail();


      });
    }

    editAddress(country, state, district, city, pincode, address, type) {
      console.log(country, state, district, city, pincode, address, type);
      console.log('hello');

      const dialogRef = this.dialog.open(EditleadComponent, {
        width: '750px',
        data: {
          country,
          state,
          district,
          city,
          pincode,
          address,
          type,
          id: this.lead_id
        }});
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          console.log('The dialog was closed');
          // this.userDetail();
          this.leadDetail();



        });
      }


      editContact(id, type) {
        console.log(id, type);

        const dialogRef = this.dialog.open(EditleadComponent, {
          width: '750px',
          data: {
            type,
            id
          }});
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.leadDetail();


          });
        }


        addContact(id, type) {
          const dialogRef = this.dialog.open(EditleadComponent, {
            width: '750px',
            data: {
              type,
              id
            }});
            dialogRef.afterClosed().subscribe(result => {
              console.log(result);
              console.log('The dialog was closed');
              // this.userDetail();


            });
          }


          deleteContact() {
            this.alert.delete('Lead Data !').then((result) => {
              if (result) {
                console.log('success');

                // console.log(id);
                // this.serve.fetchData({"id":id},"Distributors/distributors_delete").subscribe((result=>{
                //   console.log(result);
                //   if(result)
                //   {
                //     this.leadList();
                //   }
                // }))
              }
            });
          }

          confirm_lead(id) {
            this.alert.confirm('').then((result) => {
              if (result) {
                // console.log(type);
                this.serve.fetchData(id, 'Distributors/confirm_lead').subscribe((result => {
                  console.log(result);
                  if (this.lead_detail.type == 1) {
                    this.router.navigate(['lead-list']);
                  } else {
                    this.router.navigate(['dealer-lead-list']);

                  }
                }));
              }});
            }

            update_assigned_sales_executive(sales_executive) {
              this.sales_executive_update = sales_executive;

            }

            update_inside_sales_executive(id) {
              this.inside_executive_update = id;
            }

            update_assigned_executive(exec_id) {
              console.log(this.lead_id);
              console.log(this.ass_user);
              console.log(this.rsm);

              this.serve.fetchData({exec: this.ass_user, dr_id: this.lead_id}, 'Distributors/update_assigned_sales_executive').subscribe((result => {


                this.leadDetail();


              }));
              this.sales_executive_update = '';

            }

            update_assigned_executive2(exec_id) {

              console.log("Update Assigned Executive Method Called :")
              console.log(this.rsm1);
              console.log(this.inside_sales_list);

              console.log("Clone Inside Sales User: ",this.tmp_InsideUserList)

              this.serve.fetchData({'exec': this.rsm1, 'dr_id': this.lead_id}, 'Distributors/update_assigned_inside_sales_executive')
              .subscribe((result => {
                  console.log(result);
                  this.inside_sales_list = this.tmp_InsideUserList;
                  this.inside_sales_list.map((el) => { el.check = false; });

                  console.log("Before Inside Sale Checked :",this.inside_sales_list);

                  if (this.rsm1) {
                      for (let i = 0; i < this.rsm1.length; i++) {
                          const index_val = this.inside_sales_list.map((el) => el.id).indexOf(this.rsm1[i]);
                          console.log(index_val);

                          console.log("Check Error",this.inside_sales_list[index_val].check);

                          this.inside_sales_list[index_val].check = !this.inside_sales_list[index_val].check;
                      }
                  }
                  console.log(this.inside_sales_list);


                  this.leadDetail();
              }));
              this.inside_executive_update = '';
              // this.router.navigate(['/lead-detail/' + this.lead_id]);

          }

            update_inside_sales_team(inside_sales_team){

              this.inside_sales_executive = inside_sales_team;

          }

            product_Brand(value, index, event) {
              console.log(event);
              console.log(value);
              console.log(index);
              console.log(this.asmList);



              if (event.checked) {
                if (this.rsm.indexOf(this.asmList[index]['id']) === -1) {

                  this.rsm.push(value);
                  console.log(this.rsm);
                }
              } else {
                for ( let j = 0; j < this.asmList.length; j++) {
                  if (this.asmList[index]['id'] == this.rsm[j]) {
                    this.rsm.splice(j, 1);
                  }
                }
                console.log(this.rsm);
              }
              this.ass_user =  this.rsm;
            }

            rsm1:any=[];


          product_Brand12(value, index, event) {

              console.log("Product Brand12 Method Called");

              console.log(this.rsm1);
              console.log(this.inside_sales_list);

              if (event.checked) {
                  if (this.rsm1.indexOf(this.inside_sales_list[index]['id']) === -1) {
                      this.rsm1.push(value);
                      console.log(this.rsm1);
                  }
              } else {
                  for ( let j = 0; j < this.inside_sales_list.length; j++) {
                      if (this.inside_sales_list[index]['id'] == this.rsm1[j]) {
                          this.rsm1.splice(j, 2);
                      }
                  }
                  console.log(this.rsm1);
              }
              this.ass_user2 =  this.rsm1;
          }

            addStock(id) {
              // alert( this.lead_id);

              this.serve.fetchData({id}, 'Distributors/all_distributors').subscribe((result => {
                console.log(result);
                // this.all_distributor = result['all_distributors']['company_name'];
                // console.log(this.all_distributor);

                this.lead_detail1 = result;
                LeadDetailComponent.all_distributors = result['all_distributors'];
                //

                const dialogRef = this.matDialog.open(PopupComponent, {
                  width: '500px', data: { lead_id: this.lead_id, leaddata : this.lead_detail1.all_distributor}
                });

                dialogRef.afterClosed().subscribe(r => {
                  // if(r){
                  //   this.getFranchiseOrderList();
                  // }
                });


              }));






            }


            //  Social Media Lead TS Working Start here by Abhishek Mandal

            related_tabs(tab) {
              console.log(tab);
              this.view_tab = tab;
              console.log("View Tab : ",tab);
            }

            get_activity_data(){
              console.log("get_activity_data method calls");
              this.serve.fetchData({'dr_id': this.lead_id,'user_id':this.login_data.id,'user_type':this.login_data.user_type},"Distributors/get_dr_activity_list").subscribe((result=>{
                  console.log(result);
                  this.get_dr_activity_list = result['get_dr_activity_list'];

              }))

            }

            editLeadStatus(lead_status, dead_reason) {

              console.log(lead_status, dead_reason);
              console.log('hello');


                const dialogRef = this.matDialog.open(PopupComponent, {
                  width: '500px',
                  data: {
                    comes_from:'lead_detail_page_for_lead_status_update',
                    leadStatus:lead_status,
                    deadReason:dead_reason,
                    id: this.lead_id
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  console.log(result);
                  console.log('The dialog was closed');
                  // this.userDetail();
                  this.leadDetail();
                });

            }

            editLeadcomment(value,type) {

              console.log("hello see my lead comment",value);
              console.log('hello');


                const dialogRef = this.matDialog.open(EditleadComponent, {
                  width: '500px',
                  data: {
                    type,
                    value,
                    id: this.lead_id
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  console.log(result);
                  console.log('The dialog was closed');
                  // this.userDetail();
                  this.leadDetail();
                });

            }
            back(){
              window.history.back()
            }

          

            //  Social Media Lead TS Working End Here here by Abhishek Mandal










}
