var extractor = require('./dataExtractionExport.js');

var input = [
        { no:  1, type: '電話番号', content: '080-1234-1231' },
        { no:  2, type: '電話番号', content: '０２８７-４５-２００７' },
        { no:  3, type: '日付', content: '平成元年年9月5日有限会社として設立' },
        { no:  4, type: '金額', content: '４，０００万円' },
        { no:  5, type: '会社名', content: '(有)デジタルリサーチ' },
        { no:  6, type: '所在地', content: '長崎県佐世保市大塔町574-5TEL:0956-31-2611FAX:0956-31-2310' },
        { no:  7, type: '会社名', content: '有限会社高木自動車 〒411-0833 静岡県三島市中142-7' },
        { no:  8, type: '金額', content: '¥3000,000' },
        { no:  9, type: '金額', content: '3.5百万' },
        { no: 10, type: '金額', content: '10,000（千円）' },
        { no: 11, type: '金額', content: '10,000.00円' },
        { no: 12, type: '金額', content: '10,000.00円' },
        { no: 13, type: '会社名', content: '㈲アトランティス工房鶴居' },
        { no: 14, type: '会社名', content: '九州電力㈱' },
        { no: 15, type: '会社名', content: '株式会社ハウスメイトパートナーズ詳細はこちら' },
        { no: 16, type: '会社名', content: '東京プランニング株式会社 [ Tokyo PlanNing Co.,LTD ]' },
        { no: 17, type: '会社名', content: '株式会社ウェブクエスト/WEBQuest Corporation' },
        { no: 18, type: '会社名', content: '株式会社 ボックス・ワン\nBOX-1 CO.,LTD.' },
        { no: 19, type: '会社名', content: '株式会社 ボックス・ワン(2010年1月1日設立)' },
        { no: 20, type: '会社名', content: '株式会社' },
        { no: 21, type: '会社名', content: 'CrowdWorks株式会社子会社' },
        { no: 22, type: '会社名', content: 'パナソニック株式会社関連会社' },
        { no: 23, type: '会社名', content: 'バリスタ株式会社Barista Company Limited' },
        { no: 24, type: '会社名', content: 'ＬＥＤ’Ｓ株式会社（LED\'S Co., LTD.）' },
        { no: 25, type: '会社名', content: '✑キャン\'エンタープライゼズ株式会社' },
        { no: 26, type: '会社名', content: ';カラージュコーポレーション株式会社' },
        { no: 27, type: '会社名', content: '/有限会社ファーストエム' },
        { no: 28, type: '英文社名', content: 'WEBQuest Corporation' },
        { no: 29, type: 'Eメール', content: 'info@value-press.com' },
        { no: 30, type: 'Eメール', content: 'present[at]newtonpress.co.jp' },
        { no: 31, type: 'Eメール', content: 'E-mail：info@bondiray.com' },
        { no: 32, type: 'Eメール', content: 'sales%twin-links.jp(%を@に変えて送信して下さい)' },
        { no: 33, type: 'Eメール', content: 'E-mail：support@1000server.jpTEL：03-6277-7799HP：http://1000server.jp' },
        { no: 34, type: 'Eメール', content: '[E-mail]rf447832@yb4.so-net.ne.jp' },
        { no: 35, type: '役職', content: '河野通博' },
        { no: 36, type: '役職', content: '代表取締役社長 鈴木正人' },
        { no: 37, type: '役職', content: '代表取締役社長 高橋志郎 （1955/昭和30年生）' },
        { no: 38, type: '役職', content: '原口 達也（はらぐち たつや）' },
        { no: 39, type: '役職', content: '代表取締役社長\n小林 純夫' },
        { no: 40, type: '役職', content: '・大石 隆,\n・大石 隆"' },
        { no: 41, type: '役職', content: 'Tokyo' },
        { no: 42, type: '役職', content: '石' },
        { no: 43, type: '役職', content: '"中村美賀子（Mikako Nakamura） ブログ' }
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