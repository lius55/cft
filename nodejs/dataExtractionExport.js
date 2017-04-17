each = function(arr, callback) {
	var element;
	for (element in arr) {
		var val = arr[element];
		if (callback.call(val, element, val) == false) {
			break;
		}
	}
	return arr;
};

const ReplaceMap = [
	{ from: '【', 	to: '(' 	},
	{ from: '】', 	to: ')' 	},
	{ from: '元年', 	to: '1年'	},
	{ from: '年年',	to: '年'		},
	{ from: ' |　|､|、|"|,|．|\\.|\\n',	to: '' },
	{ from: '\\(株\\)',  to: '株式会社' },
	{ from: '\\(有\\)',  to: '有限会社' },
	// 金額
	{ from: '壱',	to: 1		},
	{ from: '弐',	to: 2		},
	{ from: '参',	to: 3		},
	{ from: '肆',	to: 4		},
	{ from: '伍',	to: 5		},
	{ from: '陸',	to: 6		},
	{ from: '漆|質',	to: 7		},
	{ from: '捌',	to: 8		},
	{ from: '玖',	to: 9		},
	{ from: '陌|佰',	to: '百'		},
	{ from: '阡|仟',	to: '千'		},
	{ from: '萬', 	to: '万'		}
];

/**
 * 全角から半角への変革関数
 */
function toHalfWidth(strVal) {
	// 半角変換
	var replaced = strVal.replace(/[！-～]/g, function(tmpStr) {
    	// 文字コードをシフト
    	return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
    });

	return replaced;
}

function formatComp(strVal) {

	var cmpReplaceMap = [
		{ from: '【', 	to: '(' 	},
		{ from: '】', 	to: ')' 	},
		{ from: '\\(株\\)',  to: '株式会社' },
		{ from: '\\(有\\)',  to: '有限会社' },
		{ from: ' |　|､|、|"|．|\\.|\\n',	to: '' }
	];

	// 特殊文字列変換
  	each(cmpReplaceMap, function(index, element) {
  		strVal = strVal.replace(new RegExp(element.from, 'g'), element.to);
	});

	return strVal;
}

function clearContent(strVal) {

	// 特殊文字列変換
  	each(ReplaceMap, function(index, element) {
  		strVal = strVal.replace(new RegExp(element.from, 'g'), element.to);
	});

	return strVal;
}

function moveBracketBack(str) {
	var replaced = str;
	// ()付の情報は後ろに移動する
	var bracket = new RegExp('\\([^\\(]*\\)', 'g');
	var matched = replaced.match(bracket);
	if (replaced.match(bracket) != null) {
		replaced = replaced.replace(bracket, '|');
		replaced += matched.join('');
	}
	return replaced;
}

const YearMap = [
	{ from: '平成|H|h', 	to: 1988 },
	{ from: '昭和|S|s', 	to: 1925 },
	{ from: '大正|T|t', 	to: 1911 },
	{ from: '明治|M|m', 	to: 1867 }
];

const Type = {
	Date: 		'日付',
	Money: 		'金額',
	Phone: 		'電話番号',
	PeopleNum: 	'人数',
	CmpName: 	'会社名',
	EngCmpName: '英文社名',
	PostCode: 	'郵便番号',
	Location: 	'所在地',
	Fax: 		'FAX' 
};

const AmountUnit = [
	{ unit: '億',	amount: 100000000 	},
	{ unit: '千万',	amount: 10000000	},
	{ unit: '百万', 	amount: 1000000		},
	{ unit: '万',	amount: 10000		},
	{ unit: '千', 	amount: 1000		},
	{ unit: '百', 	amount: 100			},
	{ unit: '十',	amount: 10			},
	{ unit: '円',	amount: 1			},
	{ unit: '',		amount: 1			}
];

/**
 * 和暦→西歴へ変換処理
 */
function yearReplacer(match, p1, p2, p3, offset, string) {
	var replaced;
	each(YearMap, function(index, element) {
		if(element.from.indexOf(match.match(/[^\d年]+/g).join('')) > -1)  {
			let jpYear = parseInt(match.match(/[\d]+/g).join(''));
			let adYear = parseInt(jpYear + element.to);
			// console.log("match=" + match + ",to=" + adYear + "年");
			replaced = adYear + "年";
			return false;
		}
	});
	return replaced;
}

/**
 * 和暦→西歴へ変換
 */
function toJpYear(str) {
	return str.replace(/(昭和|平成|明治|大正|s|h|m|t)\d+年/gi, yearReplacer);
}

// exports.convert(input) {
// 	return dataExtraction(input);
// }

/**
 * データ整形処理
 * @param input 整形したいdataの配列
 *    配列の各要素は以下の形式で定義する必要
 *    { no: 1, type: '電話番号', content: '080-1234-1234'}
 * @return 整形後のdataの配列(inputと同じフォーマットで返却する)
 */
exports.dataExtraction = function(input) {

	// console.log('=========start=========');

	var resultArr = new Array();

	var writeFile = function(no, type, content) {
		resultArr.push({
			no: 		no,
			type: 		type,
			content: 	content
		});
	};

	each(input, function(index, element) {

		var num = element.no;
		var type = element.type;
		var content = element.content;
		content = toHalfWidth(content);

		// 英文社名
		if (type == Type.EngCmpName) {
			var content = content.replace(/([^A-Za-z,， 　,.・・&-])+/g, '');
			if (content > 1) {
				writeFile(num, Type.EngCmpName, content);
			}
		}

		// 会社名の抽出
		if (type == Type.CmpName || type == Type.Location) {

    		content = formatComp(content);

    		// 電話番号抽出
    		var cmpPhoneReplacer = function(match, p1, p2, p3, offset, string) {
    			match = match.replace(/[^\d‐ーｰ\(\)-]/g, '');
    			match = match.replace(/‐|−|-|ー|ｰ|\(|\)/g, '-');
    			// 最初と最後の-削除
    			match = match.replace(/^[^\d]+/g, '');
    			match = match.replace(/[^\d]+$/g, '');
    			if (match.length > 10) {
	    			// resultArr.push('"' + num + '","' + Type.Phone + '","' + match + '"');
	    			writeFile(num, Type.Phone, match);
    			}
    			return '|';
    		}
    		content = content.replace(/(電話|電話番号|tel)(:|\(|\)| |　|\d|‐|−|-|ー|ｰ)+/gi, cmpPhoneReplacer);

    		// 郵便番号抽出
    		var postCodeReplacer = function(match, p1, p2, p3, offset, string) {
    			match = match.replace(/[^\d‐ーｰ-]/g, '');
    			match = match.replace(/‐|−|-|ー|ｰ/g, '-');
    			match = match.replace(/^[^\d]+/g, '');
    			match = match.replace(/[^\d]+$/g, '');
    			if (match.length > 0 ) {
	    			// resultArr.push('"' + num + '","' + Type.PostCode + '","' + match + '"');
	    			writeFile(num, Type.PostCode, match);
    			}
    			return '|';
    		}
    		content = content.replace(/(〒)(:| |　|\d|‐|−|-|ー|ｰ)+/gi, postCodeReplacer);

			// FAX番号抽出
    		var faxReplacer = function(match, p1, p2, p3, offset, string) {
    			match = match.replace(/[^\d‐ーｰ\(\)-]/g, '');
    			match = match.replace(/‐|−|-|ー|ｰ|\(|\)/g, '-');
    			match = match.replace(/^[^\d]+/g, '');
    			match = match.replace(/[^\d]+$/g, '');
    			if (match.length > 0 ) {
	    			// resultArr.push('"' + num + '","' + Type.Fax + '","' + match);
	    			writeFile(num, Type.Fax, match);
    			}
    			return '|';
    		}
    		content = content.replace(/(fax)(:|\(|\)| |　|\d|‐|−|-|ー|ｰ)+/gi, faxReplacer);

    		// FAX、電話番号、郵便番号以降の内容削除する
    		content = content.replace(/\|.*/g, '');

    		// 漢字、全角カナかな、全角ひらがな、半角かたかな
    		// 会社名・所在地のうち、記号や数字で始まるもの 記号や郵便番号等の数字は除去してください。
    		content = content.replace(/^[^一-龠|\u3040-\u309F|\u30A0-\u30FF|\uFF65-\uFF9F|\u4E00-\u9FFF]+/g, '');

    		// 所在地に「地図」「マップ」「アクセスマップ」を含むもの 該当の記述以降と、直前の記号を除去してください
    		content = content.replace(/[^一-龠|\u3040-\u309F|\u30A0-\u30FF|\uFF65-\uFF9F|\u4E00-\u9FFF\d]*(地図|マップ|アクセスマップ|詳細地図|google|メールアドレス|http|☎).*/gi, '');

    		var compReplacer = function(match, p1, p2, p3, offset, string) {
    			// resultArr.push('"' + num + '","' + Type.CmpName + '","' + match + '"');
    			writeFile(num, Type.CmpName, match);
    			return '';
    		}
    		if (type == Type.CmpName) {
    			content = content.replace(/[-]+$/g, '');
    			content.replace(/^[^,|\(|\)]*(会社)[^,|\(|\)]+/g, compReplacer);
    		} else {
    			if (content.length > 1) {
    				content = content.replace(/[-]+$/g, '');
	    			// resultArr.push('"' + num + '","' + Type.Location + '","' + content + '"');
	    			writeFile(num, Type.Location, content);
    			}
    		}
		}

		content = clearContent(content);
		content = toJpYear(content);

		// 電話番号の整形
		if (type == Type.Phone) {
			// 不要な文字削除
			content = content.replace(new RegExp('‐|−|-|ー|ｰ|,|\\.|\\(|\\)', 'g'), '-');
			writeFile(num, Type.Phone, content);
			return true;
		}

		// 郵便番号の整形
		if (type == Type.PostCode) {
			writeFile(num, Type.PostCode, content);
			return true;
		}

		if (type == Type.Date || type == Type.Money || type == Type.PeopleNum) {
			content = moveBracketBack(content);
		}

		var matched = '';
		var dateReplacer = function(match, p1, p2, p3, offset, string) {
			writeFile(num, Type.Date, match.match(/\d+/g).join('-'));
			return '';
		};

		// 日付の整形
		content = content.replace(/\d{4}年\d+月\d+日|\d{4}年\d+月|\d{4}年/g, dateReplacer);

		if (type == Type.Money) {
    		// 金額の整形 (億|千万|百万|万)*/g)
    		matched = content.match(/(\d)+(億|万|千|百|円)*[^\d億万千百円]*/g);
    		if(matched != null) {
    			each(matched, function(i, e) {

    				// 単位以外のものを削除する
    				e = e.replace(/[^\d億万千百]/g, '');
    				var sumAmount = 0;
    				var matchUnit = e.match(/(\d)+(億|万|千|百|円)*/g);
    				if (matchUnit != null) {
    					each(matchUnit, function(unIndex, unElement) {

		    				var unit = unElement.match(/[^\d]/g);
		    				unit = (unit == null) ? '' : unit.join('');
			    			var amount = unElement.match(/\d/g).join('');
			    			each(AmountUnit, function(auIndex, auElement) {

			    				if (unit.indexOf(auElement.unit) > -1) {
			    					sumAmount += amount * auElement.amount;
			    					return false;
			    				}
			    			});
    					});
		    		}
	    			writeFile(num, Type.Money, sumAmount);
    			});
    		}
		}

		if (type == Type.PeopleNum) {
			matched = content.match(/(\d)+(人|名)+/g);

			if (matched != null) {
				each(matched, function(i, e) {

					var peopleNum = e.match(/(\d)+/g);
					writeFile(num, Type.PeopleNum, peopleNum.join(''));
				});
			}
		}
	});	

	// console.log('==========end==========');
	return resultArr;
}