const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const rp = require('request-promise');
var results = new Array();

class Car {
    constructor(name, price, size, year, mileage, fuelType) {
        this.name = name;
        this.price = price;
        this.size = size;
        this.year = year;
        this.mileage = mileage;
        this.fuelType = fuelType;
        this.ratio = Number(price) / Number(size) * 1000;
    }
    show() {
        console.log('\nName: ', this.name);
        console.log('Year: ', this.year);
        console.log('Mileage: ', this.mileage);
        console.log('Fuel type: ', this.fuelType);
        console.log('Price: ', this.price);
        console.log('Engine size: ', this.size);
        console.log('Price per liter of engine capacity: ', this.ratio);
    }
}

function getPageData(page) {
    return rp('https://www.otomoto.pl/osobowe/?search_new_used=&page=' + page).then(body => {
        console.log('Getting data from https://www.otomoto.pl/osobowe/?search_new_used=&page=' + page)
        const dom = new JSDOM(body);
        var list = dom.window.document.querySelector(".offers.list").querySelectorAll('article');

        for (var i = 0; i < list.length; i++) {
            if (list[i].querySelector('.offer-title a').getAttribute('title'))
                name = list[i].querySelector('.offer-title a').getAttribute('title');
            if (list[i].querySelector('.offer-price__number'))
                price = list[i].querySelector('.offer-price__number').textContent.replace(/ /g, '').replace('PLN', '').replace('EUR', '').replace('\n', '');
            if (list[i].querySelector('.offer-item__content .offer-item__params li[data-code="engine_capacity"] span'))
                size = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="engine_capacity"] span').textContent.replace('cm3', '').replace(' ', '');
            if (list[i].querySelector('.offer-item__content .offer-item__params li[data-code="year"] span'))
                year = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="year"] span').textContent;
            if (list[i].querySelector('.offer-item__content .offer-item__params li[data-code="mileage"] span'))
                mileage = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="mileage"] span').textContent;
            if (list[i].querySelector('.offer-item__content .offer-item__params li[data-code="fuel_type"] span'))
                fuelType = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="fuel_type"] span').textContent;

            if (name && price && size && mileage && fuelType)
                results.push(new Car(name, price, size, year, mileage, fuelType));
        }
    });
}

async function getData(pages) {
    for (var page = 1; page <= pages; page++)
        await getPageData(page);
    results.sort((a, b) => (a.ratio < b.ratio) ? 1 : ((a.ratio > b.ratio) ? -1 : 0));
    results.forEach(obj => obj.show());
}

getData(3);
