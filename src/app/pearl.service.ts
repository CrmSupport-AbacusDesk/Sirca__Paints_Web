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
  myurl="https://devcrm.abacusdesk.com/sircapaints/crm/";
  myimgurl="https://devcrm.abacusdesk.com/sircapaints/";
  myimgurl2="https://devcrm.abacusdesk.com/sircapaints/";
  dbUrl="https://devcrm.abacusdesk.com/sircapaints/crm/api/index.php/";
  pdf_url="https://devcrm.abacusdesk.com/sircapaints/crm/api/uploads/quotaion/"

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
