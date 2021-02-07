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

  priorities: IPriorities[] = [{code: 1, name : '1 - Приоритет'}, {code: 2, name : '2 - Приоритет'}, {code: 3, name : '3 - Приоритет'}, {code: 4, name : '4 - Приоритет'}];
  
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


  onEditInit(event): void {
    //console.log(event);
    //console.log('Edit Init Event Called');
  }
  onEditComplete(event): void {
    this.modifiedRows.push(event.data)
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

}
