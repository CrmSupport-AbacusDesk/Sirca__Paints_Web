import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PearlService } from '../pearl.service';
import { MatDialog } from '@angular/material';
import { LocalStorage } from '../localstorage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  constructor(public route: ActivatedRoute, public serve: PearlService, public dialog: MatDialog , private renderer: Renderer2, public session: LocalStorage) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);
    console.log("Login Data : ",this.login_data);
  }
  count: any = [];
  distactive = false;
  ordersactive = false;
  masteractive = false;
  reportactive = false;
  leadactive = false;
  login_data: any = {};

  status = false;

  status1 = false;
  ngOnInit() {
    this.count_data();
  }

  toggleDropdown(value) {
    console.log(value);
    if (value == 1) {

      // tslint:disable-next-line:triple-equals
      if (this.distactive == false) {
        this.distactive = true;
        this.ordersactive = false;
        this.leadactive = false;
        this.masteractive = false;
        this.reportactive = false;
      } else {
        this.distactive = false;
        this.ordersactive = false;
        this.leadactive = false;
        this.reportactive = false;

      }

      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    } else if (value == 4) {

      if (this.leadactive == false) {
        this.leadactive = true;
        this.ordersactive = false;
        this.distactive = false;
        this.masteractive = false;
        this.reportactive = false;

      } else {
        this.leadactive = false;
        this.ordersactive = false;
        this.distactive = false;
        this.masteractive = false;
        this.reportactive = false;

      }

      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    } else if (value == 2) {
      if (this.ordersactive == false) {
        this.distactive = false;
        this.ordersactive = true;
        this.leadactive = false;
        this.masteractive = false;
        this.reportactive = false;

      } else {
        this.leadactive = false;
        this.ordersactive = false;
        this.distactive = false;
        this.masteractive = false;
        this.reportactive = false;

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    } else if (value == 3) {
      if (this.masteractive == false) {
        this.distactive = false;
        this.ordersactive = false;
        this.leadactive = false;
        this.masteractive = true;
        this.reportactive = false;

      } else {
        this.leadactive = false;
        this.ordersactive = false;
        this.distactive = false;
        this.masteractive = false;
        this.reportactive = false;

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    } else if (value == 5) {
      if (this.reportactive == false) {
        this.reportactive = true;
        this.distactive = false;
        this.ordersactive = false;
        this.leadactive = false;
        this.masteractive = false;

      } else {
        this.reportactive = false;
        this.leadactive = false;
        this.ordersactive = false;
        this.distactive = false;
        this.masteractive = false;

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    } else {
      this.distactive = false;
      this.ordersactive = false;
      this.masteractive = false;
      this.leadactive = false;
      this.reportactive = false;


    }
    // this.status = !this.status;

    // if(this.status) {
    //   this.renderer.addClass(event.target, 'active');
    //   this.renderer.removeClass(document.body, 'active');
    // }
    // else {
    //   this.renderer.removeClass(event.target, 'active');
    //   // this.renderer.removeClass(document.body, 'active');
    // }
  }


  toggleHeader() {
    console.log(this.status);
    this.status = !this.status;
    if (!this.status) {
      this.renderer.addClass(document.body, 'nav-active');
    } else {
      this.renderer.removeClass(document.body, 'nav-active');
    }
  }
  toggleNav() {
    this.status1 = !this.status1;
    if (this.status1) {
      this.renderer.addClass(document.body, 'active');
    } else {
      this.renderer.removeClass(document.body, 'active');
    }
  }
  count_data() {
    console.log('test');
    this.serve.fetchData({}, 'Attendance/count_data').subscribe((result => {
      console.log(result);
      this.count = result;
    }));
  }


}
