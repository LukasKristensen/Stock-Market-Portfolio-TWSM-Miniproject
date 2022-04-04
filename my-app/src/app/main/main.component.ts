import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    // this.loadServerData();
    document.querySelector("#closeInfo")?.addEventListener("click", function(){
      const btnInfo = document.querySelector(".infoNav");
      btnInfo?.remove();
    })
  }

  loadServerData(){
    this.serverConnection.get<any>("http://localhost:6060/requestData?test").subscribe(
      response => {
        console.log("Data:",response);
        this.uData = response;
      }
    )
  }

  //AJAX Request structure made based on: https://www.w3schools.com/xml/ajax_xmlhttprequest_send.asp
  ajaxRequest(){
    var ajaxReq = new XMLHttpRequest();
    ajaxReq.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        document.getElementById('.ajaxRequest')!.innerHTML = this.response;
      }
    };
    ajaxReq.open('GET', '', true);
    ajaxReq.send();
  }
}
