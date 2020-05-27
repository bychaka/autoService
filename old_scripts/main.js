document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        let navIcon = document.getElementById('nav-icon');
        let sideBarMenu = document.getElementById('sideBarMenu');
        navIcon.onclick = function() {
            navIcon.classList.toggle('open');
            sideBarMenu.classList.toggle('opened-menu')
        };
        init ();

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

function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    let myMap = new ymaps.Map('map', {
        // При инициализации карты обязательно нужно указать
        // её центр и коэффициент масштабирования.
        center: [53.946975, 27.682178], // Москва
        zoom: 14,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });
    myMap.geoObjects
        .add(new ymaps.Placemark([53.946975, 27.682178]));

}

$(document).ready(function(){
  $("#sideBarMenu").on("click","a", function (event) {
    //отменяем стандартную обработку нажатия по ссылке
    event.preventDefault();

    //забираем идентификатор бока с атрибута href
    let id  = $(this).attr('href'),

      //узнаем высоту от начала страницы до блока на который ссылается якорь
      top = $(id).offset().top;

    //анимируем переход на расстояние - top за 1500 мс
    $('body,html').animate({scrollTop: top}, 1000);
  });
});
