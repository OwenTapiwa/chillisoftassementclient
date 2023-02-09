import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from 'src/app/_models/user'
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AccountService {
  baseUrl = environment.apiUrl
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,private router:Router) { }

  login(model:any){
    return this.http.post(this.baseUrl + 'account/login',model).pipe(
      map((response:User) => {
        const user = response;
        if(user)
        {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user:User)
  {
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);

  }

  IsLoggedIn(){
    return !!localStorage.getItem('user');
  }

  logout()
  {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/')
  }

}
