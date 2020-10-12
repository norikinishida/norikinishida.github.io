'use strict';

var app = angular.module('DepAnnotate', ['ngFileUpload', 'ngToast']);

app.constant('CONSTANTS', {
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
        NORMAL_EDGE_COLOR: '#E01E5A',
        BLINK_EDGE_COLOR: '#ECB22E',
        LABEL_COLOR: '#2EB67D',
        MAX_N: 150,
        CANVAS_WIDTH: 1500  // canvas_height will be automatically set.
});

app.filter('TransformParent', function() {
   return function(p) {
        return (p < 0) ? 'null' : p;
   };
});

app.filter('TailorString', ['CONSTANTS', function(CONSTANTS) {
   return function(s) {
       return s.substr(0, CONSTANTS.MAX_N);
   };
}]);

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

app.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        horizontalPosition: 'center'
    });
}]);

app.controller('EDUListController',
                    ['$scope', 'Upload', 'CONSTANTS', 'Utils', 'ngToast',
                    function($scope, Upload, CONSTANTS, Utils, ngToast) {
    var second = -1;
    var rel = '';

    $scope.first = -1;
    $scope.inputFile = '';
    $scope.edus = [];
    $scope.fa = [];
    $scope.depRel = [];
    $scope.relations = CONSTANTS.relations;
    $scope.operations = [];
    $scope.blinkColor = CONSTANTS.BLINK_EDGE_COLOR;
    $scope.canvas_height = 700;
    $scope.canvas_width = CONSTANTS.CANVAS_WIDTH;
    $scope.$watch('edus.length', function() {
        // empirical formula
        $scope.canvas_height = ($scope.edus.length === 0) ? 700 : ($scope.edus.length / 75 * 4500 + 100);
    });

    // メニューバー: ファイルアップロード
    $scope.handleFileSelect = function ($files) {
        if (!$files || !$files[0]) {
            return;
        }
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        $scope.operations = [];
        $scope.first = second = -1;
        $scope.inputFile = $files[0];
        var reader = new FileReader();
        if ($scope.inputFile.name.endsWith('.dep')) {
            reader.onload = $scope.loadJsonData;
        }
        else {
            reader.onload = $scope.loadRawData;
        }
        reader.readAsText($scope.inputFile);
        $scope.inputFile = $scope.inputFile.name;
    };
    $scope.loadRawData = function(e) {
        // 改行区切り
        var contents = e.target.result.split('\n');
        // 空行はスキップ
        $scope.edus = _.filter(contents, function(s) { return s.length > 0} );
        // ROOTの追加
        $scope.edus.unshift('ROOT');
        // 親ノードの初期化
        $scope.fa = _.range($scope.edus.length).map(function() { return -1; });
        // 談話関係ラベルの初期化
        $scope.depRel = _.range($scope.edus.length).map(function() { return 'null'; });
        //
        $scope.$apply();
        // エッジの描画
        for (var i = 0; i < $scope.fa.length; ++i) {
            if ($scope.fa[i] >= 0) {
                drawCurve('parent' + $scope.fa[i].toString(), 'parent' + i.toString(), CONSTANTS.NORMAL_EDGE_COLOR);
                addRelation('parent' + i.toString(), $scope.depRel[i]);
            }
        }
    };
    $scope.loadJsonData = function(e) {
        // JSONオブジェクト
        var obj = JSON.parse(e.target.result).root;
        // 親ノードの抽出
        $scope.fa = _.pluck(obj, 'parent');
        // 談話関係ラベルの抽出
        $scope.depRel = _.pluck(obj, 'relation');
        // EDUテキストの抽出
        $scope.edus = _.pluck(obj, 'text');
        //
        $scope.$apply();
        // エッジの描画
        for (var i = 0; i < $scope.fa.length; ++i) {
            if ($scope.fa[i] >= 0) {
                drawCurve('parent' + $scope.fa[i].toString(), 'parent' + i.toString(), CONSTANTS.NORMAL_EDGE_COLOR);
                addRelation('parent' + i.toString(), $scope.depRel[i]);
            }
        }
    };

    // メニューバー: 例示
    // $scope.samples = ["サンプル 01", "サンプル 02", "サンプル 03"];
    // $scope.selectedSample = null;
    $scope.showSample = function () {
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        $scope.operations = [];
        $scope.first = second = -1;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/samples/1dc818a92b31dc871d7020ec659faaeb38e519c6.edus.tokens.dep");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var obj = JSON.parse(xhr.responseText).root;
                }
            }
        }
        xhr.send();

        // JSONオブジェクト
        // var obj = JSON.parse(xhr.responseText).root;
        // 親ノードの抽出
        $scope.fa = _.pluck(obj, 'parent');
        // 談話関係ラベルの抽出
        $scope.depRel = _.pluck(obj, 'relation');
        // EDUテキストの抽出
        $scope.edus = _.pluck(obj, 'text');
        //
        $scope.$apply();
        // エッジの描画
        for (var i = 0; i < $scope.fa.length; ++i) {
            if ($scope.fa[i] >= 0) {
                drawCurve('parent' + $scope.fa[i].toString(), 'parent' + i.toString(), CONSTANTS.NORMAL_EDGE_COLOR);
                addRelation('parent' + i.toString(), $scope.depRel[i]);
            }
        }

        $scope.inputFile = "1dc818a92b31dc871d7020ec659faaeb38e519c6.edus.tokens.dep";
    };

    // メニューバー: 保存
    $scope.saveToFile = function() {
        var data = {root: []};
        for (var i = 0; i < $scope.fa.length; ++i) {
            var cur = {id: i, parent: $scope.fa[i], text: $scope.edus[i], relation: $scope.depRel[i]};
            data.root.push(cur);
        }
        var outFileName = $scope.inputFile.endsWith('.dep') ? $scope.inputFile : $scope.inputFile + '.dep';
        var blob = new Blob([JSON.stringify(data, null, '\t')], {type: "text/plain;charset=utf-8"});
        saveAs(blob, outFileName);
    };

    // メニューバー: UNDO処理
    $scope.undo = function() {
        var op = _.last($scope.operations);
        if (op.type === 'click') {
            $scope.first = -1;
        }
        else if (op.type === 'connect') {
            disconnect(op.id1, op.id2);
        }
        else if (op.type === 'delete') {
            var id1 = op.id1, id2 = op.id2;
            $scope.fa[id2] = id1;
            $scope.depRel[id2] = op.relation;
            connect(id1, id2, $scope.depRel[id2], CONSTANTS.NORMAL_EDGE_COLOR);
        }
        $scope.operations.pop();
    };

    // メニューバー: ノード解除処理
    $scope.clearNode = function() {
        $scope.first = -1;
        $scope.operations.pop();
    };

    // メニューバー: リンク削除処理
    $scope.deleteEdge = function () {
        // delete edge between selected EDU and its father
        if ($scope.first < 0 || $scope.first >= $scope.fa.length) {
            ngToast.danger({
                content: 'エラー: ノードが選択されていません！',
                timeout: 2000
            });
            return;
        }
        if ($scope.fa[$scope.first] < 0) {
            ngToast.danger({
                content: 'エラー: 選択されたノードには親ノードがありません！',
                timeout: 2000
            });
            return;
        }
        var id1 = $scope.fa[$scope.first], id2 = $scope.first;
        var op = {type: 'delete', id1: id1, id2: id2, relation: $scope.depRel[id2]};
        $scope.first = -1;
        disconnect(id1, id2);
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
    $scope.$watchCollection('fa', function() {
        var total = _.size($scope.fa) - 1;
        if (total <= 0) return;
        var labeled = (_.filter($scope.fa.slice(1), function(e) { return e >= 0; })).length;
        $scope.progress = labeled * 100 / total;
    });

    // マウスカーソルが乗っかったときの処理
    $scope.mouseOverIndex = -1;
    $scope.mouseOverHandler = function(pos) {
        if (pos < 0 || pos >= $scope.fa.length || $scope.fa[pos] < 0) {
            return;
        }
        $scope.mouseOverIndex = pos;
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        for (var i = 0; i < $scope.fa.length; ++i) {
            if (i === pos && $scope.fa[i] >= 0) {
                connect($scope.fa[i], i, $scope.depRel[i], CONSTANTS.BLINK_EDGE_COLOR, 25);
            }
            else if ($scope.fa[i] >= 0) {
                connect($scope.fa[i], i, $scope.depRel[i], CONSTANTS.NORMAL_EDGE_COLOR);
            }
        }
    };

    // マウスカーソルが外れたときの処理
    $scope.mouseOutHandler = function(pos) {
        if (pos < 0 || pos >= $scope.fa.length || $scope.fa[pos] < 0) {
            return;
        }
        $scope.mouseOverIndex = -1;
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        _.each($scope.fa, function(v, i) {
            if (v >= 0) {
                connect(v, i, $scope.depRel[i], CONSTANTS.NORMAL_EDGE_COLOR);
            }
        });
    };

    // エッジ追加処理 (EDUのクリック)
    $scope.highLight = function(id) {
        var index = parseInt(id.toString().substr(3));
        if ($scope.first === -1) {
            $scope.first = index;
            $scope.mouseOutHandler(id);
            var op = {type: 'click', index: index};
            $scope.operations.push(op);
        }
        else {
            second = index;
            popRelation();
        }
    };
    $scope.showAddDialog = false;
    var popRelation = function() {
        var dialog;
        function relationCallback() {
            rel = angular.element('#select')[0].options[select.selectedIndex].text;
            $scope.fa[second] = $scope.first;
            var id1 = 'parent' + $scope.first.toString();
            var id2 = 'parent' + second.toString();
            drawCurve(id1, id2, CONSTANTS.NORMAL_EDGE_COLOR);
            addRelation(id2, rel);
            var op = {type: 'connect', id1: $scope.first.toString(), id2: second.toString()};
            $scope.operations.push(op);
            $scope.depRel[second] = rel;
            $scope.first = -1; second = -1;
            $scope.showAddDialog = false;
            dialog.dialog('close');
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
        rel = '';
        $scope.showAddDialog = true;
        dialog.dialog("open");
    };
    $scope.getParent = function(idx) {
        if ($scope.fa[idx] === -1) {
            return idx;
        }
        return $scope.getParent($scope.fa[idx]);
    };

    // エッジの描画
    var drawCurve = function(id1, id2, color) {
        while ($scope.operations.length > 0 && _.last($scope.operations).type === 'click') {
            $scope.operations.splice($scope.operations.length - 1, 1);
        }
        var centerS = Utils.findPos(angular.element('#' + id1)[0]);
        centerS.x += angular.element('#' + id1)[0].style.width;
        centerS.y += angular.element('#' + id1)[0].style.height;
        var centerT = Utils.findPos(angular.element('#' + id2)[0]);
        centerT.x += angular.element('#' + id2)[0].style.width;
        centerT.y += angular.element('#' + id2)[0].style.height;
        var canvasPos = Utils.findPos(angular.element('canvas')[0]);
        centerS.x -= canvasPos.x;
        centerS.y -= canvasPos.y;
        centerT.x -= canvasPos.x;
        centerT.y -= canvasPos.y;
        centerS.y += 15;
        centerT.y += 5;
        var width = Utils.findPos(angular.element('#' + id1)[0]).x;
        var percent = 1 - Math.abs(Utils.getTrimNumber(id1) - Utils.getTrimNumber(id2)) / ($scope.fa.length - 1);
        if ($scope.edus.length > 30 && percent > 0.5) {
            percent = percent - 0.5;
        }
        percent = Math.min(percent, 0.85);
        var offX = width * percent;
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
        drawCurve('parent' + id1, 'parent' + id2, color);
        addRelation('parent' + id2, rel, fontSize);
    };
    var disconnect = function(id1, id2) {
        $scope.fa[id2] = -1;
        $scope.depRel[id2] = 'null';
        var canvas = angular.element('#canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, $scope.canvas_width, $scope.canvas_height);
        for (var i = 0; i < $scope.fa.length; ++i) {
            if ($scope.fa[i] >= 0) {
                connect($scope.fa[i], i, $scope.depRel[i], CONSTANTS.NORMAL_EDGE_COLOR);
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
        var centerZ = Utils.findPos(angular.element('#' + id2)[0]);
        centerZ.x += angular.element('#' + id2)[0].style.width;
        centerZ.y += angular.element('#' + id2)[0].style.height;
        var canvasPos = Utils.findPos(angular.element('#canvas')[0]);
        centerZ.x -= canvasPos.x;
        centerZ.y -= canvasPos.y;
        centerZ.y += 15;
        var ctx = angular.element('#canvas')[0].getContext('2d');
        ctx.font = fontSize.toString() + "px Arial";
        // ctx.fillStyle = '#005AB5';
        ctx.fillStyle = CONSTANTS.LABEL_COLOR;
        while (relation.length < 12) relation = ' ' + relation;
        ctx.fillText(relation, centerZ.x - fontSize * 7, centerZ.y);
    };

}]);
