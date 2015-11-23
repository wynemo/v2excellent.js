var comments = [];
function fillComments(jqDom){
    jqDom.find('div[id^="r_"]').each(function(i,o){
        comments[parseInt($(o).find('span.no').text())] = {user: $(o).find('strong>a').text(),content: $(o).find('div.reply_content').text()};
    });
}

function findPreComments(user,current_no){
    var preComments = []
    for(var i=current_no;i>0;i--){
        var cc = comments[i];
        if(cc.user === user){
            preComments.push(cc);
        }
    }
    return preComments;
}
//Get comments from current page
fillComments($('body'));

//Get other pages comments
$('div.inner>a[href^="/t/"].page_normal').each(function(i,o){
    $.get(o.href,function(result){
        var resultDom = $('<output>').append($.parseHTML(result));
        fillComments(resultDom);
    });
});

//build reply_stack
var reply_stack = $(document.createElement('reply_stack')).on('mouseenter click touchend',function(e){
    if($(e.currentTarget).hasClass('shown')){
        return;
    }
    //get who is @ed
    $(e.currentTarget).parent().find('a[href^="/member"]').not('.dark').each(function(i,o){
        //get comments of @ed user
        var currentNo = parseInt($(o).parent().parent().find('span.no').text());
        var preComments = findPreComments(o.innerHTML, currentNo);
        $(e.currentTarget).addClass('shown');
        if(preComments.length>0){
            //show'em
            $(e.currentTarget).append(preComments[0].user + ': ' +
                                      preComments[0].content + '<hr>');
        }
    });
});

//add reply stack styles
$('body').append('<style>reply_stack:before{content: "^";font-size: 9px;line-height: 9px;font-weight: 500;border-radius: 10px;display: inline-block;background-color: #f0f0f0;color: #ccc;padding: 2px 5px 2px 5px;float: right;width: 10px;text-align: center;}reply_stack{display:none;}reply_stack.shown{display: block !important;background: #000;border-radius: 3px;padding: 5px 5px 5px 14px;color: #E2E2E2;}reply_stack.shown:before {display: none;}reply_stack>hr:last-child{display:none;}</style>');

$('div[id^="r_"]').on('mouseenter click touchend',function(e){
    $(e.currentTarget).find('reply_stack').show();
});
$('div[id^="r_"]').mouseleave(function(e){
    var rs = $(e.currentTarget).find('reply_stack');
    if(!rs.hasClass('shown')){
        rs.hide();
    }
});
$('div.reply_content:has(a[href^="/member/"])').append(reply_stack);
