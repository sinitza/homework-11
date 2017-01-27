$(function () {
    var ul = $('ul'),
        popup = $('#popup'),
        input = $('#todo'),
        inputEdit = $('#edit-input');

    $.get('/api/v1/todo', function (data) {
        arrayTasks = data.todos;
        console.log('fjf',arrayTasks);
        view(arrayTasks);
    });

    function view(arrayTasks) {
        for (var i = 0; i < arrayTasks.length; i++) {
            console.log(i);
            drawItem(arrayTasks[i].value);
            recount();
        }
    }

    $('#add').click(add);

    $('input[type="text"]').keypress(function (event) {
        if (event.keyCode === 13 ) {
            add();
        }
    });

    function add() {
        if (input.val()) {
            drawItem(input.val());
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify({ "todo": {"value": input.val()}}),
                dataType: 'json',
                processData: false,
                type: 'POST',
                url: '/api/v1/todo'
            });
            input.val('');
        }
    }

    function drawItem(item) {
        var li = $('<li class="collection-item"><span class="text">' + item +
            '</span><i class="material-icons edit right">mode_edit</i>' +
            '<i class="material-icons remove right">delete</i></li>');

        recount();



        //видалення елементу
        li.find('.remove').click(function (event) {
            event.stopPropagation();

            for (var i = 0; i < arrayTasks.length; i++) {
                if ($(event.target).parent().find('.text').text() == arrayTasks[i].value){
                    $(event.target).parent().remove();
                    $.ajax({
                        contentType: 'application/json',
                        data: JSON.stringify({"_id": arrayTasks[i]._id}),
                        dataType: 'json',
                        processData: false,
                        type: 'DELETE',
                        url: '/api/v1/todo/'+ arrayTasks[i]._id
                    });
                    arrayTasks.splice(i, 1);
                }
            }

            recount();
        });

        //редагування елементу
        li.find('.edit').click(function (event) {
            event.stopPropagation();
            popup.css('display', 'block');
            liEdit = $(event.target).parent().find('.text');
            inputEdit.val(liEdit.text());
            //зберегти редагування елементу
            $('#save').click(function (event) {
                for (var i = 0; i < arrayTasks.length; i++) {
                    if (liEdit.text() == arrayTasks[i].value) {
                        liEdit.text(inputEdit.val());
                        arrayTasks[i].value = inputEdit.val();
                    }
                    $.ajax({
                        contentType: 'application/json',
                        data: JSON.stringify({"todo": arrayTasks[i]}),
                        dataType: 'json',
                        processData: false,
                        type: 'PUT',
                        url: '/api/v1/todo/'+ arrayTasks[i]._id
                    });
                }
                popup.css('display', 'none');
            });
            //вихід без збереження редагування
            $('#cancel').click(function () {
                popup.css('display', 'none');
            })
        });

        ul.append(li);
    }

    function recount() {
        var totalCount = $('li').length;
        var doneCount = $('li.done').length;
        var count = totalCount - doneCount;
        $('#items-count').html(count + ' items to do');// + doneCount + ' items done');
    }

});
