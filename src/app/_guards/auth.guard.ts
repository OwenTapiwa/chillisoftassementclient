import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AccountService} from '../_services/account.service'
import{ToastrService} from 'ngx-toastr';
import { map,take } from 'rxjs/operators';
import { User } from 'src/app/_models/user'



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService,private router:Router,private toastr: ToastrService){}
  canActivate(): boolean{
      var loggedIn = this.accountService.IsLoggedIn();
      if(loggedIn){
        return true;
      }else{
        this.router.navigateByUrl('/login');
        return true;
      }

  }
}
  

