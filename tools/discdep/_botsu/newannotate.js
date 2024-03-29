'use strict';

var app = angular.module('MyApp', ['ngFileUpload', 'ngToast']);

app.constant('CONSTANTS', {
    // 談話関係クラス
    relations: [
        "ROOT",
        // General
        "ELABORATION",
        "ADDITION",
        "COMPARISON",
        "CAUSE-RESULT",
        "CONDITION",
        "TEMPORAL",
        // Specific
        "ENABLEMENT",
        "MANNER-MEANS",
        "BACKGROUND",
        // "FINDINGS",
        // Functional
        "ATTRIBUTION",
        "TEXTUAL-ORGANIZATION",
        "SAME-UNIT",
        // Special
        "SEGMENTATION-ERROR",
    ],
    // XXX
    eduTypeVocab: [
        "Background",
        "Objective",
        "Action",
        "Result",
        "Implication",
        "Title",
    ],
    // Colors are set according to the palette of The New England Journal of Medicine
    // 色
    NORMAL_LINK_COLOR: '#0072B5', // NEJM Blue
    NORMAL_LABEL_COLOR: '#BC3C29', // NEJM Red
    BLINK_LINK_COLOR: '#E18727', // NEJM Orange
    BLINK_LABEL_COLOR: '#E18727', // NEJM Orange
    BLINK_NODE_COLOR1: '#E18727', // NEJM Orange
    BLINK_NODE_COLOR2: '#FFDC91', // Creamy Orange
    //MAX_N: 150,
    MAX_N: 500,
    //  全体の横幅
    CANVAS_WIDTH: 1500, // canvas_height will be automatically set.
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
    $scope.sentence_ids = []; // 各EDUの文番号のリスト

    // XXX
    var typ = '';
    $scope.eduTypes = [];
    $scope.eduTypeVocab = CONSTANTS.eduTypeVocab;

    $scope.operations = []; // アクション履歴

    $scope.blinkNodeColor1 = CONSTANTS.BLINK_NODE_COLOR1;
    $scope.blinkNodeColor2 = CONSTANTS.BLINK_NODE_COLOR2;
    $scope.canvas_height = 700; // キャンバス縦幅 (デフォルト値)
    // "edus"の長さ(=edus.length)が変わったら、キャンバスの縦幅を更新
    $scope.$watch('edus.length', function() {
        // empirical formula
        $scope.canvas_height = ($scope.edus.length === 0) ? 700 : ($scope.edus.length / 75 * 4500 + 200);
    });
    $scope.canvas_width = CONSTANTS.CANVAS_WIDTH; // キャンバス横幅

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

    // EDU分割用
    // $scope.eduBegins = [];

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
        // edusのセット (空行はスキップ)
        $scope.edus = _.filter(contents, function(s) { return s.length > 0} );
        // ROOTの追加
        $scope.edus.unshift('ROOT');
        // headsの初期化
        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        // 談話関係ラベルの初期化
        $scope.depRels = _.range($scope.edus.length).map(function() { return 'null'; });
        // XXX
        $scope.eduTypes = _.range($scope.edus.length).map(function() { return 'null'; });
        // 文番号
        $scope.sentence_ids = [];
        $scope.sentence_ids.push(0)
        var sentence_id = 1;
        for (var i = 1; i < $scope.heads.length; ++i) {
            $scope.sentence_ids.push(sentence_id);
            if ($scope.edus[i].includes("<S>")) {
                sentence_id += 1;
            }
        }
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
        // XXX
        $scope.eduTypes = _.pluck(obj, 'type');
        // 文番号
        $scope.sentence_ids = [];
        $scope.sentence_ids.push(0)
        var sentence_id = 1;
        for (var i = 1; i < $scope.heads.length; ++i) {
            $scope.sentence_ids.push(sentence_id);
            if ($scope.edus[i].includes("<S>")) {
                sentence_id += 1;
            }
        }
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

    // XXX
    // EDUタイプ付与処理
    $scope.setEDUType = function () {
        // チェック
        if ($scope.first < 0 || $scope.first >= $scope.heads.length) {
            ngToast.danger({
                content: 'エラー: ノードが選択されていません！',
                timeout: 2000
            });
            return;
        }
        // タイプの選択
        var id = $scope.first;
        // var op = {type: 'setEDUType', id: id, replated_type: $scope.eduTypes[id]};
        $scope.first = id;
        popEDUType();
        // 描画
        drawAll();
        // 履歴
        // $scope.operations.push(op);
        // console.log("setEDUType pushed:");
        // console.log($scope.operations);
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
            var id1 = op.id1;
            var id2 = op.id2;
            var rel = op.changed_relation;
            $scope.heads[id2] = id1;
            $scope.depRels[id2] = rel;
            // 描画
            drawAll();
        }
        else if (op.type === 'delete') {
            // もし最終アクションが結合の削除なら、結合を戻す
            var id1 = op.id1;
            var id2 = op.id2;
            var rel = op.deleted_relation;
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
        var text = "";
        for (var i = 1; i < $scope.edus.length; i++) {
            text = text + $scope.edus[i].replace("<S>", "").replace("<P>", "");
            if (i == $scope.edus.length - 1) {
                text = text; // Do nothing
            }
            else if ($scope.edus[i].includes("<S>")) {
                text = text + "\n";
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
            content: '全文をクリップボードにコピーしました',
            timeout: 2000
        });
    };

    // 保存
    $scope.saveToFile = function() {
        if ($scope.progress !== 100) {
            ngToast.warning({
                content: 'WARNING: 談話依存構造は完全ではありません！',
                timeout: 5000
            });
        }
        // 辞書データの初期化
        var data = {root: []};
        // 辞書データ作成
        for (var i = 0; i < $scope.heads.length; ++i) {
            var cur = {id: i,
                       parent: $scope.heads[i],
                       text: $scope.edus[i],
                       relation: $scope.depRels[i],
                       type: $scope.eduTypes[i]};
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
        var blob = new Blob([JSON.stringify(data, null, '\t')], {type: "text/plain;charset=utf-8"});
        // 書き出し
        saveAs(blob, outFileName);
    };

    // 例示
    $scope.showRandomSample = function (depRel) {
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
                    // XXX
                    $scope.eduTypes = _.pluck(obj, 'type');
                    // 文番号
                    $scope.sentence_ids = [];
                    $scope.sentence_ids.push(0)
                    var sentence_id = 1;
                    for (var i = 1; i < $scope.heads.length; ++i) {
                        $scope.sentence_ids.push(sentence_id);
                        if ($scope.edus[i].includes("<S>")) {
                            sentence_id += 1;
                        }
                    }
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
        var arrayIndex = Math.floor(Math.random() * $scope.sampleFileDict[depRel].length);
        var sampleFile = $scope.sampleFileDict[depRel][arrayIndex];
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
    // マウスがEDUと重なった時・外れたときの処理
    /************************************************/

    // マウスカーソルが乗っかったときの処理
    $scope.mouseOverIndex = -1;
    $scope.mouseOverHandler = function(pos) {
        // チェック
        // if (pos < 0 || pos >= $scope.heads.length || $scope.heads[pos] < 0) {
        if (pos < 0 || pos >= $scope.heads.length) {
            return;
        }

        // マウスが乗っかったEDUのindex
        $scope.mouseOverIndex = pos;
        // console.log($scope.mouseOverIndex);

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
        // if (pos < 0 || pos >= $scope.heads.length || $scope.heads[pos] < 0) {
        if (pos < 0 || pos >= $scope.heads.length) {
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
            if (mode !== "change") {
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

    // XXX
    // EDUラベル選択
    $scope.showAddDialogForEDUType = false;
    var popEDUType = function() {
        var dialog;

        function eduTypeCallback() {
            // 依存関係のセット
            typ = angular.element('#selectForEDUType')[0].options[selectForEDUType.selectedIndex].text;
            console.log(angular.element("#selectForEDUType")[0].options[0].text);
            console.log(angular.element("#selectForEDUType")[0].options[1].text);
            console.log(angular.element("#selectForEDUType")[0].options[2].text);
            console.log(angular.element("#selectForEDUType")[0].options[3].text);
            console.log(selectForEDUType.selectedIndex);
            console.log($scope.first);
            console.log(typ);
            $scope.eduTypes[$scope.first] = typ;

            // 描画
            drawAll();

            // // 履歴追加
            // var op = {type: 'popEDUType', id: $scope.first.toString(), set_type: typ};
            // $scope.operations.push(op);
            // console.log("popEDUType pushed:");
            // console.log($scope.operations);

            // 状態の初期化
            $scope.first = -1; second = -1;

            // ダイアログのクローズ
            $scope.showAddDialogForEDUType = false;
            dialog.dialog('close');

            //
            $scope.$apply();
        }

        dialog = $("#dialog-form-for-edu-type").dialog({
            autoOpen: false,
            height: 200,
            width: 450,
            modal: true,
            buttons: {
                OK: eduTypeCallback
            },
            position: {
                my: 'left top',
                at: 'left+10% top+10%',
                of: window
            }
        });

        // EDUラベルの初期化
        typ = '';

        // ダイアログのポップアップ
        $scope.showAddDialogForEDUType = true;
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
        // X方向の微修正
        centerS.x -= 3;
        centerT.x -= 3;

        // ベジェ曲線用の座標計算
        var width = Utils.findPos(angular.element('#' + id1)[0]).x;
        var depLength = Math.abs(Utils.getTrimNumber(id1) - Utils.getTrimNumber(id2));
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
        ctx.moveTo(centerS.x, centerS.y); // 始点
        ctx.bezierCurveTo(offX, centerS.y, // 始点に対するベジェ曲線用座標
                          offX, centerT.y, // 終点に対するベジェ曲線用座標
                          centerT.x, centerT.y // 終点
                          );
        ctx.stroke(); // レンダリング

        // 矢印の先部分
        var radius = 6;
        ctx.fillStyle = color;
        ctx.beginPath(); // 開始
        ctx.moveTo(centerT.x - radius, centerT.y - radius);
        ctx.lineTo(centerT.x - radius, centerT.y + radius);
        ctx.lineTo(centerT.x, centerT.y);
        ctx.stroke(); // レンダリング

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

    /************************************************/
    // EDU分割用
    /************************************************/

    // ファイルアップロード
    $scope.handleFileSelectForSeg = function ($files) {
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
        // edusのセット (空行はスキップ)
        $scope.edus = _.filter(contents, function(s) { return s.length > 0} );
        // 各EDUを単語分割
        // var accum = 0;
        for (var i = 0; i < $scope.edus.length; i++) {
            $scope.edus[i] = $scope.edus[i].split(" ");
            // $scope.eduBegins[i] = accum;
            // accum = accum + $scope.edus[i].length;
        }
        // headsの初期化
        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        // 談話関係ラベルの初期化
        $scope.depRels = _.range($scope.edus.length).map(function() { return 'null'; });
        // XXX
        $scope.eduTypes = _.range($scope.edus.length).map(function() { return 'null'; });
        //
        $scope.$apply();
    };

    $scope.loadJsonDataForSeg = function(e) {
        // JSONオブジェクト
        var obj = JSON.parse(e.target.result).root;
        // EDUテキストの抽出
        $scope.edus = _.pluck(obj, 'text');
        // ROOTの除去
        $scope.edus = $scope.edus.slice(1, $scope.edus.length);
        // 各EDUの単語分割
        // var accum = 0;
        for (var i = 0; i < $scope.edus.length; i++) {
            $scope.edus[i] = $scope.edus[i].split(" ");
            // $scope.eduBegins[i] = accum;
            // accum = accum + $scope.edus[i].length;
        }
        // headsの抽出
        $scope.heads = _.pluck(obj, 'parent');
        // 談話関係ラベルの抽出
        $scope.depRels = _.pluck(obj, 'relation');
        // XXX
        $scope.eduTypes = _.pluck(obj, 'type');
        //
        $scope.$apply();
    };

    // クリップボードにコピー
    $scope.copyToClipboardForSeg = function() {
        var text = "";
        for (var i = 0; i < $scope.edus.length; i++) {
            for (var j = 0; j < $scope.edus[i].length; j++) {
                text = text + $scope.edus[i][j].replace("<S>", "").replace("<P>", "")
                if ($scope.edus[i][j] === "<S>") {
                    text = text + "\n";
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
            content: '全文をクリップボードにコピーしました',
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
                    // EDUテキストの抽出
                    $scope.edus = _.pluck(obj, 'text');
                    // ROOTの除去
                    $scope.edus = $scope.edus.slice(1, $scope.edus.length);
                    // 各EDUの単語分割
                    // var accum = 0;
                    for (var i = 0; i < $scope.edus.length; i++) {
                        $scope.edus[i] = $scope.edus[i].split(" ");
                        // $scope.eduBegins[i] = accum;
                        // accum = accum + $scope.edus[i].length;
                    }
                    // headsの抽出
                    $scope.heads = _.pluck(obj, 'parent');
                    // 談話関係ラベルの抽出
                    $scope.depRels = _.pluck(obj, 'relation');
                    // XXX
                    $scope.eduTypes = _.pluck(obj, 'type');
                    //
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

    // マウスカーソルが乗っかったときの処理
    $scope.mouseOverIndexForSegE = -1;
    $scope.mouseOverindexForSegT = -1;
    $scope.mouseOverHandlerForSeg = function(eduIndex, tokenIndex) {
        // チェック
        // if (pos < 0 || pos >= $scope.heads.length || $scope.heads[pos] < 0) {
        if (eduIndex < 0 || eduIndex >= $scope.edus.length) {
            return;
        }

        // マウスが乗っかったEDUのindex
        $scope.mouseOverIndexForSegE = eduIndex;
        $scope.mouseOverIndexForSegT = tokenIndex;
        // console.log($scope.mouseOverIndexForSegE);
        // console.log($scope.mouseOverIndexForSegT);
    };

    // マウスカーソルが外れたときの処理
    $scope.mouseOutHandlerForSeg = function(eduIndex, tokenIndex) {
        // チェック
        // if (pos < 0 || pos >= $scope.heads.length || $scope.heads[pos] < 0) {
        if (eduIndex < 0 || eduIndex >= $scope.edus.length) {
            return;
        }

        // マウスが乗っかったEDUのindexの初期化
        $scope.mouseOverIndexForSegE = -1;
        $scope.mouseOverIndexForSegT = -1;
    };

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
        // $scope.eduBegins = [];
        $scope.heads = [];
        $scope.depRels = [];
        // XXX
        $scope.eduTypes = [];
        // var accum = 0;
        // for (var i = 0; i < $scope.edus.length; i++) {
        //     $scope.eduBegins[i] = accum;
        //     accum = accum + $scope.edus[i].length;
        // }
        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        $scope.depRels = _.range($scope.edus.length).map(function() { return 'null'; });
        // XXX
        $scope.eduTypes = _.range($scope.edus.length).map(function() { return 'null'; });
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
        // $scope.eduBegins = [];
        $scope.heads = [];
        $scope.depRels = [];
        // XXX
        $scope.eduTypes = [];
        // var accum = 0;
        // for (var i = 0; i < $scope.edus.length; i++) {
        //     $scope.eduBegins[i] = accum;
        //     accum = accum + $scope.edus[i].length;
        // }
        $scope.heads = _.range($scope.edus.length).map(function() { return -1; });
        $scope.depRels = _.range($scope.edus.length).map(function() { return 'null'; });
        // XXX
        $scope.eduTypes = _.range($scope.edus.length).map(function() { return 'null'; });
    };


}]); // /EDUListController
