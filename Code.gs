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

function Head_Html() {
  return '<html><head><meta charset="utf-8"/><script type="text/javascript" src="http://stat.moneycontrol.co.in/mcjs/common/swfobject_2.2.js"></script><link href="http://stat.moneycontrol.co.in/mccss/pricechart/style_v1.css?v=7.5" rel="stylesheet" type="text/css" /> <script src="http://stat.moneycontrol.co.in/mcjs/common/stock-msgs.js?v=1.1" type="text/javascript"></script></head><body>';
}

function average_volume_brakeout_fold(str) {
  var url = str.match(/http:\/\/www\.moneycontrol\.com\/tech_charts\/bse\/his(.*)csv/);
  url = url[0].split("'")[0];
  var response = UrlFetchApp.fetch(url);
  var contenttext = response.getContentText();
  contenttext = contenttext.split(" 201");
  var sum = 0;
  for(var i=contenttext.length-1;i>=contenttext.length-100;i--) {
    sum += parseInt(contenttext[i].split(',')[5]);
  }
  var average = sum / 100;
  var today = parseInt(contenttext[contenttext.length-1].split(',')[5]);
  var brakeout_fold = today/average;
  
  return brakeout_fold;
  
}

function search_moneycontrol() {
  var stocks = top15();
  var body_html = '';
  
  for(var i=0;i<15;i++) {
    var news_and_announcement_html = '';
    var url = "http://www.moneycontrol.com/stocks/cptmarket/compsearchnew.php?search_data=&cid=&mbsearch_str=&topsearch_type=1&search_str="+stocks[i];
    var response = UrlFetchApp.fetch(url);
    var contenttext = response.getContentText();
    var content_array = contenttext.split("\n");
    var new_string = content_array.join("***");
    
    var news_and_announcement = new_string.match(/<div class="PA15 MB3">(.*)more video/ig);
    if(news_and_announcement) {
      news_and_announcement[0] += "</a></div></div></div>"
      var news_and_announcement_arr = news_and_announcement[0].split("***");
      news_and_announcement_html = news_and_announcement_arr.join("\n");
    }
    
    new_string = new_string.match(/function load_chart(.*)\'0\'\);<\/script>/g);
    if(new_string) {
      new_string[0] = new_string[0].replace(/\/stocks\/company_info/g,"http://www.moneycontrol.com/stocks/company_info");
      new_string[0] = new_string[0].replace(/\/tech_charts\/bse/g,"http://www.moneycontrol.com/tech_charts/bse");
      new_string[0] = new_string[0].replace(/chart_bse/g,"chart_bse"+i);
      new_string[0] = new_string[0].replace(/load_chart/g,"load_chart"+i);
      var object_html = '<object type="application/x-shockwave-flash" data="http://img-d02.moneycontrol.co.in/stocks/stock-graph.swf" width="800" height="350" id="chart_bse'+i+'" style="visibility: visible;"></object><script type="text/javascript">';
      
      content_array = new_string[0].split("***");
      new_string = content_array.join("\n");
      var stockname = "<h1>"+stocks[i]+"</h1>";
      
      var avg_vol = average_volume_brakeout_fold(new_string);
      var avg_vol_html = "<h3>"+avg_vol+"</h3>";
      
      if(avg_vol >= 3.0) {
        body_html += stockname + avg_vol_html + object_html + new_string + news_and_announcement_html;
      }
    }
  }
  var post_req = '</body></html>';
  var html = Head_Html() + body_html + post_req;
  
  var blob = Utilities.newBlob(html, 'html/text', 'my_document.html');
  
  MailApp.sendEmail({
    to: "p.yuvanesh@gmail.com",
    subject: "graph",
    htmlBody: html,
    attachments: [blob]
  }); 
}