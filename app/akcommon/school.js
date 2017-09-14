/*
<li class="">
    <div class="media media-lg li-img">
    <div class="media-left">
    <a href="../news/jingzi.html" title="做孩子永远的镜子" target="_self">
    <img class="media-object" src="../upload/201611/thumb.jpg" alt="做孩子永远的镜子">
    </a>
    </div>
    <div class="media-body">
    <h4 class="media-heading">
    <a href="../news/jingzi.html" title="做孩子永远的镜子" target="_self">
    做孩子永远的镜子
    </a>
    </h4>
    <p class="des">
    中班活动区“小医院”，“小护士”筱筱忙得不亦乐乎，但是“小护士”却把“药品”弄得东倒西歪。我发现后多次提醒她要把药品摆整齐，不知什么原因摆放药品的地方还是乱七八糟，我该怎么办呢?或许我可以换个方法试试。于是，我戴着“护士牌”来到药品柜，开始整理柜子上的药品，大...</p>
<p class="info">
    <span>2016-11-24</span>
    <span class="margin-left-10">admin</span>
    <span class="margin-left-10"><i class="icon wb-eye margin-right-5"
aria-hidden="true"></i>12</span>
    </p>
    </div>
    </div>
    </li>
*/

$(function () {
    const pageEnum={
        InformationPage:1,
        DetailPage:2
    }
    catPage(pageEnum.InformationPage);
    function catPage(type) {
        switch (type){
            case pageEnum.InformationPage:{
                $('.met-news-body').css('display','block');
                $('.met-shownews-body').css('display','none');
            }break;
            case pageEnum.DetailPage:{
                $('.met-news-body').css('display','none');
                $('.met-shownews-body').css('display','block');
            }break;
        }
    }
    function getList() {
        //http://famliytree.cn/api/news/items?index=0&pageSize=6
        $.get('../app/akcommon/data.json',{},function(result){
            if(result.ArrayOfam_news)
            {
                window.localStorage.setItem('am_news',JSON.stringify(result.ArrayOfam_news.am_news));
                $.each(result.ArrayOfam_news.am_news,function (index,item) {
                    var htmlText='<li data-id="'+item.ID+'"><div class="media media-lg li-img"> <div class="media-left">'+
                        '<a class="school-img school-link" href="#" title="'+item.Title+'" target="_self">'+
                        '<img class="media-object" src="../upload/201611/thumb.jpg" alt="'+item.Title+'"/>'+
                        '</a></div><div class="media-body"><h4 class="media-heading">'+
                        '<a class="school-link" href="#" title="'+item.Title+'" target="_self">'+item.Title+
                        '</a></h4><p class="des">'+item.Content.substr(0,100)+'...</p><p class="info">'+
                        '<span>'+new Date(item.Created).getDate()+'</span>'+
                        '<span class="margin-left-10">'+item.CreatedBy+'</span><span class="margin-left-10"><i class="icon wb-eye margin-right-5"aria-hidden="true">'+
                        '</i>item.VisitCount</span></p></div></div></li>';
                    var messageHtml=$(htmlText);
                    $('#messageContent').append(messageHtml);
                })
                $('.school-link').on('click',function () {
                    var id= $(this).parents('li').attr('data-id');
                    var data= JSON.parse(window.localStorage.getItem('am_news'));
                    var _thisData= data.filter(function (item) {
                        return item.ID==id;
                    })[0];
                    var main=$('.met-shownews-body');
                    //标题
                    main.find('.ak-title').html(_thisData.Title);
                    catPage(pageEnum.DetailPage)
                })
            }
        });
    }
    getList();

})