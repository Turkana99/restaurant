import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { BusyService } from './busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private busyService: BusyService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.busyService.busy();
    return next.handle(req).pipe(
      delay(200),
      finalize(() => this.busyService.idle())
    );
  }
}