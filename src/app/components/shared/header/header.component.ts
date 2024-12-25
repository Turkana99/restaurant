import { Component, ElementRef, HostListener } from '@angular/core';
import { LangService } from '../../core/services/language.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  whiteLogo = false;
  searchVisible: boolean = false;
  searchQuery: string = '';
  languages: { code: string; displayName: string }[] = [];
  selectedLanguage: string = 'Az';

  constructor(
    public langService: LangService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private viewportScroller: ViewportScroller,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.getAllLanguage();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
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

  // Fetch all available languages
  getAllLanguage() {
    this.langService.getLanguages().subscribe((response) => {
      this.languages = response.items;
    });
  }

  // Change language and notify other components
  changeLanguage(lang: { code: string; displayName: string }) {
    this.selectedLanguage = lang.displayName;
    this.langService.setLanguage(lang.code); // Notify the service
    console.log('Language changed to:', lang.code);
  }
}
