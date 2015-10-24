/**
 * Created by DIYgod on 15/4/24.
 */
define(function() {
    function uniqArray(arr) {
        var new_array = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] !== '' && new_array.indexOf(arr[i]) < 0) {
                new_array.push(arr[i]);
            }
        }
        return new_array;
    }

    function htmlEncode(str) {
        return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2f;")
            .replace(/\n/g, "<br>");
    }

    function addClick(elements, listener) {
        if (elements.length || elements.length === 0) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('click', listener);
            }
        }
        else if (elements) {
            elements.addEventListener('click', listener);
        }
        else {
            throw 'no element';
        }
    }

    function ajax(url, options) {
        // 创建对象
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {        //兼容 IE5 IE6
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }

        // readyState
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status === 304) {
                    if (options.onsuccess) {
                        options.onsuccess(xmlhttp.responseText, xmlhttp.responseXML);
                    }
                }
                else {
                    if (options.onfail) {
                        options.onfail();
                    }
                }
            }
        };

        // 处理data
        if (options.data) {
            var dataarr = [];
            for (var item in options.data) {
                dataarr.push(item + '=' + encodeURI(options.data[item]));
            }
            var data = dataarr.join('&');
        }

        // 处理type
        if (!options.type) {
            options.type = 'GET';
        }
        options.type = options.type.toUpperCase();

        // 发送请求
        if (options.type === 'GET') {
            var myURL = '';
            if (options.data) {
                myURL = url + '?' + data;
            }
            else {
                myURL = url;
            }
            xmlhttp.open('GET', myURL, true);
            xmlhttp.send();
        }
        else if (options.type === 'POST') {
            xmlhttp.open('POST', url, true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.send(data);
        }
    }

    return {
        uniqArray: uniqArray,
        htmlEncode: htmlEncode,
        addClick: addClick,
        ajax: ajax
    }
});
