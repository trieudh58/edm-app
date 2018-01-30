var http = require('http');
 
/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET
var records=[{"subjectCode": "POL1001","attempt": [{"score": "6.19","semester": 1}]}];

var url = 'http://localhost:8081/webservices/score/predict?subjectCode=PHI1004&gender=Nam&semester=3&records='+JSON.stringify(records);
 
console.log('Options prepared:');
console.info(url);

http.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log(body);
  });
});