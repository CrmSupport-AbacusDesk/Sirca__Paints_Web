import { Component, OnInit, Renderer2 } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { UserEmailModalComponent } from 'src/app/user/user-email-modal/user-email-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { DistributionEditComponent } from '../distribution-edit/distribution-edit.component';
import { LocalStorage } from 'src/app/localstorage.service';
import { AddPrimaryOrderValueComponent } from '../add-primary-order-value/add-primary-order-value.component';
import { DialogComponent } from 'src/app/dialog.component';
import { DistributionLegderModelComponent } from '../distribution-legder-model/distribution-legder-model.component';
import { DrDiscountComponent } from '../dr-discount/dr-discount.component';
import { DisOtpVarificationComponent } from '../dis-otp-varification/dis-otp-varification.component';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { DisExecutiveModelComponent } from '../dis-executive-model/dis-executive-model.component';
import { listener } from '@angular/core/src/render3';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';

@Component({
    selector: 'app-distribution-detail',
    templateUrl: './distribution-detail.component.html',
    animations: [slideToTop()]

})
export class DistributionDetailComponent implements OnInit {

    area_target_list:any={};
    public lineChartLabels: Label = [];
    public lineChartData: ChartDataSets[] = [];
    public lineChartType: ChartType = 'line';
    public lineChartLegend = true;
    brand_list1: any = [];
    skelton: any = new Array(10);
    temp_order: any = [];
    brand_list: any = [];
    dr_id: any = '';
    dr_detail: any;
    dr_detail_type: any = "";
    asmList: any = [];
    assignUserList: any = [];
    assignDelaerList: any = [];
    assignUser: any = [];
    assignUserId: any = [];
    userDiscountList = [];
    active: any = {};
    loader: any;
    order_data: any = [];
    login_data: any = {};
    primary_ord_data: any = [];
    order_type: any = 0;
    ledger_data: any = [];
    assignedDealers: any = [];
    orderTabActive: any = {
        'active': 'Pending',
    };
    count: any = [];
    orderdata: any = [];
    dashboardCounts: any = {};
    today_date: any;
    search_val:any={};
    temp_disc: any = {};
    temp_checkin: any = {};

    deal_list: any = [];

    assign_brand: any = [];
    totalOrders: any = {};
    orderTabCounters: any = {};
    dealersCount: any;
    tmp_userList: any = [];
    search: any = {};
    tmpsearch: any = {};
    data:any={};
    total_pending_balance:any=0;
    total_billing_receive_amount:any=0;
    total_billing_amount:any=0;
    total_payment:any=0;
    search2: any = {};
    tmpsearch2: any = {};
    sales_executive_update: any;

    temp_dis: any;
    disc_edit: any = false;
    list: any = {};
    view_tab: any = 'profile';
    view_order: any = 'primary';
    show_tab_branding_detail :any = 'Distributor';


    search3: any = {};
    tmpsearch3: any = {};
    search4: any = {};
    tmpsearch4: any = {};
    tmpsearch5: any = {};
    tmpsearch6: any = {};
    rsm: any = [];
    ass_user: any = [];

    primary_sale: any=[];

    assign_dealer: any = [];


    brand1: any = [];
    assignedExecutives: any = [];
    assign_area_list: any;

    dr_detail1: any=[];
    previous_data_list:any=[];

    billingTabActive: any = {
        active : 'Billing',
    };

    billing_list:any=[];
    payment_list: any=[];
    limit_vs_outstanding_vs_overdue_data : any = {};
    outstanding_and_overdue_days_interval : any = [];

    login:any={};
    branding_data:any={};
    branding_list:any=[];

    excel_data:any=[]
    download_brand_excel_data:any=[]

    get_dr_activity_list: any = [];


    // Pie Chart Code
    // Pie
    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'top',
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex];
                    return label;
                },
            },
        }
    };
    public pieChartLabels: Label[] = [];
    public pieChartData: number[] = [];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartColors = [
        {
            backgroundColor: ['rgba(242, 192, 16, 0.9)', 'rgba(231, 64, 51, 0.9)','rgba(220, 100, 21, 0.9)','rgba(140, 10, 20, 0.9)','rgba(150, 30, 10, 0.9)'],
        },
    ];
    dealers_filter: any ={};

    inside_executive_update: any;

    inside_sales_executive: any;

    inside_sales_list : any;

    ass_user2: any = [];

    assignInsideUserId: any = [];
    inside_sale_array: any=[];
    assignInsideUserList: any=[];
    dealer_channel_partner :any =[];
    tmp_InsideUserList: any = [];


    constructor(public route: ActivatedRoute, public rout: Router, public toast: ToastrManager, public serve: PearlService, public alert: DialogComponent, public dialog: MatDialog, public session: LocalStorage, public renderer: Renderer2, public alrt: DialogComponent) {


        this.login_data = this.session.getSession();
        this.login_data = this.login_data.value;
        this.login_data = this.login_data.data;
        console.log("User Login Data : ",this.login_data);

        this.route.params.subscribe( params => {
            console.log(params);
            this.dr_id = params.id;
            console.log(this.dr_id);

            this.serve.distributor_detail_primary_selected_tab != '' ? this.view_tab = this.serve.distributor_detail_primary_selected_tab : this.serve.distributor_detail_primary_selected_tab = this.view_tab;
            this.serve.distributor_detail_secondary_selected_tab != '' ? this.orderTabActive.active = this.serve.distributor_detail_secondary_selected_tab : this.serve.distributor_detail_secondary_selected_tab = this.orderTabActive.active;
            this.serve.distributor_detail_primary_selected_tab != ''? this.getOrders(this.view_tab,this.orderTabActive.active) : '';

            this.get_area_target()
        });

        this.retailerDetail();

        this.ledger_list();
        // this.salesUserLIst();
        // this.count_data();
        this.dashboard();
        // this.insideExecutive();

        this.today_date = moment(new Date()).format('MMM - Y');
        // this.dealer_list()
        this.session.getSession()
        .subscribe(resp => {
            console.log(resp);
            this.login_data = resp.data;
            console.log(this.login_data);

            if (this.login_data.type == '1' && this.login_data.lead_type == 'Dr' ) {
                this.renderer.addClass(document.body, 'chanel-patner');
            } else {
                this.renderer.removeClass(document.body, 'chanel-patner');
            }
        });

        this.get_primary_ord();
        this.limit_vs_outstanding_vs_overdue_method();
        this.outstanding_and_overdue_days_interval_method();
        // this.get_branding_data();

        console.log("Check login_data view dashboard",this.login_data.view_dashboard);

    }



    public lineChartOptions: ChartOptions = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{}] },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
            }
        }
    };



    dashboard()
    {
        this.serve.fetchData({'login_data':this.login_data},"Order/dashboard_order").subscribe((result=>{
            console.log(result);
            this.orderdata=result;
            this.order_data.cat=this.orderdata.cat.slice(1,2,3,4,5,6,7,8,9);
            console.log( this.order_data.cat);
            this.order_data.amount=this.orderdata.amount.slice(1,2,3,4,5,6,7,8,9);
            this.lineChartLabels = this.orderdata.cat;
            this.lineChartType = 'line';
            this.lineChartLegend = true;
            this.lineChartData = [{ data: this.orderdata.amount, label: 'Order Value' },];
        }));
    }

    ngOnInit() {

        this.login= JSON.parse(sessionStorage.getItem('login'));
        console.log(this.login.data.id);                // login user ID

    }
    // active:any = {};
    toggleterritory(key, action) {
        console.log(action);
        console.log(key);

        if (action == 'open') { this.active[key] = true; }
        if (action == 'close') { this.active[key] = false;
        }

        console.log(this.active);
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


    dealer_list() {
        this.loader = true;
        this.serve.fetchData({}, 'Distributors/get_assign_dealer')
        .subscribe(resp => {
            console.log(resp);
            this.deal_list = resp['dealer_list'];

            this.deal_list.map(resp => {
                this.assignDelaerList.map(row => {

                    if (row.dealer_id == resp.id) {
                        console.log(resp.id);
                        console.log(row.dealer_id);
                        resp.check = true;
                        this.assign_dealer.push({'id': resp.id, 'company_name': resp.company_name});
                    }
                });
            });
            this.loader = false;
            console.log(this.deal_list);
            console.log(this.assign_dealer);
        });
    }

    scrollHandler(eve) {
        console.log(eve);
        console.log('called');

    }

    verify() {
        this.serve.fetchData({'dr_id': this.dr_id}, 'Distributors/verify_dealer')
        .subscribe(resp => {
            console.log(resp);
            if(resp['verify_dealer'] == 1){
                this.toast.successToastr('Dealer Verified');
            }
            else if(resp['verify_dealer'] == 0){
                this.toast.successToastr('Dealer Unverified');
            }
            else{
                this.toast.errorToastr("Something Went Wrong. Please Try Again");
            }
            this.retailerDetail();
        });
    }

    getOrders(type, status) {
        this.serve.distributor_detail_secondary_selected_tab = this.orderTabActive.active;
        console.log(this.search4);

        let orderType;
        if (type == 'pOrder') {
            orderType = 'Primary';
        } else {
            orderType = 'Secondary';
        }
        this.orderTabActive.active = status ;
        this.loader = true;

        const data = {'id': this.dr_id, 'type': orderType, 'status': status, 'search': this.search4};
        this.serve.fetchData(data, 'Distributors/getOrders')
        .subscribe((result) => {
            console.log(result);
            this.order_data = result['data'];
            this.totalOrders = result['count'];
            this.orderTabCounters = result['tabCounters'];
            console.log(this.order_data);

            setTimeout (() => {
                this.loader = false;

            }, 700);

        });
    }

    retailerDetail() {
        this.loader = true;

        const id = {'id': this.dr_id};
        this.serve.fetchData(id, 'Distributors/distributor_detail')
        .subscribe((result) => {
            console.log(result);
            this.dr_detail = result['distributor_detail']['result'];
            this.dr_detail_type = result['distributor_detail']['result'].type;
            console.log(this.dr_detail_type);
            
            this.temp_order = this.order_data;
            this.assignUserList = result['distributor_detail']['result']['assign_user'];
            this.assignDelaerList = result['distributor_detail']['result']['assign_dealer'];
            this.assign_brand = result['distributor_detail']['result']['brand'];
            this.assignInsideUserList = result['distributor_detail']['result']['assign_inside_user'];
            this.dealer_channel_partner = result['distributor_detail']['result']['dealer_channel_partner'];
            
            // this.dr_detail1= result['distributor_detail']['result']['primary_sale'];


            this.dealersCount = result['distributor_detail']['dealersCount'];
            this.assignUserId = this.assignUserList;
            this.assignInsideUserId = this.assignInsideUserList;
            this.temp_disc = this.dr_detail.discount_data;
            this.temp_checkin = this.dr_detail.checkin;
            // this.dr1_detail=result['distributor_detail']['secondary_sale'];
            console.log(this.dr_detail);

            this.getBrandList();

            this.salesUserLIst();
            this.dealer_list();
            this.discountList();
            
            this.insideExecutive();
            this.get_branding_data();

            setTimeout (() => {
                this.loader = false;

            }, 700);

        });
    }

    salesUserLIst() {

      console.log("Sales User List Method Called:");

        this.serve.fetchData({'state':0}, 'User/active_sales_user_list')
        .subscribe((result) => {
            console.log(result);
            this.asmList = result['sales_user_list'];
            this.tmp_userList = result['sales_user_list'];

            console.log(this.assignUser);

            for (let i = 0; i < this.asmList.length; i++) {
                for (let j = 0; j < this.assignUserList.length; j++) {
                    if (this.asmList[i].id == this.assignUserList[j]['sales_executive']) {
                        this.asmList[i].check = true;
                        this.rsm.push(this.asmList[i].id);
                        console.log(this.rsm);

                    }
                }

            }
            console.log(this.assignUser);
        });

    }

    insideExecutive() {
      this.serve.fetchData({'state':0}, 'User/inside_sales_user_list')
      .subscribe((result) => {
          console.log(result);
          this.inside_sales_list = result['inside_sales_list'];
          this.tmp_InsideUserList = result['inside_sales_list'];

          // console.log(this.assignUser);

          for (let i = 0; i < this.inside_sales_list.length; i++) {
            console.log('in');
            console.log(this.assignInsideUserList);
              for (let j = 0; j < this.assignInsideUserList.length; j++) {
                console.log('in2');
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


    assign_to_distributor(id, index, e) {

        if (e.checked) {
            this.assignUserId.push(id);
            console.log(this.assignUserId);
            this.assignUser.push(this.asmList[index]);
            console.log(this.assignUserId);
            const value = {'dr_id': this.dr_id, 'data': this.assignUserId};
            console.log(value);

            this.serve.fetchData(value, 'Distributors/user_assign')
            .subscribe((response) => {
                console.log(response);

            });
        } else {
            console.log(this.asmList);
            console.log(index);
            const index_val = index;

            for ( let j = 0; j < this.assignUserId.length; j++) {
                if (this.asmList[index].id == this.assignUserId[j]) {
                    this.assignUserId.splice(j, 1);
                }

            }
            console.log(this.assignUserId);
            const value = {'dr_id': this.dr_id, 'data': this.assignUserId};
            console.log(value);
            this.serve.fetchData({'dr_id': this.dr_id, 'data': this.assignUserId}, 'Distributors/user_assign')
            .subscribe((response => {
                console.log(response);

            }));
        }

    }

    removeUser(index) {
        this.assignUser.splice(index, 1);
        this.assignUserId.splice(index, 1);
    }

    discountList() {
        this.serve.fetchData(0, 'Discount/discount_list').subscribe((result => {
            console.log(result['Discount_list']['discount_list']);
            this.userDiscountList = result['Discount_list']['discount_list'];
        }));
    }

    editDialog(value1, value2, type) {

        console.log(value1, value2, type);

        const dialogRef = this.dialog.open(UserEmailModalComponent, {
            width: '450px',
            data: {
                id: this.dr_id,
                value1,
                value2,
                type
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.retailerDetail();

        });
    }

    getItemsList(search) {
        console.log(search);

        this.asmList = [];
        for (let i = 0; i < this.tmp_userList.length; i++) {
            search = search.toLowerCase();
            console.log(this.tmp_userList[i]['name']);

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

    getItemsdisc(search) {
        console.log(search);

        this.dr_detail.discount_data = [];
        for (let i = 0; i < this.temp_disc.length; i++) {
            search = search.toLowerCase();
            this.tmpsearch2 = this.temp_disc[i]['category'].toLowerCase();
            if (this.tmpsearch2.includes(search)) {
                this.dr_detail.discount_data.push(this.temp_disc[i]);
            }
        }
        console.log(this.dr_detail.discount_data);

    }

    editAddress(country, state, district, city, pincode, address, type) {
        console.log(country, state, district, city, pincode, address, type);
        console.log(this.dr_id);

        const dialogRef = this.dialog.open(DistributionEditComponent, {
            width: '768px',
            data: {
                country,
                state,
                district,
                city,
                pincode,
                address,
                type,
                id: this.dr_id
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            console.log('The dialog was closed');
            this.retailerDetail();


        });
    }


    MobileNumber(event: any) {
        console.log(event);

        const pattern = /[0-9\+\-\.\ ]/;
        const inputChar = String.fromCharCode(event.charCode);
        if ( !pattern.test(inputChar)) {event.preventDefault(); }
    }

    edit_dr_detail(company_name, mobile, email, gst, landline, name, dob, doa, password, type, target, opening_balance, Whatsapp, username) {
        const dialogRef = this.dialog.open(DistributionEditComponent, {
            width: '750px',
            data: {
                company_name,
                mobile,
                email,
                gst,
                landline,
                name,
                dob,
                doa,
                password,
                username,
                type,
                id: this.dr_id,
                target,
                opening_balance,
                ledger_length: this.ledger_data.length,
                Whatsapp
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.retailerDetail();
            this.ledger_list();
        });
    }

    add_order_value() {
        console.log(this.dr_id);

        const dialogRef = this.dialog.open(AddPrimaryOrderValueComponent, {
            width: '750px',
            data: { id: this.dr_id }
        });

        dialogRef.afterClosed()
        .subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.get_primary_ord();
        });
    }

    get_primary_ord() {
        this.loader = 1;
        this.serve.fetchData({'dr_id': this.dr_id}, 'Distributors/get_primary_ord')
        .subscribe((result) => {
            console.log(result);
            this.loader = '';
            if (result) {
                this.primary_ord_data = result['get_primary_ord'];
            }
        });
    }


    get_area_target(){
        this.serve.fetchData({'dr_id': this.dr_id},"User/dr_target_achievement").subscribe((result=>{
            console.log(result);
            this.area_target_list=result['area_target_and_achievement_list'];
            this.assign_area_list=result['dr_assign_area_detail'];
            console.log(this.area_target_list);

            this.previous_data_list=result['history'];
            console.log(this.previous_data_list);

        }))
    }

    editDiscount() {
        const dialogRef = this.dialog.open(UserEmailModalComponent, {
            width: '520px',
            data: {
                id: this.dr_id,
                'dealer_discount': this.dr_detail.dealer_discount,
                type: 'DealerDiscountEdit'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.retailerDetail();
        });
    }

    update_assigned_sales_executive(sales_executive) {
        this.sales_executive_update = sales_executive;
    }

    update_inside_sales_executive(id) {
        this.inside_executive_update = id;
    }

    update_assigned_executive(exec_id) {
        console.log(this.rsm);
        console.log(this.asmList);

        this.serve.fetchData({'exec': this.rsm, 'dr_id': this.dr_id}, 'Distributors/update_assigned_sales_executive')
        .subscribe((result => {
            console.log(result);
            this.asmList = this.tmp_userList;
            this.asmList.map((el) => { el.check = false; });

            if (this.rsm) {
                for (let i = 0; i < this.rsm.length; i++) {
                    const index_val = this.asmList.map((el) => el.id).indexOf(this.rsm[i]);
                    console.log(index_val);

                    this.asmList[index_val].check = !this.asmList[index_val].check;
                }
            }
            console.log(this.asmList);


            this.retailerDetail();
        }));
        this.sales_executive_update = '';
        this.rout.navigate(['/distribution-detail/' + this.dr_id]);

    }

    update_assigned_executive2(exec_id) {

        console.log("Update Assigned Executive Method Called :")
        console.log(this.rsm1);
        console.log(this.inside_sales_list);

        console.log("Clone Inside Sales User: ",this.tmp_InsideUserList)

        this.serve.fetchData({'exec': this.rsm1, 'dr_id': this.dr_id}, 'Distributors/update_assigned_inside_sales_executive')
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


            this.retailerDetail();
        }));
        this.inside_executive_update = '';
        this.rout.navigate(['/distribution-detail/' + this.dr_id]);

    }

    discountedit(dr_id, discount) {
        console.log(dr_id);
        this.temp_dis = discount;
    }

    update_inside_sales_team(inside_sales_team){

        this.inside_sales_executive = inside_sales_team;

    }


    edit_discount(i) {
        console.log(i);
        this.active[i] = Object.assign({'discount': '1'});
        console.log(this.active[i]);

    }

    update_discount(category, id, discount) {
        console.log(category, id, discount);
        this.serve.fetchData({'id': this.dr_id, 'category': category, 'dis': discount,'updated_by':this.login.data.id}, 'Distributors/update_discount')
        .subscribe((response => {
            console.log(response);
            this.active = {};
            this.retailerDetail();
        }));
    }

    related_tabs(tab) {
        console.log(tab);
        this.view_tab = tab;
        // this.show_tab_branding_detail = tab;
        this.serve.distributor_detail_primary_selected_tab = this.view_tab

    }

    order_filter(type) {
        this.view_order = type;
        if (type == 'primary') {
            this.order_data = this.dr_detail['primary_order'];
            this.temp_order = this.order_data;
            console.log(type);

        }
        if (type == 'secondary') {
            console.log(type);

            this.order_data = this.dr_detail['secondary_order'];
            this.temp_order = this.order_data;
        }
    }

    getItemscheckin(search) {
        console.log(search);

        this.dr_detail.checkin = [];
        for (let i = 0; i < this.temp_checkin.length; i++) {
            search = search.toLowerCase();
            this.tmpsearch3 = this.temp_checkin[i]['exec_name'].toLowerCase();
            if (this.tmpsearch3.includes(search)) {
                this.dr_detail.checkin.push(this.temp_checkin[i]);
            }
        }
        console.log(this.dr_detail.checkin);

    }

    getItemsorder(search) {
        console.log(search);

        this.order_data = [];
        for (let i = 0; i < this.temp_order.length; i++) {
            search = search.toLowerCase();
            this.tmpsearch4 = this.temp_order[i]['id'].toLowerCase();
            if (this.tmpsearch4.includes(search)) {
                this.order_data.push(this.temp_order[i]);
            }
        }
        console.log(this.order_data);

    }

    getItemsorder1(search) {
        console.log(search);

        this.order_data = [];
        for (let i = 0; i < this.temp_order.length; i++) {
            search = search.toLowerCase();
            this.tmpsearch5 = this.temp_order[i]['company_name'].toLowerCase();
            if (this.tmpsearch5.includes(search)) {
                this.order_data.push(this.temp_order[i]);
            }
        }
        console.log(this.order_data);

    }

    getItemsorder2(search) {
        console.log(search);

        this.order_data = [];
        for (let i = 0; i < this.temp_order.length; i++) {
            search = search.toLowerCase();
            this.tmpsearch6 = this.temp_order[i]['created_by_name'].toLowerCase();
            if (this.tmpsearch6.includes(search)) {
                this.order_data.push(this.temp_order[i]);
            }
        }
        console.log(this.order_data);

    }

    product_Brandassign(value, index, event) {
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

    // ass_user:any=[];
    product_Brand(value, index, event) {
        console.log(this.rsm);
        console.log(this.asmList);

        if (event.checked) {
            if (this.rsm.indexOf(this.asmList[index]['id']) === -1) {
                this.rsm.push(value);
                console.log(this.rsm);
            }
        } else {
            for ( let j = 0; j < this.asmList.length; j++) {
                if (this.asmList[index]['id'] == this.rsm[j]) {
                    this.rsm.splice(j, 2);
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

    select_dealer(data, event) {
        console.log(this.assign_dealer);

        if (data.check) {
            this.assign_dealer.push(data);
        } else {
            const index = this.assign_dealer.findIndex(row => row.id == data.id);

            this.assign_dealer.splice(index, 1);
        }
        console.log(this.assign_dealer);
    }


    save_assign_dealer() {
        console.log(this.assign_dealer);
        this.loader = true;
        this.serve.fetchData({'dealer_list': this.assign_dealer, 'dr_id': this.dr_id}, 'Distributors/assign_dealer')
        .subscribe((result => {
            console.log(result);

            if (result['msg'] == 'success') {
                this.active.dealer = false;
                this.retailerDetail();
                // this.dealer_list();
                this.loader = false;
                this.toast.successToastr('Retail Partners Updated');
            }
        }));
    }


    product_Brand1(value, index, event) {
        if (event.checked) {
            this.brand1.push(value);
            console.log(this.brand1);
            this.serve.fetchData({'brand': this.brand1, 'dr_id': this.dr_id}, 'Distributors/dr_brand_update').subscribe((result => {
                console.log(result);
                this.toast.successToastr('Brands Updated');
            }));

        } else {
            console.log('in');

            for ( let j = 0; j < this.brand_list1.length; j++) {
                console.log('in');
                if (this.brand_list1[index].brand_name == this.brand1[j]) {
                    this.brand1.splice(j, 1);
                    this.serve.fetchData({'brand': this.brand1, 'dr_id': this.dr_id}, 'Distributors/dr_brand_update').subscribe((result => {
                        console.log(result);
                        this.toast.successToastr('Brands Updated');
                    }));
                }
            }
            console.log(this.brand1);
        }


    }

    getBrandList() {
        this.serve.fetchData(0, '/Product/product_brand_list/')
        .subscribe((result) => {
            console.log(result);
            this.brand_list1 = result;
            console.log(this.brand_list1);
            console.log(this.assign_brand);

            for (let i = 0; i < this.brand_list1.length; i++) {
                for (let j = 0; j < this.assign_brand.length; j++) {
                    console.log(this.assign_brand[j]);
                    if (this.brand_list1[i].brand_name == this.assign_brand[j]['brand']) {
                        console.log(this.assign_brand[j]['brand']);
                        this.brand_list1[i].check = true;
                        this.brand1.push(this.brand_list1[i].brand_name);
                        console.log(this.brand1);

                    }
                }
                console.log(this.brand1);

            }
        });
    }


    convert_dr(type) {

        this.alert.confirm('Convert').then((result) => {
            if (result) {
                console.log(type);
                this.serve.fetchData({type: type, dr_id: this.dr_id}, 'Category_master/sendOtp').subscribe((result => {
                    console.log(result);

                    const dialogRef = this.dialog.open(DisOtpVarificationComponent, {
                        width: '350px',
                        data: {
                            id: this.dr_id,
                            type: type,
                            otp: result
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);
                        console.log('The dialog was closed');

                    });
                }));
                // console.log(type);
                // this.serve.fetchData({type:type,dr_id:this.dr_id},"Category_master/dr_type_update").subscribe((result=>{
                //     console.log(result);
                //     if(type == 1){
                //         this.rout.navigate(['/distribution-list']);
                //     }
                //     if(type==7){
                //         this.rout.navigate(['/direct-dealer']);

                //     }

                // }))
            }
        });



    }

    deleteOrder(id, i) {
        console.log(id);

        this.alrt.delete('Order Data').then((result) => {
            if (result) {
                this.serve.fetchData({id}, 'order/directOrderdelete')
                .subscribe((response) => {
                    if (response) {
                        this.primary_ord_data.splice(i, 1);
                        this.get_primary_ord();
                    }

                });
            }

        });

    }

    add_ledger(type) {
        const dialogRef = this.dialog.open(DistributionLegderModelComponent, {
            width: '520px',
            data: {
                id: this.dr_id,
                type
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.ledger_list();

        });
    }

    ledger_list() {
        this.serve.fetchData({dr_id: this.dr_id}, 'DistributionNetwork/ledger_list')
        .subscribe((result) => {
            console.log(result);
            this.ledger_data = result['ledger_list'];
        });
    }

    deleteUser(id) {
        this.alrt.delete('Ledger Data !').then((result) => {
            if (result) {
                this.serve.fetchData({id: id, dr_id: this.dr_id}, 'DistributionNetwork/delete_ledger')
                .subscribe((result) => {
                    console.log(result);
                    this.ledger_list();
                    this.retailerDetail();
                });
            }
        });
    }


    delete_cp_order(order_id) {
        this.alrt.delete('Order Data').then((result) => {
            if (result) {
                this.serve.fetchData({order_id: order_id}, 'Order/delete_channel_partner_ord')
                .subscribe((result) => {
                    console.log(result);
                    this.ledger_list();
                    this.retailerDetail();
                });
            }

        });
    }


    getDealersData() {
        console.log(this.dr_id);
        this.loader = true;

        this.serve.fetchData({id: this.dr_id,'filter':this.dealers_filter}, 'Distributors/getDealersData')
        .subscribe((result) => {
            console.log(result);
            this.assignedDealers = result['dr_list'];
            this.loader = false;

        }, err => {
            this.loader = false;

        });
    }


    getExecutivesData() {
        console.log(this.dr_id);
        this.loader = true;

        this.serve.fetchData({id: this.dr_id}, 'Distributors/getExecutivesData')
        .subscribe((result) => {
            console.log(result);
            this.assignedExecutives = result['user'];
            this.loader = false;

        }, err => {
            this.loader = false;

        });
    }


    disExecutive(type, userId) {
        const dialogRef = this.dialog.open(DisExecutiveModelComponent, {
            width: '800px',
            data: {type: type , userId: userId}
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getExecutivesData();
        });
    }

    openDiscountModal(dealerId) {
        console.log(dealerId);

        const dialogRef = this.dialog.open(DrDiscountComponent, {
            width: '800px',
            data: {
                dealerId : dealerId
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.getDealersData();
        });



    }
    // dashboard code start
    // order_data:any=[];


    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }

    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }

    count_data() {
        console.log('test');
        this.serve.fetchData({id: this.dr_id}, 'Distributors/count_data_dr').subscribe((result => {
            console.log(result);
            this.dashboardCounts = result;
            console.log(this.dashboardCounts);

            //   this.user_filter();

        }));
    }
    //           tmp:any=[];
    //   user_list:any=[];
    //           user_filter(){
    //             console.log(this.dashboardCounts);
    //             for(let i=0;i<this.dashboardCounts['user_data'].length;i++){
    //               this.tmp=this.dashboardCounts.user_data[i]['user_type'];

    //               if(this.tmp.includes('MARKET'))
    //               {
    //                 this.user_list.push(this.dashboardCounts.user_data[i]);
    //               }
    //             }
    //           }


    edit_billing_details(credit_limit,credit_period,credit_opening_balance,dr_code,display_billing_status){

        console.log("edit_billing_details method calls");

        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '800px', data: {
                'credit_limit' : credit_limit && credit_limit!='' ? credit_limit : '',
                'credit_period' : credit_period && credit_period!='' ? credit_period : '',
                'credit_opening_balance' : credit_opening_balance && credit_opening_balance!='' ? credit_opening_balance : '',
                'dr_code' : dr_code && dr_code!='' ? dr_code : '--',
                'display_billing_status':display_billing_status,
                'dr_id' : this.dr_id,
                'from' : 'distributor_detail_page'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.retailerDetail();

        });


    }

    get_billing_list(){
        console.log("get_billing_list method calls");
        this.billingTabActive.active = 'Billing' ;
        this.serve.fetchData({'dr_id': this.dr_id},"Tally_invoice_credit/dr_credit_billing_list").subscribe((result=>{
            console.log(result);
            this.billing_list = result['0'];
            this.total_billing_amount=result['total_billing_amount'];
            console.log(typeof this.total_billing_amount);
            this.total_billing_receive_amount=result['total_billing_receive_amount'];
            console.log(typeof this.total_billing_amount);

            this.total_pending_balance=result['total_pending_balance'];
            console.log(typeof this.total_billing_amount);

        }))

    }

    get_payment_list(){
        console.log("get_payment_list method calls");
        this.billingTabActive.active = 'Payment' ;
        this.serve.fetchData({'dr_id': this.dr_id},"Tally_invoice_credit/dr_invoice_payment_listing").subscribe((result=>{
            console.log(result);
            this.payment_list = result['list'];
            this.total_payment=result['total_payment'];
        }))

    }

    go_to(id,type){
        this.rout.navigate(['/invoice-billing-detail/'+id],{ queryParams: { id,type} });
    }

    limit_vs_outstanding_vs_overdue_method(){
        console.log("limit_vs_outstanding_vs_overdue_data method calls");
        this.serve.fetchData({'dr_id': this.dr_id},"Tally_invoice_credit/dr_credit_limit_vs_outstanding_vs_overdue_on_dashboard").subscribe((result=>{
            console.log(result);
            this.limit_vs_outstanding_vs_overdue_data = result['dr_detail'];
        }))

    }

    outstanding_and_overdue_days_interval_method(){
        console.log("outstanding_and_overdue_days_interval_method method calls");
        this.serve.fetchData({'dr_id': this.dr_id},"Tally_invoice_credit/outstanding_and_overdue_days_interval").subscribe((result=>{
            console.log(result);
            this.outstanding_and_overdue_days_interval = result['previous_summary'];
            this.pieChartData=[]
            this.pieChartLabels=[]
            for(let index = 0 ; index < result['previous_summary'].length ; index++){
                this.pieChartData.push(parseInt(result['previous_summary'][index].value));
                this.pieChartLabels.push((result['previous_summary'][index].days +' days'));
            }

        }))
    }


    add_branding_detail(){
        console.log("add_branding_detail method calls");
       

        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '2000px', data: {
                'dr_id' : this.dr_id,
                'type':this.dr_detail_type,
                'from' : 'distributor_detail_page_to_add_branding_data'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.get_branding_data();

        });


    }

    get_branding_data(){
        console.log("get_branding_data method calls");
        console.log(this.dr_detail_type);
        
        if(this.dr_detail_type != '1'){
            this.show_tab_branding_detail = ''
        }
        this.serve.fetchData({'dr_id': this.dr_id , 'type':this.show_tab_branding_detail},"Distributors/get_branding_data").subscribe((result=>{
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
        console.log(this.data);

        this.serve.fetchData({'dr_id':this.dr_id},"Distributors/get_branding_data_excel").subscribe((result=>{
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



    get_activity_data(){
      console.log("get_activity_data method calls");
      this.serve.fetchData({'dr_id': this.dr_id,'user_id':this.login_data.id,'user_type':this.login_data.user_type,'search':this.data},"Distributors/get_dr_activity_list").subscribe((result=>{
          console.log(result);
          this.get_dr_activity_list = result['get_dr_activity_list'];

      }))

    }

    back(){
        console.log(window);
        window.history.back();
    }

    // pie chart code
    // chartClicked
    // public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //     console.log(event, active);
    //   }

    //   public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //     console.log(event, active);
    //   }


}
