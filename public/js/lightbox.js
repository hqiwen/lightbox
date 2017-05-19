; (function ($) {
    const LightBox = function (setting) {
        const self = this;

        $.extend(this.setting);

        this.popupMask = $('<div id="G-lightbox-mask">');
        this.popupWin = $('<div id="G-lightbox-popup">')

        // 保存body
        this.bodyNode = $(document.body);

        // 渲染剩余的DOM并插入到body
        this.renderDOM();

        //获取结构
        this.picViewArea = this.popupWin.find('div.lightbox-pic-view');
        this.popupPic = this.popupWin.find('img.lightbox-image');
        this.popupCaption = this.popupWin.find('div.lightbox-pic-caption');
        this.nextBtn = this.popupWin.find('span.light-next-btn');
        this.prevBtn = this.popupWin.find('span.light-prev-btn');
        this.captionText = this.popupWin.find('p.lightbox-pic-desc');
        this.currentIndex = this.popupWin.find('span.lightbox-of-index');
        this.closeBtn = this.popupWin.find('span.lightbox-close-btn');

        this.groupName = null;
        this.groupData = [];

        //图片监听
        this.bodyNode.on('click', '.js-lightbox', function (e) {

            e.stopPropagation();

            const currentGroupName = $(this).attr('data-group');

            if (currentGroupName != self.groupName) {
                self.groupName = currentGroupName;
                self.getGroup();
            }

            self.initPopup($(this))
        })

        this.popupMask.click(function () {
            $(this).fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
        })

        this.closeBtn.click(function () {
            self.popupMask.fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
        });

        this.nextBtn.hover(function () {
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
                $(this).addClass('light-next-btn-show');
            }
        }, function () {
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
                $(this).removeClass('light-next-btn-show');
            }
        }).click(function (e) {
            if (!$(this).hasClass('disabled')) {
                self.goto('next')
            }
        })


        this.prevBtn.hover(function () {
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
                $(this).addClass('light-prev-btn-show');
            }
        }, function () {
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
                $(this).removeClass('light-prev-btn-show');
            }
        }).click(function (e) {
            if (!$(this).hasClass('disabled')) {
                self.goto('prev')
            }
        })

        let timer = null;
        this.clear = false;

        $(window).resize(function () {
            if (self.clear) {

                window.clearTimeout(timer);

                timer = window.setTimeout(function () {
                    self.loadPicSize(self.groupData[self.index].src);
                }, 500)

            }
        }).keydown(function (e) {

            let keyValue = e.which;

            if (self.clear) {

                if (keyValue === 37 || keyValue === 38) {
                    self.prevBtn.click();
                } else if (keyValue === 39 || keyValue === 40) {
                    self.nextBtn.click();
                }

            }


        })

    }
    LightBox.prototype = {

        goto: function (dir) {
            if (dir === 'next') {

                this.index++;
                if (this.index >= this.groupData.length - 1) {
                    this.nextBtn.addClass('disabled').removeClass('light-next-btn-show')
                };
                if (this.index != 0) {
                    this.prevBtn.removeClass('disabled')
                }

                const src = this.groupData[this.index].src;
                this.loadPicSize(src);

            } else if (dir === 'prev') {

                this.index--;
                if (this.index <= 0) {
                    this.prevBtn.addClass('disabled').removeClass('light-prev-btn-show')
                };
                if (this.index != this.groupData.length - 1) {
                    this.nextBtn.removeClass('disabled')
                }

                const src = this.groupData[this.index].src;
                this.loadPicSize(src);

            }
        },

        loadPicSize: function (sourceSrc) {
            const self = this;
            self.popupPic.css({
                width: 'auto',
                height: 'auto',
            }).hide();
            this.popupCaption.hide();

            this.preLoadImg(sourceSrc, function callback() {

                self.popupPic.attr('src', sourceSrc)

                const picWidth = self.popupPic.width();
                const picHeight = self.popupPic.height();

                self.changePic(picWidth, picHeight);

            })
        },

        changePic: function (width, height) {
            const winWidth = $(window).width();
            const winHeight = $(window).height();
            const self = this;

            //图片溢出,规模处理
            const scale = Math.min(winWidth / (width + 10), winHeight / (height + 10), 1);

            width = width * scale;
            height = height * scale;

            this.picViewArea.animate({
                width: width - 10,
                height: height - 10,
            });
            this.popupWin.animate({
                width: width,
                height: height,
                marginLeft: -(width / 2),
                marginTop: -(height / 2),
            }, function () {
                self.popupPic.css({
                    width: width - 10,
                    height: height - 10,
                }).fadeIn();

                self.popupCaption.fadeIn();

            })
            this.clear = true;

            this.captionText.text(this.groupData[this.index].caption);
            this.currentIndex.text("当前索引:" + (this.index + 1) + " of " + this.groupData.length)
        },

        preLoadImg: function (src, callback) {
            const img = new Image();
            img.src = src;
            img.onload = function () {
                callback();
            }
        },

        showMaskAndPopup: function (sourceSrc, currentId) {
            const self = this;

            this.popupPic.hide();
            this.popupCaption.hide();

            this.popupMask.fadeIn();

            const winWidth = $(window).width();
            const winHeight = $(window).height();

            this.picViewArea.css({
                width: winWidth / 2,
                height: winHeight / 2,
            })

            this.popupWin.fadeIn();

            const viewHeight = winHeight / 2 + 10;

            this.popupWin.css({
                width: winWidth / 2 + 10,
                height: winHeight / 2 + 10,
                marginLeft: -(winWidth / 2 + 10) / 2,
                marginTop: -(winHeight / 2 + 10) / 2,
            }).animate({
                Top: winHeight / 2
            }, function () {
                self.loadPicSize(sourceSrc);
            })


            this.index = this.getIndexOf(currentId);

            const groupDataLength = this.groupData.length;

            if (groupDataLength > 1) {

                if (this.index === 0) {
                    this.nextBtn.removeClass('disabled');
                    this.prevBtn.addClass('disabled');
                } else if (this.index === groupDataLength - 1) {
                    this.nextBtn.addClass('disabled');
                    this.prevBtn.removeClass('disabled');
                } else {
                    this.nextBtn.removeClass('disabled')
                    this.prevBtn.removeClass('disabled')
                }

            }
        },

        getIndexOf: function (currentId) {
            let index = 0;

            $(this.groupData).each(function (i) {
                index = i;
                if (this.id === currentId) {
                    return false;
                }
            })

            return index;
        },

        initPopup: function (currentObj) {
            const self = this,
                sourceSrc = currentObj.attr('data-source'),
                currentId = currentObj.attr('data-id');

            this.showMaskAndPopup(sourceSrc, currentId);
        },

        getGroup: function () {
            const self = this;
            const groupList = this.bodyNode.find("[data-group =" + this.groupName + "]")

            self.groupData.length = 0;

            groupList.each(function () {
                self.groupData.push({
                    src: $(this).attr('data-source'),
                    id: $(this).attr('data-id'),
                    caption: $(this).attr('data-caption')
                })
            })
        },

        renderDOM: function () {
            const strDom = `<div class="lightbox-pic-view">
                                <span class="lightbox-btn light-prev-btn"></span> <img src="./images/2-2.jpg" class="lightbox-image">
                                <span class="lightbox-btn light-next-btn"></span>
                            </div>
                            <div class="lightbox-pic-caption">
                                <div class="lightbox-caption-area">
                                    <p class="lightbox-pic-desc"></p>
                                    <span class="lightbox-of-index">当前索引: </span>
                                </div>
                                <span class="lightbox-close-btn"></span>
                            </div>`

            this.popupWin.html(strDom);
            this.bodyNode.append(this.popupMask, this.popupWin)
        }

    }

    window.LightBox = LightBox;
})(jQuery)