const ia = [
	{
		cateTitle: 'Sample',
		cateItems: [
			{
				state: 'base',
				url: '#',
				menu: 'Depth2 > Depth3 > Content (Cases)',
				memos: [
					{user: '홍길동', date: '2023-11-20', desc: '최초 완료'},
					{user: '이순신', date: '2023-11-23', desc: '완료버튼 클래스 수정'}
				],
			},
			{
				state: 'done',
				url: '#',
				menu: 'Depth2 > Depth3 > Content (Empty)',
				memos: [
					{user: '홍길동', date: '2023-11-20', desc: '최초 완료'}
				],
			},
			{
				state: 'hold',
				url: '#',
				menu: 'Depth2 > Depth3 > Content (입력전)',
				memos: [
					{user: '홍길동', date: '2023-11-20', desc: '업무범위 제외됨'},
				],
			},
			{
				state: 'issue',
				url: '#',
				menu: 'Depth2 > Depth3 > Content (입력후)',
				memos: [
					{user: '홍길동', date: '2023-11-20', desc: '디자인 검토 필요'},
				],
			},
		]
	},
	{
		cateTitle: 'Category',
		cateItems: [
			{
				state: 'base',
				url: '#',
				menu: 'Depth2 > Depth3 > Content (Cases)',
				memos: [
					{user: '작업자', date: 'YYYY-MM-DD', desc: ''}, // 최초 완료시 - desc: '최초 완료'
				],
			},
		]
	},
]

let ia_html = '';
// 카테고리별
for (let i = 0; i < ia.length; i++){
	ia_html = ia_html + ''
	+'<div class="g-h2-head">'
	+'	<h2 class="g-h2">'+ ia[i].cateTitle +'</h2>'
	+'	<button type="button" class="btn g-sec-toggle" onclick="guideSecToggle(this)">'
	+'		<span class="material-symbols-outlined">expand_circle_down</span>'
	+'	</button>'
	+'</div>'
	+'<div class="g-h2-body">'
	+'	<ul class="g-ia-list">';
	// 카테고리 목록
	for (let j = 0; j < ia[i].cateItems.length; j++){
		ia_html = ia_html + ''
		+'		<li class="g-ia-item is-'+ia[i].cateItems[j].state+'">'
		+'			<a class="g-ia-primary" href="'+ia[i].cateItems[j].url+'">'
		+'				<div class="g-ia-num">0</div>'
		+'				<div class="g-ia-menu">'
		+'					<p>'+ ia[i].cateItems[j].menu +'</p>'
		+'				</div>'
		+'				<div class="g-ia-user" title="최근 작업자">'
		// 작업내역 목록 - 작업자
		for (let k = 0; k < ia[i].cateItems[j].memos.length; k++){
			ia_html = ia_html + ''
			+'					<p>'+ia[i].cateItems[j].memos[k].user+'</p>'
		}
		ia_html = ia_html + ''
		+'				</div>'
		+'				<div class="g-ia-date" title="최근 날짜">'
		// 작업내역 목록 - 날짜
		for (let l = 0; l < ia[i].cateItems[j].memos.length; l++){
			ia_html = ia_html + ''
			+'					<p>'+ia[i].cateItems[j].memos[l].date+'</p>'
		}
		ia_html = ia_html + ''
		+'				</div>'
		+'			</a>'
		+'			<div class="g-ia-support">'
		// 작업내역 목록 - 비고설명
		for (let m = 0; m < ia[i].cateItems[j].memos.length; m++){
			ia_html = ia_html + ''
			+'				<div class="g-ia-history">'
			+'					<p class="name">'+ia[i].cateItems[j].memos[m].user+'</p>'
			+'					<p class="memo">'+ia[i].cateItems[j].memos[m].date+' '+ia[i].cateItems[j].memos[m].desc+'</p>'
			+'				</div>'
		}
		ia_html = ia_html + ''
		+'			</div>'
		+'			<button type="button" class="btn g-ia-toggle" onclick="guideIAToggle(this)">'
		+'				<span class="material-symbols-outlined">expand_more</span>'
		+'			</button>'
		+'		</li>'
	}
	ia_html = ia_html + ''
	+'		<!-- //Sample -->'
	+'	</ul>'
	+'</div>';
}
