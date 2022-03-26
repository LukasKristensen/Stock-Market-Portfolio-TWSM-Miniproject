import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jQuery from 'jquery';

export class userData {
  constructor(
    public userName: string,
    public Portfolio: string[],
  ){}
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit{

  uData = [{userName: "", Portfolio: ""}];

  constructor(
    private serverConnection: HttpClient
  ){}

  ngOnInit(): void {
    //this.loadServerData();
    const btnInfo = document.querySelector("#closeInfo");
    btnInfo?.addEventListener("click", this.test)


  }

  loadServerData(){
    this.serverConnection.get<any>("http://localhost:6060/requestData?test").subscribe(
      response => {
        console.log("Data:",response);
        this.uData = response;
      }
    )
  }

  test(){
    alert("jQuery works!");
  }


}
