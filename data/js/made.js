var converter = null;
var md_file = null;
function update() {
    var source = $.trim($('#input').val());
    if (source.lenght != 0) {
        var html = converter.makeHtml(source);
        $('#preview').html(html);
    }
    setTimeout(update, 1000);
}
function onresize() {
    var view_h = $(this).height(); 
    var view_w = $(this).width(); 
    $('#container').height(view_h - $('#bar').height() - 5);
    $('#container').children('.pane').width(parseInt(view_w/2)-10);
}
function getCursorPos() {
    var pos = 0;
    var box = $('#input').get(0);
    $('#input').focus();
    if (document.selection) {
    // IE
        var sel = document.selection.createRange();
        sel.moveStart('character', - box.value.length);
        pos = sel.text.length;
    } else if (box.selectionStart || box.selectionStart == '0') {
    // others
        pos = box.selectionStart;
    }
    return pos;
}

function change_theme(theme) {
    if (theme == 'dark') {
        $('#input').addClass('dark');
    } else {
        $('#input').removeClass('dark');
    }
}

$(document).ready(function () {
    $(window).resize(function (event) {
        onresize();
    });
    $('#input').keydown(function (ev) {
        if (ev.keyCode == 9) {
            var text = $(this).val();
            var curPos = getCursorPos();
            $(this).val(text.substring(0, curPos)
                + '    '
                + text.substring(curPos));
            $('#input').get(0).selectionStart = curPos+4;
            $('#input').get(0).selectionEnd = curPos+4;
            return false;
        } else if (ev.keyCode == 8) {
            var text = $(this).val();
            var curPos = getCursorPos();
            var preText = text.substring(curPos - 4, curPos);
            if (preText == '    ') {
                $(this).val(text.substring(0, curPos - 4)
                    + text.substring(curPos));
                $('#input').get(0).selectionStart = curPos-4;
                $('#input').get(0).selectionEnd = curPos-4;
                return false;
            } 
        }
    });

    $('body').bind('dragover', function () {
        return false;    
    }).bind('dragend', function () {
        return false;
    }).bind('drop', function (ev) {
        md_file = ev.originalEvent.dataTransfer.files[0]; 
        var reader = new FileReader();
        console.log(md_file);
        reader.onload = function (e) {
            console.log(e);
            $('#input').val(e.target.result);
        }
        reader.readAsText(md_file);
        return false;
    });

    $('#color_scheme > a').click(function () {
        $('#color_scheme > a').removeClass('selected');
        $(this).addClass('selected');
        change_theme($(this).attr('href'));
        return false;
    })
    converter = new Markdown.Converter();
    update();
    onresize();
    change_theme('dark')
    setTimeout(onresize, 10);
});
