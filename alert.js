Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

function run() {
    chrome.storage.sync.get(['name', 'address1', 'address2', 'zip', 'city', 'country', 'articles', 'buyDateString', 'payDateString', 'rnr', 'shipping', 'invoiceFileDate', 'reduction'], (result) => {
        const {name, address1, address2, zip, city, country, articles, buyDateString, payDateString, rnr, shipping, invoiceFileDate, reduction} = result;
        console.log(name, address1, address2, zip, city, country, articles, buyDateString, payDateString, rnr, shipping, invoiceFileDate, reduction)

        var doc = new jsPDF();


        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        let current = 30
        const writeLine = (text) => {
            doc.text(20, current, text);
            current += 4
        }
        doc.setFontSize(8);
        writeLine("Laura & Laurent Meyer, L&L Meyer GbR, Stiftsbogen 64, 81375 München")
        doc.setFontSize(10)


        writeLine(name);
        writeLine(address1)
        if (address2 && address2.length) {
            writeLine(address2)
        }
        writeLine(`${zip} ${city}`)
        writeLine(country)

        current += 10

        doc.text(pageWidth - 20, current, `Rechnungsdatum\n${buyDateString}`, {align: 'right'})

        current += 10
        doc.setFontSize(14)
        let newRnr = rnr.pad(5);
        doc.text(20, current, `Rechnung #${newRnr}`)
        doc.setFontSize(10)

        current += 15

        doc.text(20, current, 'Vielen Dank für Ihre Bestellung. Anbei finden Sie die Rechnungsaufstellung.')
        let total = 0;
        current += 10
        let articlesRow = articles.map((e, i) => {
            let quantity = parseInt(e[0])
            let price = parseFloat(e[3].replace('EUR ', '').replace(',', '.')).toFixed(2)
            let pos = (i + 1).toString();
            let desc = `${e[2].replace(/\s{2,}/g, ' ')}\nArtikel Nr.${e[1]}`;
            let quantityS = quantity.toString();
            total += price * quantity
            return [pos, desc, quantityS, price, (price * quantity).toFixed(2)]
        });
        total += shipping
        let shippingRow = [(articles.length + 1).toString(), 'Versand', '1', shipping.toFixed(2), shipping.toFixed(2)];
        let zwischensumme = ["", "", "", "Summe Netto", total.toFixed(2)];
        let reductionText = ["", "", "", "Rabatt", reduction.toFixed(2)];
        total += reduction
        let mwst = ["", "", "", "MwSt 0%*", 0.0.toFixed(2)];
        let brutto = ["", "", "", "Gesammtbetrag Brutto", total.toFixed(2)];
        let zahlung = ["", `Zahlung von ${payDateString}`, "", "", total.toFixed(2)];
        let offen = ["", `offener Betrag`, "", "", 0.00.toFixed(2)];
        doc.autoTable({
            head: [['Pos.', 'Bezeichnung', 'Menge', 'Einzel (€)', 'Gesamt (€)']],
            body: articlesRow.concat([shippingRow], [zwischensumme], [reductionText], [mwst], [brutto], [zahlung], [offen]),
            startY: current,
        })
        current = doc.lastAutoTable.finalY + 10;

        doc.text(20, current, 'Wir hoffen, Ihnen gefällt Ihr T-Shirt und Sie bestellen bald wieder in unserem ebay Shop munichcoolshirts.')
        current += 10
        doc.text(20, current, 'Wenn Sie möchten, können Sie uns gerne eine Bewertung auf ebay hinterlassen. Wir würden uns freuen.')
        current += 10
        doc.text(20, current, 'Liebe Grüße,')
        current += 5
        doc.text(20, current, 'Ihr munichcoolshirts-Team')
        current += 30
        doc.setFontSize(8)
        doc.text(20, current, '*Dieser Rechnungsbetrag enthält nach §19 Abs. 1 UStG keine USt.')

        doc.save(`${invoiceFileDate} Rechnung ${newRnr}`);
    });
}

run();