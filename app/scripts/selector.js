/**
 * Created by DIYgod on 15/6/8.
 */
define(['util'], function(util) {
    function $(selector) {
        var ele = document;
        var sele = selector.replace(/\s+/, ' ').split(' ');    // 去除多余的空格并分割

        for (var i = 0, len = sele.length; i < len; i++) {

            switch (sele[i][0]) {    // 从子节点中查找
                case '#':
                    ele = ele.getElementById(sele[i].substring(1));
                    break;
                case '.':
                    ele = ele.getElementsByClassName(sele[i].substring(1))[0];
                    break;
                case '[':
                    var valueLoc = sele[i].indexOf('=');
                    var temp = ele.getElementsByTagName('*');
                    var tLen = temp.length;
                    if (valueLoc !== -1) {
                        var key = sele[i].substring(1, valueLoc);
                        var value = sele[i].substring(valueLoc + 1, sele[i].length - 1);
                        for (var j = 0; j < tLen; j++) {
                            if (temp[j][key] === value) {
                                ele = temp[j];
                                break;
                            }
                        }
                    }
                    else {
                        var key = sele[i].substring(1, sele[i].length - 1);
                        for (var j = 0; j < tLen; j++) {
                            if (temp[j][key]) {
                                ele = temp[j];
                                break;
                            }
                        }
                    }
                    break;
                default :
                    ele = ele.getElementsByTagName(sele[i])[0];
                    break;
            }
        }

        if (!ele) {
            ele = null;
        }

        return ele;
    }

    return $;
});
