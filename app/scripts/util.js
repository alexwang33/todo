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
        if (elements.length) {
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

    return {
        uniqArray: uniqArray,
        htmlEncode: htmlEncode,
        addClick: addClick
    }
});
