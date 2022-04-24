import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

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
    private serverConnection: HttpClient,
    private router: Router
  ){}


  ngOnInit(): void {
    document.querySelector("#closeInfo")?.addEventListener("click", function(){
      const btnInfo = document.querySelector(".infoNav");
      btnInfo?.remove();
    })
    this.ajaxRequest()
  }

  ajaxRequest(){
    var ajaxReq = new XMLHttpRequest();
    ajaxReq.onload = function(){
      if(this.readyState == 4 && this.status == 200){
        document.getElementById('ajaxRequest')!.innerHTML = this.responseText;
      }
    };
    ajaxReq.open('GET', `http://localhost:6060/ajaxPost?email=${localStorage.getItem('email')}`, true);
    ajaxReq.send();
  }

  addPosition(){
    const headers = {'content-type': 'application/json'}
    var email = localStorage.getItem('email')
    var companyInput = (<HTMLInputElement>document.getElementById('companyInput')).value
    var tickerInput = (<HTMLInputElement>document.getElementById('tickerInput')).value
    var priceInput = (<HTMLInputElement>document.getElementById('priceInput')).value
    var amountInput = (<HTMLInputElement>document.getElementById('amountInput')).value
    var dateInput = (<HTMLInputElement>document.getElementById('dateInput')).value

    var postJSON = [{"email":email, "companyInput":companyInput, "tickerInput":tickerInput,"priceInput":priceInput,"amountInput":amountInput,"dateInput":dateInput}]

    var addPositionRequest = this.serverConnection.post<any>("http://localhost:6060/addPosition",postJSON,{'headers':headers})
    addPositionRequest.subscribe()
  }

  signOut(){
    localStorage.removeItem('email')
    this.router.navigate(['login'])
  }
}
