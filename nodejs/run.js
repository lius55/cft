var extractor = require('./dataExtractionExport.js');

var input = [
	{ no: 1, type: '電話番号', content: '080-1234-1231'},
	{ no: 2, type: '電話番号', content: '０２８７-４５-２００７'},
	{ no: 3, type: '日付',	  content: '平成元年年9月5日有限会社として設立'},
	{ no: 4, type: '金額',	  content: '5,000,000円'},
	{ no: 5, type: '会社名',	  content: '(有)デジタルリサーチ'}
];

console.log('=========変換前=========');
for (var i = 0; i < input.length; i++) {
	var e = input[i];
	console.log (e.no + "," + e.type + "," + e.content);
}

console.log('=========変換後=========');
var output = extractor.dataExtraction(input);
for (var i = 0; i < output.length; i++) {
	var e = output[i];
	console.log (e.no + "," + e.type + "," + e.content);
}