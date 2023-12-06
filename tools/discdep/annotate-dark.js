'use strict';

var app = angular.module('MyApp', ['ngFileUpload', 'ngToast']);

app.constant('CONSTANTS', {
    // 談話関係
    relationVocab: [
        "Root",
        // 情報の単純な追加
        "Elaboration",
        // 対比、譲歩、相違性・類似性の強調
        "Comparison",
        // 原因理由、結果、条件、仮定
        "Cause",
        "Result",
        "Condition",
        // 付帯状況、時間
        "Temporal",
        // 背景
        "Background",
        // 目的と手段
        "Enablement",
        "Manner-Means",
        // 評価、感想、考察
        "Evaluation",
        "Discussion",
        // まとめ、結論
        "Summary-Conclusion",
        // まとめる
        "Joint",
        // 構文
        "Attribution",
        "Same-Unit",
        // 文書構造
        "Title",
        "Textual-Organization",
        // 特殊
        "Dependency",
        "Segmentation-Error",
    ],
    priorityVocab: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ],
    // EDUタグ
    tagVocab: [
        "B",
        "A",
        "R",
        "D",
        "C",
        "Tag",
    ],
    // 構成素ラベル
    constituentVocab: [
        "Root",
        "Inv",
        // "R-Inv",
        // "RD-R-Inv",
        "RD",
        "A",
        // "Inv-A",
        "R",
        "D",
        // "RD-R",
        // "RD-D",
        "B",
        // "Inv-B",
        "C",
        "Constituent",
    ],
    // Colors are set according to the palette of One Dark
    NORMAL_LINK_COLOR: '#61AFEF', // One Dark Blue
    NORMAL_LABEL_COLOR: '#E06C75', // One Dark Red
    BLINK_LINK_COLOR: '#D19A66', // One Dark Orange
    BLINK_LABEL_COLOR: '#D19A66', // One Dark Orange
    BLINK_NODE_COLOR1: '#D19A66', // One Dark Orange
    BLINK_NODE_COLOR2: '#E5C07B', // One Dark Yellow
    BLINK_NODE_COLOR3: '#C678DD', // One Dark Purple
    //MAX_N: 150,
    MAX_N: 500,
    //  全体の横幅
    CANVAS_WIDTH: 1500, // canvas_height will be automatically set.
    // 調整
    OFFSET_FOR_TAG1: 28,
    OFFSET_FOR_TAG2: 55,
});

// フィルター関数の登録: 引数が0未満なら"null"を返す
app.filter('TransformParent', function() {
   return function(p) {
        return (p < 0) ? 'null' : p;
   };
});

// フィルター関数の登録: 文字列を先頭からMAX_N文字目まで切り出す
app.filter('TailorString', ['CONSTANTS', function(CONSTANTS) {
   return function(s) {
       // return s.substr(0, CONSTANTS.MAX_N);
       return s;
   };
}]);

// Utility
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

app.controller('EDUListController', ['$scope', 'Upload', 'CONSTANTS', 'Utils', 'ngToast',
                    function($scope, Upload, CONSTANTS, Utils, ngToast) {

    /************************************************/
    // 変数など
    /************************************************/

    // 談話関係、構成素ラベル、タグの辞書
    $scope.relationVocab = CONSTANTS.relationVocab;
    $scope.priorityVocab = CONSTANTS.priorityVocab;
    $scope.constituentVocab = CONSTANTS.constituentVocab;
    $scope.tagVocab = CONSTANTS.tagVocab ;

    // 入力ファイル名
    $scope.inputFile = '';

    // EDUs
    $scope.edus = [];

    // 一時グローバル変数
    $scope.first = -1; // 最初に選択されたノード
    var second = -1; // 2回目に選択されたノード
    var temp_relation = ''; // 選択された談話関係
    var temp_priority = -1;
    var temp_constituent = ''; // 選択された構成素ラベル
    var temp_tag = ''; // 選択されたタグ
    $scope.focused_index = -1;

    // 各EDUのhead ID、談話関係、構成素ラベル、タグ
    $scope.heads = []; // 各EDUのhead IDのリスト
    $scope.relations = []; // 各EDUとそのheadとの間の談話関係、のリスト
    $scope.priorities = [];
    $scope.constituents = []; // 各EDUとそのheadとの間の構成素ラベル、のリスト
    $scope.tags = []; // 各EDUのタグのリスト

    // 各EDUの文番号
    $scope.sentence_ids = [];

    // 色、キャンバス
    $scope.blinkNodeColor1 = CONSTANTS.BLINK_NODE_COLOR1;
    $scope.blinkNodeColor2 = CONSTANTS.BLINK_NODE_COLOR2;
    $scope.blinkNodeColor3 = CONSTANTS.BLINK_NODE_COLOR3;
    $scope.canvas_height = 700; // キャンバス縦幅 (デフォルト値)
    // "edus"の長さ(=edus.length)が変わったら、キャンバスの縦幅を更新
    $scope.$watch('edus.length', function() {
        // empirical formula
        $scope.canvas_height = ($scope.edus.length === 0) ? 700 : ($scope.edus.length / 75 * 4500 + 200);
    });
    $scope.canvas_width = CONSTANTS.CANVAS_WIDTH; // キャンバス横幅
    $scope.offset_for_tag1 = CONSTANTS.OFFSET_FOR_TAG1;
    $scope.offset_for_tag2 = CONSTANTS.OFFSET_FOR_TAG2;

    // サンプルファイル名リスト (examples.txt) を読み込んで描画、ファイル名の配列を作成
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                $scope.sampleFileList = xhr.responseText.split("\n");
            }
        }
    }
    xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/examples.txt");
    xhr.send();
    console.log(xhr);

    // サンプルファイル名辞書 (examples.csv) を読み込んで、談話関係->ファイル名リストの辞書を作成
    var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState == 4) {
            if (xhr2.status == 200) {
                $scope.sampleFileDict = {};
                var lines = xhr2.responseText.split("\n");
                for (var i = 0; i < lines.length; ++i) {
                    var line = lines[i];
                    if (line !== "") {
                        var items = line.split(",");
                        $scope.sampleFileDict[items[0]] = items.slice(1);
                    }
                }
            }
        }
    }
    xhr2.open("GET", "https://norikinishida.github.io/tools/discdep/data/examples.csv");
    xhr2.send();
    console.log(xhr2);

    /************************************************/
    // 談話依存構造アノテーション用
    // 1. ファイル読み込み
    /************************************************/

    $scope.handleFileSelect = function ($files) {
        // チェック
        if (!$files || !$files[0]) {
            return;
        }

        // キャンバスのクリア
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);

        // 一時変数の初期化
        $scope.first = second = $scope.focused_index = -1;

        // 入力ファイルの設定
        $scope.inputFile = $files[0];

        // ファイル読み込み
        var reader = new FileReader();
        if ($scope.inputFile.name.endsWith('.dep')) {
            // from xxxx.dep
            reader.onload = $scope.loadJsonData;
        }
        else {
            // from xxxx.edu.txt
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

        // EDUs (空行はスキップ)
        $scope.edus = _.filter(contents, function(s) { return s.length > 0} );
        $scope.edus.unshift('ROOT');

        // 各EDUのhead, 談話関係、構成素ラベル、タグ
        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        $scope.relations = _.range($scope.edus.length).map(function() { return 'null'; });
        $scope.priorities = _.range($scope.edus.length).map(function() { return -1; });
        $scope.constituents = _.range($scope.edus.length).map(function() { return 'null'; });
        $scope.tags = _.range($scope.edus.length).map(function() { return 'null'; });

        // 各EDUの文番号
        $scope.sentence_ids = [];
        $scope.sentence_ids.push(0)
        var sentence_id = 1;
        for (var i = 1; i < $scope.heads.length; ++i) {
            $scope.sentence_ids.push(sentence_id);
            if ($scope.edus[i].includes("<S>")) {
                sentence_id += 1;
            }
        }

        // 適応
        $scope.$apply();

        // 描画
        for (var i = 0; i < $scope.heads.length; ++i) {
            // タグの描画
            if ($scope.tags[i] == "null") {
                addTag('edu' + i.toString(), "x", CONSTANTS.NORMAL_LINK_COLOR);
            }
            else {
                addTag('edu' + i.toString(), $scope.tags[i], CONSTANTS.NORMAL_LABEL_COLOR);
            }
            // 談話関係、構成素ラベルの描画
            if ($scope.heads[i] >= 0) {
                connect($scope.heads[i].toString(), i.toString(),
                        $scope.relations[i],
                        $scope.priorities[i],
                        $scope.constituents[i],
                        CONSTANTS.NORMAL_LINK_COLOR, CONSTANTS.NORMAL_LABEL_COLOR);
            }
        }
    };

    // JSONデータの読み込み
    $scope.loadJsonData = function(e) {
        // JSONオブジェクト
        var obj = JSON.parse(e.target.result).root;

        // EDUs
        $scope.edus = _.pluck(obj, 'text');

        // 各EDUのhead, 談話関係、構成素ラベル、タグ
        $scope.heads = _.pluck(obj, 'parent');
        $scope.relations = _.pluck(obj, 'relation');
        $scope.priorities = _.pluck(obj, 'priority');
        $scope.constituents = _.pluck(obj, 'constituent');
        $scope.tags = _.pluck(obj, 'tag');

        // 各EDUの文番号
        $scope.sentence_ids = [];
        $scope.sentence_ids.push(0)
        var sentence_id = 1;
        for (var i = 1; i < $scope.heads.length; ++i) {
            $scope.sentence_ids.push(sentence_id);
            if ($scope.edus[i].includes("<S>")) {
                sentence_id += 1;
            }
        }

        // 適応
        $scope.$apply();

        // 描画
        for (var i = 0; i < $scope.heads.length; ++i) {
            // タグの描画
            if ($scope.tags[i] == "null") {
                addTag('edu' + i.toString(), "x", CONSTANTS.NORMAL_LINK_COLOR);
            }
            else {
                addTag('edu' + i.toString(), $scope.tags[i], CONSTANTS.NORMAL_LABEL_COLOR);
            }
            // 談話関係と構成素ラベルの描画
            if ($scope.heads[i] >= 0) {
                connect($scope.heads[i].toString(), i.toString(),
                        $scope.relations[i],
                        $scope.priorities[i],
                        $scope.constituents[i],
                        CONSTANTS.NORMAL_LINK_COLOR, CONSTANTS.NORMAL_LABEL_COLOR);
            }
        }
    };

    /************************************************/
    // 談話依存構造アノテーション用
    // 2. コピー、保存、例示
    /************************************************/

    // クリップボードにコピー
    $scope.copyToClipboard = function() {
        var text = "";
        for (var i = 1; i < $scope.edus.length; i++) {
            text = text + $scope.edus[i].replace("<S>", "").replace("<P>", "");
            if (i == $scope.edus.length - 1) {
                text = text; // Do nothing
            }
            else if ($scope.edus[i].includes("<S>")) {
                text = text + "\n\n";
            }
            else {
                text = text + " ";
            }
        }
        var textBox = document.createElement("textarea");
        textBox.setAttribute("id", "target");
        textBox.setAttribute("type", "hidden");
        textBox.textContent = text;
        document.body.appendChild(textBox);
        textBox.select();
        document.execCommand("copy");
        document.body.removeChild(textBox);
        console.log("Copied:");
        console.log(text);
        ngToast.create({
            content: 'Copied the entire text to the clipboard.',
            timeout: 2000
        });
    };

    // 保存
    $scope.saveToFile = function() {
        if ($scope.progress !== 100) {
            ngToast.warning({
                content: 'WARNING: The discourse dependency structure is incomplete!',
                timeout: 5000
            });
        }

        // 辞書データ作成
        var data = {root: []};
        for (var i = 0; i < $scope.heads.length; ++i) {
            var cur = {id: i,
                       parent: $scope.heads[i],
                       text: $scope.edus[i],
                       relation: $scope.relations[i],
                       priority: $scope.priorities[i],
                       constituent: $scope.constituents[i],
                       tag: $scope.tags[i]};
            data.root.push(cur);
        }

        // 出力ファイル名
        if ($scope.inputFile.endsWith(".dep")) {
            // Overwrite
            var outFileName = $scope.inputFile;
        }
        else if ($scope.inputFile.endsWith(".edu.txt")) {
            // xxxx.edu.txt -> xxxx.dep
            var outFileName = $scope.inputFile.replace(".edu.txt", ".dep");
        }
        else {
            // xxxx.yyyy -> xxxx.yyyy.dep
            var outFileName = $scope.inputFile + ".dep";
        }

        // 出力ファイルオブジェクトの作成
        var blob = new Blob([JSON.stringify(data, null, '\t')],
                            {type: "text/plain;charset=utf-8"});

        // 書き出し
        saveAs(blob, outFileName);
    };

    // 例示
    $scope.showRandomSample = function (relation) {
        // キャンバスのクリア
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);

        // 一時変数の初期化
        $scope.first = second = $scope.focused_index = -1;

        // JSONファイルを読み込んで描画
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // JSONオブジェクト
                    var obj = JSON.parse(xhr.responseText).root;

                    // EDUs
                    $scope.edus = _.pluck(obj, 'text');

                    // 各EDUのhead、談話関係、構成素ラベル、タグ
                    $scope.heads = _.pluck(obj, 'parent');
                    $scope.relations = _.pluck(obj, 'relation');
                    $scope.priorities = _.pluck(obj, 'priority');
                    $scope.constituents = _.pluck(obj, 'constituent');
                    $scope.tags = _.pluck(obj, 'tag');

                    // 各EDUの文番号
                    $scope.sentence_ids = [];
                    $scope.sentence_ids.push(0)
                    var sentence_id = 1;
                    for (var i = 1; i < $scope.heads.length; ++i) {
                        $scope.sentence_ids.push(sentence_id);
                        if ($scope.edus[i].includes("<S>")) {
                            sentence_id += 1;
                        }
                    }

                    // 適応
                    $scope.$apply();

                    // 描画
                    for (var i = 0; i < $scope.heads.length; ++i) {
                        // タグの描画
                        if ($scope.tags[i] == "null") {
                            addTag('edu' + i.toString(), "x", CONSTANTS.NORMAL_LINK_COLOR);
                        }
                        else {
                            addTag('edu' + i.toString(), $scope.tags[i], CONSTANTS.NORMAL_LABEL_COLOR);
                        }
                        // 談話関係と構成素ラベルの描画
                        if ($scope.heads[i] >= 0) {
                            connect($scope.heads[i].toString(), i.toString(),
                                    $scope.relations[i],
                                    $scope.priorities[i],
                                    $scope.constituents[i],
                                    CONSTANTS.NORMAL_LINK_COLOR, CONSTANTS.NORMAL_LABEL_COLOR);
                        }
                    }
                }
            }
        }

        var arrayIndex = Math.floor(Math.random() * $scope.sampleFileDict[relation].length);
        var sampleFile = $scope.sampleFileDict[relation][arrayIndex];
        xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/examples/" + sampleFile);
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
    // 談話依存構造アノテーション用
    // 3. マウスが重なった (外れた) ときの処理
    /************************************************/

    // マウスカーソルが乗っかったときの処理
    $scope.mouseOverIndex = -1;
    $scope.mouseOverHandler = function(pos) {
        // チェック
        if (pos < 0 || pos >= $scope.heads.length) {
            return;
        }

        // マウスが乗っかったEDUのindex
        $scope.mouseOverIndex = pos;

        // 描画 (強調つき)
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        for (var i = 0; i < $scope.heads.length; ++i) {
            // タグの描画
            if ($scope.tags[i] == "null") {
                addTag('edu' + i.toString(), "x", CONSTANTS.NORMAL_LINK_COLOR);
            }
            else if (i === pos) {
                addTag('edu' + i.toString(), $scope.tags[i], CONSTANTS.BLINK_LABEL_COLOR);
            }
            else {
                addTag('edu' + i.toString(), $scope.tags[i], CONSTANTS.NORMAL_LABEL_COLOR);
            }
            // 談話関係と構成素ラベルの描画
            if (i === pos && $scope.heads[i] >= 0) {
                connect($scope.heads[i], i,
                        $scope.relations[i],
                        $scope.priorities[i],
                        $scope.constituents[i],
                        CONSTANTS.BLINK_LINK_COLOR, CONSTANTS.BLINK_LABEL_COLOR);
            }
            else if ($scope.heads[i] >= 0) {
                connect($scope.heads[i], i,
                        $scope.relations[i],
                        $scope.priorities[i],
                        $scope.constituents[i],
                        CONSTANTS.NORMAL_LINK_COLOR, CONSTANTS.NORMAL_LABEL_COLOR);
            }
        }
    };

    // マウスカーソルが外れたときの処理
    $scope.mouseOutHandler = function(pos) {
        // チェック
        if (pos < 0 || pos >= $scope.heads.length) {
            return;
        }

        // マウスが乗っかったEDUのindexの初期化
        $scope.mouseOverIndex = -1;

        // 描画 (強調なし)
        drawAll();
    };

    /************************************************/
    // 談話依存構造アノテーション用
    // 4. アノテーションメイン
    /************************************************/

    // リンク追加処理 (EDUのクリック)
    $scope.highLight = function(id) {
        console.log("highLight function begins.");

        // 選択されたEDUのindex
        var index = parseInt(id.toString().substr(3));
        // console.log("index: " + index);

        // headかdependentか
        if ($scope.first === -1) {
            $scope.first = index;
            $scope.focused_index = index;
            // console.log("first: " + $scope.first);
            // console.log("second: " + second);
            // 描画
            $scope.mouseOutHandler(id);
        }
        else {
            second = index;
            $scope.focused_index = index;
            // console.log("first: " + $scope.first);
            // console.log("second: " + second);
            // 同じEDUが選択されたらタグ付け、異なるEDUなら談話関係と構成素ラベルの付与
            if ($scope.first == second) {
                popTag();
            }
            else {
                popRelation();
            }
        }

        console.log("highLight function ends.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);
    };

    // タグの付与
    $scope.showAddDialogForTag = false;
    var popTag = function() {
        console.log("popTag function begins.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);

        var dialog;

        // コールバック関数
        function tagCallback() {
            console.log("tagCallback function begins.");
            // 依存関係の設定
            temp_tag = angular.element('#selectForTag')[0].options[selectForTag.selectedIndex].text;
            // console.log(selectForTag.selectedIndex);
            // console.log("first: " + $scope.first);
            // console.log("second: " + second);
            // console.log("temp_tag: " + temp_tag);
            // 選択されたEDUと同一文に属するEDUには同じタグを付与
            $scope.tags[$scope.first] = temp_tag; // NOTE: $scope.first == second
            var sent_id = $scope.sentence_ids[$scope.first];
            for (var i = 0; i < $scope.edus.length; ++i) {
                if ($scope.sentence_ids[i] === sent_id) {
                    $scope.tags[i] = temp_tag;
                    console.log("Set a tag, " + temp_tag + ", to EDU#" + i);
                }
            }

            // 描画
            // console.log("tagCallback drawAll");
            drawAll();

            // 初期化
            $scope.first = second = $scope.focused_index = -1;

            // クローズ
            $scope.showAddDialogForTag = false;
            dialog.dialog('close');

            // 適応
            $scope.$apply();

            console.log("tagCallback function ends.");
            // console.log("first: " + $scope.first);
            // console.log("second: " + second);
        }

        // ダイアログオブジェクト
        dialog = $("#dialog-form-for-tag").dialog({
            autoOpen: false,
            height: 200,
            width: 450,
            modal: true,
            buttons: {
                OK: tagCallback
            },
            position: {
                my: 'left top',
                at: 'left+10% top+10%',
                of: window
            }
        });

        // オープン
        temp_tag = '';
        $scope.showAddDialogForTag = true;
        dialog.dialog("open");

        console.log("popTag function ends.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);
    };

    // 談話関係、構成素ラベルの付与
    $scope.showAddDialogForRel = false;
    var popRelation = function() {
        console.log("popRelation function begins.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);

        var dialog;

        // コールバック関数
        function relationCallback() {
            console.log("relationCallback function begins.");
            // 談話依存関係の設定
            temp_relation = angular.element('#selectForRel')[0].options[selectForRel.selectedIndex].text;
            temp_priority = parseInt(angular.element('#selectForPri')[0].options[selectForPri.selectedIndex].text);
            temp_constituent = angular.element('#selectForCon')[0].options[selectForCon.selectedIndex].text;
            // console.log("selectForRel.selectedIndex: " + selectForRel.selectedIndex);
            // console.log("first: " + $scope.first);
            // console.log("second: " + second);
            // console.log("temp_relation: " + temp_relation);
            // console.log("temp_priority: " + temp_priority);
            // console.log("temp_constituent: " + temp_constituent);
            $scope.heads[second] = $scope.first;
            $scope.relations[second] = temp_relation;
            $scope.priorities[second] = temp_priority;
            $scope.constituents[second] = temp_constituent;
            console.log("Set a head, EDU#" + $scope.first + ", to EDU#" + second);
            console.log("Set labels, " + temp_relation + "#" + temp_priority + "[" + temp_constituent + "]" + ", to EDU#" + $scope.first + "->EDU#" + second);

            // 描画
            // console.log("relationCallback drawAll");
            drawAll();

            // 初期化
            $scope.first = second = $scope.focused_index = -1;

            // クローズ
            $scope.showAddDialogForRel = false;
            dialog.dialog('close');

            // 適応
            $scope.$apply();

            console.log("relationCallback function ends.");
            // console.log("first: " + $scope.first);
            // console.log("second: " + second);
        }

        // ダイアログオブジェクト
        dialog = $("#dialog-form-for-rel").dialog({
            autoOpen: false,
            height: 350,
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

        // オープン
        temp_relation = '';
        temp_priority = -1;
        temp_constituent = '';
        $scope.showAddDialogForRel = true;
        dialog.dialog("open");

        console.log("popRelation function ends.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);
    };

    // head EDUのindexを返す
    $scope.getHead = function(idx) {
        if ($scope.heads[idx] === -1) {
            return idx;
        }
        // recursive
        return $scope.getHead($scope.heads[idx]);
    };

    // ノード解除処理
    $scope.clearNode = function() {
        console.log("clearNode function begins.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);

        $scope.first = second = $scope.focused_index = -1;

        console.log("clearNode function ends.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);
    };

    // 談話関係変更処理
    $scope.changeLabel = function () {
        console.log("changeLabel function begins.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);

        // チェック
        if ($scope.first < 0 || $scope.first >= $scope.heads.length) {
            ngToast.danger({
                content: 'Error: Please choose a node!',
                timeout: 2000
            });
            return;
        }
        if ($scope.heads[$scope.first] < 0) {
            ngToast.danger({
                content: 'Error: The selected node does not have a parent (head)!',
                timeout: 2000
            });
            return;
        }

        // 談話関係と構成素ラベルの選択
        var temp_first = $scope.heads[$scope.first];
        var temp_second = $scope.first;
        $scope.first = temp_first;
        second = temp_second;
        popRelation();

        // 描画
        // console.log("changeLabel drawAll");
        drawAll();

        console.log("changeLabel function ends.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);
    };

    // リンク削除処理
    $scope.deleteLink = function () {
        console.log("deleteLink function begins.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);

        // チェック
        if ($scope.first < 0 || $scope.first >= $scope.heads.length) {
            ngToast.danger({
                content: 'Error: Please choose a node!',
                timeout: 2000
            });
            return;
        }
        if ($scope.heads[$scope.first] < 0) {
            ngToast.danger({
                content: 'Error: The selected node does not have a parent (head)!',
                timeout: 2000
            });
            return;
        }

        // 削除処理
        var temp_first = $scope.heads[$scope.first];
        var temp_second = $scope.first;
        $scope.heads[temp_second] = -1;
        $scope.relations[temp_second] = 'null';
        $scope.priorities[temp_second] = -1;
        $scope.constituents[temp_second] = 'null';
        // $scope.tags[temp_second] = 'null';

        // 描画
        // console.log("deleteLink drawAll");
        drawAll();

        // リセット
        $scope.first = second = $scope.focused_index = -1;
        console.log("deleteLink function ends.");
        // console.log("first: " + $scope.first);
        // console.log("second: " + second);
    };

    // クリップボードにコピー
    $scope.copyThisEDUToClipboard = function() {
        console.log("copyThisEDUToClipboard function begins.");
 
        var text = $scope.edus[$scope.first].replace("<S>", "").replace("<P>", "");
        var textBox = document.createElement("textarea");
        textBox.setAttribute("id", "target");
        textBox.setAttribute("type", "hidden");
        textBox.textContent = text;
        document.body.appendChild(textBox);
        textBox.select();
        document.execCommand("copy");
        document.body.removeChild(textBox);
        console.log("Copied:");
        console.log(text);
        ngToast.create({
            content: 'Copied EDU#' + $scope.first + ' to the clipboard.',
            timeout: 2000
        });

        console.log("copyThisEDUToClipboard function ends.");
    };

    /************************************************/
    // 談話依存構造アノテーション用
    // 5. 描画
    /************************************************/

    // クリアして描画
    var drawAll = function() {
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        for (var i = 0; i < $scope.heads.length; ++i) {
            // タグの描画
            if ($scope.tags[i] == "null") {
                addTag('edu' + i.toString(), "x", CONSTANTS.NORMAL_LINK_COLOR);
            }
            else {
                addTag('edu' + i.toString(), $scope.tags[i], CONSTANTS.NORMAL_LABEL_COLOR);
            }
            // 談話関係と構成素ラベルの描画
            if ($scope.heads[i] >= 0) {
                connect($scope.heads[i], i,
                        $scope.relations[i],
                        $scope.priorities[i],
                        $scope.constituents[i],
                        CONSTANTS.NORMAL_LINK_COLOR, CONSTANTS.NORMAL_LABEL_COLOR);
            }
        }
    };

    // タグの描画
    var addTag = function(id, tag, color, fontSize) {
        if (!tag) {
            // console.log("addTag:")
            // console.log("tag: " + tag);
            ngToast.danger({
                content: 'Invalid tag',
                timeout: 2000
            });
            return;
        }
        fontSize = fontSize || 15;

        // 位置
        var centerZ = Utils.findPos(angular.element('#' + id)[0]);
        centerZ.x += angular.element('#' + id)[0].style.width;
        centerZ.y += angular.element('#' + id)[0].style.height;

        // 調整
        var canvasPos = Utils.findPos(angular.element('#canvas')[0]);
        centerZ.x -= canvasPos.x;
        centerZ.x += 90;
        centerZ.y -= canvasPos.y;
        centerZ.y += 30;

        // タグ追加による調整
        centerZ.x -= $scope.offset_for_tag1;

        // 描画
        var ctx = angular.element('#canvas')[0].getContext('2d');
        ctx.font = fontSize.toString() + "px Arial";
        // ctx.fillStyle = '#005AB5';
        // ctx.fillStyle = CONSTANTS.NORMAL_LABEL_COLOR;
        ctx.fillStyle = color;
        ctx.textAlign = "right";
        // while (tag.length < 12) tag = ' ' + tag;
        ctx.fillText(tag, centerZ.x - fontSize * 7, centerZ.y);
    };

    // 談話関係と構成素ラベルの描画
    var connect = function(head_id, dep_id, relation, priority, constituent, link_color, label_color, fontSize) {
        drawCurve('edu' + head_id, 'edu' + dep_id, link_color);
        addRelation('edu' + dep_id, relation, priority, constituent, label_color, fontSize);
    };

    // リンクの描画
    var drawCurve = function(head_id, dep_id, color) {
        // while ($scope.operations.length > 0 && _.last($scope.operations).type === 'click') {
        //     $scope.operations.splice($scope.operations.length - 1, 1);
        // }

        // source coordinate
        var centerS = Utils.findPos(angular.element('#' + head_id)[0]);
        centerS.x += angular.element('#' + head_id)[0].style.width;
        centerS.y += angular.element('#' + head_id)[0].style.height;

        // target coordinate
        var centerT = Utils.findPos(angular.element('#' + dep_id)[0]);
        centerT.x += angular.element('#' + dep_id)[0].style.width;
        centerT.y += angular.element('#' + dep_id)[0].style.height;

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
        // X方向の微修正
        centerS.x -= 3;
        centerT.x -= 3;

        // ベジェ曲線用の座標計算
        var width = Utils.findPos(angular.element('#' + head_id)[0]).x;
        var depLength = Math.abs(Utils.getTrimNumber(head_id) - Utils.getTrimNumber(dep_id));
        var depLengthRatio = depLength / ($scope.heads.length - 1);
        // depLengthRatio = 1 - depLengthRatio;
        // if ($scope.edus.length > 30 && depLengthRatio > 0.5) {
        //     depLengthRatio = depLengthRatio - 0.5;
        // }
        // depLengthRatio = Math.min(depLengthRatio, 0.85);
        // var offX = width * depLengthRatio;
        var offX = Math.max(width * (1 - depLengthRatio) - 20, 0);

        // 描画
        var ctx = angular.element('#canvas')[0].getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath(); // 開始
        ctx.moveTo(centerS.x - $scope.offset_for_tag2, centerS.y); // 始点
        ctx.bezierCurveTo(offX - $scope.offset_for_tag2, centerS.y, // 始点に対するベジェ曲線用座標
                          offX - $scope.offset_for_tag2, centerT.y, // 終点に対するベジェ曲線用座標
                          centerT.x - $scope.offset_for_tag2, centerT.y // 終点
                          );
        ctx.stroke(); // レンダリング

        // 矢印の先部分
        var radius = 6;
        ctx.fillStyle = color;
        ctx.beginPath(); // 開始
        ctx.moveTo(centerT.x - radius - $scope.offset_for_tag2, centerT.y - radius);
        ctx.lineTo(centerT.x - radius - $scope.offset_for_tag2, centerT.y + radius);
        ctx.lineTo(centerT.x - $scope.offset_for_tag2, centerT.y);
        ctx.stroke(); // レンダリング

        ctx.closePath();
        ctx.fill();
    };

    // 談話関係の描画
    var addRelation = function(dep_id, relation, priority, constituent, color, fontSize) {
        if (!relation) {
            // console.log("addRelation:")
            // console.log("relation: " + relation);
            // console.log("priority: " + priority);
            // console.log("constituent: " + constituent);
            ngToast.danger({
                content: 'Invalid relation',
                timeout: 2000
            });
            return;
        }
        fontSize = fontSize || 15;

        // 位置
        var centerZ = Utils.findPos(angular.element('#' + dep_id)[0]);
        centerZ.x += angular.element('#' + dep_id)[0].style.width;
        centerZ.y += angular.element('#' + dep_id)[0].style.height;

        // 調整
        var canvasPos = Utils.findPos(angular.element('#canvas')[0]);
        centerZ.x -= canvasPos.x;
        centerZ.x += 90;
        centerZ.y -= canvasPos.y;
        centerZ.y += 30;

        // タグを追加したことによる調整
        centerZ.x -= $scope.offset_for_tag2;

        // 描画
        var ctx = angular.element('#canvas')[0].getContext('2d');
        ctx.font = fontSize.toString() + "px Arial";
        // ctx.fillStyle = '#005AB5';
        // ctx.fillStyle = CONSTANTS.NORMAL_LABEL_COLOR;
        ctx.fillStyle = color;
        ctx.textAlign = "right";
        // while (relation.length < 12) relation = ' ' + relation;
        ctx.fillText(relation + '#' + priority + ' [' + constituent + ']', centerZ.x - fontSize * 7, centerZ.y);
    };

    /************************************************/
    // EDU分割用
    // 1. ファイル読み込み
    /************************************************/

    $scope.handleFileSelectForSeg = function ($files) {
        // チェック
        if (!$files || !$files[0]) {
            return;
        }

        // クリア
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);

        // 一時変数の初期化
        $scope.first = second = $scope.focused_index = -1;

        // 入力ファイルの設定
        $scope.inputFile = $files[0];

        // ファイル読み込み
        var reader = new FileReader();
        if ($scope.inputFile.name.endsWith('.dep')) {
            // from xxxx.dep
            reader.onload = $scope.loadJsonDataForSeg;
        }
        else {
            // from xxxx.edu.txt or xxxx.sent.txt
            reader.onload = $scope.loadTextDataForSeg;
        }
        reader.readAsText($scope.inputFile);

        // 文字列に変換(?)
        $scope.inputFile = $scope.inputFile.name;
    };

    // テキストデータの読み込み (1行1EDU)
    $scope.loadTextDataForSeg = function(e) {
        // 改行区切り
        var contents = e.target.result.split('\n');

        // EDUs (空行はスキップ)
        $scope.edus = _.filter(contents, function(s) { return s.length > 0} );

        // 各EDUを単語分割
        for (var i = 0; i < $scope.edus.length; i++) {
            $scope.edus[i] = $scope.edus[i].split(" ");
        }

        // 各EDUのhead、談話関係、構成素ラベル、タグ
        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        $scope.relations = _.range($scope.edus.length).map(function() { return 'null'; });
        $scope.priorities = _.range($scope.edus.length).map(function() { return -1; });
        $scope.constituents= _.range($scope.edus.length).map(function() { return 'null'; });
        $scope.tags = _.range($scope.edus.length).map(function() { return 'null'; });

        // 各EDUの文番号
        $scope.sentence_ids = [];
        var sentence_id = 0;
        for (var i = 0; i < $scope.heads.length; ++i) {
            $scope.sentence_ids.push(sentence_id);
            if ($scope.edus[i].includes("<S>")) {
                sentence_id += 1;
            }
        }

        // 適応
        $scope.$apply();
    };

    // JSONデータの読み込み
    $scope.loadJsonDataForSeg = function(e) {
        // JSONオブジェクト
        var obj = JSON.parse(e.target.result).root;

        // EDUs
        $scope.edus = _.pluck(obj, 'text');

        // ROOTの除去
        $scope.edus = $scope.edus.slice(1, $scope.edus.length);

        // 各EDUの単語分割
        for (var i = 0; i < $scope.edus.length; i++) {
            $scope.edus[i] = $scope.edus[i].split(" ");
        }

        // 各EDUのhead, 談話関係、構成素ラベル、タグ
        $scope.heads = _.pluck(obj, 'parent');
        $scope.relations = _.pluck(obj, 'relation');
        $scope.priorities = _.pluck(obj, 'priority');
        $scope.constituents = _.pluck(obj, 'constituent');
        $scope.tags = _.pluck(obj, 'tag');

        // 各EDUの文番号
        $scope.sentence_ids = [];
        var sentence_id = 0;
        for (var i = 0; i < $scope.heads.length; ++i) {
            $scope.sentence_ids.push(sentence_id);
            if ($scope.edus[i].includes("<S>")) {
                sentence_id += 1;
            }
        }

        // 適応
        $scope.$apply();
    };

    /************************************************/
    // EDU分割用
    // 2. コピー、保存、例示
    /************************************************/

    // クリップボードにコピー
    $scope.copyToClipboardForSeg = function() {
        var text = "";
        for (var i = 0; i < $scope.edus.length; i++) {
            for (var j = 0; j < $scope.edus[i].length; j++) {
                text = text + $scope.edus[i][j].replace("<S>", "").replace("<P>", "")
                if ($scope.edus[i][j] === "<S>") {
                    text = text + "\n\n";
                }
                else {
                    text = text + " ";
                }
            }
        }
        var textBox = document.createElement("textarea");
        textBox.setAttribute("id", "target");
        textBox.setAttribute("type", "hidden");
        textBox.textContent = text;
        document.body.appendChild(textBox);
        textBox.select();
        document.execCommand("copy");
        document.body.removeChild(textBox);
        console.log("Copied:");
        console.log(text);
        ngToast.create({
            content: 'Copied the entire text to the clipboard.',
            timeout: 2000
        });
    };

    // 保存
    $scope.saveToFileForSeg = function() {
        let lines = [];
        for (var i = 0; i < $scope.edus.length; ++i) {
            const line = $scope.edus[i].join(" ") + "\n"
            lines.push(line);
        }

        // 出力ファイル名
        if ($scope.inputFile.endsWith(".edu.txt")) {
            // Overwrite
            var outFileName = $scope.inputFile;
        }
        else if ($scope.inputFile.endsWith(".sent.txt")) {
            // xxxx.sent.txt -> xxxx.edu.txt
            var outFileName = $scope.inputFile.replace(".sent.txt", ".edu.txt");
        }
        else {
            // xxxx.yyyy -> xxxx.yyyy.edu.txt
            var outFileName = $scope.inputFile + ".edu.txt";
        }

        // 出力ファイルオブジェクトの作成
        var blob = new Blob(lines, {type: "text/plain;charset=utf-8"});

        // 書き出し
        saveAs(blob, outFileName);
    };

    // 例示
    $scope.showRandomSampleForSeg = function () {
        // JSONファイルを読み込んで描画
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // JSONオブジェクト
                    var obj = JSON.parse(xhr.responseText).root;

                    // EDUs
                    $scope.edus = _.pluck(obj, 'text');

                    // ROOTの除去
                    $scope.edus = $scope.edus.slice(1, $scope.edus.length);

                    // 各EDUの単語分割
                    for (var i = 0; i < $scope.edus.length; i++) {
                        $scope.edus[i] = $scope.edus[i].split(" ");
                    }

                    // 各EDUのhead, 談話関係、構成素ラベル、タグ
                    $scope.heads = _.pluck(obj, 'parent');
                    $scope.relations = _.pluck(obj, 'relation');
                    $scope.priorities = _.pluck(obj, 'priority');
                    $scope.constituents = _.pluck(obj, 'constituent');
                    $scope.tags = _.pluck(obj, 'tag');

                    // 各EDUの文番号
                    $scope.sentence_ids = [];
                    var sentence_id = 0;
                    for (var i = 0; i < $scope.heads.length; ++i) {
                        $scope.sentence_ids.push(sentence_id);
                        if ($scope.edus[i].includes("<S>")) {
                            sentence_id += 1;
                        }
                    }

                    // 適応
                    $scope.$apply();
                }
            }
        }
        var arrayIndex = Math.floor(Math.random() * $scope.sampleFileList.length);
        var sampleFile = $scope.sampleFileList[arrayIndex];
        xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/examples/" + sampleFile);
        xhr.send();
        console.log(xhr);
        $scope.inputFile = sampleFile;
    };

    /************************************************/
    // EDU分割用
    // 3. マウスが重なった (外れた) ときの処理
    /************************************************/

    // マウスカーソルが乗っかったときの処理
    $scope.mouseOverIndexForSegE = -1;
    $scope.mouseOverindexForSegT = -1;
    $scope.mouseOverHandlerForSeg = function(eduIndex, tokenIndex) {
        // チェック
        if (eduIndex < 0 || eduIndex >= $scope.edus.length) {
            return;
        }

        // マウスが乗っかったEDUのindex
        $scope.mouseOverIndexForSegE = eduIndex;
        $scope.mouseOverIndexForSegT = tokenIndex;
    };

    // マウスカーソルが外れたときの処理
    $scope.mouseOutHandlerForSeg = function(eduIndex, tokenIndex) {
        // チェック
        if (eduIndex < 0 || eduIndex >= $scope.edus.length) {
            return;
        }

        // マウスが乗っかったEDUのindexの初期化
        $scope.mouseOverIndexForSegE = -1;
        $scope.mouseOverIndexForSegT = -1;
    };

    /************************************************/
    // EDU分割用
    // 4. アノテーションメイン
    /************************************************/

    // EDU分割・マージ処理
    $scope.segment = function(eduIndex, tokenIndex) {
        if (eduIndex === 0 && tokenIndex === 0) {
            console.log("No upper segment! Skipped.");
        }
        else if (tokenIndex > 0) {
            // 分割処理
            $scope.segmentEDUs(eduIndex, tokenIndex);
        }
        else {
            // マージ処理
            $scope.mergeEDUs(eduIndex, tokenIndex);
        }
    };

    $scope.segmentEDUs = function(eduIndex, tokenIndex) {
        let newEdus = [];
        // eduIndex番目まではそのまま
        for (var i = 0; i < eduIndex; i++) {
            newEdus.push($scope.edus[i]);
        }
        // eduIndex番目のEDUは二つに分割
        const left = $scope.edus[eduIndex].slice(0, tokenIndex);
        const right = $scope.edus[eduIndex].slice(tokenIndex);
        newEdus.push(left);
        newEdus.push(right);
        // eduIndex+1番目以降はそのまま
        for (var i = eduIndex + 1; i < $scope.edus.length; i++) {
            newEdus.push($scope.edus[i]);
        }

        // 再設定
        $scope.edus = newEdus;

        $scope.heads = [];
        $scope.relations = [];
        $scope.priorities = [];
        $scope.constituents = [];
        $scope.tags = [];

        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        $scope.relations = _.range($scope.edus.length).map(function() { return 'null'; });
        $scope.priorities = _.range($scope.edus.length).map(function() { return -1; });
        $scope.constituents= _.range($scope.edus.length).map(function() { return 'null'; });
        $scope.tags = _.range($scope.edus.length).map(function() { return 'null'; });

        $scope.sentence_ids = [];
        var sentence_id = 0;
        for (var i = 0; i < $scope.heads.length; ++i) {
            $scope.sentence_ids.push(sentence_id);
            if ($scope.edus[i].includes("<S>")) {
                sentence_id += 1;
            }
        }
    };

    $scope.mergeEDUs = function(eduIndex, tokenIndex) {
        let newEdus = [];
        // eduIndex-1番目まではそのまま
        for (var i = 0; i < eduIndex - 1; i++) {
            newEdus.push($scope.edus[i]);
        }
        // eduIndex番目はeduIndex-1番目のEDUとマージ
        const left = $scope.edus[eduIndex - 1];
        const right = $scope.edus[eduIndex];
        const merged = left.concat(right);
        newEdus.push(merged);
        // eduIndex+1番目以降はそのまま
        for (var i = eduIndex + 1; i < $scope.edus.length; i++) {
            newEdus.push($scope.edus[i]);
        }

        // 再設定
        $scope.edus = newEdus;

        $scope.heads = [];
        $scope.relations = [];
        $scope.priorities = [];
        $scope.constituents = [];
        $scope.tags = [];

        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        $scope.relations = _.range($scope.edus.length).map(function() { return 'null'; });
        $scope.priorities = _.range($scope.edus.length).map(function() { return -1; });
        $scope.constituents = _.range($scope.edus.length).map(function() { return 'null'; });
        $scope.tags = _.range($scope.edus.length).map(function() { return 'null'; });

        $scope.sentence_ids = [];
        var sentence_id = 0;
        for (var i = 0; i < $scope.heads.length; ++i) {
            $scope.sentence_ids.push(sentence_id);
            if ($scope.edus[i].includes("<S>")) {
                sentence_id += 1;
            }
        }
    };

}]); // /EDUListController
