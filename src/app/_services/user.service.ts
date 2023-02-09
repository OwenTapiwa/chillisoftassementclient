import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SysUsers } from '../_models/sysUsers';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getUsers(){
    return this.http.get<SysUsers[]>(this.baseUrl + 'users').pipe(
      map(users => {
        return users;
      })
    )
  }

}
