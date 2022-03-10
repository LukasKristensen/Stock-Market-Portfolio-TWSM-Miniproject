import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class userData {
  constructor(
    public userName: string,
    public portfolio: string
  ){}
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent{

  uData = [{userName: "", portfolio: ""}];

  constructor(
    private serverConnection: HttpClient
  ){}

  ngOnInit(): void {
    this.loadServerData();
  }

  loadServerData(){
    this.serverConnection.get<any>("http://localhost:6060/requestData?test").subscribe(
      response => {
        console.log("Data:",response);
        this.uData = response;
      }
    )
  }

}
