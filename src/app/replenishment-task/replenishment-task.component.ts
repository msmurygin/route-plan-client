import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ControllerURL } from 'src/environments/controllers';
import { ReplenishmentTaskRequestBody } from '../dto/replenishment-task-request-body';
import { RestService } from '../rest-service.service';
import {MenuItem} from 'primeng/api';
@Component({
  selector: 'replenishment-task',
  templateUrl: './replenishment-task.component.html',
  styleUrls: ['./replenishment-task.component.css']
})
export class ReplenishmentTaskComponent implements OnInit {
  breadScrumsMenuItem : MenuItem[] = [{label:'Задачи пополнения'}];
  home : any;
  loading : boolean = false;
  replTaskDataSource : any;
  constructor(private route   : ActivatedRoute,
              private service : RestService,
              private router : Router) {
    this.home = {icon: 'pi pi-home', routerLink: '/'};
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      if (params){
        this.loading = true;
        let externalLoadId : string  =  params['externalloadid'];
        let loadUsr2       : string  =  params['loadusr2'];
        let req  = this.createRequest(externalLoadId, loadUsr2);
        this.doPost(req)
      }
    });
  }

  doPost(req :ReplenishmentTaskRequestBody){
    this.service.postTableData<ReplenishmentTaskRequestBody>(ControllerURL.REPLENISHMENT_TASK_URL, req).subscribe(response =>{
      this.loading = false;
      console.log(response['replenishmentTasks'])
      this.replTaskDataSource = response['replenishmentTasks']
    });
    console.log(req)
  }

  createRequest(externalLoadId : string, loadUsr2 : string): ReplenishmentTaskRequestBody{
    let requestBody : ReplenishmentTaskRequestBody;
    if (externalLoadId === loadUsr2){
      requestBody = {
        orderKey : externalLoadId,
        changePriority: false,
        priorityValue : 0
      }
    }else{
      requestBody = {
        externLoadId : externalLoadId,
        changePriority: false,
        priorityValue : 0
      }
    }
    return requestBody;
  }

}
