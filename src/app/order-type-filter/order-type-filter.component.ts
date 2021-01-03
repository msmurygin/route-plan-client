import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControllerURL } from 'src/environments/controllers';
import Codelkup from '../dto/codelkup';
import { RestService } from '../rest-service.service';


@Component({
  selector: 'order-type-filter',
  templateUrl: './order-type-filter.component.html',
  styleUrls: ['./order-type-filter.component.css']
})
export class OrderTypeFilterComponent implements OnInit {
  
  orderTypes : Codelkup[] = [];
  orderTypesFormControl = new FormControl();
  
  url : string = ControllerURL.CODELKUP_URL + "?listName=ORDERTYPE"

  
  
  constructor(private service : RestService) { 
    service.get<Codelkup[]>(this.url).subscribe(response =>{
      this.orderTypes = response['codeLookUps'];
    });
  }

  ngOnInit(): void {
  }


  getSelectionDescription(code : string): string {
    return code ? this.orderTypes.filter(item => item.code == code)[0].description : '';
  }
}
