import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PearlService } from '../pearl.service';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent implements OnInit {
  quotation_data: any = [];
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  page_limit: any = 50
  exp_loader: any = false;
  loader: any = false;
  pagination_count: any = 0;
  quotation_count: any = '';
  data: any = [];
  skelton: any = new Array(10);
  search_val: any = {};
  data_not_found = false;
  constructor(public serve: PearlService) { }

  ngOnInit() {
    this.getQuotationList();
  }


  getQuotationList() {
    console.log("Quotation gets called");
    this.exp_loader = true;
    this.loader = true;
    this.serve.fetchData({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val }, 'Quotation/getQuotationList').subscribe((res) => {
      console.log(res);
      this.quotation_data = res['QuotationList'];
      this.pagination_count = (res['total_count']);
      this.quotation_count = res['total_count'];
      this.total_page = Math.ceil(this.pagination_count / this.page_limit);
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;

      setTimeout(() => {
        this.exp_loader = false;
        this.loader = false;
      }, 1000);
    })
  }
  refresh() {
    this.search_val = {};
    this.getQuotationList();
  }

  onDate(event) {
    console.log(event);
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
    this.getQuotationList();
  }


}
