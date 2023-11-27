function guideGnbSet(_this, n1, n2){
    let subMenu = $(_this).find('.g-menu .g-menu-btn').eq(n1).data('menu');
    $(_this).find('.g-menu .g-menu-btn').eq(n1).addClass('is-selected');
    $(subMenu).find('.g-menu-btn').eq(n2).addClass('is-selected');
}
function guideGnbOpen(wrap, menu, _this){
    $(wrap).addClass('is-active');
    $(menu).addClass('is-visible').siblings().removeClass('is-visible');
	$(_this).addClass('is-selected').siblings().removeClass('is-selected');
}
function guideGnbClose(wrap){
    $(wrap).removeClass('is-active');
}
function guideSecToggle(_this){
	$(_this).toggleClass('is-hide').parent().next().toggle();
}
function guideIAToggle(_this){
	$(_this).toggleClass('is-active').prev().toggle();
}

var gUI = {
	init : function(){
		if ($('.g-tab-codeview').length){
			this.tabCodeview.init();
		}
		if ($('.g-example-wrap').length){
			this.example.init();
		}
	},
	tabCodeview : {
		tabNav : '.g-tab',
		tabLink : '.g-tab-codeview .g-tab-nav a',
		target : null,

		init : function(){
			if ($(this.tabNav).length > 0){
				this.event();
			}
		},
		event : function(){
			//현재페이지의 탭 활성화
			$(this.tabLink).on('click', function(){
				gUI.tabCodeview.action($(this));return false;
			});
		},
		action : function($this){
			this.target = $this.attr('href');
			if ($this.parent().is('.is-active')){
				$this.parent().removeClass('is-active');
				$(this.target).removeClass('is-active');
			} else {
				$this.parent().addClass('is-active').siblings().removeClass('is-active');
				$(this.target).addClass('is-active').siblings().removeClass('is-active');
			}
		}
	},
    example : {
        moduleEl : '.g-example-wrap',
        btnEl : '.g-example-btn',
        contentEl : '.g-example-footer',
        target : null,

        init : function(){
            this.event();
        },
        event : function(){
            var _this = this;
            //현재페이지의 탭 활성화
            $(this.btnEl).on('click', function(){
                var obj = $(this).closest(_this.moduleEl);
                var idx = $(this).parent().find(_this.btnEl).index($(this));
                gUI.example.action(obj, idx); return false;
            });
        },
        action : function($module, $index){
            var $this = $module.find($(this.btnEl)).eq($index);
            this.target = $module.find($(this.contentEl)).eq($index);
            if ($this.is('.is-active')){
                $this.removeClass('is-active');
                $(this.target).removeClass('is-active');
            } else {
                $this.addClass('is-active').siblings().removeClass('is-active');
                $(this.target).addClass('is-active').siblings().removeClass('is-active');
            }
        }
    },
}
$(document).ready(function(){
	gUI.init();
})