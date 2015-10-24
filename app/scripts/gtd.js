/**
 * Created by DIYgod on 15/6/6.
 */
define(['util', 'selector'], function (util, $) {
    // localStorage + JSON 存储任务数据
    // cate代表分类，childCate代表子分类，task代表任务
    var cateText;
    var childCateText;
    var taskText;
    var cate;
    var childCate;
    var task;
    var isMobile;

    function init() {
        cateText = '['
            + '{'
            +     '"id": 0,'
            +     '"name": "默认分类",'
            +     '"child": [0]'
            + '}'
            + ']';

        childCateText = '['
            + '{'
            +     '"id": 0,'
            +     '"name": "默认子分类",'
            +     '"child": [],'
            +     '"father": 0'
            + '}'
            + ']';

        taskText = '[]';

        if (!localStorage.getItem('cate')) {  // 页面之前没被访问过的情况，载入默认值
            localStorage.cate = cateText;
            localStorage.childCate = childCateText;
            localStorage.task = taskText;
        }

        // cate = JSON.parse(localStorage.cate);
        // childCate = JSON.parse(localStorage.childCate);
        // task = JSON.parse(localStorage.task);
        isMobile = navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i);

        
        util.ajax(
            '/Backend/Task/Index/get_cate_farther.html', {
                onsuccess: function (responseText, xhr) {
                    // console.log(responseText, xhr);
                    cate = JSON.parse(responseText);
                },
                onfail : function () {
                    console.log('fail');
                }
            }
        );
        util.ajax(
            '/Backend/Task/Index/get_cate_child.html', {
                onsuccess: function (responseText, xhr) {
                    // console.log(responseText, xhr);
                    childCate = JSON.parse(responseText);
                },
                onfail : function () {
                    console.log('fail');
                }
            }
        );
        util.ajax(
            '/Backend/Task/Index/get_task.html', {
                onsuccess: function (responseText, xhr) {
                    // console.log(responseText, xhr);
                    task = JSON.parse(responseText);
                },
                onfail : function () {
                    console.log('fail');
                }
            }
        );

        util.addClick($('#type-all'), typeClick);
        util.addClick($('.add'), newType);
        util.addClick(document.getElementsByClassName('add')[1], newTask);
        util.addClick($('.status').getElementsByTagName('li'), statusClick);
        util.addClick($('.icon-check'), finishTask);
        util.addClick($('.icon-edit'), editTask);
        util.addClick($('.btn3'), cancelAdd);
        util.addClick(document.getElementsByClassName('btn3')[1], taskAdd);
        util.addClick($('.pop-close'), closePop);

        if (isMobile) {
            location.href = '#type';

            var oldHash = '#type';
            /* 滑动效果 */
            window.onhashchange = function () {
                var newHash = location.hash;
                var oldEle = $('.' + oldHash.substr(1));
                var newEle = $('.' + newHash.substr(1));
                if ((oldHash == '#type' && newHash == '#task') || (oldHash == '#task' && newHash == '#details')) {
                    oldEle.classList.add('slide', 'out');
                    newEle.classList.add('slide', 'in');
                    newEle.style.display = 'block';
                    oldEle.style.display = 'block';
                    setTimeout(function () {
                        newEle.style.display = 'block';
                        oldEle.style.display = 'none';
                        oldEle.classList.remove('slide', 'out');
                        newEle.classList.remove('slide', 'in');
                    }, 225);
                }
                else if ((oldHash == '#task' && newHash == '#type') || (oldHash == '#details' && newHash == '#task')) {
                    newEle.classList.add('slide', 'reverse', 'in');
                    oldEle.classList.add('slide', 'reverse', 'out');
                    oldEle.style.display = 'block';
                    newEle.style.display = 'block';
                    setTimeout(function () {
                        oldEle.style.display = 'none';
                        newEle.style.display = 'block';
                        newEle.classList.remove('slide', 'reverse', 'in');
                        oldEle.classList.remove('slide', 'reverse', 'out');
                    }, 225);
                }
                oldHash = newHash;
            }
        }
    }

    // 生成任务分类列表
    function makeType() {
        setNum();               // 刷新分类对象的num属性
        var oldChoose = $('.type-wrap .choose');    // 保存正在选中的分类选项
        $('.task-sum').innerHTML = task.length;
        var html = '';
        for (var i = 0; i < cate.length; i++) {
            html += ''
                + '<li>'
                + '<h3>'
                + '<i class="icon-folder-open-empty"></i><span>' + cate[i].name + '</span>(' + cate[i].num + ')<i class="delete icon-minus-circled"></i>'
                + '</h3>'
                + '<ul class="item">';

            for (var j = 0; j < cate[i].child.length; j++) {
                var childNode = getObjByKey(childCate, 'id', cate[i].child[j]);
                html += ''
                    + '<li>'
                    + '<h4>'
                    + '<i class="icon-doc-text"></i><span>' + childNode.name + '</span>(' + childNode.child.length + ')<i class="delete icon-minus-circled"></i>'
                    + '</h4>'
                    + '</li>'
            }
            html += ''
                + '</ul>'
                + '</li>'
        }
        html = html.replace(/<i class="delete icon-minus-circled"><\/i>/, '');    // 去掉默认分类的删除按钮
        html = html.replace(/<i class="delete icon-minus-circled"><\/i>/, '');    // 去掉默认子分类的删除按钮
        $('.item-wrap').innerHTML = html;

        util.addClick(document.getElementsByTagName('h3'), typeClick);                 // 为新增元素绑定点击事件
        util.addClick(document.getElementsByClassName('delete'), del);
        util.addClick(document.getElementsByTagName('h4'), typeClick);

        if (!isMobile) {
            if (oldChoose) {                                          // 恢复之前选中的选项
                var tag = oldChoose.tagName.toLowerCase();
                var name = oldChoose.getElementsByTagName('span')[0].innerHTML;
                var isClick = false;
                switch (tag) {
                    case 'h2':
                        $('h2').click();
                        isClick = true;
                        break;
                    case 'h3':
                        var cateEle = document.getElementsByTagName('h3');
                        for (i = 0; i < cateEle.length; i++) {
                            if (cateEle[i].getElementsByTagName('span')[0].innerHTML === name) {
                                cateEle[i].click();
                                isClick = true;
                                break;
                            }
                        }
                        break;
                    case 'h4':
                        var childEle = document.getElementsByTagName('h4');
                        for (i = 0; i < childEle.length; i++) {
                            if (childEle[i].getElementsByTagName('span')[0].innerHTML === name) {
                                childEle[i].click();
                                isClick = true;
                                break;
                            }
                        }
                        break;
                }
                if (!isClick) {                                   // 之前选中的元素不再显示的情况
                    $('h2').click();
                }
            }
            else {                   // 否则默认选择第一个分类
                $('h2').click();
            }
            makeTask();
        }
    }

    // 生成任务列表
    function makeTask() {
        var oldChoose = $('.task-wrap .choose');     // 保存正在选中的任务
        $('.status li').click();                     // 点击所有选项
        var ele = $('.type-wrap .choose');
        var eleTag = ele.tagName.toLowerCase();
        var name = ele.getElementsByTagName('span')[0].innerHTML;
        var taskIdArr = [];
        var childObj;
        switch (eleTag) {
            case 'h2':                               // 选中了所有任务
                for (var i = 0; i < task.length; i++) {
                    taskIdArr.push(task[i].id);
                }
                makeTaskById(taskIdArr);
                break;
            case 'h3':                               // 选中了分类
                var cateObj = getObjByKey(cate, 'name', name);     // 得到任务分类对象
                for (i = 0; i < cateObj.child.length; i++) {
                    childObj = getObjByKey(childCate, 'id', cateObj.child[i]);  // 得到任务子分类对象
                    for (var j = 0; j < childObj.child.length; j++) {
                        taskIdArr.push(childObj.child[j]);
                    }
                }
                makeTaskById(taskIdArr);
                break;
            case 'h4':                               // 选中了子分类
                childObj = getObjByKey(childCate, 'name', name);  // 得到任务子分类对象
                for (i = 0; i < childObj.child.length; i++) {
                    taskIdArr.push(childObj.child[i]);
                }
                makeTaskById(taskIdArr);
                break;
        }

        if (!isMobile) {
            if (oldChoose) {                                          // 恢复之前选中的选项
                var childEle = document.getElementsByTagName('h6');
                var oldName = oldChoose.getElementsByTagName('span')[0].innerHTML;
                var isClick = false;
                for (i = 0; i < childEle.length; i++) {
                    if (childEle[i].getElementsByTagName('span')[0].innerHTML === oldName) {
                        childEle[i].click();
                        isClick = true;
                        break;
                    }
                    if (!isClick && $('h6')) {                                   // 之前选中的元素不再显示的情况
                        $('h6').click();
                    }
                }
            }
            else if ($('h6')) {                   // 否则默认选择第一个任务
                $('h6').click();
            }
        }

        if (!isMobile) {
            makeDetails();
        }
    }

    // 根据传入的ID生成任务列表
    function makeTaskById(taskIdArr) {
        var date = [];
        var taskObj;
        for (var i = 0; i < taskIdArr.length; i++) {              // 得到所有日期
            taskObj = getObjByKey(task, 'id', taskIdArr[i]);
            date.push(taskObj.date);
        }
        date = util.uniqArray(date);
        date = sortDate(date);      // 排序

        var html = '';
        for (i = 0; i < date.length; i++) {
            html += ''
                + '<li>'
                + '<h5>' + date[i] + '</h5>'
                + '<ul class="item">';
            for (var j = 0; j < taskIdArr.length; j++) {
                taskObj = getObjByKey(task, 'id', taskIdArr[j]);
                if (taskObj.date === date[i]) {
                    if (taskObj.finish === true) {
                        html += ''
                            + '<li class="task-item task-finish">'
                    }
                    else if (taskObj.finish === false) {
                        html += ''
                            + '<li class="task-item">'
                    }
                    html += ''
                        + '<h6>'
                        + '<i class="icon-check"></i><span>' + taskObj.name + '</span><i class="delete icon-minus-circled"></i>'
                        + '</h6>'
                        + '</li>'
                }
            }
            html += ''
                + '</ul>'
                + '</li>'
        }
        $('.task-wrap').innerHTML = html;
        util.addClick(document.getElementsByTagName('h6'), taskClick);
        util.addClick(document.getElementsByClassName('delete'), del);
    }

    // 根据某对象的某属性得到某对象
    function getObjByKey(obj, key, value) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i][key] === value) {
                return obj[i];
            }
        }
    }

    // 根据某对象的某属性得到某对象的序号
    function getIndexByKey(obj, key, value) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i][key] === value) {
                return i;
            }
        }
    }

    // 对任务时间进行排序
    function sortDate(date) {
        return date.sort(function (a, b) {
            return a.replace(/-/g, '') - b.replace(/-/g, '');
        });
    }

    // 生成任务详细描述部分
    function makeDetails() {
        var ele = $('.task-wrap .choose');
        var info = $('.details').getElementsByTagName('span');
        if (ele) {
            var name = ele.getElementsByTagName('span')[0].innerHTML;
            var taskObj = getObjByKey(task, 'name', name);
            if (taskObj) {
                info[0].innerHTML = taskObj.name;
                info[1].innerHTML = taskObj.date;
                info[2].innerHTML = taskObj.content;
            }
            else {                           // ele刚刚被删掉
                info[0].innerHTML = '';
                info[1].innerHTML = '';
                info[2].innerHTML = '';
            }
            $('.set').style.display = 'inline';
        }
        else {                               // 任务列表为空的情况
            info[0].innerHTML = '';
            info[1].innerHTML = '';
            info[2].innerHTML = '';
            $('.set').style.display = 'none';
        }
    }

    // 任务分类列表点击效果
    function typeClick() {
        if (isMobile) {
            location.href = '#task';
        }
        var otherChoose = $('.type').getElementsByTagName('*');
        for (var i = 0; i < otherChoose.length; i++) {
            if (otherChoose[i].classList.contains('choose')) {
                otherChoose[i].classList.remove('choose');
                break;
            }
        }
        this.classList.add('choose');
        makeTask();
    }

    // 任务列表点击效果
    function taskClick() {
        if (isMobile) {
            location.href = '#details';
        }
        var otherChoose = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('*');
        for (var i = 0; i < otherChoose.length; i++) {
            if (otherChoose[i].classList.contains('choose')) {
                otherChoose[i].classList.remove('choose');
                break;
            }
        }
        this.classList.add('choose');
        makeDetails();
    }

    // 筛选菜单点击效果
    function statusClick() {
        var otherChoose = this.parentNode.getElementsByTagName('*');
        for (i = 0; i < otherChoose.length; i++) {
            if (otherChoose[i].classList.contains('choose')) {
                otherChoose[i].classList.remove('choose');
                break;
            }
        }
        this.classList.add('choose');
        var myEle;
        if (this.innerHTML.indexOf('所有') !== -1) {
            myEle = $('.task-wrap').getElementsByTagName('li');
            for (i = 0; i < myEle.length; i++) {
                myEle[i].style.display = 'block';
            }
        }
        else if (this.innerHTML.indexOf('已完成') !== -1) {
            myEle = $('.task-wrap').getElementsByTagName('li');
            for (i = 0; i < myEle.length; i++) {
                myEle[i].style.display = 'none';
            }
            for (i = 0; i < myEle.length; i++) {
                if (myEle[i].classList.contains('task-finish')) {
                    myEle[i].style.display = 'block';
                    myEle[i].parentNode.parentNode.style.display = 'block';
                }
            }
        }
        else if (this.innerHTML.indexOf('未完成') !== -1) {
            myEle = $('.task-wrap').getElementsByTagName('li');
            for (i = 0; i < myEle.length; i++) {
                myEle[i].style.display = 'none';
            }
            for (i = 0; i < myEle.length; i++) {
                console.log(myEle[i]);
                if (!myEle[i].classList.contains('task-finish')) {
                    myEle[i].style.display = 'block';
                    myEle[i].parentElement.parentElement.style.display = 'block';
                }
            }
        }

        if (!isMobile) {
            var h6 = document.getElementsByTagName('h6');        // 默认选择第一个任务
            for (var i = 0; i < h6.length; i++) {
                if (h6[i].parentNode.style.display !== 'none') {
                    h6[i].click();
                    break;
                }
            }
        }
    }

    // 新分类弹窗，编辑新分类
    function newType() {
        $('.pop').style.display = 'block';
        $('.overlay').style.display = 'block';
        $('.pop-name').innerHTML = '新增分类';
        var html = ''
            + '<p>'
            + '新分类名称:'
            + '<input type="text" class="typeText" placeholder="在此输入新分类的名称">'
            + '</p>'
            + '<p>'
            + '新分类父节点:'
            + '<select class="mySelect">'
            + '<option value="-1">无</option>'

        var itemWrap = $('.item-wrap');
        var itemName = itemWrap.getElementsByTagName('h3');
        for (var i = 0; i < itemName.length; i++) {
            html += ''
                + '<option value="' + i + '">' + itemName[i].getElementsByTagName('span')[0].innerHTML + '</option>'
        }

        html += ''
            + '</select>'
            + '</p>'
            + '<p class="error"></p>'
            + '<button class="myButton btn1">取消</button>'
            + '<button class="myButton btn2">确定</button>';

        $('.pop-content').innerHTML = html;
        util.addClick($('.btn1'), closePop);
        util.addClick($('.btn2'), typeAdd);
    }

    // 弹窗关闭按钮
    function closePop() {
        $('.pop').style.display = 'none';
        $('.overlay').style.display = 'none';
    }

    // 添加新分类
    function typeAdd() {
        var name = util.htmlEncode($('.typeText').value);    // XSS 防护
        var fatherName = $('.mySelect').value;
        if (name.length === 0) {              // 检测输入合法性
            $('.error').innerHTML = '分类名称不能为空';
            return;
        }
        else if (name.length >= 15) {
            $('.error').innerHTML = '分类名称不能多于15个字符';
            return;
        }
        else if (getObjByKey(cate, 'name', name)) {
            $('.error').innerHTML = '检测到相同名称的分类已存在';
            return;
        }
        else if (getObjByKey(childCate, 'name', name)) {
            $('.error').innerHTML = '检测到相同名称的子分类已存在';
            return;
        }
        if (fatherName === '-1') {             // 添加分类
            var newCate = {
                "id": cate[cate.length - 1].id + 1,
                "name": name,
                "num": 0,
                "child": []
            };
            cate.push(newCate);
            save();
        }
        else {                                 // 添加子分类
            var newChild = {
                "id": childCate[childCate.length - 1].id + 1,
                "name": name,
                "child": [],
                "father": cate[$('.mySelect').value].id
            };
            var father = getObjByKey(cate, 'id', newChild.father);   // 父节点对象
            father.child.push(newChild.id);                       // 在父节点中登记
            childCate.push(newChild);
            save();
        }
        makeType();
        closePop();
    }

    // 进入编辑模式，编辑新任务
    function newTask() {
        if (isMobile) {
            location.href = '#details';
        }
        $('.task .add').onclick = '';                                                // 暂时取消新建按钮的点击事件，防止重复点击

        document.getElementsByClassName('taskText')[0].value = '';                   // 进入编辑模式
        document.getElementsByClassName('taskText')[1].value = '';
        $('.myTextArea').value = '';
        $('.task-title span').style.display = 'none';
        $('.task-date span').style.display = 'none';
        $('.task-content span').style.display = 'none';
        $('.set').style.display = 'none';
        $('.taskError').style.display = 'inline';
        document.getElementsByClassName('taskText')[0].style.display = 'inline';
        document.getElementsByClassName('taskText')[1].style.display = 'inline';
        $('.myTextArea').style.display = 'inline';
        document.getElementsByClassName('btn3')[0].style.display = 'inline';
        document.getElementsByClassName('btn3')[1].style.display = 'inline';
    }

    // 退出编辑模式，放弃添加新任务
    function cancelAdd() {
        if (isMobile) {
            location.href = '#task';
        }
        util.addClick($('.task .add'), newTask);                                 // 重新绑定新建按钮的点击事件

        $('.task-title span').style.display = 'inline';                              // 退出编辑模式
        $('.task-date span').style.display = 'inline';
        $('.task-content span').style.display = 'inline';
        $('.set').style.display = 'inline';
        $('.taskError').style.display = 'none';
        document.getElementsByClassName('taskText')[0].style.display = 'none';
        document.getElementsByClassName('taskText')[1].style.display = 'none';
        $('.myTextArea').style.display = 'none';
        document.getElementsByClassName('btn3')[0].style.display = 'none';
        document.getElementsByClassName('btn3')[1].style.display = 'none';
        $('.taskError').innerHTML = '';
    }

    // 添加新任务
    function taskAdd() {
        var name = util.htmlEncode(document.getElementsByClassName('taskText')[0].value);   // XSS 防护
        var date = util.htmlEncode(document.getElementsByClassName('taskText')[1].value);
        var content = util.htmlEncode($('.myTextArea').value);
        var dateSplit = date.split('-');

        if (name.length === 0) {
            $('.taskError').innerHTML = '任务标题不能为空';
            return;
        }
        else if (date.length === 0) {
            $('.taskError').innerHTML = '任务日期不能为空';
            return;
        }
        else if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            $('.taskError').innerHTML = '任务日期格式错误';
            return;
        }
        else if (dateSplit[1] < 1 || dateSplit[1] > 12 || dateSplit[2] < 1 || dateSplit[2] > 31) {
            $('.taskError').innerHTML = '不要骗我，根本没有这一天';
            return;
        }
        else if (getObjByKey(task, 'name', name)) {
            $('.taskError').innerHTML = '检测到相同名称的任务已存在';
            return;
        }

        var father;
        var typeChoose = $('.type-wrap .choose');
        var eleTag = typeChoose.tagName.toLowerCase();
        switch (eleTag) {
            case 'h2':                               // 选中了所有任务
                father = 0;
                break;
            case 'h3':                               // 选中了分类
                var typeName = typeChoose.getElementsByTagName('span')[0].innerHTML;
                var typeObj = getObjByKey(cate, 'name', typeName);
                if (typeObj.child.length > 0) {
                    father = typeObj.child[0];
                }
                else {
                    father = 0;
                }
                break;
            case 'h4':                               // 选中了子分类
                var childName = typeChoose.getElementsByTagName('span')[0].innerHTML;
                father = getObjByKey(childCate, 'name', childName).id;
                break;
        }
        var newId = task.length ? task[task.length - 1].id + 1 : 0;
        var newTask = {
            "id": newId,
            "name": name,
            "father": father,
            "finish": false,
            "date": date,
            "content": content
        };
        task.push(newTask);
        var fatherObj = getObjByKey(childCate, 'id', newTask.father);
        fatherObj.child.push(newTask.id);

        save();
        makeType();
        var h6 = document.getElementsByTagName('h6');      // 选中新建的任务
        for (var i = 0; i < h6.length; i++) {
            var span = h6[i].getElementsByTagName('span')[0];
            if (span.innerHTML === name) {
                span.click();
                break;
            }
        }
        cancelAdd();
    }

    // 点击了删除按钮
    function del(e) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();  // 阻止事件冒泡

        var con = confirm("删除操作不可逆，确定要删除吗？");
        if (!con) {
            return;
        }

        var ele = this.parentNode;
        var tag = ele.tagName.toLowerCase();
        var index;
        var name = ele.getElementsByTagName('span')[0].innerHTML;
        var taskIndex;
        var fatherObj;
        switch (tag) {
            case 'h3':                                                          // 删除一个分类
                index = getIndexByKey(cate, 'name', name);

                for (var i = 0; i < cate[index].child.length; i++) {            // 删除该分类下的所有子分类及任务
                    var childIndex = getIndexByKey(childCate, 'id', cate[index].child[i]);
                    for (var j = 0; j < childCate[childIndex].child.length; j++) {
                        taskIndex = getIndexByKey(task, 'id', childCate[childIndex].child[j]);
                        task.splice(taskIndex, 1);
                    }
                    childCate.splice(childIndex, 1);
                }
                cate.splice(index, 1);
                break;
            case 'h4':                                                          // 删除一个子分类
                index = getIndexByKey(childCate, 'name', name);

                for (i = 0; i < childCate[index].child.length; i++) {       // 删除该子分类下的所有任务
                    taskIndex = getIndexByKey(task, 'id', childCate[index].child[i]);
                    task.splice(taskIndex, 1);
                }

                fatherObj = getObjByKey(cate, 'id', childCate[index].father);  // 删除父节点中的记录
                fatherObj.child.splice(fatherObj.child.indexOf(childCate[index].id), 1);
                childCate.splice(index, 1);
                break;
            case 'h6':
                index = getIndexByKey(task, 'name', name);

                fatherObj = getObjByKey(childCate, 'id', task[index].father);  // 删除父节点中的记录
                fatherObj.child.splice(fatherObj.child.indexOf(task[index].id), 1);
                task.splice(index, 1);
                break;
        }
        save();
        makeType();
    }

    // 刷新分类对象的num属性
    function setNum() {
        var sum;
        var childNum;
        for (var i = 0; i < cate.length; i++) {
            sum = 0;
            for (var j = 0; j < cate[i].child.length; j++) {
                childNum = getObjByKey(childCate, 'id', cate[i].child[j]).child.length;
                sum += childNum;
            }
            cate[i].num = sum;
        }
    }

    // 设置任务为已完成状态
    function finishTask() {
        var taskName = $('.task-title span').innerHTML;
        var taskObj = getObjByKey(task, 'name', taskName);
        if (taskObj.finish) {
            alert('任务已经已经完成了哦~');
            return;
        }
        var con = confirm("确定要设置任务为已完成状态吗？");
        if (!con) {
            return;
        }
        taskObj.finish = true;
        makeTask();
    }

    // 修改已有的任务
    function editTask() {
        $('.task .add').onclick = '';                                               // 暂时取消新建按钮的点击事件，防止重复点击
        util.addClick(document.getElementsByClassName('btn3')[1], taskChange);            // 绑定保存按钮的点击事件

        document.getElementsByClassName('taskText')[0].value = '';                  // 进入修改模式
        document.getElementsByClassName('taskText')[1].value = '';
        $('.myTextArea').value = '';
        $('.task-date span').style.display = 'none';
        $('.task-content span').style.display = 'none';
        $('.set').style.display = 'none';
        $('.taskError').style.display = 'inline';
        document.getElementsByClassName('taskText')[1].style.display = 'inline';
        $('.myTextArea').style.display = 'inline';
        document.getElementsByClassName('btn3')[0].style.display = 'inline';
        document.getElementsByClassName('btn3')[1].style.display = 'inline';

        document.getElementsByClassName('taskText')[1].value = $('.task-date span').innerHTML;
        $('.myTextArea').value = $('.task-content span').innerHTML;
    }

    // 保存修改
    function taskChange() {
        var name = $('.task-title span').innerHTML;
        var taskObj = getObjByKey(task, 'name', name);
        var date = util.htmlEncode(document.getElementsByClassName('taskText')[1].value);  // XSS 防护
        var content = util.htmlEncode($('.myTextArea').value);
        var dateSplit = date.split('-');

        if (date.length === 0) {
            $('.taskError').innerHTML = '任务日期不能为空';
            return;
        }
        else if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            $('.taskError').innerHTML = '任务日期格式错误';
            return;
        }
        else if (dateSplit[1] < 1 || dateSplit[1] > 12 || dateSplit[2] < 1 || dateSplit[2] > 31) {
            $('.taskError').innerHTML = '不要骗我，根本没有这一天';
            return;
        }

        taskObj.date = date;
        taskObj.content = content;
        save();

        makeType();
        var h6 = document.getElementsByTagName('h6');      // 选中新建的任务
        for (var i = 0; i < h6.length; i++) {
            var span = h6[i].getElementsByTagName('span')[0];
            if (span.innerHTML === name) {
                span.click();
                break;
            }
        }
        cancelAdd();
    }

    // 保存数据
    function save() {
        localStorage.childCate = JSON.stringify(childCate);
        localStorage.cate = JSON.stringify(cate);
        localStorage.task = JSON.stringify(task);
    }

    return {
        init: init,
        makeType: makeType
    };
});
