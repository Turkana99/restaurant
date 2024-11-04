import { Component, ElementRef, HostListener } from '@angular/core';
import { LangService } from '../../core/services/language.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  whiteLogo = false;
  searchVisible: boolean = false;
  searchQuery: string = '';

  constructor(
    public langService: LangService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private viewportScroller: ViewportScroller,
    private elementRef: ElementRef 
  ) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  changeLanguage(language: string): void {
    const url = this.router.url;
    const [lang, ...rest] = url.substring(1, url.length).split('/');
    const [route, param] = rest;

    const newRoute = [route];
    if (param) newRoute.push(param);

    this.router.navigate([`/${language}`, ...newRoute]);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = document.querySelector('.header') as HTMLElement;
    if (window.pageYOffset > 100) {
      element.classList.add('navbar-inverse');
      this.whiteLogo = true;
    } else {
      element.classList.remove('navbar-inverse');
      this.whiteLogo = false;
    }
  }

  closeNavbar() {
    const navbarCollapse = this.elementRef.nativeElement.querySelector(
      '.navbar-collapse'
    ) as HTMLElement;
    if (navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }

  // get Language() {
  //   return this.langService.getTranslate();
  // }

  // get currentLanguage() {
  //   return this.langService.getLanguage();
  // }

  // redirectTo(route: string) {
  //   return this.langService.getRoute(this.currentLanguage)[route];
  // }
}
