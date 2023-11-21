/**
 * @layout checkDevice
**/
function checkDevice() {
	if(navigator.userAgent.match(/Mobile/)) {
		document.querySelector('html').classList.remove('laptop');
		document.querySelector('html').classList.add('mobile');
	} else {
		document.querySelector('html').classList.remove('mobile');
		document.querySelector('html').classList.add('laptop');
	}
}
checkDevice();

/**
 * @layout checkScrollStart
**/

function scrollStart() {
	buiGoToTop(0);
	window.scrollY > 0 ? document.querySelector('html').classList.add('active-scroll-start') : document.querySelector('html').classList.remove('active-scroll-start');
	window.addEventListener('scroll', function() {
		window.scrollY > 0 ? document.querySelector('html').classList.add('active-scroll-start') : document.querySelector('html').classList.remove('active-scroll-start');
	});
}
scrollStart();


function buiGoToTop(offset) {
	let elem = document.querySelector('.widget-toolbar .goto-top .navi-text');
	if(!elem) return false;

	elem.addEventListener('click', function(e) {
		e.preventDefault();

		window.scroll({
			top: offset,
			behavior: "smooth"
		});
	});
}


/**
 * @module form buiFormCancelAction
**/
function buiFormCancelAction(buiFormUtil, buiFormCancel) {
	var xStart = buiFormUtil.offsetLeft + buiFormCancel.offsetLeft;
	var yStart = buiFormUtil.offsetTop + buiFormCancel.offsetTop;
	var xEnd = xStart + buiFormCancel.offsetWidth;
	var yEnd = yStart + buiFormCancel.offsetHeight;
	
	if (event.target.parentElement.classList.contains('typed')) {
		if (event.offsetX >= xStart && event.offsetX <= xEnd && event.offsetY >= yStart && event.offsetY <= yEnd) {
			event.target.value = '';	
			event.target.classList.remove('typed');
			event.target.style.removeProperty('cursor');
		}
	}
}

/**
 * @module form buiFormCheckValue
**/
function buiFormCheckValue(formElem) {
	formElem.value.length > 0 ? formElem.parentElement.classList.add('typed') : formElem.parentElement.classList.remove('typed');
}

/**
 * @module form buiFormCheckValue
**/
function buiFormFunc(elem) {
	const buiFormElem = elem;
	const buiForm = elem.parentElement	
	let buiFormUtil = buiForm.querySelector('.form-func');

	if (!buiFormUtil) {
		const createFormUtil = document.createElement('span');
		createFormUtil.className = "form-func";
		buiForm.appendChild(createFormUtil);
		buiFormUtil = createFormUtil;
	}

	let buiFormCancel = buiForm.querySelector('.form-cancel');
	
	if (buiFormElem.dataset.buiFormCancel != undefined) {
		if (!buiFormCancel) {
			const createFormCancel = document.createElement('span');
			createFormCancel.className = "form-cancel";
			buiFormUtil.insertBefore(createFormCancel, buiFormUtil.children[0]);
			buiFormCancel = createFormCancel;
		}
	}

	buiFormCheckValue(buiFormElem);
	
	if (buiFormUtil != null) buiFormElem.style.setProperty('padding-right', buiFormUtil.offsetWidth + 'rem');

	elem.addEventListener('input', function() {
		buiFormCheckValue(buiFormElem);
		if (buiFormElem.dataset.buiFormCancel != undefined) buiFormCancelAction(buiFormUtil, buiFormCancel);

		if (buiFormUtil != null) buiFormElem.style.setProperty('padding-right', buiFormUtil.offsetWidth + 'rem');
	}, false);

	elem.addEventListener('mouseout', function() {
		buiFormCheckValue(buiFormElem);
		if (buiFormElem.dataset.buiFormCancel != undefined) buiFormCancelAction(buiFormUtil, buiFormCancel);

		if (buiFormUtil != null) buiFormElem.style.setProperty('padding-right', buiFormUtil.offsetWidth + 'rem');
	}, false);

	elem.addEventListener('focusout', function() {
		buiFormCheckValue(buiFormElem);
		if (buiFormElem.dataset.buiFormCancel != undefined) buiFormCancelAction(buiFormUtil, buiFormCancel);

		if (buiFormUtil != null) buiFormElem.style.setProperty('padding-right', buiFormUtil.offsetWidth + 'rem');
	}, false);

	elem.addEventListener('click', function() {
		if (buiFormElem.dataset.buiFormCancel != undefined) buiFormCancelAction(buiFormUtil, buiFormCancel);
	}, false);
}


/**
 * @module form buiFormCancel
**/
function buiFormCancel(formElem) {
	if (formElem.readOnly) return;

	// check value
	buiFormCheckValue(formElem);
	formElem.addEventListener('input', function(e) {
		buiFormCheckValue(formElem);
	});

	// form util
	var formUtil = formElem.parentElement.querySelector('.form-func');
	if(!formUtil) {
		formUtil = document.createElement('span');
		formUtil.classList.add('form-func');
		formElem.parentElement.appendChild(formUtil);
	}

	// form cancel
	var formCancel = formElem.parentElement.querySelector('.form-cancel');
	if(!formCancel) {
		formCancel = document.createElement('span');
		formCancel.classList.add('form-cancel');
		formUtil.prepend(formCancel);
	}

	formElem.style.paddingRight = formUtil.offsetWidth + 'rem';

	var xStart = formUtil.offsetLeft + formCancel.offsetLeft;
	var yStart = formUtil.offsetTop + formCancel.offsetTop;
	var xEnd = xStart + formCancel.offsetWidth;
	var yEnd = yStart + formCancel.offsetHeight;

	formElem.addEventListener('mousemove', function(e) {
		if (formElem.classList.contains('typed')) {
			if (e.offsetX >= xStart && e.offsetX <= xEnd && e.offsetY >= yStart && e.offsetY <= yEnd) {
				formElem.style.setProperty('cursor', 'default');
			} else {
				formElem.style.removeProperty('cursor');
			}
		}
	});

	formElem.addEventListener('click', function(e) {
		if (formElem.classList.contains('typed')) {
			if (e.offsetX >= xStart && e.offsetX <= xEnd && e.offsetY >= yStart && e.offsetY <= yEnd) {
				formElem.value = '';
				formElem.classList.remove('typed');
				formElem.style.removeProperty('cursor');
			}
		}
	});
}

const buiFormfileAdd = function(formElem) {
	formElem.parentElement.dataset.buiFormFileName = formElem.files[0].name;
	formElem.parentElement.dataset.buiFormFileType = formElem.files[0].type;
	formElem.parentElement.style.setProperty('--background-image', 'url(' + URL.createObjectURL(formElem.files[0]) + ')');
}

/**
 * @layout globalNavigation
**/
 const globalNavigation = function() {
	var lnbLists = document.querySelectorAll('#pageNavigation .lnb-list');
	if (!lnbLists) return;

	Array.prototype.forEach.call(lnbLists, function(lnbList) {
		const gnbItem = lnbList.parentElement;
		const gnbName = gnbItem.querySelector('.gnb-name');
		const expandButton = document.createElement('button');
		const expandButtonActiveText = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><title>접기</title><path d="M12 7.3175L17.555 13.428C17.8336 13.7344 17.811 14.2088 17.5045 14.4874C17.198 14.766 16.7237 14.7435 16.4451 14.437L12 9.54742L7.55496 14.437C7.27633 14.7435 6.80199 14.766 6.4955 14.4874C6.18901 14.2088 6.16642 13.7344 6.44505 13.428L12 7.3175Z"/></svg>';
		const expandButtonInactiveText = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><title>펼치기</title><path d="M12 16.6825L6.44504 10.572C6.16641 10.2656 6.189 9.79121 6.49549 9.51258C6.80198 9.23395 7.27632 9.25654 7.55495 9.56304L12 14.4526L16.445 9.56304C16.7237 9.25654 17.198 9.23396 17.5045 9.51259C17.811 9.79122 17.8336 10.2656 17.555 10.572L12 16.6825Z"/></svg>';
		
		// expandButton.type = 'button';
		// expandButton.className = 'btn expand';
		// gnbItem.insertBefore(expandButton, gnbName);
		
		if (gnbItem.classList.contains('active')) {
			expandButton.innerHTML = expandButtonActiveText;
		} else {
			expandButton.innerHTML = expandButtonInactiveText;
		}

		expandButton.addEventListener('click', function() {
			const activeItem = this.parentElement;
			const siblings = getSiblings(activeItem);		

			if (activeItem.classList.contains('active')) {
				activeItem.classList.remove('active');
				activeItem.querySelector('.btn.expand').innerHTML = expandButtonInactiveText;
			} else {
				activeItem.classList.add('active');
				activeItem.querySelector('.btn.expand').innerHTML = expandButtonActiveText;
			}
			
			Array.prototype.forEach.call(siblings, function(siblingItem) {
				siblingItem.classList.remove('active');
				siblingItem.querySelector('.btn.expand').innerHTML = expandButtonInactiveText;
			});
		});
	});
}
globalNavigation();

/**
 * @layout localNavigation
**/
const localNavigation = function() {
	var snbLists = document.querySelectorAll('#pageNavigation .snb-list');
	if (!snbLists) return;

	snbLists.forEach(function(snbList, lnbIndex) {
		const lnbItem = snbList.parentElement;
		const lnbName = lnbItem.querySelector('.lnb-name');
		const expandButton = document.createElement('button');
		const expandButtonActiveText = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><title>접기</title><path d="M5 12C5 11.5858 5.33579 11.25 5.75 11.25H18.25C18.6642 11.25 19 11.5858 19 12C19 12.4142 18.6642 12.75 18.25 12.75H5.75C5.33579 12.75 5 12.4142 5 12Z"/></svg>';
		const expandButtonInactiveText = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><title>펼치기</title><path d="M12.75 5.75C12.75 5.33579 12.4142 5 12 5C11.5858 5 11.25 5.33579 11.25 5.75V11.25H5.75C5.33579 11.25 5 11.5858 5 12C5 12.4142 5.33579 12.75 5.75 12.75H11.25V18.25C11.25 18.6642 11.5858 19 12 19C12.4142 19 12.75 18.6642 12.75 18.25V12.75H18.25C18.6642 12.75 19 12.4142 19 12C19 11.5858 18.6642 11.25 18.25 11.25H12.75V5.75Z"/></svg>';
		
		expandButton.type = 'button';
		expandButton.className = 'btn expand';
		lnbItem.insertBefore(expandButton, lnbName);
		
		if (lnbItem.classList.contains('active')) {
			expandButton.innerHTML = expandButtonActiveText;
		} else {
			expandButton.innerHTML = expandButtonInactiveText;
		}

		expandButton.addEventListener('click', function() {
			const activeItem = this.parentElement;
			const siblings = getSiblings(activeItem);		

			if (activeItem.classList.contains('active')) {

				activeItem.classList.remove('active');
				activeItem.querySelector('.btn.expand').innerHTML = expandButtonInactiveText;
			} else {
				activeItem.classList.add('active');
				activeItem.querySelector('.btn.expand').innerHTML = expandButtonActiveText;
			}
			
			Array.prototype.forEach.call(siblings, function(siblingItem) {
				siblingItem.classList.remove('active');
				siblingItem.querySelector('.btn.expand').innerHTML = expandButtonInactiveText;
			});
		});
	});
}
localNavigation();

/**
 * @layout pageNavigation
**/
const pageNavigation = new buiToggle('[data-bui-toggle="pageNavigation"]', {
	reactTarget: 'html',
	reactTargetActiveClass: 'active-page-navi',
	focusin: false,
});

/**
 * @module 
**/
function findElement(selector, target, height) {
	var elem = document.querySelector(selector);
	if (!elem) return;

	document.querySelector(target).style.setProperty('padding-bottom', height);
}

function buiFormDncrementor(elem) {
	const formElem = elem.parentElement.querySelector('.form-elem');
	formElem.stepDown();
}

function buiFormIncrementor(elem) {
	const formElem = elem.parentElement.querySelector('.form-elem');
	formElem.stepUp();
}


/**
 * @layout infoPopup
 * @module buiToggle
**/
const infoPopup = new buiToggle('[data-bui-toggle="infoPopup"]', {
	inactiveButton: true,
	inactiveButtonClass: 'btn popup-close',
	inactiveButtonText: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><title>닫기</title><path d="M12.99,12l6.16,6.16-.99,.99-6.16-6.16-6.16,6.16-.99-.99,6.16-6.16L4.85,5.84l.99-.99,6.16,6.16,6.16-6.16,.99,.99-6.16,6.16Z"/></svg>',
	inactiveButtonArea: '.popup-local-func .button-area',
	reactTarget: 'html',
	reactTargetActiveClass: 'active-info-popup',
	focusin: true,
	focusout: true,

	onloadCallBack: function(myToggle) {
		const popupFuncContainer = myToggle.toggleTarget.querySelector('.popup-local');
		const popupFunc = document.createElement('div');
		popupFunc.className = 'popup-local-func'
		popupFunc.innerHTML = '<span class="button-area"></span>';
		popupFuncContainer.appendChild(popupFunc);
	}
});

/**
 * @layout pageNavigation
**/
const contentNavigation = new Swiper('.content-navi .swiper', {
	slidesPerView: 'auto',
	spaceBetween: 24,
	freeMode: true,
});

/**
 * @layout mainBillboard
**/
const mainBillboard = new Swiper('[data-bui-swiper=mainBillboard]', {
	loop: true,
	autoplay: {
		delay: 4000,
		disableOnInteraction: false,
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
		type : 'bullets',

		renderBullet: function (index, className) {
			Number.prototype.pad = function(size) {
				var s = String(this);
				while (s.length < (size || 2)) {s = "0" + s;}
				return s;
			}
			return '<span class="' + className + '">' + (index + 1).pad(2) + "</span>";
		},
	},
	
	on: {
		activeIndexChange: function(swiper) {
			swiper.el.setAttribute("style", "--swiper-progess: calc((" + swiper.slides[swiper.activeIndex].getAttribute("aria-label") + ") * 100%)");
			
			if (swiper.slides[swiper.activeIndex].dataset.buiSlideDarkMode != "true") {
				document.querySelector("html").classList.remove("dark-mode-true");
				document.querySelector("html").classList.add("dark-mode-false");
			} else {
				document.querySelector("html").classList.remove("dark-mode-false");
				document.querySelector("html").classList.add("dark-mode-true");
			}

			let backgroundVideo = swiper.slides[swiper.activeIndex].querySelector("video");
			if (backgroundVideo != null) backgroundVideo.currentTime = 0;
		},

		init: function (swiper) {
			thisSlide = this;
			autoPlayButton = document.querySelector('.swiper-control > span');
			autoPlayButton.addEventListener('click', (e) => {
				autoPlayState = autoPlayButton.getAttribute('aria-pressed');
				if (autoPlayState === 'false') {
					autoPlayButton.setAttribute('aria-pressed', 'true');
					thisSlide.autoplay.stop();
				} else if (autoPlayState === 'true') {
					autoPlayButton.setAttribute('aria-pressed', 'false');
					thisSlide.autoplay.start();
				};
			});

			Array.prototype.forEach.call(swiper.slides, function(slide, index) {
				slide.addEventListener("focusin", function() {
					swiper.slideTo(index);
					console.log(index);
				});
			});
		},	
	}
});


// checkActive
let checkActive;
let checkActiveToggle = function() {
	checkActive = !checkActive;
	return checkActive;
};

const ourStory = new Swiper('#ourStoryDisplay', {
	loop: true,
	slidesPerView: 'auto',
	speed: 4500,
	spaceBetween: 20,
	freeMode: true,
	autoplay: {
		delay: 0,
		disableOnInteraction: false,
		// pauseOnMouseEnter: true,
	},

	breakpoints: {
		320: {
			spaceBetween: 24
		},
		768: {
			spaceBetween: 32
		},
		1024: {
			spaceBetween: 40
		}
	},

	on: {
		slideChangeTransitionEnd: function (swiper) {
			checkActiveToggle();
			Array.prototype.forEach.call(swiper.slides, function(elem, index) {
				if (checkActive === true) {
					if (index % 2 == 0 ) {
						elem.classList.add('odd');
						elem.classList.remove('even');
					} else {
						elem.classList.remove('odd');
						elem.classList.add('even');
					}
				} else {
					if (index % 2 == 0 ) {
						elem.classList.remove('odd');
						elem.classList.add('even');
					} else {
						elem.classList.add('odd');
						elem.classList.remove('even');
					}
				}
			});
		},
	},
});

const whatWeDo = new Swiper('[data-bui-slider="whatWeDoDisplay"]', {
	loop: true,
	loopAdditionalSlides: 3,
	slidesPerView: 'auto',
	spaceBetween: 20,
	freeMode: true,
	breakpoints: {
		1024: {
			spaceBetween: 32
		}
	},
	on: {
		init: function () {
			// console.log("onload swiper");
		},
	},
});

const sectionAnimations = () => {
	gsap.utils.toArray('[data-bui-animation="type-1"]').forEach((section, index) => {
		gsap.to(section, {
			scrollTrigger: {
				// markers: true,
				trigger: section,
				start: 'top 98%',
				end: 'top bottom',

				onEnter: function(self) {
					section.classList.add('active-animation');
				},
				onLeaveBack: function(self) {
					section.classList.remove('active-animation');
				},
			}
		});
	});
}
sectionAnimations();


let animationHowWeWork = gsap.timeline({
	scrollTrigger: {
		trigger: document.querySelector('.subsection.how-we-work'),
		start: 'bottom-=100% center',
		end: "bottom+=100% center",
		// toggleActions: 'restart pause reverse pause',
		scrub: 1,
		// markers: true,
	},
});

animationHowWeWork.scrollTrigger;
animationHowWeWork.set(document.querySelector('.subsection.how-we-work .slogan'), {
	x: '0',
}).to(document.querySelector('.subsection.how-we-work .slogan'), {
	x: '-100vw',
});


// contentNavigationGoTo
const contentNavigationGoTo = function() {
	let contentNavi = document.querySelector(".content-navi");
	if (!contentNavi) return false;
	let pageHead = document.querySelector(".page-head");
	let localHead = document.querySelector(".local-head");
	let contentNaviTexts = gsap.utils.toArray(".content-navi .navi-text");

	contentNaviTexts.forEach(naviText => {
		ScrollTrigger.matchMedia({
			// mobile
			"(max-width: 1023px)": function() {
				contentNavigationGoToActions(naviText, pageHead.offsetHeight + contentNavi.offsetHeight);
			},
			
			// desktop
			"(min-width: 1024px)": function() {
				contentNavigationGoToActions(naviText, pageHead.offsetHeight + contentNavi.offsetHeight);
	
			},
		});
	});

	ScrollTrigger.matchMedia({
		// mobile
		"(max-width: 1023px)": function() {
			contentNavigationSnapActions();
		},
		
		// desktop
		"(min-width: 1024px)": function() {
			contentNavigationSnapActions();

		},
	});
	
	function contentNavigationActiveActions(link) {
		contentNaviTexts.forEach(el => el.parentElement.classList.remove("current"));
		link.parentElement.classList.add("current");
	}
	
	function contentNavigationSnapActions() {
		gsap.to(".content-navi", {
			scrollTrigger: {
				// markers: true,
				trigger: 'body',
				start: `top+=${localHead.offsetHeight} ${pageHead.offsetHeight}`,
				end: `top+=${localHead.offsetHeight + contentNavi.offsetHeight} bottom`,

				onEnter: function(self) {
					document.querySelector('html').classList.add('snap-content-navi');
				},
				onLeaveBack: function(self) {
					document.querySelector('html').classList.remove('snap-content-navi');
				},
			}
		});
	}

	function contentNavigationGoToActions(naviText, offsetStart) {
		let element = document.querySelector(naviText.getAttribute("href"));

		let goToActions = ScrollTrigger.create({
			// markers: true,
			trigger: element,
			start: "top " + (offsetStart + 1) + "rem",
			end: "bottom " + offsetStart + "rem",
			onToggle: self => self.isActive && contentNavigationActiveActions(naviText)
		});
		
		naviText.addEventListener("click", e => {
			e.preventDefault();
			gsap.to(window, {duration: 1, scrollTo: goToActions.start + 1, overwrite: "auto"});
		});
	}
}

contentNavigationGoTo();

// Business Pagination scroll Actions
const scrollActions = ScrollTrigger.create({
	// markers: true,
	trigger: ".page-portfolio-view .posts-read",
	start: "top bottom",
	end: "bottom bottom",
	toggleClass: {
		className: "active",
		targets: ".page-portfolio-view .pagination.module-a"
	}
});

setTimeout(function() {
	scrollActions.refresh();
}, 600);


// Scroll to a given hash, preventing the event given if there is one
function scrollToHash(hash, e) {
	const elem = hash ? document.querySelector(hash) : false;
	const pageHead = document.querySelector(".page-head").offsetHeight;
	const contentNavi = document.querySelector(".content-navi").offsetHeight;
	const offsetTop = pageHead + contentNavi;
	
	let goToActions = ScrollTrigger.create({
		// markers: true,
		trigger: hash,
		start: "top " + (offsetTop + 1) + "rem",
		end: "bottom " + offsetTop + "rem",
	});

	if(elem) {
		if(e) e.preventDefault();
		gsap.to(window, {duration: 1, scrollTo: goToActions.start + 1, overwrite: "auto"});
	}
}