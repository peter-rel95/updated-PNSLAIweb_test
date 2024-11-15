//*** HISTORY PAGE ***//
window.addEventListener("DOMContentLoaded",() => {
	const ctl = new CollapsibleTimeline("#timeline");
});

class CollapsibleTimeline {
	constructor(el) {
		this.el = document.querySelector(el);

		this.init();
	}
	init() {
		this.el?.addEventListener("click",this.itemAction.bind(this));
	}
	animateItemAction(button,ctrld,contentHeight,shouldCollapse) {
		const expandedClass = "timeline__item-body--expanded";
		const animOptions = {
			duration: 300,
			easing: "cubic-bezier(0.65,0,0.35,1)"
		};

		if (shouldCollapse) {
			button.ariaExpanded = "false";
			ctrld.ariaHidden = "true";
			ctrld.classList.remove(expandedClass);
			animOptions.duration *= 2;
			this.animation = ctrld.animate([
				{ height: `${contentHeight}px` },
				{ height: `${contentHeight}px` },
				{ height: "0px" }
			],animOptions);
		} else {
			button.ariaExpanded = "true";
			ctrld.ariaHidden = "false";
			ctrld.classList.add(expandedClass);
			this.animation = ctrld.animate([
				{ height: "0px" },
				{ height: `${contentHeight}px` }
			],animOptions);
		}
	}
	itemAction(e) {
		const { target } = e;
		const action = target?.getAttribute("data-action");
		const item = target?.getAttribute("data-item");

		if (action) {
			const targetExpanded = action === "expand" ? "false" : "true";
			const buttons = Array.from(this.el?.querySelectorAll(`[aria-expanded="${targetExpanded}"]`));
			const wasExpanded = action === "collapse";

			for (let button of buttons) {
				const buttonID = button.getAttribute("data-item");
				const ctrld = this.el?.querySelector(`#item${buttonID}-ctrld`);
				const contentHeight = ctrld.firstElementChild?.offsetHeight;

				this.animateItemAction(button,ctrld,contentHeight,wasExpanded);
			}

		} else if (item) {
			const button = this.el?.querySelector(`[data-item="${item}"]`);
			const expanded = button?.getAttribute("aria-expanded");

			if (!expanded) return;

			const wasExpanded = expanded === "true";
			const ctrld = this.el?.querySelector(`#item${item}-ctrld`);
			const contentHeight = ctrld.firstElementChild?.offsetHeight;

			this.animateItemAction(button,ctrld,contentHeight,wasExpanded);
		}
	}
}
//*** HISTORY PAGE_END ***//


//*** ACCOUNT INQUIRY PAGE ***//
$(document).ready(function () {
  $("#account-list").DataTable({
    //disable sorting on last column
    columnDefs: [{ orderable: false, targets: 5 }],
    language: {
      //customize pagination prev and next buttons: use arrows instead of words
      paginate: {
        previous: '<span class="fa fa-chevron-left"></span>',
        next: '<span class="fa fa-chevron-right"></span>',
      },
      //customize number of elements to be displayed
      lengthMenu:
        'Display <select class="form-control input-sm">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select> results",
    },
  });
});
//*** ACCOUNT INQUIRY PAGE ***//

//*** FOR SCROLL BUTTON ***//
function Scroller(options) {
  this.options = options;
  this.button = null;
  this.stop = false;
}
Scroller.prototype.constructor = Scroller;
Scroller.prototype.createButton = function () {
  this.button = document.createElement("button");
  this.button.classList.add("scroll-button");
  this.button.classList.add("scroll-button--hidden");
  this.button.textContent = "⏏";
  document.body.appendChild(this.button);
};

Scroller.prototype.init = function () {
  this.createButton();
  this.checkPosition();
  this.click();
  this.stopListener();
};
Scroller.prototype.scroll = function () {
  if (this.options.animate == false || this.options.animate == "false") {
    this.scrollNoAnimate();
    return;
  }
  if (this.options.animate == "normal") {
    this.scrollAnimate();
    return;
  }
  if (this.options.animate == "linear") {
    this.scrollAnimateLinear();
    return;
  }
};

Scroller.prototype.scrollNoAnimate = function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

Scroller.prototype.scrollAnimate = function () {
  if (this.scrollTop() > 0 && this.stop == false) {
    setTimeout(
      function () {
        this.scrollAnimate();
        window.scrollBy(
          0,
          -Math.abs(this.scrollTop()) / this.options.normal["steps"]
        );
      }.bind(this),
      this.options.normal["ms"]
    );
  }
};

Scroller.prototype.scrollAnimateLinear = function () {
  if (this.scrollTop() > 0 && this.stop == false) {
    setTimeout(
      function () {
        this.scrollAnimateLinear();
        window.scrollBy(0, -Math.abs(this.options.linear["px"]));
      }.bind(this),
      this.options.linear["ms"]
    );
  }
};

Scroller.prototype.click = function () {
  this.button.addEventListener(
    "click",
    function (e) {
      e.stopPropagation();
      this.scroll();
    }.bind(this),
    false
  );
  this.button.addEventListener(
    "dblclick",
    function (e) {
      e.stopPropagation();
      this.scrollNoAnimate();
    }.bind(this),
    false
  );
};

Scroller.prototype.hide = function () {
  this.button.classList.add("scroll-button--hidden");
};

Scroller.prototype.show = function () {
  this.button.classList.remove("scroll-button--hidden");
};

Scroller.prototype.checkPosition = function () {
  window.addEventListener(
    "scroll",
    function (e) {
      if (this.scrollTop() > this.options.showButtonAfter) {
        this.show();
      } else {
        this.hide();
      }
    }.bind(this),
    false
  );
};

Scroller.prototype.stopListener = function () {
  // stop animation on slider drag
  var position = this.scrollTop();
  window.addEventListener(
    "scroll",
    function (e) {
      if (this.scrollTop() > position) {
        this.stopTimeout(200);
      } else {
        //...
      }
      position = this.scrollTop();
    }.bind(this, position),
    false
  );

  // stop animation on wheel scroll down
  window.addEventListener(
    "wheel",
    function (e) {
      if (e.deltaY > 0) this.stopTimeout(200);
    }.bind(this),
    false
  );
};

Scroller.prototype.stopTimeout = function (ms) {
  this.stop = true;
  // console.log(this.stop); //
  setTimeout(
    function () {
      this.stop = false;
      console.log(this.stop); //
    }.bind(this),
    ms
  );
};

Scroller.prototype.scrollTop = function () {
  var curentScrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  return curentScrollTop;
};
// ------------------- USE EXAMPLE ---------------------
// *Set options
var options = {
  showButtonAfter: 200, // show button after scroling down this amount of px
  animate: "normal", // [false|normal|linear] - for false no aditional settings are needed
  // easy out effect
  normal: {
    // applys only if [animate: normal] - set scroll loop "distanceLeft"/"steps"|"ms"
    steps: 3, // more "steps" per loop => slower animation
    ms: 1000 / 60, // less "ms" => quicker animation, more "ms" => snapy
  },
  // linear effect
  linear: {
    // applys only if [animate: linear] - set scroll "px"|"ms"
    px: 80, // more "px" => quicker your animation gets
    ms: 1000 / 60, // Less "ms" => quicker your animation gets, More "ms" =>
  },
};
// *Create new Scroller and run it.
var scroll = new Scroller(options);
scroll.init();
//*** FOR SCROLL BUTTON_END ***//



