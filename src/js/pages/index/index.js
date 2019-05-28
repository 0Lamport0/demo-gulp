const IScroll = require("../../common/iscroll.js");

function Page(){
    FastClick.attach(document.body);
    this.catListElem = $(".js-navList");
    this.detListElem = $(".js-contentList");
    // console.log(this.catListElem);
    // console.log(this.detListElem);
};

$.extend(Page.prototype,{
    init : function(){
        this.getNavData();
        this.getDetailsData();
        // 创建分类滚动
        this.createCategoryScroller();
        // 创建商品滚动
        this.creataProductScroller();
    },
    getNavData : function(){
        $.ajax({
            url : "../json/index.json",
            success : $.proxy(this.handleGetNavDataSucc,this),
            error : $.proxy(this.handleGetNavDataErr,this)
        })
    },
    getDetailsData : function(){
        $.ajax({
            url : "../json/index.json",
            success : $.proxy(this.handleGetDetailsDataSucc,this),
            error : $.proxy(this.handleGetDetailsDataErr,this)
        })
    },
    handleGetNavDataSucc : function(res){
        // console.log(res);
        let str = "";
        for( let i = 0; i < res.navData.categories.length; i ++ ){
            // console.log(res.navData.categories[i]);
            str += "<li class='nav-item iconfont'>" + res.navData.categories[i].icon + "</li>";
        }
        // console.log(str);
        this.catListElem.html(str);
        if( this.categoryScroll ){
            this.categoryScroll.refresh();
        }
    },
    handleGetDetailsDataSucc : function(res){
        // console.log(res);
        let str = "";
        for( let i = 0; i < res.detailsData.commodities.length; i ++ ){
            // console.log(res.detailsData.commodities[i]);
            str += "<li class='content-item'><img src='" + res.detailsData.commodities[i].url + "' alt='' title='' /><dl><dt>" + res.detailsData.commodities[i].title + "</dt><dd>" + res.detailsData.commodities[i].oldPrice + "</dd></dl></li>";
        }
        // console.log(str);
        this.detListElem.html(str);
        if( this.productScroll ){
            this.productScroll.refresh();
        }
    },
    handleGetNavDataErr : function(){
        console.log("getNavData is error");
    },
    handleGetDetailsDataErr : function(){
        console.log("getDetailsData is error");
    },
    createCategoryScroller : function(){
        this.categoryScroll = new IScroll(".nav",{
            scrollX : true,
            scrollY : false
        });
    },
    creataProductScroller : function(){
        this.productScroll = new IScroll(".content",{
            probeType : 3
        });
        // 添加监听事件，实现下拉刷新上拉加载
        this.productScroll.on("scroll",function(){
            // console.log("实现下拉刷新上拉加载");
        });
    }
});
var page = new Page();
page.init();