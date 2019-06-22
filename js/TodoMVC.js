//辅助用获取对象函数
let $ = function (sel) {
    return document.querySelector(sel);
};
let $All = function (sel) {
    return document.querySelectorAll(sel);
};
//用于保存所有条目的数组
let ItemLists = [];

//用于添加设置条目ID
let tempItemID = 0;


let updateAll = function () {
    //
    let todoCount = 0;
    let compCount = 0;

    model.flush();
    let todo = $('.todo-list');
    todo.innerHTML = '';
    //选择栏的保留
    // console.log(model.data);
    //获取三个过滤器对象
    let filters = $All('.filters li a');
    for (let i = 0; i < filters.length; i++) {
        // console.log(filters[i].childNodes[0].data)
        // console.log(model.data.filter)
        if (filters[i].childNodes[0].data === model.data.filter) {
            for (let j = 0; j < filters.length; j++) {
                // console.log(filters[j])
                filters[j].classList.remove('selected');
            }
            filters[i].classList.add('selected');
        }
    }

    ItemLists.forEach(function (item, index) {
        console.log(item);
        if (item.complete) {
            compCount += 1;
        }
        console.log(model);
//      选择展示过滤器信息
        if ((model.data.filter === 'All') || (model.data.filter === 'Active' && !item.complete) ||
            (model.data.filter === 'Completed' && item.complete)) {
            //新的一项todo
            let tempItem = document.createElement('li');

            if (item.complete) {
                tempItem.classList.add('completed')
            }
            let tempID = tempItemID;
            tempItemID+=1;
            tempItem.setAttribute('id', tempID);
            //todo的主体，分为完成按钮/编辑文体/删除三个部分
            let entry = document.createElement('div');
            entry.setAttribute('class', 'entry');

            //    完成条目定义
            let finish = document.createElement('input');
            finish.setAttribute('type', 'checkbox');
            finish.checked = item.complete;
            finish.setAttribute('class', 'toggle');
            finish.addEventListener('change', function () {
                item.complete = !item.complete;
                model.data.itemls = ItemLists;
                model.flush();
                updateAll();
            });

            //    编辑
            let msg = document.createElement('label');
            msg.setAttribute('class','todo-list');
            msg.setAttribute('type','text');
            console.log(item);
            msg.innerHTML=item.mess;
            // tempItem.appendChild(msg);
            msg.addEventListener('dblclick',function()
            {
                //通过双击来编辑
                //创建新的input元素
                tempItem.classList.add('editing');
                let newTemp = document.createElement('input');
                newTemp.setAttribute('class','edit');
                newTemp.setAttribute('type','text');
                let text = tempItem.querySelector('.todo-list');
                console.log(text);
                let info = text.innerHTML;
                newTemp.setAttribute('value',info);

                let saved=false;
                function exitEditing(){
                    //退出编辑
                    if(saved){
                        return;
                    }
                    saved=false;
                    tempItem.removeChild(newTemp);
                    tempItem.classList.remove('editing');
                }

                newTemp.addEventListener('keyup',function(e){
                    if(e.keyCode===27){
                        // 未保存
                        exitEditing();
                    }else if(e.keyCode===13){
                        //保存
                        let text = tempItem.querySelector('.todo-list');
                        text.innerHTML=this.value;
                        item.mess=this.value;
                        model.data.items=ItemLists;
                        model.flush();
                        exitEditing();
                        updateAll();
                    }
                });
                newTemp.addEventListener('blur',function(){
                    exitEditing();
                });
                tempItem.appendChild(newTemp);
                newTemp.focus();

            });


            //    删除
            let remove = document.createElement('button');
            remove.setAttribute('class', 'destroy');
            remove.addEventListener('click', function () {
                ItemLists.splice(index, 1);
                model.data.items = ItemLists;
                model.flush();
                updateAll();
            });

            entry.appendChild(finish);
            entry.appendChild(msg);
            entry.appendChild(remove);
            tempItem.appendChild(entry);

            todo.insertBefore(tempItem, todo.firstChild);
        }
    });

    todoCount = ItemLists.length - compCount;


    let clearCompleted=document.getElementById('clearCompleted');

    if(compCount===0){
        clearCompleted.style.visibility='hidden';
    }else{
        clearCompleted.style.visibility='visible';
    }



    let count = $('.todo-count');
    if (todoCount === 0) {
        count.innerHTML = 'Add some todo~'
    } else if (todoCount === 1) {
        count.innerHTML = '1 item left'
    } else {
        count.innerHTML = todoCount + 'items left'
    }
    model.data.items = ItemLists;

    //对应一些特殊情况，有一些按钮不可见
    let completeAll = $('.toggle-all');
    if (ItemLists.length === 0) {
        completeAll.style.visibility = 'hidden';
    } else {
        completeAll.style.visibility = 'visible';
        completeAll.checked = ItemLists.length !== todoCount;
    }
};

window.onload = function () {

    model.init(function () {
        model.flush();
        ItemLists = model.data.items;
        //获取所有信息
        let addItem = $('.new-todo');
        addItem.addEventListener('keyup', function (e) {
            //本想根据提示使用code，但是无法响应，此处仍然使用keyCode
            if (e.keyCode === 13) {
                let msg = addItem.value;
                if (msg === '') {
                    console.warn('Empty message input');
                    return;
                }
                ItemLists.push({
                    mess: msg,
                    complete: false
                });
                model.data.items = ItemLists;
                model.flush();
                addItem.value = '';
                updateAll();
            }
        });

        let filters = $All('.filters li a');
        for (let i = 0; i < filters.length; i++) {
            filters[i].addEventListener('click', function () {
                model.data.filter = this.innerHTML;
                //选中时将选择栏目对应调节
                for (let j = 0; j < filters.length; j++) {
                    filters[j].classList.remove('selected');
                }
                this.classList.add('selected');
                model.flush();
                updateAll();
            })
        }


        let finishAll = $('.toggle-all');
        finishAll.addEventListener('click', function () {
            if (finishAll.checked) {
                for (let i = 0; i < ItemLists.length; i++) {
                    ItemLists[i].complete = true;
                }

            } else {
                for (let i = 0; i < ItemLists.length; i++) {
                    ItemLists[i].complete = false;
                }
            }
            model.data.items = ItemLists;
            model.flush();
            updateAll();
        });

        let clearAll = $('.clear-all');
        clearAll.addEventListener('click',function(){
            ItemLists=[];
            model.data.items = ItemLists;
            model.flush();
            updateAll();
        });

        let clear = $('.clear-completed');
        clear.addEventListener('click', function () {
            let temp = [];
            for (let i = 0; i < ItemLists.length; i++) {
                if (ItemLists[i].complete === false) {
                    temp.push({
                        mess: ItemLists[i].mess,
                        complete: ItemLists[i].complete
                    })
                }
            }
            ItemLists = temp;
            model.data.items = ItemLists;
            model.flush();
            updateAll();
        })
    });
    updateAll();
};

