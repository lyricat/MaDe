var converter = null;
var md_file = null;
function update() {
    var source = $.trim(editor.getSession().getValue());
    if (source.lenght != 0) {
        var html = converter.makeHtml(source);
        $('#preview').html(html);
    }
    setTimeout(update, 1000);
}
function onresize() {
    var view_h = $(this).height(); 
    var view_w = $(this).width(); 
    $('#container').height(view_h - $('#bar').height() - 1);
    $('#container').children('.pane')
        .height(view_h - $('#bar').height - 5);
    $('#input').width(parseInt(view_w/2)+10)
    $('#preview_pane').width(parseInt(view_w/2)-20);
}
function change_theme(theme) {
    if (theme == 'dark') {
        $('.ace_scroller, .ace_sb, .ace_editor').addClass('dark');
        editor.setTheme("ace/theme/twilight");
    } else {
        $('.ace_scroller, .ace_sb, .ace_editor').removeClass('dark');
        editor.setTheme("ace/theme/textmate");
    }
}
var editor = null;
$(document).ready(function () {
    $(window).resize(function (event) {
        onresize();
    });
    editor = ace.edit("input");
    editor.getSession().setValue("the new text here");
    editor.getSession().setTabSize(4);
    editor.getSession().setUseSoftTabs(true);
    document.getElementById('input').style.fontSize='14px';    
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(true);    
    var mode = require("ace/mode/markdown").Mode;
    editor.getSession().setMode(new mode());

    $('body').bind('dragover', function () {
        return false;    
    }).bind('dragend', function () {
        return false;
    }).bind('drop', function (ev) {
        md_file = ev.originalEvent.dataTransfer.files[0]; 
        var reader = new FileReader();
        reader.onload = function (e) {
            editor.getSession().setValue(e.target.result);
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
    setTimeout(function () {change_theme('dark')}, 10)
    setTimeout(onresize, 10);
});
