import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControllerURL } from 'src/environments/controllers';
import { DateFormatPipe } from '../date-format.pipe';
import { RestService } from '../rest-service.service';
import {NavigationURL} from '../../environments/navigation';

export interface IClaimsRequestBody {
  startDate     : Date;
  endDate       : Date;
  client        : string;
  guilty        : string;
  allDates      : number;
  showCheck     : number;
  showSend      : number;
  showAll       : number;
  skus          : ISkuClaims[];
}

export interface IClaims {
  id: string;
  externalLoadId: string;
  client: string;
  addDate: string;
  dateOfArrival: Date;
  linesCount: number;
  linesCountChecked: number;
  cost: number;
  taskState: number;
 
}

export interface ISkuClaims {
  name: string;
}

@Component({
  selector: 'claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  loading              : boolean  = false;
  filterPanelOpenState : boolean  = true;

  totalRecords         : number;
  
  startDate             = new FormControl();
  endDate               = new FormControl();
  client               : string;
  guilty               : string;

  showAllClaims        : boolean  = false;
  showCheck            : boolean  = false;
  showSend             : boolean  = false;
  showAll              : boolean  = false;

  skuclaimsDataSource  : ISkuClaims []= [];
  selectedSkuClaims    : ISkuClaims [] = [];
  claimsDataSource     : IClaims    [] = [];
  NAVIGATION           = NavigationURL;
  constructor(private service : RestService,   private _dateFormatPipe: DateFormatPipe,) {}  

  ngOnInit(): void {
    this.loadSkuClaimsFilterData();
  }

  loadSkuClaimsFilterData(){
    this.service.get<ISkuClaims[]>(ControllerURL.SKU_CLAIMS_SERVICE_URL).subscribe(response =>{
      this.skuclaimsDataSource = response;
    });
  }


  loadClaims(){
    this.loading = true;
    let body : IClaimsRequestBody = this.createBody();
    this.service.post<IClaims[]>(ControllerURL.CLAIMS_SERVICE_URL, body).subscribe(data =>{
      this.claimsDataSource = data['claims'];
      this.totalRecords = this.claimsDataSource.length;
      this.loading = false;
    });
  
  }

  createBody(): any{
    let body : IClaimsRequestBody = {
      startDate     : this.startDate.value ? this._dateFormatPipe.transform(this.startDate.value) : undefined,
      endDate       : this.endDate.value ?   this._dateFormatPipe.transform(this.endDate.value) : undefined,
      client        : this.client? this.client : "",
      guilty        : this.guilty? this.guilty : "",
      allDates      : this.showAllClaims? 1 : 0,
      showAll       : this.showAll? 1 : 0,
      showCheck     : this.showCheck? 1 : 0,
      showSend      : this.showSend?  1 : 0,
      skus          : this.selectedSkuClaims
    }
     console.log(body)

    return body;
  }


  searchClicked(){
    this.loadClaims();
  }


  createTask(item: any){

  }
}
