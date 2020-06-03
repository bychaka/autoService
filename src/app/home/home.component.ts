import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { HostListener } from '@angular/core';
import {LocationStrategy} from "@angular/common";
import {MainService} from "../shared/main.service";
import {sampleSize} from "lodash"
declare var $: any;
declare var ymaps:any;

const defaultComment = [
    {
      rating: 5,
      comment:"Крутой салон занимающийся большим спектром работ.\n" +
        "              На мазду делал замену оптики и тд. Все работы были выполнены\n" +
        "              в срок и качественно. Парням огромное спасибо.",
      date:"12.11.20",
      userName:"Дима",
      userId:"5ed060b6343e351cc07ac78c",
      orderId:"5ed363a36720d335c4c8f7f3",
      car:"Мазда 6"
    }
  ];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @HostListener('window:popstate', ['$event'])
  yandexMap: any;
  comments = [];

  constructor(private router: Router, location: LocationStrategy, private mainService: MainService) {
    location.onPopState(() => {
      setTimeout(() => {
        this.oldScripts();
      })
    });
  }

  get getRandomComments() {
    return sampleSize(this.comments, 3);
  }

  ngOnInit(): void {
    this.mainService.getComments().then(result => {
      if (result.length) {
        this.comments = result;
      } else {
        this.comments = defaultComment;
      }
    });
    this.yandexMapsInit();
    $(window).bind("pageshow", function(event) {
      if (event.originalEvent.persisted) {
        window.location.reload()
      }
    });
  }

  ngAfterViewInit(): void {
      this.oldScripts();
  }

  goLogin() {
    this.router.navigate(['login']);
  }

  oldScripts() {
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        let navIcon = document.getElementById('nav-icon');
        let sideBarMenu = document.getElementById('sideBarMenu');
        navIcon.onclick = function() {
          navIcon.classList.toggle('open');
          sideBarMenu.classList.toggle('opened-menu')
        };

        $("#sideBarMenu").on("click","a", function (event) {
          //отменяем стандартную обработку нажатия по ссылке
          event.preventDefault();

          //забираем идентификатор бока с атрибута href
          let id  = $(this).attr('href');
          if (id) {
            //узнаем высоту от начала страницы до блока на который ссылается якорь
            let top = $(id).offset().top;
            //анимируем переход на расстояние - top за 1500 мс
            $('body,html').animate({scrollTop: top}, 1000);
          }
        });

        $('.carousel .carousel-item').each(function(){
          let next = $(this).next();
          if (!next.length) {
            next = $(this).siblings(':first');
          }
          next.children(':first-child').clone().appendTo($(this));

          for (var i=0;i<2;i++) {
            next=next.next();
            if (!next.length) {
              next = $(this).siblings(':first');
            }

            next.children(':first-child').clone().appendTo($(this));
          }
        });

        $('.mc-item-wrap ul').each(function() {
          $(this).after('<div class="mc-item-wrap-after"></div>');
          $('.mc-item-wrap.active').children('ul').show();
        });
        $('.mc-toggle').click(function(){
          $('body .mc-wrap .mc-item-wrap > ul, .mc-item-wrap-after').hide();
          $('.mc-item-wrap').removeClass('active');
          $(this).parent().children('ul').show();
          $(this).parent().addClass('active');
          $(this).parent().children('.mc-item-wrap-after').show();
        });
      }
    };

  }
  yandexMapsInit() {
    ymaps.ready().then(() => {
        // Создание экземпляра карты и его привязка к контейнеру с
        // заданным id ("map").
        this.yandexMap = new ymaps.Map('map', {
          // При инициализации карты обязательно нужно указать
          // её центр и коэффициент масштабирования.
          center: [53.946975, 27.682178],
          zoom: 14,
          controls: []
        }, {
          searchControlProvider: 'yandex#search'
        });
      this.yandexMap.geoObjects
          .add(new ymaps.Placemark([53.946975, 27.682178]));
    });
  }
}

