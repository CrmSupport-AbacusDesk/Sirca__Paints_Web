import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import  * as FileSaver from 'file-saver';
import  * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class PearlService {
  header:any=new HttpHeaders();
  data:any;
  myProduct:any={};
  peraluser:any={};
  tmp;
  detail:any={};

  orderFilterPrimary:any={};
  orderFilterSecondary:any={};
  dealerListSearch:any={};
  directDealerListSearch:any={};
  distributorListSearch:any={};

  distributor_detail_primary_selected_tab:any='';
  distributor_detail_secondary_selected_tab:any='';

  expenseFilter:any = {};
  plumberMeetFilter:any = {};
  travelPlanFilter:any = {};
  billingFilter:any = {};
  socialMediaLeadFilter:any={};
  travelPlanTab:any='';

  // Live Links
  myurl="https://app.gravitybath.com/crm/";
  myimgurl="https://app.gravitybath.com/";
  myimgurl2="https://app.gravitybath.com/";
  dbUrl="https://app.gravitybath.com/crm/api/index.php/";
  pdf_url="https://app.gravitybath.com/crm/api/uploads/quotaion/"

  // Test Links
  // myurl="http://phpstack-83335-2448668.cloudwaysapps.com/crm/";
  // myimgurl="http://phpstack-83335-2448668.cloudwaysapps.com/";
  // myimgurl2="http://phpstack-83335-2448668.cloudwaysapps.com/";
  // dbUrl="http://phpstack-83335-2448668.cloudwaysapps.com/crm/api/index.php/";

  // New Test Link
  // myurl="https://apps.abacusdesk.com/gravity2k21/crm/";
  // myimgurl="https://apps.abacusdesk.com/gravity2k21/";
  // myimgurl2="https://apps.abacusdesk.com/gravity2k21/";
  // dbUrl="https://apps.abacusdesk.com/gravity2k21/crm/api/index.php/";
  // pdf_url="https://apps.abacusdesk.com/gravity2k21/crm/api/uploads/quotaion/"
  





  constructor(public http:HttpClient) { }

  can_active:any="";
  LogInCheck(username,password)
  {
    this.data={username,password};
    return this.http.post(this.dbUrl+"/login/submitnew/",JSON.stringify(this.data),{ headers:this.header });

  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }



  fetchData(data:any,fn:any)
  {
    this.header.append('Content-Type','application/json');
    console.log(this.dbUrl+fn);
    return this.http.post(this.dbUrl+fn,JSON.stringify(data),{ headers:this.header })
  }
  upload_image(val,fn_name)
  {
    console.log(val);
    return this.http.post(this.dbUrl+fn_name, val, { headers:this.header});

  }
  FileData(request_data:any, fn:any)
  {
    this.header.append('Content-Type',undefined);
    console.log(request_data);
    return this.http.post( this.dbUrl+fn, request_data, {headers : this.header});
  }


}
