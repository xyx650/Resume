/*--阻止浏览器默认行为--*/
$(document).on('touchstart touchmove', function (e) {
    e.preventDefault();
});


/*--loading--*/
let loadingRender = (function ($) {
    let $loadingBox = $('.loadingBox'),
        $progress = $loadingBox.find('.progress'),
        $progressing = $loadingBox.find('.progressing'),
        $fail = $loadingBox.find('.fail'),
        $receiving = $('.receiving');
    let dataList = [];

    //获取数据
    $.ajax({
        url: './img/result.txt',
        dataType: 'json',
        async: false,
        success: function (data) {
            data.forEach((item) => {
                dataList.push(item);
            });

        }
    });

    // let dataList = ["img/fail.GIF","img/loadingBg.jpg","img/loadingMotto.png","img/loadingName.png","img/phoneBg.jpg","img/phoneBgMess.png","img/phoneBg_C.png","img/phoneBg_lt.png","img/phoneBg_Rt.png","img/phoneIcon.jpg"];

    let total = dataList.length;
    let loaded = 0;

    // console.log(dataList);
    //读取数据，预先获得图片宽高
    let getDataInfo = (function () {
        let dataObj = dataList.map(function (item) {
            let tempImg = new Image();
            let obj = {};
            tempImg.src = item;
            tempImg._name = item.slice(4);
            tempImg.onload = function () {
                obj._name = tempImg._name;
                obj._width = tempImg.width;
                obj._height = tempImg.height;
                loaded++;
                // console.log(tempImg.src);
                // console.log(tempImg.name);
                // tempImg = null;
                progressing();
                return obj;
            }
            tempImg.onerror = function (ev) {

                let dalay = setTimeout(function () {
                    $receiving.remove();
                    $fail.css('display', 'block');
                    $fail.children('p').html('加载资源' + tempImg._name + '失败，点击重新加载...');
                    $fail.on('tap', () => {
                        location.reload();
                    });
                    tempImg = null;
                    clearTimeout(dalay);
                }, 5000)
                // tempImg = null;
            }
            return obj;
        })
        // console.log(dataObj);
        return dataObj;
    })();

    //进度条
    let progressing = function () {
        // console.log(loaded);
        // console.log(total);
        // console.log(loaded / total);
        $progressing.css('width', loaded / total * 100 + '%');
        if (loaded >= total) {
            let delayTimer = setTimeout(() => {
                let $resumeName = $('.resumeName'),
                    $resumeMotto = $('.resumeMotto'),
                    $received = $('.received');
                $progress.remove();
                $receiving.remove();
                $fail.remove();
                $resumeName.css('display', 'block');
                $resumeMotto.css('display', 'block');
                $received.css('display', 'block').on({
                    tap: () => {
                        $loadingBox.remove();
                        phoneRender.init();
                    },
                    webkitAnimationEnd: () => {
                        $received.removeClass("animation1");
                        $received.addClass("animation2");
                    }
                });
                clearTimeout(delayTimer);
            }, 2300);
        }
    };

    //文字：下载中动画效果
    let i = 0;
    let loadingText = function () {
        $receiving.html('下载简历中.');
        let textAnimate = setInterval(function () {
            i++;
            switch (i % 4) {
                case 0:
                    $receiving.html('下载简历中.');
                    break;
                case 1:
                    $receiving.html('下载简历中..');
                    break;
                case 2:
                    $receiving.html('下载简历中...');
                    break;
                case 3:
                    $receiving.html('下载简历中....');
            }
            if (i >= 10) {
                clearInterval(textAnimate);
                return;
            }
        }, 800);

    };


    return {
        init: function () {
            $loadingBox.css('display', 'block');
            // progress();
            loadingText();

            // return objData;
        },
        getDataInfo: getDataInfo
    }
})(Zepto);


/*--phoneRender--*/
let phoneRender = (function ($) {

    let $phoneBox = $('.phoneBox'),
        $phoneIcon = $phoneBox.find('.phoneIcon');

    //获取时间
    let $topTime = $phoneBox.find('.topTime');
    let getNow = function () {
        let now = new Date(),
            hour = now.getHours(),
            minute = now.getMinutes();
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        $topTime.html(`${hour}:${minute}`);
    };
    getNow();
    setInterval(getNow, 5000);

    let audioBell = $('#audioBell')[0];

    //滑动打开简历按钮事件
    let startX = 0,
        changeX = 0,
        maxChangeX = parseFloat(document.documentElement.style.fontSize) * 3.8;

    let touchBegin = function (e) {
        //=>this:phoneIcon
        let point = e.changedTouches[0];
        startX = point.clientX;
    };

    let touching = function (e) {
        let point = e.changedTouches[0],
            $this = $(this);
        changeX = point.clientX - startX;
        changeX = changeX < 0 ? 0 : (changeX > maxChangeX ? maxChangeX : changeX);
        $this.css('transform', `translateX(${changeX}px)`);
    };

    let touchEnd = function (e) {
        let point = e.changedTouches[0],
            $this = $(this);
        if (changeX > maxChangeX * 0.7) {
            // 进入下一阶段
            $this.css('transform', `translateX(${maxChangeX}px)`);
            audioBell.pause();
            $phoneBox.remove();
            cubeRender.init();
            return;
        }
        changeX = 0;
        $this.css('transform', `translateX(${changeX}px)`);
    };

    return {
        init: function () {
            audioBell.play();
            $phoneBox.css('display', 'block');
            //=>事件绑定实现相关效果
            $phoneIcon.on({
                touchstart: touchBegin,
                touchmove: touching,
                touchend: touchEnd
            });

        }
    }
})(Zepto);


/*--cubeRender--*/
let cubeRender = (function ($) {
    let $cubeBox = $('.cubeBox'),
        $box = $('.cubeBox .box');

    let strX = 0,
        strY = 0,
        changeX = 0,
        changeY = 0,
        rotateX = 0,
        rotateY = 0;

    let touchBegin = function (e) {
        let point = e.changedTouches[0];
        strX = point.clientX;
        strY = point.clientY;
    };

    let touching = function (e) {
        let point = e.changedTouches[0];
        changeX = point.clientX - strX;
        changeY = point.clientY - strY;

        rotateX = parseFloat($(this).attr('rotateX'));
        rotateY = parseFloat($(this).attr('rotateY'));

        rotateX = rotateX - changeY / 3;
        rotateY = rotateY + changeX / 3;

        $(this).css(`transform`, `scale(.75) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    let touchEnd = function (e) {
        $(this).attr({
            rotateX: rotateX,
            rotateY: rotateY
        });
    };


    return {
        init: function () {
            $cubeBox.css('display', 'block');

            //=>事件绑定实现相关效果
            $box.attr({
                rotateX: -30,
                rotateY: 40
            }).on({
                touchstart: touchBegin,
                touchmove: touching,
                touchend: touchEnd
            });

            //=>每一个页面的点击操作
            $box.find('li').tap(function () {
                $cubeBox.css('display', 'none');
                let index = $(this).index();
                detailRender.init(index);
            });
        }
    }
})(Zepto);


/*--detailRender--*/
let detailRender = (function ($) {
    let $cubeBox = $('.cubeBox'),
        $detailBox = $('.detailBox'),
        $returnIcon = $detailBox.find('.returnIcon'),
        $skillBox = $('.skillBox'),
        $imgList = $skillBox.find('img'),
        swiperH = null,
        swiperV = null;

    // swipervertical = null;
    // console.log($imgList);
    let $makisuBox = $('#makisuBox');


    //message
    let $messageBox = $('.messageBox'),
        $talkBox = $messageBox.find('.talkBox'),
        $talkList = $talkBox.find('li'),
        $keyBord = $messageBox.find('.keyBord'),
        $keyBordText = $keyBord.find('span'),
        $submit = $keyBord.find('.submit');


    let step = -1,
        autoTimer = null,
        textTimer = null,
        offset = 0,
        n = -1;
    // let ratio = document.documentElement.clientWidth / document.documentElement.clientHeight;
    // console.log(ratio);
    // if (ratio < 0.47){
    //     offset=document.documentElement.clientHeight/20;
    // }

    let deadLine = document.documentElement.clientHeight - $keyBord[0].offsetHeight;
    let messageUp = function () {

        clearInterval(autoTimer);
        autoTimer = setInterval(() => {

            step++;
            let $cur = $talkList.eq(step);
            $cur.css({
                opacity: 1,
                transform: 'translateY(0)'
            });

            let keybordFn = () => {
                $keyBord.css('transform', 'translateY(0)').one('transitionend', textMove);
            };

            // console.log(document.documentElement.clientHeight);
            // console.log($keyBord.offset().height);
            // console.log('autotimer:', autoTimer);
            // console.log('$talkList.length'+$talkList.length);
            console.log($cur.offset().top + $cur.offset().height);
            console.log('deadline:' + deadLine);

            if ($cur.offset().top + $cur.offset().height > deadLine / 1.2) {
                offset += -$cur.offset().height;
                $talkBox.css(`transform`, `translateY(${offset * 1.33}px)`);
            }
            if (step === 8) {
                $cur.one('transitionend', keybordFn);
                clearInterval(autoTimer);
                // return;
            } else {
                $cur.off('transitionend', keybordFn);


                // if (step > 3) {
                //     offset += -$cur[0].offsetHeight;
                //     $talkBox.css(`transform`, `translateY(${offset}px)`);
                // }
                if (step >= $talkList.length - 1) {
                    clearInterval(autoTimer);
                    // return;
                }
            }

            // console.log(document.documentElement.clientHeight);
            // console.log($cur[0].offsetHeight);
            // console.log(offset);
            // console.log('step:', step);
            // console.log('第' + step + '个li:', $talkList.eq(step));

        }, 2000);
    };

    let messageClear = function () {
        clearInterval(autoTimer);

        step = -1;
        offset = 0;
        $talkBox.css({
            transform: 'translateY(0)',
        });
        $talkList.css({
            transition: 0,
            opacity: 0,
            transform: 'translateY(1.5rem)',
        });
        $keyBordText.css('display', 'none');
        $submit.css('display', 'none');
        $keyBord.css('transform', 'translateY(3.7rem)');
    }

//=>控制文字及其打印机效果
    let textMove = function () {
        let text = $keyBordText.html();

        $keyBordText.css('display', 'block').html('');
        // let textTimer = null;

        textTimer = setInterval(() => {
            if (n >= text.length) {

                $keyBordText.html(text);
                $submit.css('display', 'block').tap(() => {
                    $keyBordText.css('display', 'none');
                    $keyBord.css('transform', 'translateY(3.7rem)');
                    messageUp();
                });
                clearInterval(textTimer);
                return;
            }
            n++;
            $keyBordText[0].innerHTML += text.charAt(n);
        }, 133);
    };

    return {
        init: function (index = 0) {
            $detailBox.css('display', 'block');


            let change = function (obj) {

                let {slides: slideArr, activeIndex} = obj;

                //=>page1单独处理
                if (activeIndex == 0) {
                    $makisuBox.makisu({
                        selector: 'dd',
                        overlap: 0.6,
                        speed: 0.8
                    });
                    $makisuBox.makisu('open');
                } else {
                    $makisuBox.makisu({
                        selector: 'dd',
                        overlap: 0,
                        speed: 0
                    });
                    $makisuBox.makisu('close');
                }
                //page2
                if (activeIndex == 1) {
                    step = -1;
                    n = -1;
                    messageUp();

                } else {
                    messageClear();
                }

                if (activeIndex !== 2) {
                    $imgList.removeAttr('style');
                }

                //=>给当前活动块设置id动画,其它块移除id
                [].forEach.call(slideArr, (item, index) => {
                    if (index === activeIndex) {
                        item.id = 'page' + (activeIndex + 1);
                        return;
                    }
                    item.id = null;
                });
            };

            // console.log(step);
            if (!swiperH) {

                swiperH = new Swiper('.swiper-container-h', {
                    effect: 'coverflow',
                    on: {
                        init: function () {
                            change(this);
                        },
                        transitionEnd: function () {
                            change(this);
                        }
                    }
                });


                swiperV = new Swiper('.swiper-container-v', {
                    direction: 'vertical',
                    // watchSlidesProgress: true,
                    // loop:true,
                    effect: 'flip'

                });

                $returnIcon.tap(() => {
                    $detailBox.css('display', 'none');
                    $cubeBox.css('display', 'block');


                    //移除page1 introduction
                    messageClear();

                    //移除page2 skillbox
                    $imgList.removeAttr('style');
                    // clearInterval(autoTimer);
                    change(swiperH);


                });

                $imgList.on('webkitAnimationEnd', function () {
                    $(this).attr('style', '-webkit-animation: roundIn1 2s linear infinite both;opacity:1');
                });



            }
            // console.log(swiperH);
            swiperH.slideTo(index, 0);


        }
    }

})(Zepto);

// loadingRender.init();
cubeRender.init();
// console.log(loadingRender.getDataInfo);
