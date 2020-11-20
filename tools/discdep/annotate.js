'use strict';

var app = angular.module('MyApp', ['ngFileUpload', 'ngToast']);

// 定数
app.constant('CONSTANTS', {
    // 談話関係クラス
    relations: ['ROOT',
                'attribution',
                'background',
                'cause',
                'comparison',
                'condition',
                'contrast',
                'elaboration',
                'enablement',
                'evaluation',
                'explanation',
                'joint',
                'manner-means',
                'summary',
                'temporal',
                'topic-change',
                'topic-comment',
                'same-unit',
                'textual'],
    // リンクの通常色
    NORMAL_LINK_COLOR: '#4A89F3',
    // リンクのハイライト色
    BLINK_LINK_COLOR: '#FFE047',
    // 談話関係ラベルの色
    LABEL_COLOR: '#DD4B3E',
    // ?
    //MAX_N: 150,
    MAX_N: 500,
    //  全体の横幅
    CANVAS_WIDTH: 1500  // canvas_height will be automatically set.
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

    $scope.first = -1; // 選択されたheadノード
    var second = -1; // 選択されたmodifierノード
    var rel = ''; // 選択された談話関係ラベル

    $scope.inputFile = ''; // 入力ファイル

    $scope.edus = []; // EDUのリスト
    $scope.heads = []; // 各EDUのhead IDのリスト
    $scope.depRels = []; // 各EDUとそのheadとの間の談話関係、のリスト
    $scope.relations = CONSTANTS.relations; // 定義された談話関係

    $scope.operations = []; // アクション履歴

    $scope.blinkColor = CONSTANTS.BLINK_LINK_COLOR; // リンクのハイライト色
    $scope.canvas_height = 700; // キャンバス縦幅 (デフォルト値)
    // "edus"の長さ(=edus.length)が変わったら、キャンバスの縦幅を更新
    $scope.$watch('edus.length', function() {
        // empirical formula
        $scope.canvas_height = ($scope.edus.length === 0) ? 700 : ($scope.edus.length / 75 * 4500 + 200);
    });
    $scope.canvas_width = CONSTANTS.CANVAS_WIDTH; // キャンバス横幅

    // メニューバー: ファイルアップロード
    $scope.handleFileSelect = function ($files) {
        // チェック
        if (!$files || !$files[0]) {
            return;
        }

        // キャンバス等の取得
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
        // 描画 (不要のはず)
        for (var i = 0; i < $scope.heads.length; ++i) {
            if ($scope.heads[i] >= 0) {
                // リンクの描画
                drawCurve('edu' + $scope.heads[i].toString(), 'edu' + i.toString(), CONSTANTS.NORMAL_LINK_COLOR);
                // 談話関係ラベルの描画
                addRelation('edu' + i.toString(), $scope.depRels[i]);
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
                addRelation('edu' + i.toString(), $scope.depRels[i]);
            }
        }
    };

    // メニューバー: 例示
    // $scope.samples = ["サンプル 01", "サンプル 02", "サンプル 03"];
    // $scope.selectedSample = null;
    $scope.showSample1 = function () {
        // キャンバス等の取得
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
                            addRelation('edu' + i.toString(), $scope.depRels[i]);
                        }
                    }
                }
            }
        }
        xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/samples/1dc818a92b31dc871d7020ec659faaeb38e519c6.edus.tokens.dep");
        xhr.send();
        console.log(xhr);
        $scope.inputFile = "Sample 01";
    };
    $scope.showSample2 = function () {
        // キャンバス等の取得
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
                            addRelation('edu' + i.toString(), $scope.depRels[i]);
                        }
                    }
                }
            }
        }
        xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/samples/1d5a95f805753e4ae9c605845a395adf47cabce8.edus.tokens.dep");
        xhr.send();
        console.log(xhr);
        $scope.inputFile = "Sample 02";
    };
    $scope.showSample3 = function () {
        // キャンバス等の取得
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
                            addRelation('edu' + i.toString(), $scope.depRels[i]);
                        }
                    }
                }
            }
        }
        xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/samples/8d0569b9fe93d0997ca38060117ffc6381122957.edus.tokens.dep");
        xhr.send();
        console.log(xhr);
        $scope.inputFile = "Sample 03";
    };

    // メニューバー: 保存
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

    // メニューバー: UNDO処理
    $scope.undo = function() {
        // 最終アクション
        var op = _.last($scope.operations);
        if (op.type === 'click') {
            // もし最終アクションがhead選択なら、head解除
            $scope.first = -1;
        }
        else if (op.type === 'connect') {
            // もし最終アクションがmodifier選択なら、headとmodifierの結合をなくす
            disconnect(op.id1, op.id2);
        }
        else if (op.type === 'delete') {
            // もし最終アクションが結合の削除なら、結合を戻す
            var id1 = op.id1, id2 = op.id2;
            $scope.heads[id2] = id1;
            $scope.depRels[id2] = op.relation;
            connect(id1, id2, $scope.depRels[id2], CONSTANTS.NORMAL_LINK_COLOR);
        }
        $scope.operations.pop();
    };

    // メニューバー: head解除処理
    $scope.clearNode = function() {
        $scope.first = -1;
        $scope.operations.pop();
    };

    // メニューバー: リンク削除処理
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
        var op = {type: 'delete', id1: id1, id2: id2, relation: $scope.depRels[id2]};
        $scope.first = -1;
        disconnect(id1, id2);
        // 履歴に追加
        $scope.operations.push(op);
    };

    // メニューバー: ラベル辞書に追加
    // $scope.addLabel = function() {
    //     var label = prompt('ラベルを辞書に追加:').trim().toLowerCase();
    //     if (!label) {
    //         ngToast.danger({
    //             content: 'エラー: 空文字はラベルとして不適です',
    //             timeout: 2000
    //         });
    //         return;
    //     }
    //     if ($scope.relations.indexOf(label) > 0) {
    //         ngToast.danger({
    //             content: 'エラー: ラベル ' + label + ' は既に存在しています',
    //             timeout: 2000
    //         });
    //         return;
    //     }
    //     $scope.relations.unshift(label);
    //     ngToast.success({
    //        content: 'ラベルを辞書に追加しました ' + label,
    //         timeout: 2000
    //     });
    // };

    // メニューバー: ラベル辞書から削除
    // $scope.openDeleteDialog = false;
    // $scope.deleteLabel = function() {
    //     var dialog = $('#new-relation-dialog').dialog({
    //         autoOpen: false,
    //         height: 600,
    //         width: 350,
    //         modal: true,
    //         buttons: {
    //             OK: function() {
    //                 $scope.openDeleteDialog = false;
    //                 $scope.$apply();
    //                 dialog.dialog('close');
    //             }
    //         }
    //     });
    //     $scope.openDeleteDialog = true;
    //     dialog.dialog('open');
    // };
    // $scope.removeRelation = function(relation) {
    //     var pos = $scope.relations.indexOf(relation);
    //     if (pos >= 0) {
    //         $scope.relations.splice(pos, 1);
    //         ngToast.info({
    //             content: 'ラベルを辞書から削除しました ' + relation,
    //             timeout: 2000
    //         });
    //     }
    // };

    // メニューバー: カスタム辞書
    // $scope.handleBrowseClick = function() {
    //     var ctrl = angular.element('#relation-file');
    //     ctrl.on('change', handleChange);
    //     ctrl.click();
    // };
    // var handleChange = function(evt) {
    //     var file = evt.target.files[0];
    //     var reader = new FileReader();
    //     reader.onload = function(e) {
    //         var contents = e.target.result.split('\n');
    //         $scope.relations = [];
    //         for (var i = 0; i < contents.length; ++i) {
    //             var r = contents[i].trim();
    //             if (r.length > 0 && $scope.relations.indexOf(r) < 0) {
    //                 $scope.relations.push(r);
    //             }
    //         }
    //         ngToast.success({
    //            content: 'SUCCESSFULLY load ' + $scope.relations.length.toString() + ' relations.',
    //            timeout: 2000
    //         });
    //         $scope.$apply();
    //     };
    //     reader.readAsText(file);
    // };

    // プログレスバー
    $scope.progress = 0;
    $scope.$watchCollection('heads', function() {
        var total = _.size($scope.heads) - 1;
        if (total <= 0) return;
        var labeled = (_.filter($scope.heads.slice(1), function(e) { return e >= 0; })).length;
        $scope.progress = labeled * 100 / total;
    });

    // マウスカーソルが乗っかったときの処理
    $scope.mouseOverIndex = -1;
    $scope.mouseOverHandler = function(pos) {
        // チェック
        if (pos < 0 || pos >= $scope.heads.length || $scope.heads[pos] < 0) {
            return;
        }

        // マウスが乗っかったEDUのindex
        $scope.mouseOverIndex = pos;

        // キャンバス等の取得
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);

        // 描画
        for (var i = 0; i < $scope.heads.length; ++i) {
            if (i === pos && $scope.heads[i] >= 0) {
                connect($scope.heads[i], i, $scope.depRels[i], CONSTANTS.BLINK_LINK_COLOR, 25);
            }
            else if ($scope.heads[i] >= 0) {
                connect($scope.heads[i], i, $scope.depRels[i], CONSTANTS.NORMAL_LINK_COLOR);
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

        // canvas等の取得
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);

        // 描画
        _.each($scope.heads, function(v, i) {
            if (v >= 0) {
                connect(v, i, $scope.depRels[i], CONSTANTS.NORMAL_LINK_COLOR);
            }
        });
    };

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
    var popRelation = function() {
        var dialog;

        function relationCallback() {
            rel = angular.element('#select')[0].options[select.selectedIndex].text;
            $scope.heads[second] = $scope.first;

            // 描画
            var id1 = 'edu' + $scope.first.toString();
            var id2 = 'edu' + second.toString();
            drawCurve(id1, id2, CONSTANTS.NORMAL_LINK_COLOR);
            addRelation(id2, rel);

            // 履歴追加
            var op = {type: 'connect', id1: $scope.first.toString(), id2: second.toString()};
            $scope.operations.push(op);

            // 談話関係ラベルセット
            $scope.depRels[second] = rel;

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

        // なんだこれ
        var canvasPos = Utils.findPos(angular.element('canvas')[0]);

        // 調整
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

        // なんだこれ
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

    var connect = function(id1, id2, rel, color, fontSize) {
        drawCurve('edu' + id1, 'edu' + id2, color);
        addRelation('edu' + id2, rel, fontSize);
    };

    var disconnect = function(id1, id2) {
        // 該当要素の削除
        $scope.heads[id2] = -1;
        $scope.depRels[id2] = 'null';

        // キャンバス等の取得
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);

        // 描画
        for (var i = 0; i < $scope.heads.length; ++i) {
            if ($scope.heads[i] >= 0) {
                connect($scope.heads[i], i, $scope.depRels[i], CONSTANTS.NORMAL_LINK_COLOR);
            }
        }
    };

    // 談話関係ラベルの描画
    var addRelation = function(id2, relation, fontSize) {
        if (!relation) {
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

        // なんだこれ
        var canvasPos = Utils.findPos(angular.element('#canvas')[0]);

        // 調整
        centerZ.x -= canvasPos.x;
        centerZ.y -= canvasPos.y;
        centerZ.y += 30;

        // 描画
        var ctx = angular.element('#canvas')[0].getContext('2d');
        ctx.font = fontSize.toString() + "px Arial";
        // ctx.fillStyle = '#005AB5';
        ctx.fillStyle = CONSTANTS.LABEL_COLOR;
        while (relation.length < 12) relation = ' ' + relation;
        ctx.fillText(relation, centerZ.x - fontSize * 7, centerZ.y);
    };

}]); // /EDUListController
