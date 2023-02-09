import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { ForgotComponent } from './forgot/forgot.component';
import { RegisterComponent } from './register/register.component';
import { OtpComponent } from './otp/otp.component';
import { FormsModule } from '@angular/forms';

import { LockscreenComponent } from './lockscreen/lockscreen.component';


@NgModule({
  declarations: [LoginComponent, ForgotComponent, RegisterComponent, OtpComponent, LockscreenComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule
  ]
})
export class LoginModule { }
