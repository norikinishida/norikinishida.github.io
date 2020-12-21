'use strict';

var app = angular.module('MyApp', ['ngFileUpload', 'ngToast']);

// 定数
app.constant('CONSTANTS', {
    // 談話関係クラス
    relations: [
        // 1
        'ROOT',
        // 2
        'ATTRIBUTION',
        // 3
        'BACKGROUND',
        // 4
        'CAUSE-RESULT-REASON',
        // 5
        'COMPARISON',
        // 6
        'CONDITION',
        // 7
        'CONTRAST',
        // 8
        'DEFINITION',
        // 9
        'ELABORATION',
        // 10
        'ENABLEMENT',
        // 11
        'EVALUATION',
        // 12
        'EXEMPLIFICATION',
        // 13
        'JOINT',
        // 14
        'MANNER-MEANS',
        // 15
        'SAME-UNIT'
    ],
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
    CANVAS_WIDTH: 1500, // canvas_height will be automatically set.
    SAMPLE_FILES: [
        'D14-1001.edu.txt.dep',
        'D14-1002.edu.txt.dep',
        'D14-1003.edu.txt.dep',
        'D14-1004.edu.txt.dep',
        'D14-1005.edu.txt.dep',
        'D14-1006.edu.txt.dep',
        'D14-1007.edu.txt.dep',
        'D14-1008.edu.txt.dep',
        'D14-1009.edu.txt.dep',
        'D14-1010.edu.txt.dep',
        'D14-1011.edu.txt.dep',
        'D14-1012.edu.txt.dep',
        'D14-1013.edu.txt.dep',
        'D14-1014.edu.txt.dep',
        'D14-1015.edu.txt.dep',
        'D14-1016.edu.txt.dep',
        'D14-1017.edu.txt.dep',
        'D14-1018.edu.txt.dep',
        'D14-1019.edu.txt.dep',
        'D14-1020.edu.txt.dep',
        'D14-1021.edu.txt.dep',
        'D14-1022.edu.txt.dep',
        'D14-1023.edu.txt.dep',
        'D14-1024.edu.txt.dep',
        'D14-1025.edu.txt.dep',
        'D14-1026.edu.txt.dep',
        'D14-1027.edu.txt.dep',
        'D14-1028.edu.txt.dep',
        'D14-1029.edu.txt.dep',
        'D14-1030.edu.txt.dep',
        'D14-1031.edu.txt.dep',
        'D14-1032.edu.txt.dep',
        'D14-1033.edu.txt.dep',
        'D14-1034.edu.txt.dep',
        'D14-1035.edu.txt.dep',
        'D14-1036.edu.txt.dep',
        'D14-1037.edu.txt.dep',
        'D14-1038.edu.txt.dep',
        'D14-1039.edu.txt.dep',
        'D14-1040.edu.txt.dep',
        'D14-1041.edu.txt.dep',
        'D14-1042.edu.txt.dep',
        'D14-1043.edu.txt.dep',
        'D14-1044.edu.txt.dep',
        'D14-1045.edu.txt.dep',
        'D14-1046.edu.txt.dep',
        'D14-1047.edu.txt.dep',
        'D14-1048.edu.txt.dep',
        'D14-1049.edu.txt.dep',
        'D14-1050.edu.txt.dep',
        'D14-1051.edu.txt.dep',
        'D14-1052.edu.txt.dep',
        'D14-1053.edu.txt.dep',
        'D14-1054.edu.txt.dep',
        'D14-1055.edu.txt.dep',
        'D14-1056.edu.txt.dep',
        'D14-1057.edu.txt.dep',
        'D14-1058.edu.txt.dep',
        'D14-1059.edu.txt.dep',
        'D14-1060.edu.txt.dep',
        'D14-1061.edu.txt.dep',
        'D14-1062.edu.txt.dep',
        'D14-1063.edu.txt.dep',
        'D14-1064.edu.txt.dep',
        'D14-1065.edu.txt.dep',
        'D14-1066.edu.txt.dep',
        'D14-1067.edu.txt.dep',
        'D14-1068.edu.txt.dep',
        'D14-1069.edu.txt.dep',
        'D14-1070.edu.txt.dep',
        'D14-1071.edu.txt.dep',
        'D14-1072.edu.txt.dep',
        'D14-1073.edu.txt.dep',
        'D14-1074.edu.txt.dep',
        'D14-1075.edu.txt.dep',
        'D14-1076.edu.txt.dep',
        'D14-1077.edu.txt.dep',
        'D14-1078.edu.txt.dep',
        'D14-1079.edu.txt.dep',
        'D14-1080.edu.txt.dep',
        'D14-1081.edu.txt.dep',
        'D14-1082.edu.txt.dep',
        'D14-1083.edu.txt.dep',
        'D14-1084.edu.txt.dep',
        'D14-1085.edu.txt.dep',
        'D14-1086.edu.txt.dep',
        'D14-1087.edu.txt.dep',
        'D14-1088.edu.txt.dep',
        'D14-1089.edu.txt.dep',
        'D14-1090.edu.txt.dep',
        'D14-1091.edu.txt.dep',
        'D14-1092.edu.txt.dep',
        'D14-1093.edu.txt.dep',
        'D14-1094.edu.txt.dep',
        'D14-1095.edu.txt.dep',
        'D14-1096.edu.txt.dep',
        'D14-1097.edu.txt.dep',
        'D14-1098.edu.txt.dep',
        'D14-1099.edu.txt.dep',
        'D14-1100.edu.txt.dep',
        'D14-1101.edu.txt.dep',
        'D14-1102.edu.txt.dep',
        'D14-1103.edu.txt.dep',
        'D14-1104.edu.txt.dep',
        'D14-1105.edu.txt.dep',
        'D14-1106.edu.txt.dep',
        'D14-1107.edu.txt.dep',
        'D14-1108.edu.txt.dep',
        'D14-1109.edu.txt.dep',
        'D14-1110.edu.txt.dep',
        'D14-1111.edu.txt.dep',
        'D14-1112.edu.txt.dep',
        'D14-1113.edu.txt.dep',
        'D14-1114.edu.txt.dep',
        'D14-1115.edu.txt.dep',
        'D14-1116.edu.txt.dep',
        'D14-1117.edu.txt.dep',
        'D14-1118.edu.txt.dep',
        'D14-1119.edu.txt.dep',
        'D14-1120.edu.txt.dep',
        'D14-1121.edu.txt.dep',
        'D14-1122.edu.txt.dep',
        'D14-1123.edu.txt.dep',
        'D14-1124.edu.txt.dep',
        'D14-1125.edu.txt.dep',
        'D14-1126.edu.txt.dep',
        'D14-1127.edu.txt.dep',
        'D14-1128.edu.txt.dep',
        'D14-1129.edu.txt.dep',
        'D14-1130.edu.txt.dep',
        'D14-1131.edu.txt.dep',
        'D14-1132.edu.txt.dep',
        'D14-1133.edu.txt.dep',
        'D14-1134.edu.txt.dep',
        'D14-1135.edu.txt.dep',
        'D14-1136.edu.txt.dep',
        'D14-1137.edu.txt.dep',
        'D14-1138.edu.txt.dep',
        'D14-1139.edu.txt.dep',
        'D14-1140.edu.txt.dep',
        'D14-1141.edu.txt.dep',
        'D14-1142.edu.txt.dep',
        'D14-1143.edu.txt.dep',
        'D14-1144.edu.txt.dep',
        'D14-1145.edu.txt.dep',
        'D14-1146.edu.txt.dep',
        'D14-1147.edu.txt.dep',
        'D14-1148.edu.txt.dep',
        'D14-1149.edu.txt.dep',
        'D14-1150.edu.txt.dep',
        'D14-1151.edu.txt.dep',
        'D14-1152.edu.txt.dep',
        'D14-1153.edu.txt.dep',
        'D14-1154.edu.txt.dep',
        'D14-1155.edu.txt.dep',
        'D14-1156.edu.txt.dep',
        'D14-1157.edu.txt.dep',
        'D14-1158.edu.txt.dep',
        'D14-1159.edu.txt.dep',
        'D14-1160.edu.txt.dep',
        'D14-1161.edu.txt.dep',
        'D14-1162.edu.txt.dep',
        'D14-1163.edu.txt.dep',
        'D14-1164.edu.txt.dep',
        'D14-1165.edu.txt.dep',
        'D14-1166.edu.txt.dep',
        'D14-1167.edu.txt.dep',
        'D14-1168.edu.txt.dep',
        'D14-1169.edu.txt.dep',
        'D14-1170.edu.txt.dep',
        'D14-1171.edu.txt.dep',
        'D14-1172.edu.txt.dep',
        'D14-1173.edu.txt.dep',
        'D14-1174.edu.txt.dep',
        'D14-1175.edu.txt.dep',
        'D14-1176.edu.txt.dep',
        'D14-1177.edu.txt.dep',
        'D14-1178.edu.txt.dep',
        'D14-1179.edu.txt.dep',
        'D14-1180.edu.txt.dep',
        'D14-1181.edu.txt.dep',
        'D14-1182.edu.txt.dep',
        'D14-1183.edu.txt.dep',
        'D14-1184.edu.txt.dep',
        'D14-1185.edu.txt.dep',
        'D14-1186.edu.txt.dep',
        'D14-1187.edu.txt.dep',
        'D14-1188.edu.txt.dep',
        'D14-1189.edu.txt.dep',
        'D14-1190.edu.txt.dep',
        'D14-1191.edu.txt.dep',
        'D14-1192.edu.txt.dep',
        'D14-1193.edu.txt.dep',
        'D14-1194.edu.txt.dep',
        'D14-1195.edu.txt.dep',
        'D14-1196.edu.txt.dep',
        'D14-1197.edu.txt.dep',
        'D14-1198.edu.txt.dep',
        'D14-1199.edu.txt.dep',
        'D14-1200.edu.txt.dep',
        'D14-1201.edu.txt.dep',
        'D14-1202.edu.txt.dep',
        'D14-1203.edu.txt.dep',
        'D14-1204.edu.txt.dep',
        'D14-1205.edu.txt.dep',
        'D14-1206.edu.txt.dep',
        'D14-1207.edu.txt.dep',
        'D14-1208.edu.txt.dep',
        'D14-1209.edu.txt.dep',
        'D14-1210.edu.txt.dep',
        'D14-1211.edu.txt.dep',
        'D14-1212.edu.txt.dep',
        'D14-1213.edu.txt.dep',
        'D14-1214.edu.txt.dep',
        'D14-1215.edu.txt.dep',
        'D14-1216.edu.txt.dep',
        'D14-1217.edu.txt.dep',
        'D14-1218.edu.txt.dep',
        'D14-1219.edu.txt.dep',
        'D14-1220.edu.txt.dep',
        'D14-1221.edu.txt.dep',
        'D14-1222.edu.txt.dep',
        'D14-1223.edu.txt.dep',
        'D14-1224.edu.txt.dep',
        'D14-1225.edu.txt.dep',
        'D14-1226.edu.txt.dep',
        'P06-1001.edu.txt.dep',
        'P06-1002.edu.txt.dep',
        'P06-1003.edu.txt.dep',
        'P06-1004.edu.txt.dep',
        'P06-1005.edu.txt.dep',
        'P06-1006.edu.txt.dep',
        'P06-1007.edu.txt.dep',
        'P06-1008.edu.txt.dep',
        'P06-1009.edu.txt.dep',
        'P06-1010.edu.txt.dep',
        'P06-1011.edu.txt.dep',
        'P06-1012.edu.txt.dep',
        'P06-1013.edu.txt.dep',
        'P06-1014.edu.txt.dep',
        'P06-1015.edu.txt.dep',
        'P06-1016.edu.txt.dep',
        'P06-1017.edu.txt.dep',
        'P06-1018.edu.txt.dep',
        'P06-1019.edu.txt.dep',
        'P06-1020.edu.txt.dep',
        'P06-1021.edu.txt.dep',
        'P06-1022.edu.txt.dep',
        'P06-1023.edu.txt.dep',
        'P06-1024.edu.txt.dep',
        'P06-1025.edu.txt.dep',
        'P06-1026.edu.txt.dep',
        'P06-1027.edu.txt.dep',
        'P06-1028.edu.txt.dep',
        'P06-1029.edu.txt.dep',
        'P06-1030.edu.txt.dep',
        'P06-1031.edu.txt.dep',
        'P06-1032.edu.txt.dep',
        'P06-1033.edu.txt.dep',
        'P06-1034.edu.txt.dep',
        'P06-1035.edu.txt.dep',
        'P06-1036.edu.txt.dep',
        'P06-1037.edu.txt.dep',
        'P06-1038.edu.txt.dep',
        'P06-1039.edu.txt.dep',
        'P06-1040.edu.txt.dep',
        'P06-1041.edu.txt.dep',
        'P06-1042.edu.txt.dep',
        'P06-1043.edu.txt.dep',
        'P06-1044.edu.txt.dep',
        'P06-1045.edu.txt.dep',
        'P06-1046.edu.txt.dep',
        'P06-1047.edu.txt.dep',
        'P06-1048.edu.txt.dep',
        'P06-1049.edu.txt.dep',
        'P06-1050.edu.txt.dep',
        'P06-1051.edu.txt.dep',
        'P06-1052.edu.txt.dep',
        'P06-1053.edu.txt.dep',
        'P06-1054.edu.txt.dep',
        'P06-1055.edu.txt.dep',
        'P06-1056.edu.txt.dep',
        'P06-1057.edu.txt.dep',
        'P06-1058.edu.txt.dep',
        'P06-1059.edu.txt.dep',
        'P06-1060.edu.txt.dep',
        'P06-1061.edu.txt.dep',
        'P06-1062.edu.txt.dep',
        'P06-1063.edu.txt.dep',
        'P06-1064.edu.txt.dep',
        'P06-1065.edu.txt.dep',
        'P06-1066.edu.txt.dep',
        'P06-1067.edu.txt.dep',
        'P06-1068.edu.txt.dep',
        'P06-1069.edu.txt.dep',
        'P06-1070.edu.txt.dep',
        'P06-1071.edu.txt.dep',
        'P06-1072.edu.txt.dep',
        'P06-1073.edu.txt.dep',
        'P06-1074.edu.txt.dep',
        'P06-1075.edu.txt.dep',
        'P06-1076.edu.txt.dep',
        'P06-1077.edu.txt.dep',
        'P06-1078.edu.txt.dep',
        'P06-1079.edu.txt.dep',
        'P06-1080.edu.txt.dep',
        'P06-1081.edu.txt.dep',
        'P06-1082.edu.txt.dep',
        'P06-1083.edu.txt.dep',
        'P06-1084.edu.txt.dep',
        'P06-1085.edu.txt.dep',
        'P06-1086.edu.txt.dep',
        'P06-1087.edu.txt.dep',
        'P06-1088.edu.txt.dep',
        'P06-1089.edu.txt.dep',
        'P06-1090.edu.txt.dep',
        'P06-1091.edu.txt.dep',
        'P06-1092.edu.txt.dep',
        'P06-1093.edu.txt.dep',
        'P06-1094.edu.txt.dep',
        'P06-1095.edu.txt.dep',
        'P06-1096.edu.txt.dep',
        'P06-1097.edu.txt.dep',
        'P06-1098.edu.txt.dep',
        'P06-1099.edu.txt.dep',
        'P06-1100.edu.txt.dep',
        'P06-1101.edu.txt.dep',
        'P06-1102.edu.txt.dep',
        'P06-1103.edu.txt.dep',
        'P06-1104.edu.txt.dep',
        'P06-1105.edu.txt.dep',
        'P06-1106.edu.txt.dep',
        'P06-1107.edu.txt.dep',
        'P06-1108.edu.txt.dep',
        'P06-1109.edu.txt.dep',
        'P06-1110.edu.txt.dep',
        'P06-1111.edu.txt.dep',
        'P06-1112.edu.txt.dep',
        'P06-1113.edu.txt.dep',
        'P06-1114.edu.txt.dep',
        'P06-1115.edu.txt.dep',
        'P06-1116.edu.txt.dep',
        'P06-1117.edu.txt.dep',
        'P06-1118.edu.txt.dep',
        'P06-1119.edu.txt.dep',
        'P06-1120.edu.txt.dep',
        'P06-1121.edu.txt.dep',
        'P06-1122.edu.txt.dep',
        'P06-1123.edu.txt.dep',
        'P06-1124.edu.txt.dep',
        'P06-1125.edu.txt.dep',
        'P06-1126.edu.txt.dep',
        'P06-1127.edu.txt.dep',
        'P06-1128.edu.txt.dep',
        'P06-1129.edu.txt.dep',
        'P06-1130.edu.txt.dep',
        'P06-1131.edu.txt.dep',
        'P06-1132.edu.txt.dep',
        'P06-1133.edu.txt.dep',
        'P06-1134.edu.txt.dep',
        'P06-1135.edu.txt.dep',
        'P06-1136.edu.txt.dep',
        'P06-1137.edu.txt.dep',
        'P06-1138.edu.txt.dep',
        'P06-1139.edu.txt.dep',
        'P06-1140.edu.txt.dep',
        'P06-1141.edu.txt.dep',
        'P06-1142.edu.txt.dep',
        'P06-1143.edu.txt.dep',
        'P06-1144.edu.txt.dep',
        'P06-1145.edu.txt.dep',
        'P06-1146.edu.txt.dep',
        'P06-1147.edu.txt.dep',
        'P14-1000_anno1.edu.txt.dep',
        'P14-1000_anno2.edu.txt.dep',
        'P14-1000_anno3.edu.txt.dep',
        'P14-1001_anno1.edu.txt.dep',
        'P14-1001_anno2.edu.txt.dep',
        'P14-1001_anno3.edu.txt.dep',
        'P14-1002_anno1.edu.txt.dep',
        'P14-1002_anno2.edu.txt.dep',
        'P14-1002_anno3.edu.txt.dep',
        'P14-1003_anno1.edu.txt.dep',
        'P14-1003_anno2.edu.txt.dep',
        'P14-1003_anno3.edu.txt.dep',
        'P14-1004_anno1.edu.txt.dep',
        'P14-1004_anno2.edu.txt.dep',
        'P14-1004_anno3.edu.txt.dep',
        'P14-1005_anno1.edu.txt.dep',
        'P14-1005_anno2.edu.txt.dep',
        'P14-1005_anno3.edu.txt.dep',
        'P14-1006_anno1.edu.txt.dep',
        'P14-1006_anno2.edu.txt.dep',
        'P14-1006_anno3.edu.txt.dep',
        'P14-1007_anno1.edu.txt.dep',
        'P14-1007_anno2.edu.txt.dep',
        'P14-1007_anno3.edu.txt.dep',
        'P14-1008_anno1.edu.txt.dep',
        'P14-1008_anno2.edu.txt.dep',
        'P14-1008_anno3.edu.txt.dep',
        'P14-1009_anno1.edu.txt.dep',
        'P14-1009_anno2.edu.txt.dep',
        'P14-1009_anno3.edu.txt.dep',
        'P14-1010_anno1.edu.txt.dep',
        'P14-1010_anno2.edu.txt.dep',
        'P14-1010_anno3.edu.txt.dep',
        'P14-1011_anno1.edu.txt.dep',
        'P14-1011_anno2.edu.txt.dep',
        'P14-1011_anno3.edu.txt.dep',
        'P14-1012_anno1.edu.txt.dep',
        'P14-1012_anno2.edu.txt.dep',
        'P14-1012_anno3.edu.txt.dep',
        'P14-1013_anno1.edu.txt.dep',
        'P14-1013_anno2.edu.txt.dep',
        'P14-1013_anno3.edu.txt.dep',
        'P14-1014_anno1.edu.txt.dep',
        'P14-1014_anno2.edu.txt.dep',
        'P14-1014_anno3.edu.txt.dep',
        'P14-1015_anno1.edu.txt.dep',
        'P14-1015_anno2.edu.txt.dep',
        'P14-1015_anno3.edu.txt.dep',
        'P14-1016_anno1.edu.txt.dep',
        'P14-1016_anno2.edu.txt.dep',
        'P14-1016_anno3.edu.txt.dep',
        'P14-1017_anno1.edu.txt.dep',
        'P14-1017_anno2.edu.txt.dep',
        'P14-1017_anno3.edu.txt.dep',
        'P14-1018_anno1.edu.txt.dep',
        'P14-1018_anno2.edu.txt.dep',
        'P14-1018_anno3.edu.txt.dep',
        'P14-1019_anno1.edu.txt.dep',
        'P14-1019_anno2.edu.txt.dep',
        'P14-1019_anno3.edu.txt.dep',
        'P14-1020_anno1.edu.txt.dep',
        'P14-1020_anno2.edu.txt.dep',
        'P14-1020_anno3.edu.txt.dep',
        'P14-1021_anno1.edu.txt.dep',
        'P14-1021_anno2.edu.txt.dep',
        'P14-1021_anno3.edu.txt.dep',
        'P14-1022_anno1.edu.txt.dep',
        'P14-1022_anno2.edu.txt.dep',
        'P14-1022_anno3.edu.txt.dep',
        'P14-1023_anno1.edu.txt.dep',
        'P14-1023_anno2.edu.txt.dep',
        'P14-1023_anno3.edu.txt.dep',
        'P14-1024_anno1.edu.txt.dep',
        'P14-1024_anno2.edu.txt.dep',
        'P14-1024_anno3.edu.txt.dep',
        'P14-1025_anno1.edu.txt.dep',
        'P14-1025_anno2.edu.txt.dep',
        'P14-1025_anno3.edu.txt.dep',
        'P14-1026_anno1.edu.txt.dep',
        'P14-1026_anno2.edu.txt.dep',
        'P14-1026_anno3.edu.txt.dep',
        'P14-1027_anno1.edu.txt.dep',
        'P14-1027_anno2.edu.txt.dep',
        'P14-1027_anno3.edu.txt.dep',
        'P14-1028_anno1.edu.txt.dep',
        'P14-1028_anno2.edu.txt.dep',
        'P14-1028_anno3.edu.txt.dep',
        'P14-1029_anno1.edu.txt.dep',
        'P14-1029_anno2.edu.txt.dep',
        'P14-1029_anno3.edu.txt.dep',
        'P14-1030_anno1.edu.txt.dep',
        'P14-1030_anno2.edu.txt.dep',
        'P14-1030_anno3.edu.txt.dep',
        'P14-1031_anno1.edu.txt.dep',
        'P14-1031_anno2.edu.txt.dep',
        'P14-1031_anno3.edu.txt.dep',
        'P14-1032_anno1.edu.txt.dep',
        'P14-1032_anno2.edu.txt.dep',
        'P14-1032_anno3.edu.txt.dep',
        'P14-1033_anno1.edu.txt.dep',
        'P14-1033_anno2.edu.txt.dep',
        'P14-1033_anno3.edu.txt.dep',
        'P14-1034_anno1.edu.txt.dep',
        'P14-1034_anno2.edu.txt.dep',
        'P14-1034_anno3.edu.txt.dep',
        'P14-1035_anno1.edu.txt.dep',
        'P14-1035_anno2.edu.txt.dep',
        'P14-1035_anno3.edu.txt.dep',
        'P14-1036_anno1.edu.txt.dep',
        'P14-1036_anno2.edu.txt.dep',
        'P14-1036_anno3.edu.txt.dep',
        'P14-1037_anno1.edu.txt.dep',
        'P14-1037_anno2.edu.txt.dep',
        'P14-1037_anno3.edu.txt.dep',
        'P14-1038_anno1.edu.txt.dep',
        'P14-1038_anno2.edu.txt.dep',
        'P14-1038_anno3.edu.txt.dep',
        'P14-1039_anno1.edu.txt.dep',
        'P14-1039_anno2.edu.txt.dep',
        'P14-1039_anno3.edu.txt.dep',
        'P14-1040_anno1.edu.txt.dep',
        'P14-1040_anno2.edu.txt.dep',
        'P14-1040_anno3.edu.txt.dep',
        'P14-1041_anno1.edu.txt.dep',
        'P14-1041_anno2.edu.txt.dep',
        'P14-1041_anno3.edu.txt.dep',
        'P14-1042_anno1.edu.txt.dep',
        'P14-1042_anno2.edu.txt.dep',
        'P14-1042_anno3.edu.txt.dep',
        'P14-1043_anno1.edu.txt.dep',
        'P14-1043_anno2.edu.txt.dep',
        'P14-1043_anno3.edu.txt.dep',
        'P14-1044_anno1.edu.txt.dep',
        'P14-1044_anno2.edu.txt.dep',
        'P14-1044_anno3.edu.txt.dep',
        'P14-1045_anno1.edu.txt.dep',
        'P14-1045_anno2.edu.txt.dep',
        'P14-1045_anno3.edu.txt.dep',
        'P14-1046_anno1.edu.txt.dep',
        'P14-1046_anno2.edu.txt.dep',
        'P14-1046_anno3.edu.txt.dep',
        'P14-1047_anno1.edu.txt.dep',
        'P14-1047_anno2.edu.txt.dep',
        'P14-1047_anno3.edu.txt.dep',
        'P14-1048_anno1.edu.txt.dep',
        'P14-1048_anno2.edu.txt.dep',
        'P14-1048_anno3.edu.txt.dep',
        'P14-1049_anno1.edu.txt.dep',
        'P14-1049_anno2.edu.txt.dep',
        'P14-1049_anno3.edu.txt.dep',
        'P14-1050_anno1.edu.txt.dep',
        'P14-1050_anno2.edu.txt.dep',
        'P14-1050_anno3.edu.txt.dep',
        'P14-1051_anno1.edu.txt.dep',
        'P14-1051_anno2.edu.txt.dep',
        'P14-1052_anno1.edu.txt.dep',
        'P14-1052_anno2.edu.txt.dep',
        'P14-1053_anno1.edu.txt.dep',
        'P14-1053_anno2.edu.txt.dep',
        'P14-1054_anno1.edu.txt.dep',
        'P14-1054_anno2.edu.txt.dep',
        'P14-1055_anno1.edu.txt.dep',
        'P14-1055_anno2.edu.txt.dep',
        'P14-1056_anno1.edu.txt.dep',
        'P14-1056_anno2.edu.txt.dep',
        'P14-1057_anno1.edu.txt.dep',
        'P14-1057_anno2.edu.txt.dep',
        'P14-1058_anno1.edu.txt.dep',
        'P14-1058_anno2.edu.txt.dep',
        'P14-1059_anno1.edu.txt.dep',
        'P14-1059_anno2.edu.txt.dep',
        'P14-1060_anno1.edu.txt.dep',
        'P14-1060_anno2.edu.txt.dep',
        'P14-1061_anno1.edu.txt.dep',
        'P14-1061_anno2.edu.txt.dep',
        'P14-1062_anno1.edu.txt.dep',
        'P14-1062_anno2.edu.txt.dep',
        'P14-1063_anno1.edu.txt.dep',
        'P14-1063_anno2.edu.txt.dep',
        'P14-1064_anno1.edu.txt.dep',
        'P14-1064_anno2.edu.txt.dep',
        'P14-1065_anno1.edu.txt.dep',
        'P14-1065_anno2.edu.txt.dep',
        'P14-1066_anno1.edu.txt.dep',
        'P14-1066_anno2.edu.txt.dep',
        'P14-1067_anno1.edu.txt.dep',
        'P14-1067_anno2.edu.txt.dep',
        'P14-1068_anno1.edu.txt.dep',
        'P14-1068_anno2.edu.txt.dep',
        'P14-1069_anno1.edu.txt.dep',
        'P14-1069_anno2.edu.txt.dep',
        'P14-1070_anno1.edu.txt.dep',
        'P14-1070_anno2.edu.txt.dep',
        'P14-1071_anno1.edu.txt.dep',
        'P14-1071_anno2.edu.txt.dep',
        'P14-1072_anno1.edu.txt.dep',
        'P14-1072_anno2.edu.txt.dep',
        'P14-1073_anno1.edu.txt.dep',
        'P14-1073_anno2.edu.txt.dep',
        'P14-1074_anno1.edu.txt.dep',
        'P14-1074_anno2.edu.txt.dep',
        'P14-1075_anno1.edu.txt.dep',
        'P14-1075_anno2.edu.txt.dep',
        'P14-1076_anno1.edu.txt.dep',
        'P14-1076_anno2.edu.txt.dep',
        'P14-1077_anno1.edu.txt.dep',
        'P14-1077_anno2.edu.txt.dep',
        'P14-1078_anno1.edu.txt.dep',
        'P14-1078_anno2.edu.txt.dep',
        'P14-1079_anno1.edu.txt.dep',
        'P14-1079_anno2.edu.txt.dep',
        'P14-1080_anno1.edu.txt.dep',
        'P14-1080_anno2.edu.txt.dep',
        'P14-1081_anno1.edu.txt.dep',
        'P14-1081_anno2.edu.txt.dep',
        'P14-1082_anno1.edu.txt.dep',
        'P14-1082_anno2.edu.txt.dep',
        'P14-1083_anno1.edu.txt.dep',
        'P14-1083_anno2.edu.txt.dep',
        'P14-1084_anno1.edu.txt.dep',
        'P14-1084_anno2.edu.txt.dep',
        'P14-1085_anno1.edu.txt.dep',
        'P14-1085_anno2.edu.txt.dep',
        'P14-1086_anno1.edu.txt.dep',
        'P14-1086_anno2.edu.txt.dep',
        'P14-1087_anno1.edu.txt.dep',
        'P14-1087_anno2.edu.txt.dep',
        'P14-1088_anno1.edu.txt.dep',
        'P14-1088_anno2.edu.txt.dep',
        'P14-1089_anno1.edu.txt.dep',
        'P14-1089_anno2.edu.txt.dep',
        'P14-1090_anno1.edu.txt.dep',
        'P14-1090_anno2.edu.txt.dep',
        'P14-1091_anno1.edu.txt.dep',
        'P14-1091_anno2.edu.txt.dep',
        'P14-1092_anno1.edu.txt.dep',
        'P14-1092_anno2.edu.txt.dep',
        'P14-1093_anno1.edu.txt.dep',
        'P14-1093_anno2.edu.txt.dep',
        'P14-1094_anno1.edu.txt.dep',
        'P14-1094_anno2.edu.txt.dep',
        'P14-1095_anno1.edu.txt.dep',
        'P14-1095_anno2.edu.txt.dep',
        'P14-1096_anno1.edu.txt.dep',
        'P14-1096_anno2.edu.txt.dep',
        'P14-1097_anno1.edu.txt.dep',
        'P14-1097_anno2.edu.txt.dep',
        'P14-1098_anno1.edu.txt.dep',
        'P14-1098_anno2.edu.txt.dep',
        'P14-1099_anno1.edu.txt.dep',
        'P14-1099_anno2.edu.txt.dep',
        'P14-1100_anno1.edu.txt.dep',
        'P14-1100_anno2.edu.txt.dep',
        'P14-1101.edu.txt.dep',
        'P14-1102.edu.txt.dep',
        'P14-1103.edu.txt.dep',
        'P14-1104.edu.txt.dep',
        'P14-1105.edu.txt.dep',
        'P14-1106.edu.txt.dep',
        'P14-1107.edu.txt.dep',
        'P14-1108.edu.txt.dep',
        'P14-1109.edu.txt.dep',
        'P14-1110.edu.txt.dep',
        'P14-1111.edu.txt.dep',
        'P14-1112.edu.txt.dep',
        'P14-1113.edu.txt.dep',
        'P14-1114.edu.txt.dep',
        'P14-1115.edu.txt.dep',
        'P14-1116.edu.txt.dep',
        'P14-1117.edu.txt.dep',
        'P14-1118.edu.txt.dep',
        'P14-1119.edu.txt.dep',
        'P14-1120.edu.txt.dep',
        'P14-1121.edu.txt.dep',
        'P14-1122.edu.txt.dep',
        'P14-1123.edu.txt.dep',
        'P14-1124.edu.txt.dep',
        'P14-1125.edu.txt.dep',
        'P14-1126.edu.txt.dep',
        'P14-1127.edu.txt.dep',
        'P14-1128.edu.txt.dep',
        'P14-1129.edu.txt.dep',
        'P14-1130.edu.txt.dep',
        'P14-1131.edu.txt.dep',
        'P14-1132.edu.txt.dep',
        'P14-1133.edu.txt.dep',
        'P14-1134.edu.txt.dep',
        'P14-1135.edu.txt.dep',
        'P14-1136.edu.txt.dep',
        'P14-1137.edu.txt.dep',
        'P14-1138.edu.txt.dep',
        'P14-1139.edu.txt.dep',
        'P14-1140.edu.txt.dep',
        'P14-1141.edu.txt.dep',
        'P14-1142.edu.txt.dep',
        'P14-1143.edu.txt.dep',
        'P14-1144.edu.txt.dep',
        'P14-1145.edu.txt.dep',
        'P14-1146.edu.txt.dep',
        'P14-1147.edu.txt.dep',
        'P16-1001_anno1.edu.txt.dep',
        'P16-1001_anno2.edu.txt.dep',
        'P16-1002_anno1.edu.txt.dep',
        'P16-1002_anno2.edu.txt.dep',
        'P16-1003_anno1.edu.txt.dep',
        'P16-1003_anno2.edu.txt.dep',
        'P16-1004_anno1.edu.txt.dep',
        'P16-1004_anno2.edu.txt.dep',
        'P16-1005_anno1.edu.txt.dep',
        'P16-1005_anno2.edu.txt.dep',
        'P16-1006_anno1.edu.txt.dep',
        'P16-1006_anno2.edu.txt.dep',
        'P16-1007_anno1.edu.txt.dep',
        'P16-1007_anno2.edu.txt.dep',
        'P16-1008_anno1.edu.txt.dep',
        'P16-1008_anno2.edu.txt.dep',
        'P16-1009_anno1.edu.txt.dep',
        'P16-1009_anno2.edu.txt.dep',
        'P16-1010_anno1.edu.txt.dep',
        'P16-1010_anno2.edu.txt.dep',
        'P16-1011_anno1.edu.txt.dep',
        'P16-1011_anno2.edu.txt.dep',
        'P16-1012_anno1.edu.txt.dep',
        'P16-1012_anno2.edu.txt.dep',
        'P16-1013_anno1.edu.txt.dep',
        'P16-1013_anno2.edu.txt.dep',
        'P16-1014_anno1.edu.txt.dep',
        'P16-1014_anno2.edu.txt.dep',
        'P16-1015_anno1.edu.txt.dep',
        'P16-1015_anno2.edu.txt.dep',
        'P16-1016_anno1.edu.txt.dep',
        'P16-1016_anno2.edu.txt.dep',
        'P16-1017_anno1.edu.txt.dep',
        'P16-1017_anno2.edu.txt.dep',
        'P16-1018_anno1.edu.txt.dep',
        'P16-1018_anno2.edu.txt.dep',
        'P16-1019_anno1.edu.txt.dep',
        'P16-1019_anno2.edu.txt.dep',
        'P16-1020_anno1.edu.txt.dep',
        'P16-1020_anno2.edu.txt.dep',
        'P16-1021_anno1.edu.txt.dep',
        'P16-1021_anno2.edu.txt.dep',
        'P16-1022_anno1.edu.txt.dep',
        'P16-1022_anno2.edu.txt.dep',
        'P16-1023_anno1.edu.txt.dep',
        'P16-1023_anno2.edu.txt.dep',
        'P16-1024_anno1.edu.txt.dep',
        'P16-1024_anno2.edu.txt.dep',
        'P16-1025_anno1.edu.txt.dep',
        'P16-1025_anno2.edu.txt.dep',
        'P16-1026_anno1.edu.txt.dep',
        'P16-1026_anno2.edu.txt.dep',
        'P16-1027_anno1.edu.txt.dep',
        'P16-1027_anno2.edu.txt.dep',
        'P16-1028_anno1.edu.txt.dep',
        'P16-1028_anno2.edu.txt.dep',
        'P16-1029_anno1.edu.txt.dep',
        'P16-1029_anno2.edu.txt.dep',
        'P16-1030.edu.txt.dep',
        'P16-1031_anno1.edu.txt.dep',
        'P16-1031_anno2.edu.txt.dep',
        'P16-1032_anno1.edu.txt.dep',
        'P16-1032_anno2.edu.txt.dep',
        'P16-1033_anno1.edu.txt.dep',
        'P16-1033_anno2.edu.txt.dep',
        'P16-1034_anno1.edu.txt.dep',
        'P16-1034_anno2.edu.txt.dep',
        'P16-1035_anno1.edu.txt.dep',
        'P16-1035_anno2.edu.txt.dep',
        'P16-1036_anno1.edu.txt.dep',
        'P16-1036_anno2.edu.txt.dep',
        'P16-1037_anno1.edu.txt.dep',
        'P16-1037_anno2.edu.txt.dep',
        'P16-1038_anno1.edu.txt.dep',
        'P16-1038_anno2.edu.txt.dep',
        'P16-1039_anno1.edu.txt.dep',
        'P16-1039_anno2.edu.txt.dep',
        'P16-1040_anno1.edu.txt.dep',
        'P16-1040_anno2.edu.txt.dep',
        'P16-1041_anno1.edu.txt.dep',
        'P16-1041_anno2.edu.txt.dep',
        'P16-1042_anno1.edu.txt.dep',
        'P16-1042_anno2.edu.txt.dep',
        'P16-1043_anno1.edu.txt.dep',
        'P16-1043_anno2.edu.txt.dep',
        'P16-1044_anno1.edu.txt.dep',
        'P16-1044_anno2.edu.txt.dep',
        'P16-1045_anno1.edu.txt.dep',
        'P16-1045_anno2.edu.txt.dep',
        'P16-1046_anno1.edu.txt.dep',
        'P16-1046_anno2.edu.txt.dep',
        'P16-1047_anno1.edu.txt.dep',
        'P16-1047_anno2.edu.txt.dep',
        'P16-1048_anno1.edu.txt.dep',
        'P16-1048_anno2.edu.txt.dep',
        'P16-1049_anno1.edu.txt.dep',
        'P16-1049_anno2.edu.txt.dep',
        'P16-1050_anno1.edu.txt.dep',
        'P16-1050_anno2.edu.txt.dep',
        'P16-1051_anno1.edu.txt.dep',
        'P16-1051_anno2.edu.txt.dep',
        'P16-1052_anno1.edu.txt.dep',
        'P16-1052_anno2.edu.txt.dep',
        'P16-1053_anno1.edu.txt.dep',
        'P16-1053_anno2.edu.txt.dep',
        'P16-1054_anno1.edu.txt.dep',
        'P16-1054_anno2.edu.txt.dep',
        'P16-1055_anno1.edu.txt.dep',
        'P16-1055_anno2.edu.txt.dep',
        'P16-1056_anno1.edu.txt.dep',
        'P16-1056_anno2.edu.txt.dep',
        'P16-1057_anno1.edu.txt.dep',
        'P16-1057_anno2.edu.txt.dep',
        'P16-1058_anno1.edu.txt.dep',
        'P16-1058_anno2.edu.txt.dep',
        'P16-1059_anno1.edu.txt.dep',
        'P16-1059_anno2.edu.txt.dep',
        'P16-1060_anno1.edu.txt.dep',
        'P16-1060_anno2.edu.txt.dep',
        'P16-1061_anno1.edu.txt.dep',
        'P16-1061_anno2.edu.txt.dep',
        'P16-1062_anno1.edu.txt.dep',
        'P16-1062_anno2.edu.txt.dep',
        'P16-1063_anno1.edu.txt.dep',
        'P16-1063_anno2.edu.txt.dep',
        'P16-1064_anno1.edu.txt.dep',
        'P16-1064_anno2.edu.txt.dep',
        'P16-1065_anno1.edu.txt.dep',
        'P16-1065_anno2.edu.txt.dep',
        'P16-1066_anno1.edu.txt.dep',
        'P16-1066_anno2.edu.txt.dep',
        'P16-1067_anno1.edu.txt.dep',
        'P16-1067_anno2.edu.txt.dep',
        'P16-1068_anno1.edu.txt.dep',
        'P16-1068_anno2.edu.txt.dep',
        'P16-1069_anno1.edu.txt.dep',
        'P16-1069_anno2.edu.txt.dep',
        'P16-1070_anno1.edu.txt.dep',
        'P16-1070_anno2.edu.txt.dep',
        'P16-1071_anno1.edu.txt.dep',
        'P16-1071_anno2.edu.txt.dep',
        'P16-1072_anno1.edu.txt.dep',
        'P16-1072_anno2.edu.txt.dep',
        'P16-1073_anno1.edu.txt.dep',
        'P16-1073_anno2.edu.txt.dep',
        'P16-1074_anno1.edu.txt.dep',
        'P16-1074_anno2.edu.txt.dep',
        'P16-1075_anno1.edu.txt.dep',
        'P16-1075_anno2.edu.txt.dep',
        'P16-1076_anno1.edu.txt.dep',
        'P16-1076_anno2.edu.txt.dep',
        'P16-1077_anno1.edu.txt.dep',
        'P16-1077_anno2.edu.txt.dep',
        'P16-1078_anno1.edu.txt.dep',
        'P16-1078_anno2.edu.txt.dep',
        'P16-1079_anno1.edu.txt.dep',
        'P16-1079_anno2.edu.txt.dep',
        'P16-1080_anno1.edu.txt.dep',
        'P16-1080_anno2.edu.txt.dep',
        'P16-1081_anno1.edu.txt.dep',
        'P16-1081_anno2.edu.txt.dep',
        'P16-1082_anno1.edu.txt.dep',
        'P16-1082_anno2.edu.txt.dep',
        'P16-1083_anno1.edu.txt.dep',
        'P16-1083_anno2.edu.txt.dep',
        'P16-1084_anno1.edu.txt.dep',
        'P16-1084_anno2.edu.txt.dep',
        'P16-1085_anno1.edu.txt.dep',
        'P16-1085_anno2.edu.txt.dep',
        'P16-1086_anno1.edu.txt.dep',
        'P16-1086_anno2.edu.txt.dep',
        'P16-1087_anno1.edu.txt.dep',
        'P16-1087_anno2.edu.txt.dep',
        'P16-1088_anno1.edu.txt.dep',
        'P16-1088_anno2.edu.txt.dep',
        'P16-1089_anno1.edu.txt.dep',
        'P16-1089_anno2.edu.txt.dep',
        'P16-1090_anno1.edu.txt.dep',
        'P16-1090_anno2.edu.txt.dep',
        'P16-1091_anno1.edu.txt.dep',
        'P16-1091_anno2.edu.txt.dep',
        'P16-1092_anno1.edu.txt.dep',
        'P16-1092_anno2.edu.txt.dep',
        'P16-1093_anno1.edu.txt.dep',
        'P16-1093_anno2.edu.txt.dep',
        'P16-1094_anno1.edu.txt.dep',
        'P16-1094_anno2.edu.txt.dep',
        'P16-1095_anno1.edu.txt.dep',
        'P16-1095_anno2.edu.txt.dep',
        'P16-1096_anno1.edu.txt.dep',
        'P16-1096_anno2.edu.txt.dep',
        'P16-1097_anno1.edu.txt.dep',
        'P16-1097_anno2.edu.txt.dep',
        'P16-1098_anno1.edu.txt.dep',
        'P16-1098_anno2.edu.txt.dep',
        'P16-1099_anno1.edu.txt.dep',
        'P16-1099_anno2.edu.txt.dep',
        'P16-1100_anno1.edu.txt.dep',
        'P16-1100_anno2.edu.txt.dep',
        'P16-1101.edu.txt.dep',
        'P16-1102.edu.txt.dep',
        'P16-1103.edu.txt.dep',
        'P16-1104.edu.txt.dep',
        'P16-1105.edu.txt.dep',
        'P16-1106.edu.txt.dep',
        'P16-1107.edu.txt.dep',
        'P16-1108.edu.txt.dep',
        'P16-1109.edu.txt.dep',
        'P16-1110.edu.txt.dep',
        'P16-1111.edu.txt.dep',
        'P16-1112.edu.txt.dep',
        'P16-1113.edu.txt.dep',
        'P16-1114.edu.txt.dep',
        'P16-1115.edu.txt.dep',
        'P16-1116.edu.txt.dep',
        'P16-1117.edu.txt.dep',
        'P16-1118.edu.txt.dep',
        'P16-1119.edu.txt.dep',
        'P16-1120.edu.txt.dep',
        'P16-1121.edu.txt.dep',
        'P16-1122.edu.txt.dep',
        'P16-1123.edu.txt.dep',
        'P16-1124.edu.txt.dep',
        'P16-1125.edu.txt.dep',
        'P16-1126.edu.txt.dep',
        'P16-1127.edu.txt.dep',
        'P16-1128.edu.txt.dep',
        'P16-1129.edu.txt.dep',
        'P16-1130.edu.txt.dep',
        'P16-1131.edu.txt.dep',
        'P16-1132.edu.txt.dep',
        'P16-1133.edu.txt.dep',
        'P16-1134.edu.txt.dep',
        'P16-1135.edu.txt.dep',
        'P16-1136.edu.txt.dep',
        'P16-1137.edu.txt.dep',
        'P16-1138.edu.txt.dep',
        'P16-1139.edu.txt.dep',
        'P16-1140.edu.txt.dep',
        'P16-1141.edu.txt.dep',
        'P16-1142.edu.txt.dep',
        'P16-1143.edu.txt.dep',
        'P16-1144.edu.txt.dep',
        'P16-1145.edu.txt.dep',
        'P16-1146.edu.txt.dep',
        'P16-1147.edu.txt.dep',
        'P16-1148.edu.txt.dep',
        'P16-1149.edu.txt.dep',
        'P16-1150.edu.txt.dep',
        'P16-1151.edu.txt.dep',
        'P16-1152.edu.txt.dep',
        'P16-1153.edu.txt.dep',
        'P16-1154.edu.txt.dep',
        'P16-1155.edu.txt.dep',
        'P16-1156.edu.txt.dep',
        'P16-1157.edu.txt.dep',
        'P16-1158.edu.txt.dep',
        'P16-1159.edu.txt.dep',
        'P16-1160.edu.txt.dep',
        'P16-1161.edu.txt.dep',
        'P16-1162.edu.txt.dep',
        'P16-1163.edu.txt.dep',
        'P16-1164.edu.txt.dep',
        'P16-1165.edu.txt.dep',
        'P16-1166.edu.txt.dep',
        'P16-1167.edu.txt.dep',
        'P16-1168.edu.txt.dep',
        'P16-1169.edu.txt.dep',
        'P16-1170.edu.txt.dep',
        'P16-1171.edu.txt.dep',
        'P16-1172.edu.txt.dep',
        'P16-1173.edu.txt.dep',
        'P16-1174.edu.txt.dep',
        'P16-1175.edu.txt.dep',
        'P16-1176.edu.txt.dep',
        'P16-1177.edu.txt.dep',
        'P16-1178.edu.txt.dep',
        'P16-1179.edu.txt.dep',
        'P16-1180.edu.txt.dep',
        'P16-1181.edu.txt.dep',
        'P16-1182.edu.txt.dep',
        'P16-1183.edu.txt.dep',
        'P16-1184.edu.txt.dep',
        'P16-1185.edu.txt.dep',
        'P16-1186.edu.txt.dep',
        'P16-1187.edu.txt.dep',
        'P16-1188.edu.txt.dep',
        'P16-1189.edu.txt.dep',
        'P16-1190.edu.txt.dep',
        'P16-1191.edu.txt.dep',
        'P16-1192.edu.txt.dep',
        'P16-1193.edu.txt.dep',
        'P86-1003.edu.txt.dep',
        'P86-1004.edu.txt.dep',
        'P86-1005.edu.txt.dep',
        'P86-1006.edu.txt.dep',
        'P86-1008.edu.txt.dep',
        'P86-1009.edu.txt.dep',
        'P86-1010.edu.txt.dep',
        'P86-1011.edu.txt.dep',
        'P86-1012.edu.txt.dep',
        'P86-1013.edu.txt.dep',
        'P86-1014.edu.txt.dep',
        'P86-1015.edu.txt.dep',
        'P86-1016.edu.txt.dep',
        'P86-1017.edu.txt.dep',
        'P86-1018.edu.txt.dep',
        'P86-1020.edu.txt.dep',
        'P86-1021.edu.txt.dep',
        'P86-1022.edu.txt.dep',
        'P86-1024.edu.txt.dep',
        'P86-1025.edu.txt.dep',
        'P86-1029.edu.txt.dep',
        'P86-1030.edu.txt.dep',
        'P86-1031.edu.txt.dep',
        'P86-1032.edu.txt.dep',
        'P86-1033.edu.txt.dep',
        'P86-1034.edu.txt.dep',
        'P86-1036.edu.txt.dep',
        'P86-1037.edu.txt.dep',
        'P86-1038.edu.txt.dep',
        'P96-1001.edu.txt.dep',
        'P96-1002.edu.txt.dep',
        'P96-1003.edu.txt.dep',
        'P96-1004.edu.txt.dep',
        'P96-1005.edu.txt.dep',
        'P96-1006.edu.txt.dep',
        'P96-1007.edu.txt.dep',
        'P96-1008.edu.txt.dep',
        'P96-1009.edu.txt.dep',
        'P96-1010.edu.txt.dep',
        'P96-1011.edu.txt.dep',
        'P96-1012.edu.txt.dep',
        'P96-1013.edu.txt.dep',
        'P96-1014.edu.txt.dep',
        'P96-1015.edu.txt.dep',
        'P96-1016.edu.txt.dep',
        'P96-1017.edu.txt.dep',
        'P96-1018.edu.txt.dep',
        'P96-1019.edu.txt.dep',
        'P96-1020.edu.txt.dep',
        'P96-1021.edu.txt.dep',
        'P96-1022.edu.txt.dep',
        'P96-1023.edu.txt.dep',
        'P96-1024.edu.txt.dep',
        'P96-1025.edu.txt.dep',
        'P96-1027.edu.txt.dep',
        'P96-1028.edu.txt.dep',
        'P96-1029.edu.txt.dep',
        'P96-1030.edu.txt.dep',
        'P96-1031.edu.txt.dep',
        'P96-1032.edu.txt.dep',
        'P96-1033.edu.txt.dep',
        'P96-1034.edu.txt.dep',
        'P96-1035.edu.txt.dep',
        'P96-1036.edu.txt.dep',
        'P96-1037.edu.txt.dep',
        'P96-1039.edu.txt.dep',
        'P96-1041.edu.txt.dep',
        'P96-1042.edu.txt.dep',
        'P96-1043.edu.txt.dep',
        'P96-1044.edu.txt.dep',
        'P96-1045.edu.txt.dep',
        'P96-1046.edu.txt.dep',
        'P96-1047.edu.txt.dep',
        'P96-1048.edu.txt.dep',
        'P96-1049.edu.txt.dep',
        'P96-1050.edu.txt.dep',
        'P96-1051.edu.txt.dep',
        'P96-1052.edu.txt.dep',
        'P96-1053.edu.txt.dep',
        'P96-1054.edu.txt.dep',
        'P96-1055.edu.txt.dep',
        'P96-1056.edu.txt.dep',
        'P96-1057.edu.txt.dep',
        'P96-1058.edu.txt.dep'
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

    // ファイルアップロード
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

    // ノード解除処理
    $scope.clearNode = function() {
        $scope.first = -1;
        $scope.operations.pop();
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
        var op = {type: 'delete', id1: id1, id2: id2, relation: $scope.depRels[id2]};
        $scope.first = -1;
        disconnect(id1, id2);
        // 履歴に追加
        $scope.operations.push(op);
    };

    // UNDO処理
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
        var arrayIndex = Math.floor(Math.random() * 1049);
        var sampleFile = CONSTANTS.SAMPLE_FILES[arrayIndex];
        console.log(sampleFile)
        xhr.open("GET", "https://norikinishida.github.io/tools/discdep/data/samples/" + sampleFile);
        xhr.send();
        console.log(xhr);
        $scope.inputFile = sampleFile;
    };

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
        centerZ.x += 90;
        centerZ.y -= canvasPos.y;
        centerZ.y += 30;

        // 描画
        var ctx = angular.element('#canvas')[0].getContext('2d');
        ctx.font = fontSize.toString() + "px Arial";
        // ctx.fillStyle = '#005AB5';
        ctx.fillStyle = CONSTANTS.LABEL_COLOR;
        ctx.textAlign = "right";
        // while (relation.length < 12) relation = ' ' + relation;
        ctx.fillText(relation, centerZ.x - fontSize * 7, centerZ.y);
    };

}]); // /EDUListController
