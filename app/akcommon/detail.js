$(function () {
    loadDetailData(GetQueryString('index'));

    //获取url中的参数
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    //详情页加载
    function loadDetailData(index) {
        index = Number(index);
        var data = JSON.parse(window.localStorage.getItem('am_news'));
        var _thisData = data[index];
        var main = $('.met-shownews-body');
        //标题
        main.find('.ak-title').html(_thisData.Title);
        //时间
        main.find('.ak-date').html(new Date(_thisData.Created).toLocaleDateString());
        //创建者
        main.find('.ak-createby').html(_thisData.CreatedBy);
        //浏览数量
        main.find('.ak-looknum').html(_thisData.VisitCount);
        //正文
        main.find('.ak-content').html(_thisData.Content);

        $.each(_thisData.ContentCover, function (index, item) {
            var htmlText = '<div class="content_cover"><img src="../' + item + '"/></div>';
            main.find('.content_covers').append($(htmlText));
        });

        main.find('.ak-prev').off('click');
        main.find('.ak-next').off('click');
        //上一页
        if (index != 0) {
            var prevData = data[index - 1];
            //上一页title
            main.find('.ak-prev').attr('title', prevData.Title).removeClass('disabled');
            main.find('.ak-prev span').html(': ' + prevData.Title);
            //添加点击事件
            main.find('.ak-prev').on('click', function () {
                window.location.href = './information_detail.html?index=' + (index - 1);
            })
        } else {
            main.find('.ak-prev').attr('title', '没有了').addClass('disabled');
            main.find('.ak-prev span').html(': ' + '没有了');
        }
        //下一页
        if (index < data.length - 1) {
            var nextData = data[index + 1];
            //下一页的title
            main.find('.ak-next').attr('title', nextData.Title).removeClass('disabled');
            main.find('.ak-next span').html(': ' + nextData.Title);
            //添加点击事件
            main.find('.ak-next').on('click', function () {
                window.location.href = './information_detail.html?index=' + (index + 1);
            })
        } else {
            main.find('.ak-next').attr('title', '没有了').addClass('disabled');
            main.find('.ak-next span').html(': ' + '没有了');
        }
    }
})