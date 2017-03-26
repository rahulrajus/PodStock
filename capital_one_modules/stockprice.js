function getData() {
    var url = 'http://query.yahooapis.com/v1/public/yql';
    var symbol = $("#symbol").val();
    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
        .done(function (data) {
            $('#result').text("Price: " + data.query.results.quote.LastTradePriceOnly);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log('Request failed: ' + err);
        });
}