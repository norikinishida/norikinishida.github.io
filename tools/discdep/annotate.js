'use strict';

var app = angular.module('MyApp', ['ngFileUpload', 'ngToast']);

app.constant('CONSTANTS', {
    // 談話関係クラス
    relations: [
        // COVID19-DT
        'ROOT',
        'ELABORATION',
        'EXEMPLIFICATION',
        'DEFINITION',
        'CONTRAST',
        'COMPARISON',
        'CAUSE-RESULT-REASON',
        'CONDITION',
        'JOINT',
        'BACKGROUND',
        'ENABLEMENT',
        'MANNER-MEANS',
        'EVALUATION-CONCLUSION',
        'ATTRIBUTION',
        'SAME-UNIT',
        'TEXTUAL-ORGANIZATION',
        // GENIA
        // "Root",
        // "Elaboration",
        // "Contrast-Comparison",
        // "Cause-Reason-Result",
        // "Condition-Temporal",
        // "Joint",
        // "Background",
        // "Enablement",
        // "Manner-Means",
        // "Evaluation-Conclusion",
        // "Attribution",
        // "Same-Unit",
        // "Textual-Organization",
        // Special relations
        'SEGMENTATION-ERROR',
        // 'FIXME',
    ],
    // Colors are set according to the palette of The New England Journal of Medicine
    // 色
    NORMAL_LINK_COLOR: '#0072B5',
    NORMAL_LABEL_COLOR: '#BC3C29',
    BLINK_LINK_COLOR: '#E18727',
    BLINK_LABEL_COLOR: '#E18727',
    BUTTON_COLOR: '#20854E',
    BAR_COLOR: '#20854E',
    //MAX_N: 150,
    MAX_N: 500,
    //  全体の横幅
    CANVAS_WIDTH: 1500, // canvas_height will be automatically set.
    SAMPLE_FILES: [
        '00c862a6402381a8541bcffe843696e059095300.edu.txt.dep',
        '0146a0b36f80ebcb868c7e16fb60c1a9d2afbf83.edu.txt.dep',
        '0b362bc7e9278b56c2740ab7bc10e91c036f835a.edu.txt.dep',
        '0b7581ab8ae5da78a11692b4c7d9399ec6dea283.edu.txt.dep',
        '0c44f901baca3850ff6e79e5f26ee898faa9b68d.edu.txt.dep',
        '1399e34d62b515e482ccde6c4cae500b19546909.edu.txt.dep',
        '13e4291652008b528006f89f67d55955c2aac729.edu.txt.dep',
        '1723e7c27aadbc83619fd69629fcc089e700418b.edu.txt.dep',
        '17c5d5036721bc5935b23a9e23f69fde366ecc20.edu.txt.dep',
        '1ca87acde2d673e129b4360d84dce19f2555438b.edu.txt.dep',
        '1d5a95f805753e4ae9c605845a395adf47cabce8.edu.txt.dep',
        '1dc818a92b31dc871d7020ec659faaeb38e519c6.edu.txt.dep',
        '2074781d7ca96edc1ef37f4cc7196856653a14e0.edu.txt.dep',
        '20ec367d459abe3e88b7db18a359f087c37bd90e.edu.txt.dep',
        '2134f97f11e3c3aee6903f4971a2d1195f9620b0.edu.txt.dep',
        '21a551af356295ada6e657054646444bca9d202b.edu.txt.dep',
        '21a572a6c0f75baa745480e28b596d73d4492cc8.edu.txt.dep',
        '23d06bd7a12e6e729f5b2b06bbe825eb9a91270e.edu.txt.dep',
        '25aad84c22269cf7221d0c22737e2e01a36ec51b.edu.txt.dep',
        '2bc85cf8715cbd57eb454b5a0d8966c787aca1e5.edu.txt.dep',
        '2c798963aaa2245c095624af78d5638bebf60c2f.edu.txt.dep',
        '2cd74646ef69d8ea8f04a046a88eb22dc7187dab.edu.txt.dep',
        '2cfc9d870895fa21b90e90ab86d1343b0da35457.edu.txt.dep',
        '2ebd4ba5ce0c32a5c7ef6396e35262bd667f1dcc.edu.txt.dep',
        '2f6efc4edc0c9fffd3acc810efd8616e7772b28a.edu.txt.dep',
        '2f8012db8f2100bb1876e19722d6c131849e2315.edu.txt.dep',
        '31fae2807695521804442fedcd3f7b9f17d0f9ea.edu.txt.dep',
        '338d45deb88de8cc7f4cf5158c4752fb3533a0b7.edu.txt.dep',
        '34694791cd158e785ad16404d5d34ad8559792c0.edu.txt.dep',
        '352657225f9b69e4693a466de17c2a4d55ccc1d3.edu.txt.dep',
        '36f9ee4d21bf47a3f9f504f7fca3a1db625899d2.edu.txt.dep',
        '3b2db322b3470bdbc2145b4b348b1dc2c8e054ec.edu.txt.dep',
        '3d026627a1f1f6af6f6fbb07bbcb84d917c7c946.edu.txt.dep',
        '3e8d0363f49f83917e0ddddf7b4322186da47dbc.edu.txt.dep',
        '3f8d61cff42f5714412479237e85de075e817fae.edu.txt.dep',
        '414d4a7cbe08a1904b9b3c2716562f40983f1087.edu.txt.dep',
        '422787d1a8391db8a23e809e861e477df0753c99.edu.txt.dep',
        '43568a4ba8221af0f87a1c7d1ddbd2a48eb27e79.edu.txt.dep',
        '4467298e39f2e2c43a48135ce26a887ea78b5706.edu.txt.dep',
        '492a1c000e859332a6e5d333aef1d74c4147b4e1.edu.txt.dep',
        '4c76e1e9a4f5afc01accd2dbbd43f0463744e8d2.edu.txt.dep',
        '4cace95b9b4e1f4af324d1fa278274c53c2b00af.edu.txt.dep',
        '5405330f85660bb35ec960a144e904c54c4c67a7.edu.txt.dep',
        '5c2bd95f80ed7229802a7fd01731a2586702f8b3.edu.txt.dep',
        '6197b0f53a6a883f99c2602a89309b8b2f27da92.edu.txt.dep',
        '628c524b306aaaa50ae9b6a7017423445fd97c44.edu.txt.dep',
        '6b72cc2cfb96b6ed68bbf031175f2ff18ac80d2c.edu.txt.dep',
        '6e704c9d3e78ca76678b668e56990e6a02c0e966.edu.txt.dep',
        '74c27dd895ee9f14d0b9584b8a3551a0600f05e2.edu.txt.dep',
        '762f9b6467251b8e21ad0a838c12a2c6c5ab9a10.edu.txt.dep',
        '79fa8fdc827ebf13a568461671621f811d9af7f5.edu.txt.dep',
        '80bd28c8ba829f2173211a2fad8f98657676e0a6.edu.txt.dep',
        '8d0569b9fe93d0997ca38060117ffc6381122957.edu.txt.dep',
        '90662d7dc7b09e018829ae2bc13e167b218931d8.edu.txt.dep',
        '909b7a89053c834c12a9d4348e977e66c6116d42.edu.txt.dep',
        '97adff711db916914190dd5fde9ec4923a13f46d.edu.txt.dep',
        '998006100007fee546077ce3c05ded0d35d08ff8.edu.txt.dep',
        '9f75a36d8f57e382a717ee506b636cbdb355802a.edu.txt.dep',
        'a64f73ac0e74f9eca66d9c4876006757c8399e49.edu.txt.dep',
        'a6f51bc35967b5ec3948012d00a543a9f51b450f.edu.txt.dep',
        'a7ba852208db4acf89b85705dd9a04d667da521c.edu.txt.dep',
        'a924e53c9e50e932f6d0b3938b5bdf284e1736a7.edu.txt.dep',
        'a987e584291a44e8bbab14f9909629b8bba57853.edu.txt.dep',
        'ab47b7fee600cd540e17d363002a05a3bdfdd306.edu.txt.dep',
        'ac51af9995edb441f0ce4fdc384908daa6e83675.edu.txt.dep',
        'ad147a4279222c5e480a5636fb879540eded760e.edu.txt.dep',
        'aedcbf29dcf8ecc0cf24cccd05124571f06fe258.edu.txt.dep',
        'b25406fedda8c98e076135cef12df228ca6fd4f1.edu.txt.dep',
        'b61d4d87ea3b4fa2ff058ee867bdac4f15c0cf11.edu.txt.dep',
        'ba3522d00ecebd159c5b5dc90119df8642993c49.edu.txt.dep',
        'ba755009e5f7330a8344f1b2dd8e65d54b8488e8.edu.txt.dep',
        'bcbee2c092b43738b2504034db8246acb059d4c5.edu.txt.dep',
        'be7c8e5eb861bc4ef5334a348c6741638ffef108.edu.txt.dep',
        'c0e6a4d852babb843d63198cc1e16146efc108b1.edu.txt.dep',
        'c280d46d6fa7e2c2938a5c09bd6b092e1058a9b0.edu.txt.dep',
        'c4aa9bb066a64db00b8bdd44d5c021c5603a09a2.edu.txt.dep',
        'c526fbee33eed355a7c7437950603c4835418b0e.edu.txt.dep',
        'c90121a3f539b59d4b528f3a1dd172b75533c0cc.edu.txt.dep',
        'ca2a4dbdc3d133ac018b4427e143e1a5ca45d1eb.edu.txt.dep',
        'cb6074cfc9898c507ee6f98f9888fb652b409069.edu.txt.dep',
        'ceda3aacfcc249a8bdff8eb316c13638860e560b.edu.txt.dep',
        'd125abb6f1e1cb460e9dd29bf71df2895151761d.edu.txt.dep',
        'd1bc51c207da125a38e3ab23f94966c37bf6bf8f.edu.txt.dep',
        'd1ce2321a8a67ec9c9823cb9c15543fce565ed85.edu.txt.dep',
        'd2bf31d4a63b71e7b5bb16f4375134d4ef881d25.edu.txt.dep',
        'd7e5ba009aed400fac0a223f7fe364b16ac84ae6.edu.txt.dep',
        'd87f44c7d76e4c51ed8e72103669c275e2db3e71.edu.txt.dep',
        'db9cea6a24f86d7bc1250050693fd459e3de6e2b.edu.txt.dep',
        'e296fa71274bad6cabcf683a2ba47e58b1326877.edu.txt.dep',
        'e29e17f37924d1d14edf56276a5dcca87851e62f.edu.txt.dep',
        'e6aaada1af8e6361fefb6307231035a4da1c6141.edu.txt.dep',
        'e767d7dc7a215fc7e1eed093425089a179eba77a.edu.txt.dep',
        'e8c619b901c3fd4c2e830df5c471e7b7d204be6b.edu.txt.dep',
        'eb68173ed9ade0c27573673e9a45ef1be8191edc.edu.txt.dep',
        'ed43a39e585d77f1fecd662508f8042ed4ad3396.edu.txt.dep',
        'ee370aa6a34ccb5c96e1a213dbed64a2fe4af89f.edu.txt.dep',
        'eeb7b153d2cd9b4aa3ce620bb2f1e538596a9309.edu.txt.dep',
        'f7185938312bfa794681998fe0bff4e2697c053d.edu.txt.dep',
        'f729e0e5f3472840a5f1be47d12b29c83d1c4879.edu.txt.dep',
        'faffbac0e2a22d215556feec30516c1a6ccdb283.edu.txt.dep',
    ],
});

// 引数が0未満なら"null"を返す
app.filter('TransformParent', function() {
   return function(p) {
        return (p < 0) ? 'null' : p;
   };
});

// 文字列を先頭からMAX_N文字目まで切り出す
app.filter('TailorString', ['CONSTANTS', function(CONSTANTS) {
   return function(s) {
       // return s.substr(0, CONSTANTS.MAX_N);
       return s;
   };
}]);

// ??
app.service('Utils', function() {
   return {
       findPos: function(obj) {
            var curLeft = 0, curTop = 0;
            if (obj.offsetParent) {
                do {
                    curLeft += obj.offsetLeft;
                    curTop += obj.offsetTop;
                    obj = obj.offsetParent;
                } while (obj);
            }
            return {x: curLeft, y: curTop};
        },
       getTrimNumber: function(s) {
            var i = s.length - 1;
            while (i >= 0 && s[i] >= '0' && s[i] <= '9') {
                --i;
            }
            return parseInt(s.substr(i + 1), 10) || 0;
        }
    };
});

// トーストの位置設定
app.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        horizontalPosition: 'center'
    });
}]);

app.controller('EDUListController',
                    ['$scope', 'Upload', 'CONSTANTS', 'Utils', 'ngToast',
                    function($scope, Upload, CONSTANTS, Utils, ngToast) {

    /************************************************/
    // 変数など
    /************************************************/

    $scope.first = -1; // 選択されたheadノード
    var second = -1; // 選択されたmodifierノード
    var rel = ''; // 選択された談話関係ラベル

    $scope.inputFile = ''; // 入力ファイル

    $scope.edus = []; // EDUのリスト
    $scope.heads = []; // 各EDUのhead IDのリスト
    $scope.depRels = []; // 各EDUとそのheadとの間の談話関係、のリスト
    $scope.relations = CONSTANTS.relations; // 定義された談話関係

    $scope.operations = []; // アクション履歴

    $scope.blinkLinkColor = CONSTANTS.BLINK_LINK_COLOR; // リンクのハイライト色
    $scope.blinkLabelColor = CONSTANTS.BLINK_LABEL_COLOR;
    $scope.canvas_height = 700; // キャンバス縦幅 (デフォルト値)
    // "edus"の長さ(=edus.length)が変わったら、キャンバスの縦幅を更新
    $scope.$watch('edus.length', function() {
        // empirical formula
        $scope.canvas_height = ($scope.edus.length === 0) ? 700 : ($scope.edus.length / 75 * 4500 + 200);
    });
    $scope.canvas_width = CONSTANTS.CANVAS_WIDTH; // キャンバス横幅

    /************************************************/
    // IO
    /************************************************/

    // ファイルアップロード
    $scope.handleFileSelect = function ($files) {
        // チェック
        if (!$files || !$files[0]) {
            return;
        }

        // クリア
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);

        // 状態の初期化
        $scope.operations = [];
        $scope.first = second = -1;

        // 入力ファイルの設定
        $scope.inputFile = $files[0];

        // ファイル読み込み
        var reader = new FileReader();
        if ($scope.inputFile.name.endsWith('.dep')) {
            reader.onload = $scope.loadJsonData;
        }
        else {
            reader.onload = $scope.loadTextData;
        }
        reader.readAsText($scope.inputFile);

        // 文字列に変換(?)
        $scope.inputFile = $scope.inputFile.name;
    };

    // テキストデータの読み込み (1行1EDU)
    $scope.loadTextData = function(e) {
        // 改行区切り
        var contents = e.target.result.split('\n');
        // edusのセット (空行はスキップ) とROOTの追加
        $scope.edus = _.filter(contents, function(s) { return s.length > 0} );
        $scope.edus.unshift('ROOT');
        // headsの初期化
        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        // 談話関係ラベルの初期化
        $scope.depRels = _.range($scope.edus.length).map(function() { return 'null'; });
        //
        $scope.$apply();
        // 描画
        for (var i = 0; i < $scope.heads.length; ++i) {
            if ($scope.heads[i] >= 0) {
                // リンクの描画
                drawCurve('edu' + $scope.heads[i].toString(), 'edu' + i.toString(), CONSTANTS.NORMAL_LINK_COLOR);
                // 談話関係ラベルの描画
                addRelation('edu' + i.toString(), $scope.depRels[i], CONSTANTS.NORMAL_LABEL_COLOR);
            }
        }
    };

    $scope.loadJsonData = function(e) {
        // JSONオブジェクト
        var obj = JSON.parse(e.target.result).root;
        // EDUテキストの抽出
        $scope.edus = _.pluck(obj, 'text');
        // headsの抽出
        $scope.heads = _.pluck(obj, 'parent');
        // 談話関係ラベルの抽出
        $scope.depRels = _.pluck(obj, 'relation');
        //
        $scope.$apply();
        // 描画
        for (var i = 0; i < $scope.heads.length; ++i) {
            if ($scope.heads[i] >= 0) {
                // リンクの描画
                drawCurve('edu' + $scope.heads[i].toString(), 'edu' + i.toString(), CONSTANTS.NORMAL_LINK_COLOR);
                // 談話関係ラベルの描画
                addRelation('edu' + i.toString(), $scope.depRels[i], CONSTANTS.NORMAL_LABEL_COLOR);
            }
        }
    };

    /************************************************/
    // 上部のボタンを押したときの処理 + プログレスバー
    /************************************************/

    // ノード解除処理
    $scope.clearNode = function() {
        $scope.first = -1;
        // 履歴
        $scope.operations.pop();
        console.log("clearNode popped:");
        console.log($scope.operations);
    };

    // ラベル変更処理
    $scope.changeLabel = function () {
        // チェック
        if ($scope.first < 0 || $scope.first >= $scope.heads.length) {
            ngToast.danger({
                content: 'エラー: ノードが選択されていません！',
                timeout: 2000
            });
            return;
        }
        if ($scope.heads[$scope.first] < 0) {
            ngToast.danger({
                content: 'エラー: 選択されたノードには親ノードがありません！',
                timeout: 2000
            });
            return;
        }
        // 関係の選択
        var id1 = $scope.heads[$scope.first], id2 = $scope.first;
        var op = {type: 'change', id1: id1, id2: id2, changed_relation: $scope.depRels[id2]};
        $scope.first = id1;
        second = id2;
        popRelation("change");
        // 描画
        drawAll();
        // 履歴
        $scope.operations.push(op);
        console.log("changeLabel pushed:");
        console.log($scope.operations);
    };

    // リンク削除処理
    $scope.deleteLink = function () {
        // チェック
        if ($scope.first < 0 || $scope.first >= $scope.heads.length) {
            ngToast.danger({
                content: 'エラー: ノードが選択されていません！',
                timeout: 2000
            });
            return;
        }
        if ($scope.heads[$scope.first] < 0) {
            ngToast.danger({
                content: 'エラー: 選択されたノードには親ノードがありません！',
                timeout: 2000
            });
            return;
        }
        // 削除処理
        var id1 = $scope.heads[$scope.first], id2 = $scope.first;
        var op = {type: 'delete', id1: id1, id2: id2, deleted_relation: $scope.depRels[id2]};
        $scope.heads[id2] = -1;
        $scope.depRels[id2] = 'null';
        // 描画
        drawAll();
        $scope.first = -1;
        // 履歴
        $scope.operations.push(op);
        console.log("deleteLink: pushed");
        console.log($scope.operations);
    };

    // UNDO処理
    $scope.undo = function() {
        // 最終アクション
        var op = _.last($scope.operations);
        console.log("undo top:");
        console.log(op);
        if (op.type === 'click') {
            // もし最終アクションがhead選択なら、head解除
            $scope.first = -1;
        }
        else if (op.type === 'connect') {
            // もし最終アクションがmodifier選択なら、headとmodifierの結合をなくす
            $scope.heads[op.id2] = -1;
            $scope.depRels[op.id2] = 'null';
            // 描画
            drawAll();
        }
        else if (op.type == "change") {
            // もし最終アクションがラベルの変更なら、ラベルを戻す
            var id1 = op.id1, id2 = op.id2, rel = op.changed_relation;;
            $scope.heads[id2] = id1;
            $scope.depRels[id2] = rel;
            // 描画
            drawAll();
        }
        else if (op.type === 'delete') {
            // もし最終アクションが結合の削除なら、結合を戻す
            var id1 = op.id1, id2 = op.id2, rel = op.deleted_relation;
            $scope.heads[id2] = id1;
            $scope.depRels[id2] = rel;
            // 描画
            drawAll();
        }
        $scope.operations.pop();
        console.log("undo popped:");
        console.log($scope.operations);
    };

    // クリップボードにコピー
    $scope.copyToClipboard = function() {
        var text = $scope.edus[$scope.first];
        var textBox = document.createElement("textarea");
        textBox.setAttribute("id", "target");
        textBox.setAttribute("type", "hidden");
        textBox.textContent = text;
        document.body.appendChild(textBox);
        textBox.select();
        document.execCommand("copy");
        document.body.removeChild(textBox);
        console.log("Copied " + text);

        $scope.first = -1;
        // 履歴
        $scope.operations.pop();
        console.log("clearNode popped:");
        console.log($scope.operations);
    };

    // 保存
    $scope.saveToFile = function() {
        // 辞書データの初期化
        var data = {root: []};
        // 辞書データ作成
        for (var i = 0; i < $scope.heads.length; ++i) {
            var cur = {id: i,
                       parent: $scope.heads[i],
                       text: $scope.edus[i],
                       relation: $scope.depRels[i]};
            data.root.push(cur);
        }
        // 出力ファイル名
        var outFileName = $scope.inputFile.endsWith('.dep') ? $scope.inputFile : $scope.inputFile + '.dep';
        // 出力ファイルオブジェクトの作成
        var blob = new Blob([JSON.stringify(data, null, '\t')], {type: "text/plain;charset=utf-8"});
        // 書き出し
        saveAs(blob, outFileName);
    };

    // 例示
    $scope.showRandomSample = function () {
        // クリア
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);

        // 状態の初期化
        $scope.operations = [];
        $scope.first = second = -1;

        // JSONファイルを読み込んで描画
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // JSONオブジェクト
                    var obj = JSON.parse(xhr.responseText).root;
                    // EDUテキストの抽出
                    $scope.edus = _.pluck(obj, 'text');
                    // headsの抽出
                    $scope.heads = _.pluck(obj, 'parent');
                    // 談話関係ラベルの抽出
                    $scope.depRels = _.pluck(obj, 'relation');
                    //
                    $scope.$apply();
                    // 描画
                    for (var i = 0; i < $scope.heads.length; ++i) {
                        if ($scope.heads[i] >= 0) {
                            drawCurve('edu' + $scope.heads[i].toString(), 'edu' + i.toString(), CONSTANTS.NORMAL_LINK_COLOR);
                            addRelation('edu' + i.toString(), $scope.depRels[i], CONSTANTS.NORMAL_LABEL_COLOR);
                        }
                    }
                }
            }
        }
        var arrayIndex = Math.floor(Math.random() * 100);
        var sampleFile = CONSTANTS.SAMPLE_FILES[arrayIndex];
        console.log(sampleFile)
        xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/samples/" + sampleFile);
        xhr.send();
        console.log(xhr);
        $scope.inputFile = sampleFile;
    };

    // プログレスバー
    $scope.progress = 0;
    $scope.progressDetail = "0";
    $scope.$watchCollection('heads', function() {
        var total = _.size($scope.heads) - 1;
        if (total <= 0) return;
        var labeled = (_.filter($scope.heads.slice(1), function(e) { return e >= 0; })).length;
        $scope.progress = labeled * 100 / total;
        $scope.progressDetail = String(labeled) + "/" + String(total);
    });

    /************************************************/
    // マウスがEDUと重なった時・外れたときの処理
    /************************************************/

    // マウスカーソルが乗っかったときの処理
    $scope.mouseOverIndex = -1;
    $scope.mouseOverHandler = function(pos) {
        // チェック
        if (pos < 0 || pos >= $scope.heads.length || $scope.heads[pos] < 0) {
            return;
        }

        // マウスが乗っかったEDUのindex
        $scope.mouseOverIndex = pos;

        // 描画 (強調つき)
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        for (var i = 0; i < $scope.heads.length; ++i) {
            if (i === pos && $scope.heads[i] >= 0) {
                connect($scope.heads[i], i, $scope.depRels[i], CONSTANTS.BLINK_LINK_COLOR, CONSTANTS.BLINK_LABEL_COLOR);
            }
            else if ($scope.heads[i] >= 0) {
                connect($scope.heads[i], i, $scope.depRels[i], CONSTANTS.NORMAL_LINK_COLOR, CONSTANTS.NORMAL_LABEL_COLOR);
            }
        }
    };

    // マウスカーソルが外れたときの処理
    $scope.mouseOutHandler = function(pos) {
        // チェック
        if (pos < 0 || pos >= $scope.heads.length || $scope.heads[pos] < 0) {
            return;
        }

        // マウスが乗っかったEDUのindexの初期化
        $scope.mouseOverIndex = -1;

        // 描画 (強調なし)
        drawAll();
    };

    /************************************************/
    // EDUをクリックしたときの処理
    /************************************************/

    // リンク追加処理 (EDUのクリック)
    $scope.highLight = function(id) {
        // 選択されたEDUのindex
        var index = parseInt(id.toString().substr(3));

        // headかmodifierか
        if ($scope.first === -1) {
            // headセット
            $scope.first = index;
            // 描画
            $scope.mouseOutHandler(id);
            // 履歴追加
            var op = {type: 'click', index: index};
            $scope.operations.push(op);
            console.log("highLight pushed:");
            console.log($scope.operations);
        }
        else {
            // modifierセット
            second = index;
            // 談話関係ラベル選択画面へ
            popRelation();
        }
    };

    // 談話関係ラベル選択
    $scope.showAddDialog = false;
    var popRelation = function(mode) {
        var dialog;

        function relationCallback() {
            // 依存関係のセット
            rel = angular.element('#select')[0].options[select.selectedIndex].text;
            $scope.heads[second] = $scope.first;
            $scope.depRels[second] = rel;

            // 描画
            drawAll();

            // 履歴追加
            if (mode != "change") {
                var op = {type: 'connect', id1: $scope.first.toString(), id2: second.toString()};
                $scope.operations.push(op);
                console.log("popRelation pushed:");
                console.log($scope.operations);
            }

            // 状態の初期化
            $scope.first = -1; second = -1;

            // ダイアログのクローズ
            $scope.showAddDialog = false;
            dialog.dialog('close');

            //
            $scope.$apply();
        }

        dialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 200,
            width: 450,
            modal: true,
            buttons: {
                OK: relationCallback
            },
            position: {
                my: 'left top',
                at: 'left+10% top+10%',
                of: window
            }
        });

        // 談話関係ラベルの初期化
        rel = '';

        // ダイアログのポップアップ
        $scope.showAddDialog = true;
        dialog.dialog("open");
    };

    // head EDUのindexを返す
    $scope.getHead = function(idx) {
        if ($scope.heads[idx] === -1) {
            return idx;
        }
        return $scope.getHead($scope.heads[idx]);
    };

    /************************************************/
    // 描画処理
    /************************************************/

    // クリアして描画
    var drawAll = function() {
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        for (var i = 0; i < $scope.heads.length; ++i) {
            if ($scope.heads[i] >= 0) {
                connect($scope.heads[i], i, $scope.depRels[i], CONSTANTS.NORMAL_LINK_COLOR, CONSTANTS.NORMAL_LABEL_COLOR);
            }
        }

    };

    var connect = function(id1, id2, rel, link_color, label_color, fontSize) {
        drawCurve('edu' + id1, 'edu' + id2, link_color);
        addRelation('edu' + id2, rel, label_color, fontSize);
    };

    // リンクの描画
    var drawCurve = function(id1, id2, color) {
        while ($scope.operations.length > 0 && _.last($scope.operations).type === 'click') {
            $scope.operations.splice($scope.operations.length - 1, 1);
        }

        // source coordinate
        var centerS = Utils.findPos(angular.element('#' + id1)[0]);
        centerS.x += angular.element('#' + id1)[0].style.width;
        centerS.y += angular.element('#' + id1)[0].style.height;

        // target coordinate
        var centerT = Utils.findPos(angular.element('#' + id2)[0]);
        centerT.x += angular.element('#' + id2)[0].style.width;
        centerT.y += angular.element('#' + id2)[0].style.height;

        // 調整
        var canvasPos = Utils.findPos(angular.element('canvas')[0]);
        centerS.x -= canvasPos.x;
        centerS.y -= canvasPos.y;
        centerT.x -= canvasPos.x;
        centerT.y -= canvasPos.y;
        if (centerT.y > centerS.y) {
            // targetがsourceより下に位置するなら、下側からリンクが出る
            centerS.y += 40;
        }
        else {
            // targetがsourceより上に位置するなら、上側からリンクが出る
            centerS.y += 10;
        }
        centerT.y += 25;

        var width = Utils.findPos(angular.element('#' + id1)[0]).x;

        // 距離 (比率)
        var percent = 1 - Math.abs(Utils.getTrimNumber(id1) - Utils.getTrimNumber(id2)) / ($scope.heads.length - 1);

        // 謎の調整
        if ($scope.edus.length > 30 && percent > 0.5) {
            percent = percent - 0.5;
        }
        percent = Math.min(percent, 0.85);

        var offX = width * percent;

        // 描画
        var ctx = angular.element('#canvas')[0].getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerS.x, centerS.y);
        ctx.bezierCurveTo(offX, centerS.y, offX, centerT.y, centerT.x, centerT.y);
        ctx.stroke();

        ctx.beginPath();
        var radius = 6;
        ctx.fillStyle = color;
        ctx.moveTo(centerT.x - radius, centerT.y - radius);
        ctx.lineTo(centerT.x - radius, centerT.y + radius);
        ctx.lineTo(centerT.x, centerT.y);

        ctx.closePath();
        ctx.fill();
    };

    // 談話関係ラベルの描画
    var addRelation = function(id2, relation, color, fontSize) {
        if (!relation) {
            console.log("addRelation:")
            console.log(relation);
            ngToast.danger({
                content: 'Invalid relation',
                timeout: 2000
            });
            return;
        }
        fontSize = fontSize || 15;

        // 位置
        var centerZ = Utils.findPos(angular.element('#' + id2)[0]);
        centerZ.x += angular.element('#' + id2)[0].style.width;
        centerZ.y += angular.element('#' + id2)[0].style.height;

        // 調整
        var canvasPos = Utils.findPos(angular.element('#canvas')[0]);
        centerZ.x -= canvasPos.x;
        centerZ.x += 90;
        centerZ.y -= canvasPos.y;
        centerZ.y += 30;

        // 描画
        var ctx = angular.element('#canvas')[0].getContext('2d');
        ctx.font = fontSize.toString() + "px Arial";
        // ctx.fillStyle = '#005AB5';
        // ctx.fillStyle = CONSTANTS.NORMAL_LABEL_COLOR;
        ctx.fillStyle = color;
        ctx.textAlign = "right";
        // while (relation.length < 12) relation = ' ' + relation;
        ctx.fillText(relation, centerZ.x - fontSize * 7, centerZ.y);
    };

}]); // /EDUListController
