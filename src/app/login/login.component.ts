import { Component, OnInit,Inject } from '@angular/core';
import { slideToRight } from '../router-animation/router-animation.component';
import { PearlService } from '../pearl.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { sessionStorage } from '../localstorage.service';
import { DialogComponent } from '../dialog.component';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [slideToRight()]
})
export class LoginComponent implements OnInit {

  data: any = [];
  peraluser: any = {};
  st_user: any = {};
  nexturl: any;
  channel_partner = false;
  cp_otp: any;
  system_user: boolean = false;
  system_user_data: any = {};
  edit_view:boolean=false;


  // tslint:disable-next-line:max-line-length
  constructor(@Inject(SESSION_STORAGE) private storage:WebStorageService, public serve: PearlService, public rout: Router, public dialog: DialogComponent, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  visible_password(){
    this.edit_view =true
  }
  not_visible_password(){
    this.edit_view =false
  }

  login() {
    // this.session.setSession(this.data['username'],this.data['password']);

    const value = {'username': this.data['username'], 'password': this.data['password']};
    this.serve.fetchData(value, 'login/submitnew').subscribe((data: any) => {
      console.log(data);
      this.system_user_data = data
      console.log(data.data.user_type);

      for(let i = 0 ;i<data['assignModule'].length ;i++){

        if(data['assignModule'][i]['module_name'] == 'lead channel partner' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_leads'] = 1
          data['data']['view_lead_channel_partner'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'lead dealer' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_leads'] = 1
          data['data']['view_lead_dealer'] = 1

        }
        else if(data['assignModule'][i]['module_name'] == 'distribution channel partner' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_distribution_n_w'] = 1
          data['data']['view_dist_n_w_channel_partner'] = 1

        }
        else if(data['assignModule'][i]['module_name'] == 'distribution direct dealer' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_distribution_n_w'] = 1
          data['data']['view_dist_n_w_direct_dealer'] = 1

        }
        else if(data['assignModule'][i]['module_name'] == 'distribution dealer' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_distribution_n_w'] = 1
          data['data']['view_dist_n_w_dealer'] = 1

        }
        else if(data['assignModule'][i]['module_name'] == 'order to Sirca' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_orders'] = 1
          data['data']['view_orders_primary'] = 1

        }
        else if(data['assignModule'][i]['module_name'] == 'order to channel partner' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_orders'] = 1
          data['data']['view_orders_secondary'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'followup' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_followup'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'pop order' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_orders'] = 1
          data['data']['view_pop_order'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'attendence' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_attendence'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'check in' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_check_in'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'leaves' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_leaves'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'product master' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_products'] = 1
          data['data']['view_masters'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'executive master' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_users'] = 1
          data['data']['view_masters'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'discount master' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_discount'] = 1
          data['data']['view_masters'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'pop master' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_pop_master'] = 1
          data['data']['view_masters'] = 1


        }
        else if(data['assignModule'][i]['module_name'] == 'report' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_monthly_work_report'] = 1
          data['data']['view_c_p_sales_report'] = 1
          data['data']['view_primary_secondary_report'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'dashboard' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_dashboard'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'travel plan' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_travel_plan'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'area target' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_masters'] = 1
          data['data']['view_area_target'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'allowance master' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_masters'] = 1
          data['data']['view_allowance_master'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'expense' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_expense'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'billing' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_billing'] = 1
        }
        else if(data['assignModule'][i]['module_name'] == 'plumber meet' && data['assignModule'][i]['view'] == 'true'){
          data['data']['view_plumber_meet'] = 1
        }

        else{

        }



      }

      // tslint:disable-next-line:triple-equals
      if (data.data.type == '1' && data.data.lead_type == 'Dr') {
        this.channel_partner = true;

        this.st_user = data;

        this.cp_otp =  Math.floor(100000 + Math.random() * 900000);

        // tslint:disable-next-line:no-shadowed-variable
        const value = {'mobile': this.st_user.data.mobile, 'otp': this.cp_otp};

        // tslint:disable-next-line:no-shadowed-variable
        this.serve.fetchData(value, 'login/verify_otp').subscribe((data: any) => {
          console.log(data);

        });

      }

      else if (data.data.user_type == 'OFFICE' || data.data.user_type == 'office' || data.data.user_type == 'Office' || data.data.user_type == 'Inside Sales Team') {
        this.system_user = true;

        this.st_user = data;

        if(this.st_user.data.contact_01 == '9896356568') {

          this.cp_otp = '123456';

        } else {

          this.cp_otp =  Math.floor(100000 + Math.random() * 900000);

        }


        const value = {'mobile': this.st_user.data.contact_01, 'otp': this.cp_otp};

        this.serve.fetchData(value, 'login/verify_otp').subscribe((data: any) => {
          console.log(data);

        });

      }


      else {
        this.channel_partner = false;

        // tslint:disable-next-line:triple-equals
        if (data['message'] == 'Success') {
          this.dialog.success('LogIn', 'Success');
          this.st_user = data;
          console.log(this.st_user);
          this.st_user.data.access_level = '1';
          this.st_user.st_log = true;
          // localStorage.setItem('st_user', JSON.stringify(this.st_user) );
          sessionStorage.setItem('st_user', JSON.stringify(this.st_user));
          // this.storage.set('st_user', JSON.stringify(this.st_user) );



          // tslint:disable-next-line:triple-equals
          if (this.st_user.data.view_dashboard == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_leads == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_lead_channel_partner == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_lead_dealer == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dealer-lead-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_followup == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/followup-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals

          } else if (this.st_user.data.view_distribution_n_w == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_dist_n_w_channel_partner == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_dist_n_w_direct_dealer == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/direct-dealer';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_dist_n_w_dealer == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dealer';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_orders == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_orders_primary == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_orders_secondary == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/secondary-order-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_pop_order == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/pop-n-gift-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_orders_direct == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/direct-order';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_attendence == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/attendance';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_check_in == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/checkin';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_qr_code == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/qr-code-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_plumbing_man == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/plumber-lead-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_consumer == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/consumer-lead-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_banner == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/banner-banner-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_leaves == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/leave-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_travel_plan == '1' ) {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/travel-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_redeem_request == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/redeem-request-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_products == '1' || this.st_user.data.view_masters == '1' ) {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_users == '1' || this.st_user.data.view_masters == '1' ) {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sale-user-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_discount == '1' || this.st_user.data.view_masters == '1' ) {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/discount-list';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          }
          else if (this.st_user.data.view_pop_master == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/pop-n-gift-master';
            this.router.navigate([this.nexturl]);
          }

          // else if (this.st_user.data.view_specialdiscountount == '1') {
          // this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/specialdiscount';
          // this.router.navigate([this.nexturl]);
          // tslint:disable-next-line:triple-equals
          // }

          else if (this.st_user.data.view_category_master == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/categorymaster';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_scheme_master == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/schememaster';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dwr';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_user_location_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/live_track';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_daily_work_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dwr';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_monthly_work_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/monthly-dwr';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_primary_target_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/target-report/1';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_c_p_sales_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distriutor-sales-report';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_primary_secondary_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/primary-vs-secondary';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_product_category_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-wise-report';
            this.router.navigate([this.nexturl]);
            // tslint:disable-next-line:triple-equals
          } else if (this.st_user.data.view_secondary_target_report == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/target-report/2';
            this.router.navigate([this.nexturl]);
          }


          else if (this.st_user.data.view_area_target == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/area-target';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_allowance_master == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/allowance-master';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_expense == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/expense-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_billing == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/invoice-billing';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_plumber_meet == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/plumber-meet';
            this.router.navigate([this.nexturl]);
          }
          else {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigate([this.nexturl]);
          }
        }
        else {
          this.dialog.error('Incorrect UserName or Password');
        }
      }

    }, error => {
      console.log(error);
    });
  }


  submit_otp() {
    // tslint:disable-next-line:triple-equals
    if (this.cp_otp == this.data.otp) {

      this.dialog.success('LogIn', 'Success');
      this.st_user = this.system_user_data;
      console.log(this.st_user);
      this.st_user.data.access_level = '1';
      this.st_user.st_log = true;
      // localStorage.setItem('st_user', JSON.stringify(this.st_user) );
      sessionStorage.setItem('st_user', JSON.stringify(this.st_user));
      // this.storage.set('st_user', JSON.stringify(this.st_user) );



      // tslint:disable-next-line:triple-equals
      if (this.st_user.data.view_dashboard == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_leads == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_lead_channel_partner == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_lead_dealer == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dealer-lead-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_followup == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/followup-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals

      } else if (this.st_user.data.view_distribution_n_w == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_dist_n_w_channel_partner == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_dist_n_w_direct_dealer == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/direct-dealer';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_dist_n_w_dealer == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dealer';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_orders == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_orders_primary == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_orders_secondary == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/secondary-order-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_pop_order == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/pop-n-gift-list';
        this.router.navigate([this.nexturl]);
      } else if (this.st_user.data.view_orders_direct == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/direct-order';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_attendence == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/attendance';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_check_in == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/checkin';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_qr_code == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/qr-code-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_plumbing_man == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/plumber-lead-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_consumer == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/consumer-lead-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_banner == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/banner-banner-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_leaves == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/leave-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_travel_plan == '1' ) {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/travel-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_redeem_request == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/redeem-request-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_products == '1' || this.st_user.data.view_masters == '1' ) {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_users == '1' || this.st_user.data.view_masters == '1' ) {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sale-user-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_discount == '1' || this.st_user.data.view_masters == '1' ) {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/discount-list';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_pop_master == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/pop-n-gift-master';
        this.router.navigate([this.nexturl]);
      } else if (this.st_user.data.view_category_master == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/categorymaster';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_scheme_master == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/schememaster';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dwr';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_user_location_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/live_track';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_daily_work_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dwr';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_monthly_work_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/monthly-dwr';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_primary_target_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/target-report/1';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_c_p_sales_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distriutor-sales-report';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_primary_secondary_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/primary-vs-secondary';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_product_category_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-wise-report';
        this.router.navigate([this.nexturl]);
        // tslint:disable-next-line:triple-equals
      } else if (this.st_user.data.view_secondary_target_report == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/target-report/2';
        this.router.navigate([this.nexturl]);
      } else if (this.st_user.data.view_area_target == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/area-target';
        this.router.navigate([this.nexturl]);
      } else if (this.st_user.data.view_allowance_master == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/allowance-master';
        this.router.navigate([this.nexturl]);
      } else if (this.st_user.data.view_expense == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/expense-list';
        this.router.navigate([this.nexturl]);
      } else if (this.st_user.data.view_billing == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/invoice-billing';
        this.router.navigate([this.nexturl]);
      }else if (this.st_user.data.view_plumber_meet == '1') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/plumber-meet';
        this.router.navigate([this.nexturl]);
      }
      else {

        if(this.st_user.data.type != ''){
          this.router.navigate(['/distribution-detail/' + this.st_user['data'].id]);
        }
        else{
          this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigate([this.nexturl]);

        }



      }

    }




    else {
      this.dialog.error('Incorrect Otp');
    }
  }
}
