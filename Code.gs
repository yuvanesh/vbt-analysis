// top 15 stocks of a day(today)
function top15() {
  var url = "http://money.rediff.com/gainers/bse/daily/groupa"
  var response = UrlFetchApp.fetch(url);
  var contenttext = response.getContentText();
  var result_stocks = contenttext.match(/companies\/(.*)\//mg);
  result_stocks = result_stocks.splice(0,15);
  for(var i=0;i<15;i++) {
    result_stocks[i] = result_stocks[i].split('/')[1];
  }
  return result_stocks;
}

