function guideGnbSet(_this, n1, n2){
    $(_this).find('.g-gnb .g-gnb-btn').eq(n1).addClass('is-selected');
}
function guideGnbOpen(wrap, menu){
    $(wrap).addClass('is-active');
    $(menu).addClass('is-visible').siblings().removeClass('is-visible');
}
