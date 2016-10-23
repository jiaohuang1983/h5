var system = {
    /**
     *public
     */
    loop: true, //�Ƿ�ѭ���л�ҳ��
    isSound: false, //�Ƿ�����˱�������(����[false:û�б�������,true:�б�������]);
    duration: .35, //�л�ҳ�涯������ĳ���ʱ��
    minScale: 0.5, //ҳ���л�����С����ֵ
    changeRatio: 0.4, //��һҳ�뵱ǰҳ���ƶ�����
    longRatio: 0.1, //����ҳ���л��ı���
    pageW: $(window).width(), //ҳ���
    fastChange: true, //�Ƿ��������л�ҳ��
    /**
     *private
     */
    index: null, //������ҳ
    currentPage: 0, //��ǰҳ
    prePage: 0, //��ǰҳ����һҳ
    nextPage: 0, //��ǰҳ����һҳ
    firstVisited: false, //��һ���������(���ܣ����������ɿ���ѭ���л�ҳ�棬ǰ����loop��������Ϊtrue)
    ty: 0, //�˲�����û����
    touch: true, //�Ƿ������������л�ҳ��
    touchStatus: false, //�Ƿ������϶�
    touchObj: null, //��ǰ��������
    direction: null, //��������
    initY: 0, //ҳ�滬���ı�ǰ�ĳ�ʼY����
    ease: '', //�л�ҳ��Ļ�������(ease-in-out ease-in ease-out...)
    soundStatus: false, //�����Ƿ񲥷�(����[false:��ͣ,true:����]);
    isInfoPage: true, //�����ж��û��Ƿ��ڲ鿴����ҳ,���Ϊtrue,����ͣ�����л�ҳ��.����ʼ�����л�ҳ��
    H: $(window).height() //���ڸ߶�
}
$('.guideTop').hide();
var hasTouch = 'ontouchstart' in window,
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    END_EV = hasTouch ? 'touchend' : 'mouseup';
var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
var touchstart = mobile ? "touchstart" : "mousedown";
var touchend = mobile ? "touchend" : "mouseup";
var touchmove = mobile ? "touchmove" : "mousemove";
//��ʼ��ֹ��Ļ�Ļ����¼�
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
     * ��̨����Ӧ
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
     * ����ҳ����
     * @return {[type]} [description]
     */
    infoAnimation: function() {
        var $info = $('.info');
        common.setCss3($info, 'scale(1)', 'all 2s ease-out', { 'opacity': 1 });
        common.setCss3($('#logo'), '', 'all 3s ease-out', { 'opacity': 1 });
        common.addFirstPageEvent();
    },
    /**
     * ��ӽ����һ��ҳ��ĵ���¼�
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
     * �����һҳ
     * @return {[type]} [description]
     */
    disFirstPage: function() {
        common.outInfoPage();
    },
    /**
     * ��������ҳ
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
     * �˳�����ҳ
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
                     * ���ɴ����¼�
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
    //��ǰ��ҳ�Ƿ���΢�������
    is_weixin: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") return true;
        else return false;
    },
    /**
     * ���ɴ����¼�
     * @type {Hammer}
     */
    createEvent: function() {
        system.index = $('.page').size();
        common.setPageIndex();

        var hammer = new Hammer(document.getElementById("main"));
        /**
         * ��ʼ�϶�
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
                 * ���ػ�ӭҳ
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
             * �϶���
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
             * �϶�����
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
                //�л�ҳ��
                var $hide = $('#main .page').eq(system.currentPage);
                common.setCss3(activeObj, 'translate(0,' + (endY) + 'px)', 'all ' + d + 's');
                //�л��ɹ�
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
     * ��תҳ��
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

        //�л�ҳ��
        common.setCss3(activeObj, 'translate(0,' + (initY) + 'px)', 'none');
        window.setTimeout(function() {
                common.setCss3(activeObj, 'translate(0,' + (endY) + 'px)', 'all ' + d + 's');
            }, 30)
            //�л��ɹ�
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
     * ��һҳ
     *
     * */
    gotoNextPage: function() {
        this.gotoPage(system.nextPage);
    },
    /**
     * touchEnd ҳ���л����
     * @return {[type]} [description]
     */
    pageChangeEnd: function() {
        var n = system.currentPage;
        var cPage = $('.page').eq(n);
        common.pageEffects();
    },
    /**
     * �����ƶ�
     * @param  {[type]} Y [����]
     */
    pageTouchMoving: function(Y) {
        var cNum = system.currentPage,
            S = 1 - (Math.abs(Y) / system.H) * (1 - system.minScale),
            Y = Y * system.changeRatio;
        common.setCss3($('.page').eq(cNum), 'translate(0px, ' + Y + 'px) scale(' + S + ')', 'none');
    },
    /**
     * ��ҳ�������Ч
     * @return {[type]} [description]
     */
    pageEffects: function() {
        var cNum = system.currentPage,
            pageCon = $(".page").eq(cNum).find('.pageContent'),
            effect = pageCon.attr('data-effect'), //ҳ����Ч
            dir = pageCon.attr('data-dir'); //����
        dur = 2;
        $('.guideTop').show();
        isMove = true;
        if (dir == 'true') pageCon.attr('data-dir', 'false');
        else pageCon.attr('data-dir', 'true');
        switch (effect) {
            case 'h': //�����ƶ�
                var maxMoveX = pageCon.width() - 640; //����ƶ�ֵ
                dur = maxMoveX / 60 < 2 ? 2 : maxMoveX / 60;
                if (maxMoveX > 50) {
                    if (dir == 'true') common.setCss3(pageCon, 'translate(' + (-maxMoveX) + 'px,0px)', 'all ' + dur + 's');
                    else common.setCss3(pageCon, 'translate(0,0px)', 'all ' + dur + 's');
                }
                break;
            case 'v': //�����ƶ�
                var maxMoveY = pageCon.height() - pageCon.parent().height(); //����ƶ�ֵ
                dur = maxMoveY / 60 < 2 ? 2 : maxMoveY / 60;
                if (dir == 'true') common.setCss3(pageCon, 'translate(0px,' + (-maxMoveY) + 'px)', 'all ' + dur + 's');
                else common.setCss3(pageCon, 'translate(0,0px)', 'all ' + dur + 's');
                break;
            case 'scale': //����Ч��
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
     * ҳ���˳�
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
     * �����л�ҳ�������ֵ
     */
    setPageIndex: function() {
        var CP = system.currentPage;
        system.nextPage = CP + 1;
        system.prePage = CP - 1;
        if (system.prePage < 0) system.prePage = system.index - 1;
        if (system.nextPage >= system.index) system.nextPage = 0;
    },
    /**
     * ����CSS3
     * @param {[type]} obj    [Ҫ�����Ķ���]
     * @param {[type]} f      [transform]
     * @param {[type]} t      [transition]
     * @param {[type]} attach [���������Զ���]
     */
    setCss3: function(obj, f, t, attach) {
        obj.css({ 'transform': f, 'transition': t, '-webkit-transform': f, '-webkit-transition': t })
        if (attach) obj.css(attach);
    }
}
handleOverallComplete();

function handleOverallComplete(event) {
    /**
     * ��ʼ��
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
