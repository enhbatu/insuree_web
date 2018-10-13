import { Component, OnInit, ViewChild } from '@angular/core';
import { SalaryService } from '../../shared/salary.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { InsureeService } from '../../shared/insuree.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salary-list',
  templateUrl: './salary-list.component.html',
  styleUrls: ['./salary-list.component.css']
})
export class SalaryListComponent implements OnInit {
  byear: number;
  eyear: number;
  isvalid: boolean;
  salaries: any[];
  reCaptcha: any;
  person: any;
  isloading: boolean = false;
  isFirstLoad: boolean = false;
  today: Date;
  @ViewChild('captchaRef')
  captchaRef: RecaptchaComponent;
  errormassage: string;
  qrCode: any;
  qrCodeData: any;
  pages: number[];
  pagesize: number = 24;

  constructor(private route: Router, private _service: SalaryService, private _insureeService: InsureeService) { }

  ngOnInit() {
    this.isFirstLoad = true;
    this.byear = new Date().getFullYear() - 1;
    this.eyear = new Date().getFullYear();
    this.today = new Date();
  }

  getSalary(CaptchaResponse: string) {
    this.isloading = true;
    this.salaries = undefined;
    this._insureeService.getPerson().subscribe(response => {
      this.isloading = false;
      this.person = response;
    }, error => {
      if (error.status == 0) {
        this.route.navigate(['/error']);
      }
      else {
        this.errormassage = error.message;
      }
      this.isloading = false;
    });
    this._service.getSalary(this.byear, this.eyear, CaptchaResponse).subscribe(response => {
      this.qrCode = response.qrCode
      this.qrCodeData = response.qrCodeData;
      this.isFirstLoad = false;
      this.isloading = false;
      let result = response;
      this.salaries = result.salaries;
      this.pages = this.SplitByPage(this.salaries, this.pagesize);
      this.captchaRef.reset();
    }, error => {
      if (error.status == 0) {
        this.route.navigate(['/error']);
      }
      else {
        this.errormassage = error.message;
      }
      this.isloading = false;
    });
  }

  SplitByPage(data: any[], pagesize: number): any[] {
    let ipage = 0;
    let irow = 0;
    let lastindex = 0;
    let pages = [];
    for (let i = 0; i < data.length; i++) {
      if (irow >= pagesize) {
        lastindex = i;
        pages.push(data.slice(pages.length * pagesize, pagesize));
        irow = 0;
      }
      irow++;
    }
    if (lastindex < (data.length)) {
      pages.push(data.slice(lastindex, data.length));
    }
    return pages;
  }
  CalcPages(pagesize: number, rownum: number): number {
    let pagenum = rownum / pagesize;
    if (pagenum - Math.trunc(pagenum) > 0) {
      pagenum++;
    }
    return Math.trunc(pagenum);
  }
  printContent() {
    var restorepage = document.body.innerHTML;
    var restoreBYear = this.byear;
    var restoreEYear = this.eyear;
    var printcontent = document.getElementById('printArea').innerHTML;
    var printPreview = window.open('_blank', 'print_preview');
    var printDocument = printPreview.document;
    console.log(document.head);
    printDocument.open();
    printDocument.write("<!doctype html>");
    printDocument.write("<html>");
    printDocument.write("<head>" + document.head.innerHTML + "</head>");
    printDocument.write("<body onload='window.print();window.close();'>");
    printDocument.write(printcontent);
    printDocument.write("</body>");
    printDocument.write("</html>");
    printDocument.close();
    console.log(printDocument.readyState.toString());
    printPreview.focus();
  }
}
