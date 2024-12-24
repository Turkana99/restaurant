import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root', // Ensure this is present
})
export class LangService {
  constantNavItem: any = {
    Az: {
      home: 'Ana Səhifə',
      menu: 'Menyu',
      resName: 'Ləziz.Restoran',
      desc: 'Hər bir boşqabın kulinariya ustalığı və ehtiraslı sənətkarlıq hekayəsini toxuduğu yer',
      btnDesc: 'Sifarişə başla',
      menuText:'Sevimli yeməklərinizi sifariş edin',
      addCartBtn:'Səbətə əlavə et',
      ordSummary:'Sifariş Xülasəsi',
      
    },
    En: {
      home: 'Home',
      menu: 'Menu',
      resName: 'Laziz.Restoran',
      desc: 'Where Each Plate Weaves a Story of Culinary Mastery and Passionate Craftsmanship',
      btnDesc: 'Start ordering',
      menuText:'Order your favorite foods',
      addCartBtn:'Add to cart',
      ordSummary:'Order Summary',
    },
    Ru: {
      home: 'Главная страница',
      menu: 'Меню',
      resName: 'Лазиз.Ресторан',
      desc: 'Где каждая тарелка сплетает историю кулинарного мастерства и страстного мастерства',
      btnDesc: 'Начать заказ',
      menuText:'Закажите ваши любимые блюда',
      addCartBtn:'Добавить в корзину',
      ordSummary:'Резюме заказа',
    },
  };
  constructor(private http: HttpClient) {}

  getLanguages(): Observable<any> {
    return this.http.get<any>(environment?.getLanguagesUrl);
  }
}
