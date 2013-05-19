(function ($) {
	$.widget('ui.scroll', {
		options: {
			scrollX: true,
			scrollY: true
		},
		_create: function () {
			var jThis = this.element;
			jThis.addClass('ui-scroll-content');
		
			var scrollWrapper = $('<div>').addClass('ui-scroll');
			scrollWrapper.appendTo(jThis.parent());
			
			jThis.appendTo(scrollWrapper);
			
			if (this.options.scrollX) {
				this._addScrollBar('x');
			}
			
			if (this.options.scrollY) {
				this._addScrollBar('y');
			}
		},
		_init: function () {
		},
		destroy: function () {
			var jThis = this.element;
			jThis.removeClass('ui-scroll-content');
			
			var scrollWrapper = jThis.parent();
			jThis.parent(scrollWrapper.parent());
			scrollWrapper.remove();
		},
		_addScrollBar: function (axis) {
			var jThis = this.element;
			var scrollWrapper = jThis.parent();
		
			var scrollBar = $('<div>').addClass('ui-scroll-bar ui-widget-content');
			scrollBar.appendTo(scrollWrapper);
			
			var scrollSlider = $('<div>').addClass('ui-scroll-slider ui-widget-header');
			scrollSlider.appendTo(scrollBar)
						.draggable({
							containment: scrollBar
						});
			
			var scrollGrip = $('<span>');
			scrollGrip.appendTo(scrollSlider);
			
			if (axis == 'x') {
				scrollBar.attr('role', 'scrollX');
				scrollSlider.attr('role', 'scrollX');
				scrollGrip.addClass('ui-icon ui-icon-grip-dotted-vertical');
			}
			else if (axis == 'y') {
				scrollBar.attr('role', 'scrollY');
				scrollSlider.attr('role', 'scrollY');
				scrollGrip.addClass('ui-icon ui-icon-grip-dotted-horizontal');
			}
			
			var scrollBars = scrollWrapper.children('div.ui-scroll-bar');
			if (scrollBars.length > 1) {
				scrollBars.addClass('ui-scroll-multi');
				
				var scrollFiller = $('<div>').addClass('ui-scroll-filler ui-widget-content');
				scrollFiller.appendTo(scrollWrapper);
			}
			
			var resizeHandler = function () {
				if (axis == 'x') {
					var width = jThis.width();
					var containerWidth = scrollBar.outerWidth();
					
					var scaleFactor = containerWidth / width;
					if (scaleFactor > 1) {
						scaleFactor = 1;
					}
					
					scrollSlider.width(containerWidth * scaleFactor - 2);
				}
				else {
					var height = jThis.height();
					var containerHeight = scrollBar.outerHeight(true);
					
					var scaleFactor = containerHeight / height;
					if (scaleFactor > 1) {
						scaleFactor = 1;
					}
					
					scrollSlider.height(containerHeight * scaleFactor - 2);
				}
			};
			
			scrollWrapper.resize(resizeHandler);
			this.element.resize(resizeHandler);
			
			resizeHandler();
			
			var scrollHandler = function () {
				function removeUnits(value) {
					return parseInt(value.replace('px', ''));
				}
				
				function calculatePosition(contentSize, scrollBarSize, scrollSliderSize, scrollSliderPosition) {
					var usableSpace = scrollBarSize - scrollSliderSize;
					var progress = scrollSliderPosition / usableSpace;
					
					var hiddenSpace = contentSize - scrollBarSize;
					
					return -1 * hiddenSpace * progress;
				}
			
				if (axis == 'x') {
					var position = removeUnits(scrollSlider.css('left'));
					jThis.css('left', calculatePosition(jThis.outerWidth(true),
														scrollBar.width(),
														scrollSlider.width(),
														position));
				}
				else {
					var position = removeUnits(scrollSlider.css('top'));
					
					jThis.css('top', calculatePosition(jThis.outerHeight(true),
													   scrollBar.height(),
													   scrollSlider.height(),
													   position));
				}
			}
			
			scrollSlider.on('drag', scrollHandler);
		}
	});
})(jQuery);
