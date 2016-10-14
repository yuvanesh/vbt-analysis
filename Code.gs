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


function search_moneycontrol() {
  var stocks = top15();
  var body_html = '';
  var pre_req = '<html><head><meta charset="utf-8"/><script type="text/javascript" src="http://stat.moneycontrol.co.in/mcjs/common/swfobject_2.2.js"></script><link href="http://stat.moneycontrol.co.in/mccss/pricechart/style_v1.css?v=7.5" rel="stylesheet" type="text/css" /> <script src="http://stat.moneycontrol.co.in/mcjs/common/stock-msgs.js?v=1.1" type="text/javascript"></script></head><body>';
  for(var i=0;i<15;i++) {
    var url = "http://www.moneycontrol.com/stocks/cptmarket/compsearchnew.php?search_data=&cid=&mbsearch_str=&topsearch_type=1&search_str="+stocks[i];
    var response = UrlFetchApp.fetch(url);
    var contenttext = response.getContentText();
    var new_content = contenttext.split("\n");
    var new_string = new_content.join("***");
    new_string = new_string.match(/function load_chart(.*)\'0\'\);<\/script>/g);
    if(new_string) {
      new_string[0] = new_string[0].replace(/\/stocks\/company_info/g,"http://www.moneycontrol.com/stocks/company_info");
      new_string[0] = new_string[0].replace(/\/tech_charts\/bse/g,"http://www.moneycontrol.com/tech_charts/bse");
      new_string[0] = new_string[0].replace(/chart_bse/g,"chart_bse"+i);
      new_string[0] = new_string[0].replace(/load_chart/g,"load_chart"+i);
      var object_html = '<object type="application/x-shockwave-flash" data="http://img-d02.moneycontrol.co.in/stocks/stock-graph.swf" width="800" height="350" id="chart_bse'+i+'" style="visibility: visible;"></object><script type="text/javascript">';
      new_content = new_string[0].split("***");
      new_string = new_content.join("\n");
      var stockname = "<h1>"+stocks[i]+"</h1>";
      body_html += stockname + object_html + new_string;
    }
  }
  var post_req = '</body></html>';
  var html = pre_req + body_html + post_req;
  
  var blob = Utilities.newBlob(html, 'text/plain', 'my_document.txt');
  
  MailApp.sendEmail({
    to: "p.yuvanesh@gmail.com",
    subject: "graph",
    htmlBody: html,
    attachments: [blob]
  });
}// top 15 stocks of a day(today)
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

