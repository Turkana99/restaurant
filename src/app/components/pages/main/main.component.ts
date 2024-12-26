import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from '../../core/services/language.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  providers: [LangService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(private router: Router, private langService: LangService) {}
  startOder() {
    this.router.navigate(['/menu']);
  }
  get Language() {
    return this.langService.getTranslate();
  }
}
