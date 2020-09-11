import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { ApiCallsComponent } from './api-calls/api-calls.component';
import { AuthInterceptorService } from './config/auth-interceptor.service'
import { HttpClientModule ,HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    ApiCallsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
