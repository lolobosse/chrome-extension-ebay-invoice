// This is the content script

const name = $("#buyercontactname").val();
const address1 = $('#buyeraddress1').val();
const address2 = $('#buyeraddress2').val();
const zip = $('#buyerzip').val();
const city = $('#buyercity').val();
const country = $('#buyercountry').children("option:selected").attr('id');

let big_table = $('#ERSShipnHand').find("table");

let all_articles = []

const articles = big_table.find('tbody tr').get().filter((_, i) => i > 0).map((e) => {
    return $(e).find('td').get().filter((e, i) => i !== 2 && i < 5).map(e => $.trim($(e).text()));
});
let shipping = parseFloat($('#ShippingAndHandling1').val());
console.log(articles, shipping);
console.log(name, address1, address2, zip, city, country);
console.log(big_table);

let dates = $('table.shreskin-edit-sales-record-status-summary').find('tbody tr').get().filter((_, i) => i === 1)[0]

let all_events = $(dates).find("td[width='200'] b, td[width='200'] a").get();
let buyDay = $(all_events[0]).text()
let payDay = $(all_events[1]).text()

console.log(buyDay, payDay)


moment.locale('de');
buyDay = moment(buyDay, "DD-MM-YY");
payDay = moment(payDay, "DD-MM-YY");
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

