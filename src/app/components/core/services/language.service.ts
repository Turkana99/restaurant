import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  lang!: string;
  culture!: string;
  private languageSubject = new BehaviorSubject<string>('');
  currentLanguage$!: any;
  constantNavItem: any = {
    'az-AZ': {
      homePage: 'Ana Səhifə',
      menu: 'Menyu',
      brandPart1: 'Ləziz.',
      brandPart2: 'Restoran',
      breadcrumbText: 'Sevimli yeməklərinizi sifariş edin',
      mainPgDesc:
        'Hər bir boşqabın kulinariya ustalığı və ehtiraslı sənətkarlıq hekayəsini toxuduğu yer',
      startOrderbtn: 'Sifarişə başla',
      ordSummary: 'Sifariş yekunu',
      total: 'Cəmi',
      frsOrderBtn: 'Səbəti təsdiqlə',
      emptyMessage: 'Bu kateqoriyada yemək yoxdur.',
      addCartbtn: 'Səbətə əlavə et',
      tableTitle: 'Masanı seçin',
      editCart: ' Düzəliş et',
      resetCart: 'Səbəti sıfırla',
      errorMessage: 'Əməliyyat uğursuz oldu!',
      resetMessage: 'Səbətiniz uğurla sıfırlandı!',
      createOrderMessage: 'Sifariş uğurla yaradıldı!',
      updateCartMessage:'Səbətiniz uğurla yeniləndi!',
      createOrderBtn:'Sifarişi tamamla',
      completeEditBtn:'Düzəlişi tamamla',
    },
    'en-US': {
      homePage: 'Home Page',
      menu: 'Menu',
      brandPart1: 'Laziz.',
      brandPart2: 'Restaurant',
      breadcrumbText: 'Order your favorite dishes',
      mainPgDesc:
        'Where Each Plate Weaves a Story of Culinary Mastery and Passionate Craftsmanship',
      startOrderbtn: 'Start ordering',
      ordSummary: 'Order Summary',
      total: 'Total',
      frsOrderBtn: 'Confirm cart',
      emptyMessage: 'No food available in this category.',
      addCartbtn: 'Add to cart',
      tableTitle: 'Select table',
      editCart: 'Edit cart',
      resetCart: 'Reset cart',
      errorMessage: 'The operation failed!',
      resetMessage: 'Your cart has been successfully reset!',
      createOrderMessage: 'Order successfully created!',
      updateCartMessage:'Your cart has been successfully updated!',
      createOrderBtn:'Complete the order',
      completeEditBtn:'Complete the edit',
    },
    'ru-RU': {
      homePage: 'Главная страница',
      menu: 'Меню',
      brandPart1: 'Лазиз.',
      brandPart2: 'Ресторан',
      breadcrumbText: 'Заказывайте любимые блюда',
      mainPgDesc:
        'Где каждая тарелка сплетает историю кулинарного мастерства и страстного мастерства',
      startOrderbtn: 'Начать заказ',
      ordSummary: 'Резюме заказа',
      total: 'Общий',
      frsOrderBtn: 'Подтвердить корзину',
      emptyMessage: 'В этой категории нет доступных продуктов.',
      addCartbtn: 'Добавить в корзину',
      tableTitle: 'Выбрать таблицу',
      editCart: 'Редактировать корзину',
      resetCart: 'Сбросить корзину',
      errorMessage: 'Операция провалилась!',
      resetMessage: 'Ваша корзина успешно сброшена!',
      createOrderMessage: 'Заказ успешно создан!',
      updateCartMessage:'Ваша корзина успешно обновлена!',
      createOrderBtn:'Завершить заказ',
      completeEditBtn:'Завершите редактирование',
    },
  };
  constructor(private http: HttpClient) {
    this.lang = JSON.parse(localStorage.getItem('lang') as string);
    this.culture = (this.lang as any)?.culture || 'az-AZ';
    this.currentLanguage$ = this.languageSubject.asObservable();
    this.languageSubject.next(this.lang);
  }

  // Getter to expose the current value of languageSubject
  get currentLanguageValue(): string {
    console.log('current language', this.languageSubject.value);

    return this.languageSubject.value;
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(environment.getLanguagesUrl);
  }

  setLanguage(language: { culture: string; displayName: string }) {
    localStorage.setItem('lang', JSON.stringify(language));
    this.lang = JSON.parse(localStorage.getItem('lang') as string);
    this.culture = (this.lang as any)?.culture;
    this.languageSubject.next(language.culture);
  }

  getTranslate() {
    return this.constantNavItem[this.culture];
  }
}
