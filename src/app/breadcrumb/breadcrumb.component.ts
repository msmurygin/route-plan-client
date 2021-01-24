import { Component, Injectable, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})


@Injectable({
  providedIn: 'root'
})
export class BreadcrumbComponent implements OnInit  {
  
  home  : any;
  BCmodel : any [] =  [];
  
  constructor() { 

  }
  ngOnInit(): void {}

  public registerPage(title: string, pageDescr : {name: string, url: string} , queryParams : {[k: string]: any}): void{
    if (this.BCmodel){

      let newModel = [...this.BCmodel, {
         id: pageDescr.name, 
         label: title, 
         queryParams: queryParams, 
         routerLink : pageDescr.url
       }];
      console.log("Page was registered to bread crumb model "+ pageDescr.name+" "+pageDescr.url +" "+
      " with title "+ title + queryParams['externalloadid']+" "+ queryParams['loadusr2'])

      this.BCmodel = newModel;
      this.ngOnInit();
     
    }
  }

  public unregister(id : string): void {
    if (this.BCmodel){
      this.BCmodel.forEach( (item, index) => {
        if(item.id === id) {
          this.BCmodel.splice(index,1);
          console.log("Item was deleted from bread crumb menu with id "+ id);
        }
      });

     
    }
  }

}
