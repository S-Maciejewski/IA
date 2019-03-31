const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request = require('request');

class Car {
    constructor(name, price, size) {
        this.name = name;
        this.price = price;
        this.size = size;
        this.ratio = Number(price) / Number(size) * 1000;
    }
    show() {
        console.log('\nName: ', this.name);
        console.log('Price: ', this.price);
        console.log('Engine size: ', this.size);
        console.log('Price per liter of engine capacity: ', this.ratio);
    }
}

request('https://www.otomoto.pl/osobowe/?search%5Bnew_used', function (error, response, body) {
    const dom = new JSDOM(body);
    var list = dom.window.document.querySelector(".offers.list").querySelectorAll('article');

    var results = new Array();
    for (var i = 0; i < list.length; i++) {
        name = price = size = null;
        if (list[i].querySelector('.offer-title a').getAttribute('title'))
            name = list[i].querySelector('.offer-title a').getAttribute('title');

        if (list[i].querySelector('.offer-price__number'))
            price = list[i].querySelector('.offer-price__number').textContent.replace(' ', '').replace('PLN', '').replace('EUR', '').replace('\n', '');

        if (list[i].querySelector('.offer-item__content .offer-item__params li[data-code="engine_capacity"] span'))
            size = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="engine_capacity"] span').textContent.replace('cm3', '').replace(' ', '');

        if (name && price && size) 
            results.push(new Car(name, price, size));
    }
    results.sort((a, b) => (a.ratio < b.ratio) ? 1 : ((a.ratio > b.ratio) ? -1 : 0));
    results.forEach(obj => obj.show());
});

