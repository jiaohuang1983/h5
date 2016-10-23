var system = {
    /**
     *public
     */
    loop: true, //是否循环切换页面
    isSound: false, //是否添加了背景音乐(参数[false:没有背景音乐,true:有背景音乐]);
    duration: .35, //切换页面动画补间的持续时间
    minScale: 0.5, //页面切换的最小缩放值
    changeRatio: 0.4, //下一页与当前页的移动比率
    longRatio: 0.1, //触发页面切换的比率
    pageW: $(window).width(), //页面宽
    fastChange: true, //是否开启快速切换页面
    /**
     *private
     */
    index: null, //共多少页
    currentPage: 0, //当前页
    prePage: 0, //当前页的上一页
    nextPage: 0, //当前页的下一页
    firstVisited: false, //第一次浏览结束(功能：浏览结束后可开启循环切换页面，前提是loop参数必须为true)
    ty: 0, //此参数暂没作用
    touch: true, //是否开启触摸滑动切换页面
    touchStatus: false, //是否正在拖动
    touchObj: null, //当前触摸对象
    direction: null, //触摸方向
    initY: 0, //页面滑动改变前的初始Y坐标
    ease: '', //切换页面的缓动函数(ease-in-out ease-in ease-out...)
    soundStatus: false, //音乐是否播放(参数[false:暂停,true:播放]);
    isInfoPage: true, //用来判断用户是否在查看引导页,如果为true,则暂停触摸切换页面.否则开始触摸切换页面
    H: $(window).height() //窗口高度
}
$('.guideTop').hide();
var hasTouch = 'ontouchstart' in window,
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    END_EV = hasTouch ? 'touchend' : 'mouseup';
var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
var touchstart = mobile ? "touchstart" : "mousedown";
var touchend = mobile ? "touchend" : "mouseup";
var touchmove = mobile ? "touchmove" : "mousemove";
//开始禁止屏幕的滑动事件
window.addEventListener('touchmove', banTouchScroll, false);

function banTouchScroll(e) { e.preventDefault();
    return false; };
var isMove = false;

function resizeHandler() {
    system.H = $(window).height();
}
window.addEventListener('resize', function() {
    resizeHandler();
});
var init = function() {
    /**
     * 舞台自适应
     * @return {[type]} [description]
     */
    common.infoAnimation();
    resizeHandler();
    window.setTimeout(function() {
        $('.guideTop').show();
    }, 1500)
}
var common = {
    /**
     * 引导页动画
     * @return {[type]} [description]
     */
    infoAnimation: function() {
        var $info = $('.info');
        common.setCss3($info, 'scale(1)', 'all 2s ease-out', { 'opacity': 1 });
        common.setCss3($('#logo'), '', 'all 3s ease-out', { 'opacity': 1 });
        common.addFirstPageEvent();
    },
    /**
     * 添加进入第一个页面的点击事件
     * @return {[type]} [description]
     */
    addFirstPageEvent: function() {
        var hasTouch = 'ontouchstart' in window,
            START_EV = hasTouch ? 'touchstart' : 'mousedown';
        common.gotoPage(0);
        system.isInfoPage = false;
        common.createEvent();
    },
    /**
     * 进入第一页
     * @return {[type]} [description]
     */
    disFirstPage: function() {
        common.outInfoPage();
    },
    /**
     * 进入引导页
     */
    inInfoPage: function() {
        $('.page2 .pageContent img').removeAttr("style");
        var $info = $('.info');
        var $firstPage = $('.page').eq(0);
        $firstPage.addClass('show');
        $info.addClass('show').removeClass('hide');
        common.setCss3($firstPage, 'perspective(1000px) translate3d(0,' + 0 + 'px,0px) rotateX(0deg) scale3d(1,1,1)', 'none', { '-webkit-backface-visibility': 'hidden', 'backface-visibility': 'hidden', 'zIndex': 2 });
        setTimeout(function() {
            common.setCss3($info, 'perspective(1000px) translate3d(0,0px,0px) rotateX(0deg) scale3d(1,1,1)', 'all 0.7s ease-in-out', { '-webkit-backface-visibility': 'hidden', 'backface-visibility': 'hidden', 'zIndex': 10 });
            common.setCss3($firstPage, 'perspective(1000px) translate3d(0,' + (system.H / 2 + 50) + 'px,' + (-120) + 'px) rotateX(-90deg) scale3d(0.8,0.8,0.5)', 'all 0.7s ease-in-out');
        }, 30);
        window.setTimeout(function() {
            $firstPage.addClass('hide').removeClass('show');
            common.addFirstPageEvent();
        }, 700)
        system.isInfoPage = true;
    },
    /**
     * 退出引导页
     */
    outInfoPage: function(e) {
        var $info = $('.info');
        var $firstPage = $('.page').eq(0);
        common.setCss3($firstPage, 'perspective(1000px) translate3d(0,' + (system.H / 2 + 50) + 'px,' + (-150) + 'px) rotateX(-90deg) scale3d(0.5,0.5,0.5)', 'none', { '-webkit-backface-visibility': 'hidden', 'backface-visibility': 'hidden' });
        $firstPage.addClass('show').removeClass('hide');
        setTimeout(function() {
            common.setCss3($info, 'perspective(1000px) translate3d(0,' + (-system.H / 2) + 'px,' + (-0) + 'px) rotateX(90deg) scale3d(0.51,0.51,0.51)', 'all 0.7s ease-in-out', { '-webkit-backface-visibility': 'hidden', 'backface-visibility': 'hidden', 'zIndex': 0 });
            common.setCss3($firstPage, 'perspective(1000px) translate3d(0,' + 0 + 'px,0px) rotateX(0deg) scale3d(1,1,1)', 'all 0.7s ease-in-out');
            setTimeout(function() {
                common.setCss3($('.page2 .pageContent img'), 'translateY(0px)', 'all 0.5s ease-in-out', { 'opacity': 1 });
                if (!system.index) {
                    /**
                     * 生成触摸事件
                     * @type {Hammer}
                     */
                    //$info.remove();
                    $info.addClass('hide');
                    $('#main').removeClass('perspective');
                    common.createEvent();
                }
                $firstPage.attr('style', '').removeClass('firstPage');
                system.isInfoPage = false;
            }, 700);

        }, 30);
    },
    //当前网页是否在微信中浏览
    is_weixin: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") return true;
        else return false;
    },
    /**
     * 生成触摸事件
     * @type {Hammer}
     */
    createEvent: function() {
        system.index = $('.page').size();
        common.setPageIndex();

        var hammer = new Hammer(document.getElementById("main"));
        /**
         * 开始拖动
         */
        hammer.on('dragstart', function(e) {
                if (!isMove) {
                    return;
                }
                if (!e.gesture || system.isInfoPage || !system.touch) return;
                var Y = e.gesture.deltaY,
                    direction = e.gesture.direction,
                    index;
                /**
                 * 返回欢迎页
                 */
                if ((direction != 'up') && (system.currentPage == 0)) {
                    return
                };
                if (system.loop && !system.firstVisited && direction == 'down' && system.currentPage == 0) return;
                if (!system.loop) {
                    if (system.currentPage == 0 && direction == 'down') return;
                    if (system.currentPage == (system.index - 1) && direction == 'up') return;
                }
                system.touchStatus = true;
                index = (direction == 'up') ? system.nextPage : system.prePage;
                system.touchObj = $('.page').eq(index);
                if (direction == 'up') {
                    system.touchObj.addClass('active');
                    common.setCss3(system.touchObj, 'translate(0,' + (system.H) + 'px)', 'none');
                    system.initY = system.H;
                    system.direction = 'up';
                    system.fastChange = true;
                } else if (direction == 'down') {
                    system.touchObj.addClass('active');
                    common.setCss3(system.touchObj, 'translate(0,' + (-system.H) + 'px)', 'none');
                    system.initY = -system.H;
                    system.direction = 'down';
                    system.fastChange = false;
                } else {
                    system.touchStatus = false;
                }
            })
            /**
             * 拖动中
             */
        hammer.on('drag', function(e) {
                if (!system.touchStatus || !system.touch) return;
                var gesture = e.gesture,
                    Y = gesture.deltaY;

                switch (system.direction) {
                    case 'up':
                        common.setCss3(system.touchObj, 'translate(0,' + (system.H + Y) + 'px)', 'none');
                        break;

                    case 'down':
                        common.setCss3(system.touchObj, 'translate(0,' + (-(system.H - Y)) + 'px)', 'none');
                        break;
                }
                common.pageTouchMoving(Y);
            })
            /**
             * 拖动结束
             */
        hammer.on('dragend', function(e) {
            if (!system.touchStatus || !system.touch) return;
            system.touchStatus = false;
            if (!system.fastChange) system.touch = false;
            var Y = e.gesture.deltaY,
                ratioH = system.H * system.longRatio,
                dTime = e.gesture.deltaTime;
            var endY = 0,
                d = system.duration;
            var activeObj = system.touchObj;
            if (Math.abs(Y) > ratioH || dTime < 350) {
                //切换页面
                var $hide = $('#main .page').eq(system.currentPage);
                common.setCss3(activeObj, 'translate(0,' + (endY) + 'px)', 'all ' + d + 's');
                //切换成功
                window.setTimeout(function() {
                    $hide.addClass('hide').removeClass('show');
                    activeObj.addClass('show').removeClass('hide active');
                    if (!system.fastChange) system.touch = true;
                    common.pageChangeEnd();
                }, d * 1000)
                common.pageOutStyle(system.currentPage, true, 0.5);
                var index = (system.direction == 'up') ? system.nextPage : system.prePage;
                var cIndex = $('.page').eq(index).index('.page');
                if ((system.prePage == system.index - 2) && (system.currentPage == system.index - 1)) {
                    system.firstVisited = true;
                }
                system.currentPage = cIndex;
                common.setPageIndex();
            } else {
                endY = system.initY;
                common.setCss3(activeObj, 'translate(0,' + (endY) + 'px)', 'all ' + d / 2 + 's');
                window.setTimeout(function() {
                    common.setCss3(activeObj, 'none', 'none');
                    activeObj.removeClass('active');
                }, d * 1000)
                var cNum = system.currentPage;
                common.pageOutStyle(cNum, false, 0.3);
            }
        })
    },
    /**
     * 跳转页面
     * @return {[type]} [description]
     */
    gotoPage: function(pageIndex) {
        system.touchObj = $('.page').eq(pageIndex);
        var initY, endY = 0,
            d = system.duration,
            activeObj = system.touchObj;
        var $hide = $('#main .page').eq(system.currentPage);
        if (pageIndex > system.currentPage) {
            system.direction = 'up';
            initY = system.H;
        } else {
            system.direction = 'down';
            initY = -system.H;
        }
        activeObj.addClass('active');
        system.touchStatus = false;

        //切换页面
        common.setCss3(activeObj, 'translate(0,' + (initY) + 'px)', 'none');
        window.setTimeout(function() {
                common.setCss3(activeObj, 'translate(0,' + (endY) + 'px)', 'all ' + d + 's');
            }, 30)
            //切换成功
        window.setTimeout(function() {
            $hide.addClass('hide').removeClass('show');
            activeObj.addClass('show').removeClass('hide active');
            if (!system.fastChange) system.touch = true;
            common.pageChangeEnd();
        }, d * 1000)
        common.pageOutStyle(system.currentPage, true, 0.5);
        system.currentPage = pageIndex;
        if ((system.prePage == system.index - 2) && (system.currentPage == system.index - 1)) {
            system.firstVisited = true;
        }
        common.setPageIndex();
    },
    /*
     * 下一页
     *
     * */
    gotoNextPage: function() {
        this.gotoPage(system.nextPage);
    },
    /**
     * touchEnd 页面切换完成
     * @return {[type]} [description]
     */
    pageChangeEnd: function() {
        var n = system.currentPage;
        var cPage = $('.page').eq(n);
        common.pageEffects();
    },
    /**
     * 触摸移动
     * @param  {[type]} Y [坐标]
     */
    pageTouchMoving: function(Y) {
        var cNum = system.currentPage,
            S = 1 - (Math.abs(Y) / system.H) * (1 - system.minScale),
            Y = Y * system.changeRatio;
        common.setCss3($('.page').eq(cNum), 'translate(0px, ' + Y + 'px) scale(' + S + ')', 'none');
    },
    /**
     * 单页面里的特效
     * @return {[type]} [description]
     */
    pageEffects: function() {
        var cNum = system.currentPage,
            pageCon = $(".page").eq(cNum).find('.pageContent'),
            effect = pageCon.attr('data-effect'), //页面特效
            dir = pageCon.attr('data-dir'); //方向
        dur = 2;
        $('.guideTop').show();
        isMove = true;
        if (dir == 'true') pageCon.attr('data-dir', 'false');
        else pageCon.attr('data-dir', 'true');
        switch (effect) {
            case 'h': //横向移动
                var maxMoveX = pageCon.width() - 640; //最大移动值
                dur = maxMoveX / 60 < 2 ? 2 : maxMoveX / 60;
                if (maxMoveX > 50) {
                    if (dir == 'true') common.setCss3(pageCon, 'translate(' + (-maxMoveX) + 'px,0px)', 'all ' + dur + 's');
                    else common.setCss3(pageCon, 'translate(0,0px)', 'all ' + dur + 's');
                }
                break;
            case 'v': //纵向移动
                var maxMoveY = pageCon.height() - pageCon.parent().height(); //最大移动值
                dur = maxMoveY / 60 < 2 ? 2 : maxMoveY / 60;
                if (dir == 'true') common.setCss3(pageCon, 'translate(0px,' + (-maxMoveY) + 'px)', 'all ' + dur + 's');
                else common.setCss3(pageCon, 'translate(0,0px)', 'all ' + dur + 's');
                break;
            case 'scale': //缩放效果
                if (dir == 'true') common.setCss3(pageCon, 'scale(0.85,0.85)', 'all 3s');
                else common.setCss3(pageCon, 'scale(1,1)', 'all ' + dur + 's');
                break;
            default:
        }
    },
    pageGo: function() {
        isMove = true;
        $('.guideTop').show();
    },
    /**
     * 页面退出
     * @return {[type]} [description]
     */
    pageOutStyle: function(n, adEd, dur) {
        //return;
        var pNum = system.prePage,
            cNum = system.currentPage,
            nextNum = system.nextPage;
        var dur = dur ? dur : 0;
        var cPage = $('.page').eq(n);
        cPage.css({ '-webkit-transform': 'none', 'transform': 'none' });
        if (adEd) {
            var TY = system.H * system.changeRatio;
            if (system.direction == 'up') TY = -TY;
            common.setCss3(cPage, 'translate(0px, ' + TY + 'px) scale(' + system.minScale + ')', 'all ' + dur + 's ease-in-out');
        } else {
            var tra = 'none';
            if (dur != 0) tra = 'all ' + dur + 's';
            common.setCss3(cPage, 'none', tra);
        }
    },
    /**
     * 设置切换页面的索引值
     */
    setPageIndex: function() {
        var CP = system.currentPage;
        system.nextPage = CP + 1;
        system.prePage = CP - 1;
        if (system.prePage < 0) system.prePage = system.index - 1;
        if (system.nextPage >= system.index) system.nextPage = 0;
    },
    /**
     * 设置CSS3
     * @param {[type]} obj    [要操作的对象]
     * @param {[type]} f      [transform]
     * @param {[type]} t      [transition]
     * @param {[type]} attach [其它的属性对象]
     */
    setCss3: function(obj, f, t, attach) {
        obj.css({ 'transform': f, 'transition': t, '-webkit-transform': f, '-webkit-transition': t })
        if (attach) obj.css(attach);
    }
}
handleOverallComplete();

function handleOverallComplete(event) {
    /**
     * 初始化
     */
    $('.main').show();
    $('.page').addClass('hide');
    $("#main").show();
    window.setTimeout(function() {
        init();
        $('.guideTop').bind("click", function() {
            common.gotoNextPage();
        });
    }, 100);
}
