function guideGnbSet(_this, n1, n2){
    $(_this).find('.g-menu .g-menu-btn').eq(n1).addClass('is-selected');
}
function guideGnbOpen(wrap, menu, _this){
    $(wrap).addClass('is-active');
    $(menu).addClass('is-visible').siblings().removeClass('is-visible');
	$(_this).addClass('is-selected').siblings().removeClass('is-selected');
}
function guideGnbClose(wrap){
    $(wrap).removeClass('is-active');
}
