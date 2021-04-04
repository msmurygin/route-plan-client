import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ControllerURL } from 'src/environments/controllers';
import { AuthService } from '../login/auth.service';
import { RestService } from '../rest-service.service';


export interface IReplenishmentPriorityDataSource{
  serialKey : number;
  locationType: string;
  sku: string;
  descr: string;
  loc: string;
  qty : number;
  replenishmentQty : number;
  priority : number;
  putawayZone: string;
  bypassRoute: string;
}

export interface IReplenishmentPriorityRequestBody {
  sku: string;
  loc: string;
  zone : string;
}
export interface IPriorities {
  code : number;
  name : string;
}

export interface IReplenishmentPriorityPutBody {
  replenishmentUpdate: IReplenishmentPriorityDataSource[]
}

@Component({
  selector: 'replenishment-priority',
  templateUrl: './replenishment-priority.component.html',
  styleUrls: ['./replenishment-priority.component.css']
})
export class ReplenishmentPriorityComponent implements OnInit {

  sku: string;
  loc: string;
  putawayzone: string;

  priorities: IPriorities[] = [{code: -10000, name: "не выбрано"}, {code: 1, name : '1 - Приоритет'}, {code: 2, name : '2 - Приоритет'}, {code: 3, name : '3 - Приоритет'}, {code: 4, name : '4 - Приоритет'}];
  
  modifiedRows : IReplenishmentPriorityDataSource[]= []

  dataSource : IReplenishmentPriorityDataSource[]= []
  loading    : boolean;

  constructor(private service : RestService, private messageService : MessageService,
    private auth : AuthService) { }

  ngOnInit(): void {
  }

  createSearchBody() : IReplenishmentPriorityRequestBody{
    let body : IReplenishmentPriorityRequestBody ={
      sku : this.sku,
      loc : this.loc,
      zone: this.putawayzone
    }
    return body;
  }
  searchClicked(){
    this.loading = true;
    let requestBody : IReplenishmentPriorityRequestBody = this.createSearchBody();
    this.service.post<IReplenishmentPriorityDataSource>(ControllerURL.REPLENISHMENT_PRIORITY_URL, requestBody).subscribe(response =>{
      this.loading = false;
      if (requestBody){
        this.dataSource = response['replenishmentPriorities']
      }
    });
  }


  focusValue : any;
  onEditInit(event) : void {
    this.focusValue = event.data[event.field] 
  }

  onEditComplete(event): void {
    //console.log(event);
    if (event.data['priority'] == -10000 || event.data[event.field] == " " || event.data[event.field] == this.focusValue) {
      event.data['priority']  =  this.focusValue
      return;
    
    }
    if (this.modifiedRows){
      let alreadyModified : any = this.modifiedRows.filter(item => item.serialKey == event.data['serialKey'])
      if (alreadyModified.length > 0) {
        let modifiedObject = alreadyModified[0];
        let index = this.modifiedRows.indexOf(modifiedObject);
        if (index >-1) this.modifiedRows.splice(index, 1);
      }
      this.modifiedRows.push(event.data)
     
    }
    console.log(this.modifiedRows);
  }

  save(): void {
    if ( this.modifiedRows && this.modifiedRows.length > 0 ){
      let body : IReplenishmentPriorityPutBody = {
        replenishmentUpdate :  [... this.modifiedRows]
      }
      this.service.put(ControllerURL.REPLENISHMENT_PRIORITY_URL, JSON.stringify(body)).subscribe(response =>{
        this.messageService.add({life: 10000, closable:true, severity: 'success', summary: 'Операция прошла успешно', detail: "Данные обновлены" });
        this.cancel();
        this.searchClicked()
      })
      
    }
  }
  cancel(): void {
    if ( this.modifiedRows){
      while (this.modifiedRows.length) {
        this.modifiedRows.pop();
      }
    }
   
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }


  onBlurEvent(event){
    console.log(event)
    //this.onEditComplete(event)
  }

}
