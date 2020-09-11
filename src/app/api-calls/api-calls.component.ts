import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-calls',
  templateUrl: './api-calls.component.html',
  styleUrls: ['./api-calls.component.css']
})
export class ApiCallsComponent implements OnInit {

  myStr = "testing";

  constructor() { }

  ngOnInit(): void {
  }

}
