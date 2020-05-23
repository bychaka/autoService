document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        let navIcon = document.getElementById('nav-icon');
        console.log(navIcon);
        navIcon.onclick = function() {
            navIcon.classList.toggle('open');
        };
        init ();
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