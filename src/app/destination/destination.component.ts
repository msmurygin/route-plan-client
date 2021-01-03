import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControllerURL } from 'src/environments/controllers';
import { RestService } from '../rest-service.service';


@Component({
  selector: 'destination-filer',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css']
})
export class DestinationComponent implements OnInit {

  destinations : String[] = [];
  destinationConrol = new FormControl();
  
  constructor(private service : RestService) { 
    service.get<String[]>(ControllerURL.DESTINATION_URL).subscribe(response =>{
      this.destinations = response['routes'];
    });

  }

  ngOnInit(): void {
  }

}
