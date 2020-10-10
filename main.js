// This is the content script

console.log('Loaded')

const texts = $('.info-item dd .txt-tobe-copied').toArray().map((e)=>{
    return $(e).text()
})

const name = texts[3];
const address1 = texts[4];
const address2 = "";
const zip = texts[5];
const city = texts[6];
const country = texts[7];


let all_articles = []

// const articles = big_table.find('tbody tr').get().filter((_, i) => i > 0).map((e) => {
//     return $(e).find('td').get().filter((e, i) => i !== 2 && i < 5).map(e => $.trim($(e).text()));
// });
const articles = $('.items-row').toArray().map((e)=>{
    return [
        parseInt($(e).find('.quantity').text()),
        $(e).find('.item-itemID').text().replace('(', '').replace(')', ''),
        $(e).find('.item-title').text(),
        $(e).find('.soldFor').text().replace('€', '')
    ]
})
let shipping = parseFloat($('.totals-summary > dl > div:nth-child(2) > dd').text().replace('€', ''));
console.log(articles, shipping);
console.log(name, address1, address2, zip, city, country);

all_events = $('.purchase-details .info-item dd').toArray()
let buyDay = $(all_events[3]).text()
let payDay = $(all_events[4]).text().split(' ').slice(0, 3).join(" ")

const changeDate = d => {
    const parts = d.split(' ')
    parts[1] += '.'
    return parts.join(" ")
}

console.log(buyDay, payDay)


moment.locale('de');
buyDay = moment(changeDate(buyDay), "ll");
payDay = moment(changeDate(payDay), "ll");
let buyDateString = buyDay.format('LL');
let invoiceFileDate = buyDay.format('YYYYMMDD');
let payDateString = payDay.format('LL');


let obj = {
    name,
    address1,
    address2,
    zip,
    city,
    country,
    articles,
    buyDateString,
    shipping,
    payDateString,
    invoiceFileDate
};
chrome.storage.sync.set(obj)

