const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const rp = require('request-promise');
const fs = require('fs');
var results = new Array();

class Car {
    constructor(name, price, engineSize, year, mileage, fuelType) {
        this.name = name;
        this.price = price;
        this.engineSize = engineSize;
        this.year = year;
        this.mileage = mileage;
        this.fuelType = fuelType;
        this.ratio = Number(price) / Number(engineSize) * 1000;
    }
    show() {
        console.log('\nName: ', this.name);
        console.log('Year: ', this.year);
        console.log('Mileage: ', this.mileage);
        console.log('Fuel type: ', this.fuelType);
        console.log('Price: ', this.price);
        console.log('Engine size: ', this.engineSize);
        console.log('Price per liter of engine capacity: ', this.ratio);
    }
}

function getPageData(page) {
    return rp('https://www.otomoto.pl/osobowe/?search_new_used=&page=' + page).then(body => {
        console.log('Getting data from https://www.otomoto.pl/osobowe/?search_new_used=&page=' + page)
        const dom = new JSDOM(body);
        var list = dom.window.document.querySelector(".offers.list").querySelectorAll('article');

        if (list)
            for (var i = 0; i < list.length; i++) {
                name = list[i].querySelector('.offer-title a').getAttribute('title');

                price = list[i].querySelector('.offer-price__number');
                if (price) price = price.textContent.replace(/ /g, '').replace('PLN', '').replace('EUR', '').replace('\n', '');

                engineSize = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="engine_capacity"] span');
                if (engineSize) engineSize = engineSize.textContent.replace('cm3', '').replace(' ', '');

                year = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="year"] span');
                if (year) year = year.textContent;

                mileage = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="mileage"] span');
                if (mileage) mileage = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="mileage"] span').textContent;

                fuelType = list[i].querySelector('.offer-item__content .offer-item__params li[data-code="fuel_type"] span');
                if (fuelType) fuelType = fuelType.textContent;

                if (name && price && engineSize && mileage && fuelType)
                    results.push(new Car(name, price, engineSize, year, mileage, fuelType));
            }
    }).catch(err => {
        console.log('Error occured while getting data, details: ', err);
    });
}

function getPages(pages) {
    let promises = [];
    for (var page = 1; page <= pages; page++)
        promises.push(getPageData(page));
    return Promise.all(promises);
}

async function getDataParallel(pages, showResults = true) {
    await getPages(pages);
    results.sort((a, b) => (a.ratio < b.ratio) ? 1 : ((a.ratio > b.ratio) ? -1 : 0));
    if (showResults) results.forEach(obj => obj.show());
    writeResultsToCSV();
}

async function getDataSequential(pages, showResults = true) {
    for (var page = 1; page <= pages; page++)
        await getPageData(page);
    results.sort((a, b) => (a.ratio < b.ratio) ? 1 : ((a.ratio > b.ratio) ? -1 : 0));
    if (showResults) results.forEach(obj => obj.show());
    writeResultsToCSV();
}

function writeResultsToCSV() {
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(results[0]);
    let csv = results.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\"/g, '')).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r\n');

    fs.writeFile("cars.csv", csv, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Csv file successfully generated");
    });
}

getDataParallel(100, false);
