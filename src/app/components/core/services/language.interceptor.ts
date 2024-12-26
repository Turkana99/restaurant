import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LangService } from './language.service';
@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const language = inject(LangService).culture;

    const modifiedReq = req.clone({
      setHeaders: { language: language },
    });
    return next.handle(modifiedReq);
  }
}
