import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ControllerURL } from 'src/environments/controllers';
import { ProblemListRequestBody } from '../dto/problem-list-request-body';
import { RestService } from '../rest-service.service';
import { TableRowColorUtils } from '../table-row-color-utils';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  
  breadScrumsMenuItem : MenuItem[];
  home : any;
  loading : boolean = false;
  problemListDataSource : any;

  
  constructor(private route   : ActivatedRoute,
    private service : RestService,
    private router : Router,
    private colorUtil: TableRowColorUtils) {
    this.home = {icon: 'pi pi-home', routerLink: '/'};
  }

  ngOnInit(): void {
    let route : string;
    this.route.queryParams.subscribe(params =>{
      if (params){
        this.loading = true;
        let externalLoadId =  params['externalloadid'];
        let loadUsr2       =  params['loadusr2'];
        route              =  params['loadusr2'];
        let req  :  ProblemListRequestBody =  this.createRequest(externalLoadId, loadUsr2);
        this.doPost(req);
        this.loading = false;
      }
    });

    this.breadScrumsMenuItem = [{label:'Список проблем по рейсу ' + route }];
  }

  doPost(req :ProblemListRequestBody){
    console.log(req)
    this.service.postTableData<ProblemListRequestBody>(ControllerURL.PROBLEM_LIST_URL, req).subscribe(response =>{
     
      console.log(response['problems'])
      this.problemListDataSource = response['problems']
    });
  }

  createRequest(externalLoadId : string, loadUsr2 : string): ProblemListRequestBody {
    let requestBody : ProblemListRequestBody;
    if (externalLoadId === loadUsr2){
      requestBody = {
        orderKey : externalLoadId,
      }
    }else{
      requestBody = {
        externalLoadId : externalLoadId,
      }
    }
    return requestBody;
  }


  getRowColor(item : any){
    return this.colorUtil.getRowColorWithoutShiftsColor(item);
  }
}
