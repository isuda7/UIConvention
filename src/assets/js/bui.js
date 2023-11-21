let BUI = {};

BUI.document = document;


// Polyfill entries
if(!Object.entries) 
Object.entries = function(obj) {
	return Object.keys(obj).reduce(function(arr, key) {
		arr.push([key, obj[key]]);
		return arr;
	}, []);
}

// Polyfill getSiblings
var getSiblings = function(e) {
	// for collecting siblings
	let siblings = []; 
	// if no parent, return no sibling
	if(!e.parentNode) {
		return siblings;
	}
	// first child of the parent node
	let sibling  = e.parentNode.firstChild;
	// collecting siblings
	while (sibling) {
		if (sibling.nodeType === 1 && sibling !== e) {
			siblings.push(sibling);
		}
		sibling = sibling.nextSibling;
	}
	return siblings;
};

function numberWithCommas(num){
	var len, point, str; 
	num = num + ""; 
	point = num.length % 3 ;
	len = num.length; 

	str = num.substring(0, point); 
	while (point < len) { 
		if (str != "") str += ","; 
		str += num.substring(point, point + 3); 
		point += 3; 
	}
	return str;
}

/**
 * buiToggle
 * 
 * @ProjectDescription
 * @author codenamic@gmail.com
 * @version 1.1
 * 
 * Released on 2022-02-01
 * Copyright (c) 2018,
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 * 
**/
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiToggle = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Variables
	var defaults = {
		// general
		mode: 'normal',
		event: 'click',
		activeClass: 'active',
		// active: true,
		// inactive: false,
		// inactiveClass: 'inactive',
		// initialTarget: null,
		// disabled: false,
		// disabledClass: null,

		// focusin
		focusin: false,
		focusout: false,

		// clickout
		clickout: false,
		clickoutTarget: null,
		
		// target
		targetClass: 'bui-toggle-target',
		targetActiveClass: 'active',
		targetAttribute: 'data-toggle-target',

		// inactiveButton
		inactiveButton: false,
		inactiveButtonElement: 'button',
		inactiveButtonClass: 'close',
		inactiveButtonText: 'close',
		inactiveButtonArea: null,

		// dimmed target
		dimmedTarget: null,
		dimmedTargetClass: null,
		dimmedTargetActiveClass: 'active-dimmed',

		// react target
		reactTarget: null,
		reactTargetClass: null,
		reactTargetActiveClass: 'active',

		// react Parent
		reactParent: null,
		reactParentClass: null,
		reactParentActiveClass: 'active',

		// callback
		onloadCallBack: function() {return false;},
		
		eventBeforeCallBack: function() {return false;},
		eventAfterCallBack: function() {return false;},

		activeBeforeCallBack: function() {return false;},
		activeAfterCallBack: function() {return false;},

		inactiveBeforeCallBack: function() {return false;},
		inactiveAfterCallBack: function() {return false;}
	};

	// Merge two or more objects together.
	var extend = function () {
		var merged = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) return;
				merged[key] = obj[key];
			}
		});
		return merged;
	};

	// Create the Constructor object
	var Constructor = function(selector, options) {
		
		// Merge user options with defaults
		settings = extend(defaults, options || {});
		
		var publicAPIs = {};
		var settings;

		publicAPIs.settings = settings;
		publicAPIs.myToggle = {};

		// active
		publicAPIs.active = function(name) {
			active(settings, publicAPIs.myToggle[name]);
		}
		
		// inactive
		publicAPIs.inactive = function(name) {
			inactive(settings, publicAPIs.myToggle[name]);
		}

		// toggle
		publicAPIs.toggle = function(name) {
			publicAPIs.myToggle[name].active ? publicAPIs.inactive(name) : publicAPIs.active(name);
		}

		// update
		publicAPIs.update = function() {			
			let toggleTargets = document.querySelectorAll(selector);
			if (!toggleTargets) return;

			Array.prototype.forEach.call(toggleTargets, function(value, index, array) {
				publicAPIs.myToggle[value.id] = {
					active: false,
					toggleName: value.id,
					toggleTarget: value,
					toggleButton: document.querySelector('[data-bui-toggle-button="' + value.id + '"]'),
					dimmed: value.dataset.buiDimmed,
					reactTarget: document.querySelector(settings.reactTarget),
				}

				settings.onloadCallBack.call(this, publicAPIs.myToggle[value.id]);
				publicAPIs.myToggle[value.id].toggleTarget.classList.add(settings.targetClass);

				if (settings.inactiveButton) inactiveButton(settings, publicAPIs.myToggle[value.id]);
				if (settings.focusin) focusin(settings, publicAPIs.myToggle[value.id]);

				if (publicAPIs.myToggle[value.id].toggleButton != null) {
					publicAPIs.myToggle[value.id].toggleButton.addEventListener('click', function(event) {
						publicAPIs.toggle(value.id);
						if (event.currentTarget.nodeName === 'A') event.preventDefault();
					}, false);
				}

			});
		};

		// Initialize the instance
		var init = function () {
			// Setup the DOM
			publicAPIs.update();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};

	// Actions Active
	function active(settings, toggleThis) {		
		settings.eventBeforeCallBack.call(this, toggleThis);
		settings.activeBeforeCallBack.call(this, toggleThis);
		
		settings.currentEventListener = window.event.target;

		toggleThis.active = true;
		toggleThis.toggleTarget.classList.add(settings.activeClass);

		if (toggleThis.toggleButton != null) toggleThis.toggleButton.classList.add(settings.activeClass);
		if (settings.reactTarget != null) toggleThis.reactTarget.classList.add(settings.reactTargetActiveClass);
		if (settings.reactParent != null) toggleThis.toggleTarget.closest(settings.reactParent).classList.add(settings.reactParentActiveClass);	
		if (toggleThis.dimmed == "true") document.querySelector("html").classList.add(settings.dimmedTargetActiveClass);

		if (settings.focusout) focusout(settings, toggleThis);
		if (settings.clickout) clickout(settings, toggleThis);

		setTimeout(function() {
			document.addEventListener('focusin', settings.focusoutActions, false);
			document.addEventListener('click', settings.clickoutActions, false);
		}, 400);

		settings.eventAfterCallBack.call(this, toggleThis);
		settings.activeAfterCallBack.call(this, toggleThis);
	};
	
	// Actions Inactive
	function inactive(settings, toggleThis) {
		settings.eventBeforeCallBack.call(this, toggleThis);
		settings.inactiveBeforeCallBack.call(this, toggleThis);

		if (settings.currentEventListener != undefined) settings.currentEventListener.focus();

		toggleThis.active = false;
		toggleThis.toggleTarget.classList.remove(settings.activeClass);
		
		if (toggleThis.toggleButton != null) toggleThis.toggleButton.classList.remove(settings.activeClass);
		if (settings.reactTarget != null) toggleThis.reactTarget.classList.remove(settings.reactTargetActiveClass);
		if (settings.reactParent != null) toggleThis.toggleTarget.closest(settings.reactParent).classList.remove(settings.reactParentActiveClass);
		if (toggleThis.dimmed == "true") document.querySelector("html").classList.remove(settings.dimmedTargetActiveClass);

		document.removeEventListener('focusin', settings.focusoutActions, false);
		document.removeEventListener('click', settings.clickoutActions, false);

		settings.eventAfterCallBack.call(this, toggleThis);
		settings.inactiveAfterCallBack.call(this, toggleThis);
	};

	// Inactive Button
	function inactiveButton(settings, toggleThis) {
		var inactiveButton = toggleThis.toggleTarget.querySelector('.' + settings.inactiveButtonClass);

		if (inactiveButton === null) {
			inactiveButton = document.createElement('button');
			inactiveButton.setAttribute('type', 'button');
			inactiveButton.className = settings.inactiveButtonClass;
			inactiveButton.innerHTML = settings.inactiveButtonText;
			
			// Append Inactive Button
			settings.inactiveButtonArea === null ? toggleThis.toggleTarget.appendChild(inactiveButton) : toggleThis.toggleTarget.querySelector(settings.inactiveButtonArea).appendChild(inactiveButton);
		}

		// Inactive event
		inactiveButton.addEventListener('click', function() {
			inactive(settings, toggleThis);
		}, false);
	};

	// reactTarget
	function reactTarget(settings, toggleThis) {
		toggleThis.reactTarget.classList.add(settings.activeClass);
	};
	
	// Inactive by Clickout
	function clickout(settings, toggleThis) {
		settings.clickoutActions = function() {
			let clickoutTarget = toggleThis.toggleTarget;
			if (settings.clickoutTarget != null) clickoutTarget = toggleThis.toggleTarget.querySelector(settings.clickoutTarget);
			if (toggleThis.active || !clickoutTarget.contains(window.event.target)) inactive(settings, toggleThis);
		}
	};

	// Inactive by focusout
	function focusout(settings, toggleThis) {
		settings.focusoutActions = function() {
			if (!toggleThis.toggleTarget.contains(document.activeElement)) inactive(settings, toggleThis);
		}
	};

	// focus to Active target
	function focusin(settings, toggleThis) {
		toggleThis.toggleTarget.setAttribute('tabindex', '0');
	};

	// Return the Constructor
	return Constructor;
});

/**
 * buiTab
**/
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiTab = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Variables
	var defaults = {
		// general
		mode: 'normal',
		active: false,
		activeClass: 'current',
		initial: 0,

		// tab
		tabItem: '.tab-item',
		tabName: '.tab-text',
		buttonActiveText: null,
		buttonAppendTo: null,
		tabItemReact: false,

		// target
		target: null,
		targetClass: 'bui-tab-target',
		targetActiveClass: 'active',
		container: '.tab-content',

		/* callback */
		onloadCallBack: function() {return false;},
		eventCallBack: function() {return false;},
		activeCallBack: function() {return false;},
		inactiveCallBack: function() {return false;}
	};

	/**
	 * Merge two or more objects together.
	 * @param	{Object}	objects		The objects to merge together
	 * @returns	{Object}				Merged values of defaults and options
	 */
	var extend = function () {
		var merged = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) return;
				merged[key] = obj[key];
			}
		});
		return merged;

	};

	var tabToggle = function(settings, tabs) {
		tabs.item.classList.add(settings.activeClass);
		tabs.item.setAttribute('title', '현재 선택된 항목');

		Array.prototype.forEach.call(getSiblings(tabs.item), function(siblingsItem) {
			siblingsItem.classList.remove(settings.activeClass);
			siblingsItem.removeAttribute('title');
		});

		if(tabs.target != null) {
			tabs.target.classList.add(settings.targetActiveClass);
			Array.prototype.forEach.call(getSiblings(tabs.target), function(siblingsItem) {
				siblingsItem.classList.remove(settings.targetActiveClass);
			});
		}

		if (settings.tabItemReact != false) {
			var items = tabs.item;
			var left = items.offsetLeft + items.clientWidth + 16;
			var move = left - window.outerWidth;

			if (window.outerWidth < left) {
				items.parentElement.parentElement.scrollTo(move, 0);
			} else{
				items.parentElement.parentElement.scrollTo(0, 0);
			}
		}
	}

	var tabItemReact = function(settings, selectItems) {
		if (settings.tabItemReact != false) {
			Array.prototype.forEach.call(selectItems, function(list, index) {
				var items = list.querySelector('.' + settings.activeClass);
				var left = items.offsetLeft + items.clientWidth + 16;
				var move = left - window.outerWidth;
				items.parentElement.parentElement.style.scrollBehavior = 'smooth';

				if (window.outerWidth < left) {
					items.parentElement.parentElement.scrollTo(move, 0);
				} else{
					items.parentElement.parentElement.scrollTo(0, 0);
				}
			});
		}
	}

	// Create the Constructor object
	var Constructor = function (selector, options) {

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		// Variables
		var publicAPIs = {};
		var settings;

		publicAPIs.itemEntry = [];

		 publicAPIs.createProperties = function(item, name, target) {
			this.item = item;
			this.name = name;
			this.target = target;
		};

		// Setup the DOM with the proper attributes
		publicAPIs.setup = function() {
			// Variables
			var selectItems = document.querySelectorAll(selector);
			if (!selectItems) return;
		
			Array.prototype.forEach.call(selectItems, function(list, index) {
				var listEntry = [];
				var initial = settings.initial;
				var items = list.querySelectorAll(settings.tabItem);

				Array.prototype.forEach.call(items, function(item, index) {
					var name = item.querySelector(settings.tabName);
					var target = document.querySelector(name.getAttribute('href'));
					listEntry[index] = new publicAPIs.createProperties(item, name, target);
					item.classList.contains(settings.activeClass) ? initial = index : null;
				});

				// actions
				Array.prototype.forEach.call(listEntry, function(tabs, index) {
					tabs.target != null ? tabs.target.classList.add(settings.targetClass) : null;
					initial === index ? tabToggle(settings, tabs) : null;
					tabs.name.addEventListener('click', function(e) {
						
						settings.eventCallBack.call();
						settings.mode != 'null' ? e.preventDefault() : null;

						// after click
						if(settings.mode === 'scroll') {
							tabs.target.closest(settings.container).scrollTo({
								top: tabs.target.offsetTop,
								behavior: 'smooth'
							});
						} else {
							tabToggle(settings, tabs);
						}
					});
					
					// after scroll
					if(settings.mode === 'scroll') {

						// closest 으로 변경
						tabs.target.closest(settings.container).addEventListener('scroll', function(event) {
							if(this.scrollTop + 48 >= tabs.target.offsetTop && this.scrollTop + 48 < tabs.target.offsetTop + tabs.target.offsetHeight) {
								tabToggle(settings, tabs);
							}
						});
					}
				});
			});

			tabItemReact(settings, selectItems);
		};

		// Initialize the instance
		var init = function () {
			// Setup the DOM
			publicAPIs.setup();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};

	// Return the Constructor
	return Constructor;
});


/**
 * buiExpand
**/
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiExpand = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Variables
	var defaults = {
		// general
		active: false,
		activeClass: 'active',
		initial: 0,

		ellipsis: false,
		ellipsisLimit: 2,
		ellipsisField: '',
		ellipsisActiveClass: 'limit',

		// target
		target: null,
		targetClass: 'bui-expand-target',
		targetActiveClass: 'active',

		// close
		button: 'button',
		buttonClass: 'expand',
		buttonActiveClass: 'active',
		buttonText: '펼치기',
		buttonActiveText: null,
		buttonAppendArea: null,
		buttonAppendTo: 'beforeEnd',

		// accordion
		accordion: false,

		clickout: false,
		clickoutTarget: null,

		// callback
		onloadCallBack: function() {return false;},
		
		eventBeforeCallBack: function() {return false;},
		eventAfterCallBack: function() {return false;},

		activeBeforeCallBack: function() {return false;},
		activeAfterCallBack: function() {return false;},

		inactiveBeforeCallBack: function() {return false;},
		inactiveAfterCallBack: function() {return false;}
	};

	/**
	 * Merge two or more objects together.
	 * @param	{Object}	objects		The objects to merge together
	 * @returns	{Object}				Merged values of defaults and options
	 */
	var extend = function () {
		var merged = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) return;
				merged[key] = obj[key];
			}
		});
		return merged;
	};

	var activeIndex = 0;

	var activeAction = function(settings, setupData) {
		settings.activeBeforeCallBack.call(this, setupData);
		setupData.target.classList.add(settings.activeClass);
		setupData.button.classList.add(settings.buttonActiveClass);
		if (settings.buttonActiveText != null) setupData.button.innerHTML = settings.buttonActiveText;
		activeIndex = setupData.index;
		settings.activeAfterCallBack.call(this, setupData);
		
		if (settings.clickout == true) {
			document.addEventListener('mouseup', function(event) {				
				if (setupData.target.classList.contains(settings.activeClass) && !setupData.target.contains(event.target)) {
					inactiveAction(settings, setupData);
				}
			});
		};
	};

	var inactiveAction = function(settings, setupData) {
		settings.inactiveBeforeCallBack.call(this, setupData);

		setupData.target.classList.remove(settings.activeClass);
		setupData.button.classList.remove(settings.buttonActiveClass);
		if (settings.buttonActiveText != null) setupData.button.innerHTML = settings.buttonText;

		settings.inactiveAfterCallBack.call(this, setupData);
	};

	var ellipsis = function(settings, toggleTarget) {
		var field = toggleTarget.querySelector(settings.ellipsisField); 
		var containerHeight = field.offsetHeight 
		var lineHeight = parseInt(window.getComputedStyle(field).getPropertyValue('line-height')); 
		var lines = containerHeight / lineHeight;

		if (lines > settings.ellipsisLimit) {
			toggleTarget.classList.add(settings.ellipsisActiveClass);
		} else {
			toggleTarget.classList.remove(settings.ellipsisActiveClass);
		}
	};

	var actionSetup = function(settings, setupData) {
		setupData.element.classList.add(settings.targetClass);

		if (settings.buttonAppendArea != null) {
			if(setupData.element.querySelector(settings.buttonAppendArea)) {
				setupData.element.querySelector(settings.buttonAppendArea).insertAdjacentElement(settings.buttonAppendTo, setupData.button);
			}
		} else {
			setupData.element.insertAdjacentElement(settings.buttonAppendTo, setupData.button);
		};

		// setupData.element.querySelector(settings.buttonAppendArea).insertBefore(setupData.button, setupData.element.querySelector(settings.buttonAppendArea).lastElementChild);
		// if(toggleTarget.classList.contains(settings.activeClass)) {
		// 	activeAction(settings, toggleTarget, toggleButton);
		// }
	}

	// Create the Constructor object
	var Constructor = function(selector, options) {

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		// Variables
		var publicAPIs = {};
		var settings;


		publicAPIs.length = 0;

		publicAPIs.myArray = {};

		publicAPIs.active = function(index) {
			activeAction(settings, publicAPIs.myArray[index]);
		};

		publicAPIs.inactive = function(index) {
			inactiveAction(settings, publicAPIs.myArray[index]);
		};

		// Setup the DOM with the proper attributes
		publicAPIs.setup = function() {

			// Variables
			var selectItems = document.querySelectorAll(selector);
			if (!selectItems) return;

			Array.prototype.forEach.call(selectItems, function(toggleTarget) {
				if(settings.ellipsis === true) {
					ellipsis(settings, toggleTarget);
					window.addEventListener('resize', function() {
						ellipsis(settings, toggleTarget);
					}, false);
				}

				let setTarget = (settings.target != null) ? setTarget = document.querySelector(settings.target) : toggleTarget;
				let expandButton = document.createElement('button');

				expandButton.type = 'button';
				expandButton.className = settings.buttonClass;

				if (setTarget.classList.contains(settings.activeClass)) {
					expandButton.innerHTML = settings.buttonActiveText;
					expandButton.classList.add(settings.activeClass);
				} else {
					expandButton.innerHTML = settings.buttonText;
					expandButton.classList.remove(settings.activeClass);
				}

				publicAPIs.myArray[publicAPIs.length] = {
					index: publicAPIs.length,
					element: toggleTarget,
					target: setTarget,
					button: expandButton,
				}

				publicAPIs.length++;
			});


			for (let i = 0; i < publicAPIs.length; i++) {
				// onload call
				settings.onloadCallBack.call(this, publicAPIs.myArray[i]);

				// Setup Toggle Button
				actionSetup(settings, publicAPIs.myArray[i]);


				publicAPIs.myArray[i].button.addEventListener('click', function(event) {
					// console.log(publicAPIs.myArray[i]);
					settings.eventBeforeCallBack.call(this, publicAPIs.myArray[i]);

					if (settings.accordion == true) {
						for (let j = 0; j < publicAPIs.length; j++) {
							if (i == j) {
								publicAPIs.myArray[j].target.classList.contains(settings.activeClass) ? inactiveAction(settings, publicAPIs.myArray[j]) : activeAction(settings, publicAPIs.myArray[j]);
							} else {
								inactiveAction(settings, publicAPIs.myArray[j])
							}
						}
					} else {
						publicAPIs.myArray[i].target.classList.contains(settings.activeClass) ? inactiveAction(settings, publicAPIs.myArray[i]) : activeAction(settings, publicAPIs.myArray[i]);
					}
					
					settings.eventAfterCallBack.call(this, publicAPIs.myArray[i]);
				});
			}
		};

		// Initialize the instance
		var init = function () {
			// Setup the DOM
			publicAPIs.setup();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};
	
	// Return the Constructor
	return Constructor;
});

/**
 * buiNavigation
**/
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiNav = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Variables
	var defaults = {
		// general
		mode: 'click',

		active: false,
		activeClass: 'active',
		initial: 0,

		navList: '.nav-list',
		navItem: '.nav-item',
		navText: '.nav-name',
		subList: '.sub-list',
		ellipsisActiveClass: 'limit',

		// tractTarget
		reactTarget: null,
		reactTargetClass: 'bui-nav-react-target',
		reactTargetActiveClass: 'active',

		// close
		button: 'button',
		buttonClass: 'expand',
		buttonActiveClass: 'active',
		buttonText: '펼치기',
		buttonActiveText: '접기',
		buttonAppendTo: null,

		// accordion
		// accordion: true,

		/* callback */
		onloadCallBack: function() {return false;},
		
		eventBeforeCallBack: function() {return false;},
		eventAfterCallBack: function() {return false;},

		activeBeforeCallBack: function() {return false;},
		activeAfterCallBack: function() {return false;},

		inactiveBeforeCallBack: function() {return false;},
		inactiveAfterCallBack: function() {return false;}
	};

	/**
	 * Merge two or more objects together.
	 * @param	{Object}	objects		The objects to merge together
	 * @returns	{Object}				Merged values of defaults and options
	 */
	var extend = function () {
		var merged = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) return;
				merged[key] = obj[key];
			}
		});
		return merged;
	};

	/**
	 * Create the Constructor object
	 */
	var Constructor = function (selector, options) {

		// Merge user options with defaults
		var settings;
		settings = extend(defaults, options || {});
		
		// Variables
		var publicAPIs = {};

		// Entries
		publicAPIs.myNav = {};

		// update
		publicAPIs.update = function() {			
			let navIndex = 0;
			let navItems = document.querySelectorAll(selector);
			if (!navItems) return;

			Array.prototype.forEach.call(navItems, function(navItem) {
				const subList = navItem.querySelector(settings.subList); 
				
				if (subList != null) {
					const navList = navItem.parentElement;
					const navText = navItem.querySelector(settings.navText);
					const expandButton = document.createElement(settings.button);			
					expandButton.type = 'button';
					expandButton.className = settings.buttonClass;
					
					// navItem.insertBefore(expandButton, navText); // button을 naviName 앞에 추가
					navText.appendChild(expandButton); // button을 naviName 뒤에 추가
					navItem.classList.contains(settings.activeClass) ? expandButton.innerHTML = settings.buttonActiveText : expandButton.innerHTML = settings.buttonText;

					publicAPIs.myNav[navIndex] = {
						list: navList,
						item: navItem,
						name: navText,
						body: subList,
						button: expandButton,
					}
					navIndex++;

				}
			});
			
			for (let i = 0; i < navIndex; i++) {
				settings.onloadCallBack.call(this, publicAPIs.myNav[i]); // CallBack
				publicAPIs.myNav[i].button.addEventListener('click', function(event) {
					for (let j = 0; j < navIndex; j++) {
						if (i == j) {
							if (settings.mode == "toggle") {
								if (publicAPIs.myNav[j].item.classList.contains(settings.activeClass)) {
									publicAPIs.myNav[j].item.classList.remove(settings.activeClass);
									publicAPIs.myNav[j].button.innerHTML = settings.buttonText;
									if (settings.reactTarget != null) document.querySelector(settings.reactTarget).classList.remove(settings.activeClass);
								} else {
									settings.activeBeforeCallBack.call(this, publicAPIs.myNav[j]); // CallBack

									publicAPIs.myNav[j].item.classList.add(settings.activeClass);
									publicAPIs.myNav[j].button.innerHTML = settings.buttonActiveText;
									if (settings.reactTarget != null) document.querySelector(settings.reactTarget).classList.add(settings.activeClass);

									settings.activeAfterCallBack.call(this, publicAPIs.myNav[j]); // CallBack
								}
							} else {
								settings.activeBeforeCallBack.call(this, publicAPIs.myNav[j]); // CallBack

								publicAPIs.myNav[j].item.classList.add(settings.activeClass);
								publicAPIs.myNav[j].button.innerHTML = settings.buttonActiveText;
								if (settings.reactTarget != null) document.querySelector(settings.reactTarget).classList.add(settings.activeClass);

								settings.activeAfterCallBack.call(this, publicAPIs.myNav[j]); // CallBack
							}

						} else {
							publicAPIs.myNav[j].item.classList.remove(settings.activeClass);
							publicAPIs.myNav[j].button.innerHTML = settings.buttonText;
						}
					}
				});
			}
		};
		
		// Initialize the instance
		var init = function () {
			// Setup the DOM
			publicAPIs.update();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};
	
	// Return the Constructor
	return Constructor;
});

/**
 * buiForm
**/
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiForm2 = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Variables
	var defaults = {
		/* callback */
		onloadCallBack: function() {return false;},
		
		eventBeforeCallBack: function() {return false;},
		eventAfterCallBack: function() {return false;},

		activeBeforeCallBack: function() {return false;},
		activeAfterCallBack: function() {return false;},

		inactiveBeforeCallBack: function() {return false;},
		inactiveAfterCallBack: function() {return false;}
	};

	/**
	 * Merge two or more objects together.
	 * @param   {Object} objects	The objects to merge together
	 * @returns {Object}			Merged values of defaults and options
	 */
	var extend = function () {
		var merged = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) return;
				merged[key] = obj[key];
			}
		});
		return merged;
	};

	// Create the Constructor object
	var Constructor = function(selector, options) {
		
		// Merge user options with defaults
		settings = extend(defaults, options || {});
		
		var publicAPIs = {};
		var settings;

		publicAPIs.settings = settings;
		publicAPIs.myForm = {};

		// update
		publicAPIs.update = function() {
			let formIndex = 0;		
			let formElems = document.querySelectorAll(selector);
			if (!formElems) return;

			Array.prototype.forEach.call(formElems, function(value, index, array) {
				publicAPIs.myForm[index] = {
					form: value.parentElement,
					formElem: value,
					formFunc: value.parentElement.querySelector('.form-util'),
					formUtil: document.createElement('span'),
				}
				formIndex++;
			});

			for (let i = 0; i < formIndex; i++) {
				buiFormCheckTyped(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem);
				if (publicAPIs.myForm[i].formFunc != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formFunc.offsetWidth + 'rem');
				
				// buiFormCancel
				if (publicAPIs.myForm[i].formElem.hasAttribute('data-bui-form-cancel')) {

					let buiFormCancel = publicAPIs.myForm[i].form.querySelector('.form-btn-cancel');

					if (!buiFormCancel) {
						buiFormCancel = document.createElement('span');
						buiFormCancel.className = "form-btn-cancel";

						if (publicAPIs.myForm[i].formFunc != null) {
							publicAPIs.myForm[i].formFunc.insertBefore(buiFormCancel, publicAPIs.myForm[i].formFunc.children[0]);
						} else {
							publicAPIs.myForm[i].formUtil.className = 'form-util';
							publicAPIs.myForm[i].form.appendChild(publicAPIs.myForm[i].formUtil);
							publicAPIs.myForm[i].formUtil.insertBefore(buiFormCancel, publicAPIs.myForm[i].formUtil.children[0]);
						}


						// buiFormClearAction(publicAPIs.myForm[i].formElem, publicAPIs.myForm[i].formFunc, publicAPIs.myForm[i].formUtil);

					}

					buiFormCancel.addEventListener('click', function() {
						console.log("ddd");
					});
				}

















				publicAPIs.myForm[i].formElem.addEventListener("input", function() {
					buiFormCheckTyped(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem);

					if (publicAPIs.myForm[i].formElem.value.length > 0) {
						if (publicAPIs.myForm[i].formUtil != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formUtil.offsetWidth + 'rem');
						if (publicAPIs.myForm[i].formFunc != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formFunc.offsetWidth + 'rem');
					} else {
						if (publicAPIs.myForm[i].formUtil != null) publicAPIs.myForm[i].form.style.removeProperty('--padding-right');
						if (publicAPIs.myForm[i].formFunc != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formFunc.offsetWidth + 'rem');
					}
				});

				publicAPIs.myForm[i].formElem.addEventListener("mouseenter", function() {
					publicAPIs.myForm[i].form.classList.add('mouseenter');

					if (publicAPIs.myForm[i].formUtil != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formUtil.offsetWidth + 'rem');
					if (publicAPIs.myForm[i].formFunc != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formFunc.offsetWidth + 'rem');
				});

				publicAPIs.myForm[i].formElem.addEventListener("mouseleave", function() {
					publicAPIs.myForm[i].form.classList.remove('mouseenter');

					if (!publicAPIs.myForm[i].formElem.matches(':focus')) {
						if (publicAPIs.myForm[i].formUtil != null) publicAPIs.myForm[i].form.style.removeProperty('--padding-right');
						if (publicAPIs.myForm[i].formFunc != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formFunc.offsetWidth + 'rem');
					}
				});

				publicAPIs.myForm[i].formElem.addEventListener("focusin", function() {
					if (publicAPIs.myForm[i].formUtil != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formUtil.offsetWidth + 'rem');
					if (publicAPIs.myForm[i].formFunc != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formFunc.offsetWidth + 'rem');
				});

				publicAPIs.myForm[i].formElem.addEventListener("focusout", function() {
					if (!publicAPIs.myForm[i].formElem.matches(':hover')) {
						if (publicAPIs.myForm[i].formUtil != null) publicAPIs.myForm[i].form.style.removeProperty('--padding-right');
						if (publicAPIs.myForm[i].formFunc != null) publicAPIs.myForm[i].form.style.setProperty('--padding-right', publicAPIs.myForm[i].formFunc.offsetWidth + 'rem');
					};
				});
			}
		};

		// .select()

		// buiFormCheckTyped
		function buiFormCheckTyped(form, formElem) {
			form.dataset.buiFormValue = formElem.value;
			form.style.setProperty("--bui-form-value", formElem.value);
			formElem.value.length > 0 ? form.classList.add('typed') : form.classList.remove('typed');
		}

		// buiFormCancel
		function buiFormClearAction(elem, formFunc, formUtil) {
			elem.value = '';
			elem.value.select();
			elem.parentElement.classList.remove('typed');
		}
		
		// buiFormCancelAction
		function buiFormCancelAction(event, buiFormElem, buiFormFunc, buiFormCancel) {
			var xStart = buiFormFunc.offsetLeft + buiFormCancel.offsetLeft;
			var yStart = buiFormFunc.offsetTop + buiFormCancel.offsetTop;
			var xEnd = xStart + buiFormCancel.offsetWidth;
			var yEnd = yStart + buiFormCancel.offsetHeight;
			
			if (event.target.parentElement.classList.contains('typed')) {
				if (event.offsetX >= xStart && event.offsetX <= xEnd && event.offsetY >= yStart && event.offsetY <= yEnd) {
					buiFormElem.style.setProperty('cursor', 'pointer');
				} else {
					buiFormElem.style.removeProperty('cursor');
				}
			}
		}

		// Initialize the instance
		var init = function () {
			// Setup the DOM
			publicAPIs.update();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};

	// Return the Constructor
	return Constructor;
});


/**
 * buiForm
**/
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiForm = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Variables
	var defaults = {
		value: false,

		/* callback */
		onloadCallBack: function() {return false;},
		
		eventBeforeCallBack: function() {return false;},
		eventAfterCallBack: function() {return false;},

		activeBeforeCallBack: function() {return false;},
		activeAfterCallBack: function() {return false;},

		inactiveBeforeCallBack: function() {return false;},
		inactiveAfterCallBack: function() {return false;}
	};

	/**
	 * Merge two or more objects together.
	 * @param   {Object} objects	The objects to merge together
	 * @returns {Object}			Merged values of defaults and options
	 */
	var extend = function () {
		var merged = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) return;
				merged[key] = obj[key];
			}
		});
		return merged;
	};

	// Create the Constructor object
	var Constructor = function(selector, options) {
		
		// Merge user options with defaults
		settings = extend(defaults, options || {});
		
		var publicAPIs = {};
		var settings;

		publicAPIs.settings = settings;
		publicAPIs.myForm = {};

		// update
		publicAPIs.update = function() {
			let formIndex = 0;		
			let formElems = document.querySelectorAll(selector);
			if (!formElems) return;

			Array.prototype.forEach.call(formElems, function(value, index, array) {
				publicAPIs.myForm[index] = {
					form: value.parentElement,
					formElem: value,
					formUtil: value.parentElement.querySelector('.form-util'),
				}
				formIndex++;
			});

			for (let i = 0; i < formIndex; i++) {				
				buiFormCheckTyped(settings, publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem);
				buiCheckFormUtil(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem, publicAPIs.myForm[i].formUtil);
				
				// buiFormCancel
				if (publicAPIs.myForm[i].formElem.hasAttribute('data-bui-form-cancel')) {

					let buiFormCancel = publicAPIs.myForm[i].form.querySelector('.form-btn-cancel');

					if (!buiFormCancel) {
						buiFormCancel = document.createElement('span');
						buiFormCancel.className = "form-btn-cancel";

						if (publicAPIs.myForm[i].formUtil != null) {
							publicAPIs.myForm[i].formUtil.insertBefore(buiFormCancel, publicAPIs.myForm[i].formUtil.children[0]);
						} else {
							let formUtil = document.createElement('span');				
							formUtil.className = 'form-util';
							formUtil.appendChild(buiFormCancel);
							publicAPIs.myForm[i].form.appendChild(formUtil);
							publicAPIs.myForm[i].formUtil = formUtil;
						}
					}

					buiFormCancel.addEventListener("click", function() {
						buiFormClearAction(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem);
					});
				}

				publicAPIs.myForm[i].formElem.addEventListener("input", function() {
					buiFormCheckTyped(settings, publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem);
					buiCheckFormUtil(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem, publicAPIs.myForm[i].formUtil);
				});

				publicAPIs.myForm[i].formElem.addEventListener("focusin", function() {
					publicAPIs.myForm[i].form.classList.add('focusin');
					buiCheckFormUtil(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem, publicAPIs.myForm[i].formUtil);
				});

				publicAPIs.myForm[i].formElem.addEventListener("focusout", function() {
					publicAPIs.myForm[i].form.classList.remove('focusin');

					if (!publicAPIs.myForm[i].formElem.matches(':hover')) {
						buiCheckFormUtil(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem, publicAPIs.myForm[i].formUtil);
					};
				});

				publicAPIs.myForm[i].form.addEventListener("mousemove", function(event) {
					var xStart = publicAPIs.myForm[i].formElem.offsetLeft;
					var yStart = publicAPIs.myForm[i].formElem.offsetTop;
					var xEnd = xStart + publicAPIs.myForm[i].formElem.offsetWidth;
					var yEnd = yStart + publicAPIs.myForm[i].formElem.offsetHeight;
					
					if (event.offsetX >= xStart && event.offsetX <= xEnd && event.offsetY >= yStart && event.offsetY <= yEnd) {
						publicAPIs.myForm[i].form.classList.add('mouseover');
						buiCheckFormUtil(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem, publicAPIs.myForm[i].formUtil);
					} else {
						publicAPIs.myForm[i].form.classList.remove('mouseover');
						if (!publicAPIs.myForm[i].formElem.matches(':focus')) buiCheckFormUtil(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem, publicAPIs.myForm[i].formUtil);
					}
				});

				// mouseenter
				publicAPIs.myForm[i].form.addEventListener("mouseleave", function(event) {
					publicAPIs.myForm[i].form.classList.remove('mouseover');
					if (!publicAPIs.myForm[i].formElem.matches(':focus')) buiCheckFormUtil(publicAPIs.myForm[i].form, publicAPIs.myForm[i].formElem, publicAPIs.myForm[i].formUtil);
				});
	
			}
		};

		// checkFormUtil
		function buiCheckFormUtil(form, formElem, formUtil) {
			if (formUtil != null) {
				formElem.style.setProperty('padding-right', formUtil.offsetWidth + 'rem');
			} else {
				formElem.style.removeProperty('padding-right');
			}
		}

		// buiFormCheckTyped
		function buiFormCheckTyped(settings, form, formElem) {
			formElem.value.length > 0 ? form.classList.add('typed') : form.classList.remove('typed');

			if (settings.value) {
				form.style.setProperty("--bui-form-value", formElem.value);
				form.dataset.buiFormValue = formElem.value;
			}
		}

		// buiFormCancel
		function buiFormClearAction(form, formElem) {
			form.classList.remove('typed');
			formElem.value = null;
			formElem.focus();
			formElem.select();
		}

		// Initialize the instance
		var init = function () {
			// Setup the DOM
			publicAPIs.update();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};

	// Return the Constructor
	return Constructor;
});