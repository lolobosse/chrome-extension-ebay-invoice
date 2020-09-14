// var app = chrome.runtime.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {
    debugger;
    console.log("the doc loaded")
    var form = document.getElementById("form")
    console.log(form)
    form.addEventListener('submit', function (e) {
        e.preventDefault()
        console.log("added to the form")
        var rnr = parseInt(document.getElementById('rnr').value)
        console.log(rnr);
        chrome.storage.sync.set({rnr}, function () {
            console.log('Has been set')
            concatenateInjections(["jquery-3.5.1.min.js",
                "jspdf.min.js",
                "jspdf.plugin.autotable.js",
                "moment-with-locales.min.js"],
                'alert.js')
        })

    })
});

function concatenateInjections(ar, scrpt) {
    var i = ar.length;
    var idx = 0;

    function inject(idx) {
        idx++;
        if (idx <= i) {
            var f = ar[idx - 1];
            chrome.tabs.executeScript({file: f}, function () {
                inject(idx);
            });
        } else {
            if (typeof scrpt === 'undefined') return;
            chrome.tabs.executeScript({file: scrpt});
        }
    }

    inject(idx);
}