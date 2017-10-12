$(function () {
    const pageEnum={
        InformationPage:1,
        DetailPage:2
    }
    const contentEnum={
        All:0,
        School:1,
        News:2
    }
    catPage(pageEnum.InformationPage);
    function catPage(type) {
        switch (type){
            case pageEnum.InformationPage:{
                $('.met-news-body').css('display','block');
                $('.met-shownews-body').css('display','none');
                $('section.animsition').addClass('met-news').removeClass('met-shownews');
            }break;
            case pageEnum.DetailPage:{
                $('.met-news-body').css('display','none');
                $('.met-shownews-body').css('display','block');
                $('section.animsition').addClass('met-shownews').removeClass('met-news');
            }break;
        }
    }
    function getList() {
        //http://famliytree.cn/api/news/items?index=0&pageSize=6
        //../app/akcommon/data.json
        $.get('../app/akcommon/data.json',{},function(result){
            if(result)
            {
                window.localStorage.setItem('am_news',JSON.stringify(result));
                var type= GetQueryString('type')?Number(GetQueryString('type')):contentEnum.All;
                pageSelect(type);
            }
        });
    }
    //全部 学校资讯 教育新闻
    function catContent(type){
        var result= JSON.parse(window.localStorage.getItem('am_news'));
        $('#messageContent').find('li').remove();
        $.each(result,function (index,item) {
            if(item.Type==type||Number(type)==contentEnum.All) {
                var htmlText = '<li data-id="' + item.ID + '"><div class="media media-lg li-img"> <div class="media-left">' +
                    '<a class="school-img school-link" href="#" title="' + item.Title + '" target="_self">' +
                    '<img class="media-object" src="../upload/201611/thumb.jpg" alt="' + item.Title + '"/>' +
                    '</a></div><div class="media-body"><h4 class="media-heading">' +
                    '<a class="school-link" href="#" title="' + item.Title + '" target="_self">' + item.Title +
                    '</a></h4><p class="des">' + item.Content.substr(0, 100) + '...</p><p class="info">' +
                    '<span>' + new Date(item.Created).toLocaleDateString() + '</span>' +
                    '<span class="margin-left-10">' + item.CreatedBy + '</span><span class="margin-left-10"><i class="icon wb-eye margin-right-5"aria-hidden="true">' +
                    '</i>'+item.VisitCount+'</span></p></div></div></li>';
                var messageHtml = $(htmlText);
                $('#messageContent').append(messageHtml);
            }
        })
        $('.school-link').on('click',function () {
            var id= $(this).parents('li').attr('data-id');
            var data= JSON.parse(window.localStorage.getItem('am_news'));
            var index;
            var _thisData= data.filter(function (item,i) {
                if(item.ID==id)index=i;
                return item.ID==id;
            })[0];
            loadDetailData(index);
        });
    }
    //详情页加载
    function loadDetailData(index) {
        window.location.href='./information_detail.html?index='+index;
    }
    //切换title
    function pageSelect(type) {
        //母版页中的选中替换
        if(type==contentEnum.School)$('.school-title').find('a').addClass('active');
        if(type==contentEnum.News)$('.news-title').find('a').addClass('active');
        //删除选中样式
        $('.met-column-nav-ul li,.met-news-bar .column li').parents('ul').find('a.active').removeClass('active');
        //添加选中样式
        $('.met-column-nav-ul li[data-type="'+type+'"],.met-news-bar .column li[data-type="'+type+'"]').find('a').addClass('active');
        catContent(type);
    }
    getList();
    //获取url中的参数
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
})