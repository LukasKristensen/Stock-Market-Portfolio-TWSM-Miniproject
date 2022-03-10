import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class userData {
  constructor(
    public userName: string,
    public portfolio: string
  ){}
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  title = 'my-app';
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
