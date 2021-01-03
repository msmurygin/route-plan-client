import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControllerURL } from 'src/environments/controllers';
import Codelkup from '../dto/codelkup';
import { RestService } from '../rest-service.service';

@Component({
  selector: 'status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.css']
})
export class StatusFilterComponent implements OnInit {
  
  statuses : Codelkup[] = [];
  statusesFormControl = new FormControl();
  
  constructor(private service : RestService) { 
    service.get<Codelkup[]>(ControllerURL.STATUSES_URL).subscribe(response =>{
      this.statuses = response['codeLookUps'];
    });
  }

  ngOnInit(): void {
  }

  getSelectionDescription(code : string): string {
    return code ? this.statuses.filter(item => item.code == code)[0].description : '';
  }
}
