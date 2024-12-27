import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; // PrimeNG Message Service

@Injectable()
export class MessageInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse) {
          //successful responses
          const isLogin =
            req.url.split('/')[req.url.split('/').length - 1].toLowerCase() ==
            'login';
          let method = req.method.toLowerCase();
          if (['post', 'put', 'patch', 'delete'].includes(method)) {
            this.messageService.add({
              severity: 'success',
              summary: 'Uğurlu',
              detail: `Uğurla ${
                method === 'post'
                  ? isLogin
                    ? 'giriş edildi'
                    : 'əlavə edildi'
                  : ['put', 'patch'].includes(method)
                  ? 'yeniləndi'
                  : method === 'delete'
                  ? 'silindi'
                  : ''
              }`,
              life: 2000,
            });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!(error.error instanceof ErrorEvent)) {
          let errorDetail = error?.error?.errors;
          let tempErrors = [];
          for (const key in error?.error?.errors) {
            tempErrors.push(error?.error?.errors[key]);
          }
          errorDetail = tempErrors.join('\n');
          this.messageService.add({
            severity: 'error',
            summary:
              (error?.error?.status || error?.status) +
              ' - ' +
              (error?.error?.title || 'Xəta'),
            detail:
              errorDetail ||
              error?.error?.detail ||
              'Bilinməyən xəta baş verdi',
            life: 2000,
          });
        }
        // Rethrow the error so that the caller knows it failed
        return throwError(error);
      })
    );
  }
}