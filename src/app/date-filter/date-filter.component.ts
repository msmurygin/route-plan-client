import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
}
