(function(global, undefind) {

	'use strict';

	var calendar = function(element, options) {
		var _this = this;
		_this.myDate = new Date(); //获取当前日期
		_this.newDate = _this.myDate.getDate(); //今天几号
		_this.newDay = _this.myDate.getDay(); //今天周几
		_this.newMonth = _this.myDate.getMonth(); // 这是几月
		_this.newFullYear = _this.myDate.getFullYear(); // 这是哪年

		options = options || {};
		var defaults = {
			calenderScroll: false, //滚动加载 
			checkCalender: false, //选多个日期 
			topcalendarTop: options.calendarTop || '38px', //日历展示的top值
			beforeToday: false, //今天之前不可选呢
			afterToday: false //今天之后不可选呢

		};

		_this._element = $(element);
		_this._options = $.extend({}, defaults, options); 
		_this._element.show();
		_this.init();
	};
	//默认加载
	calendar.prototype.init = function() {
		var _this = this;
		console.log(this._element)
		_this._element.html('');
		//月超12，年加1，月归0;
		for(var i = 0; i < 1; i++) {
			_this.newMonth++
				if(_this.newMonth > 11) {
					_this.newMonth = 0;
					_this.newFullYear += 1;
				}

			this._element.append(_this.calendarCon(_this.newFullYear, _this.newMonth));

		}
		 

		if(!_this._options.checkCalender) {
			_this._element.css({
				'top': _this._options.topcalendarTop
			})
		}

		_this.calendarConter();
		_this.calendarClick();
	}

	//创建日历
	calendar.prototype.calendarCon = function(newYears, newMonths) {
		var _this = this;

		console.log(newYears, newMonths)
		var oldDate = new Date(newYears, newMonths);
		var calendarList;
		oldDate.setMonth(newMonths);
		oldDate.setDate(0);
		var newDayNum = oldDate.getDate(0); //获取天数

		oldDate.setDate(1);
		var emptyAll = oldDate.getDay(); //获取每月空白数量	

		if(_this.newMonth == 0) {
			newYears -= 1;
		}
		newMonths = newMonths == 0 ? 12 : newMonths;
		newMonths = newMonths > 9 ? newMonths : '0' + newMonths;
		//是否多选日历现实确定按钮
		if(_this._options.checkCalender) {
			calendarList =
				'<div class="dateTimeInput">' +
				'<input type="text" placeholder="请输入日期" />' +
				'</div>';
			calendarList +=
				'<div class="calendar-btn"><p>' +
				'<a class="leftbtnYear" href="javascript:;">&lt;&lt;</a>' +
				'<a class="leftbtn ml5" href="javascript:;">&lt;</a>' +
				'</p>';
		} else {
			calendarList =
				'<div class="calendar-btn"><p>' +
				'<a class="leftbtnYear" href="javascript:;">&lt;&lt;</a>' +
				'<a class="leftbtn ml5" href="javascript:;">&lt;</a>' +
				'</p>';
		}
		calendarList += '<h3>' + newYears + ',' + newMonths + '</h3>';
		calendarList +=
			'<p>' +
			'<a class="rightbtn" href="javascript:;">&gt;</a>' +
			'<a class="rightbtnYear ml5" href="javascript:;">&gt;&gt;</a>' +
			'</p></div>';

		calendarList +=
			'<ol class="title">' +
			'<li>日</li>' +
			'<li>一</li>' +
			'<li>二</li>' +
			'<li>三</li>' +
			'<li>四</li>' +
			'<li>五</li>' +
			'<li>六</li>' +
			'</ol>';
		calendarList += '<div class="content"><div class="list">';
		//		calendarList += '<h3>' + newYears + '日' + newMonths + '月</h3>';
		calendarList += '<ul>';
		if(emptyAll > 0) {
			for(var j = 0; j < emptyAll; j++) {
				calendarList += ('<li></li>');
			}
		}

		//判断是否是这个月
		if((_this.myDate.getMonth() + 1) == newMonths && _this.myDate.getFullYear() == newYears) {
			for(var i = 1; i <= newDayNum; i++) {
				var days = i > 9 ? i : '0' + i;
				if(i < _this.newDate) { // 今日以前

					if(_this._options.beforeToday) {
						calendarList += ('<li _date="' + newYears + '-' + newMonths + '-' + days + '" class="disabled" >' + days + '</li>');
					} else {
						calendarList += ('<li _date="' + newYears + '-' + newMonths + '-' + days + '" >' + days + '</li>');
					}

				} else if(i == _this.newDate) { //今日

					calendarList += ('<li _date="' + newYears + '-' + newMonths + '-' + days + '"   >' + days + '</li>');
				} else { //今日以后

					if(_this._options.afterToday) {
						calendarList += ('<li _date="' + newYears + '-' + newMonths + '-' + days + '" class="disabled" >' + days + '</li>');
					} else {
						calendarList += ('<li _date="' + newYears + '-' + newMonths + '-' + days + '" >' + days + '</li>');
					}
				}
			}
		} else {
			for(var i = 1; i <= newDayNum; i++) {
				var days = i > 9 ? i : '0' + i;
				calendarList += ('<li _date="' + newYears + '-' + newMonths + '-' + days + '" >' + days + '</li>');
			}
		}
		calendarList += '</ul>' +
			'</div></div>';
		//是否多选日历现实确定按钮
		if(_this._options.checkCalender) {
			calendarList +=
				'<div class="bottom-btn">' +
				'<a  class="sure-btn disabled" href="javascript:;">确定</a>' +
				'</div>';
		}
		$(".calendar .calendar-btn h3").html(newYears + "," + newMonths)
		return calendarList;
	};

	//滚动加载更多
	calendar.prototype.calendarConter = function() {
		var _this = this;

		if(_this._options.calenderScroll) {
			_this._element.find('content').on("resize scroll", function() {
				var windowHeight = _this._element.find('content').height(); //当前窗口的高度             
				var scrollTop = _this._element.find('content').scrollTop(); //当前滚动条从上往下滚动的距离            
				var docHeight = _this._element.find(".content .list").height() * _this._element.find(".content .list").length; //当前文档的高度 
				//console.log(scrollTop, windowHeight, docHeight);
				//换句话说：（滚动条滚动的距离 + 窗口的高度 = 文档的高度）  这个是基本的公式  
				if((scrollTop + windowHeight - 20) >= docHeight) {
					monthNum++;

					//月超12，年加1，月归0;
					for(var i = 0; i < monthNum; i++) {
						newMonth++
						if(newMonth > 11) {
							newMonth = 0;
							newFullYear += 1;
						}
						_this._element.find(".content").append(calendarCon(newFullYear, newMonth))
					}
				}
			});
		}
	}

	//点击事件
	calendar.prototype.calendarClick = function() {
		var _this = this;
		var newMonth = _this.myDate.getMonth() + 1; // 这是几月  

		//多选日期
		let startCalender = ''; //开始日期
		let endCalender = ''; //结束日期
		let clickNum = 0; //点击的次数 
		//上一年/下一年/上一月/下一月
		_this._element.on('click', ' .calendar-btn a', function() {
			//console.log(startCalender, endCalender)

			if($(this).hasClass('rightbtn')) {
				_this.newMonth++;
			} else if($(this).hasClass('leftbtn')) {
				_this.newMonth--;
			} else if($(this).hasClass('rightbtnYear')) {
				_this.newFullYear++;
			} else if($(this).hasClass('leftbtnYear')) {
				_this.newFullYear--;
			}
			if(_this.newMonth > 11) {
				_this.newMonth = 0;
				_this.newFullYear += 1;
			} else if(_this.newMonth <= 0) {
				_this.newMonth = 12;
				_this.newFullYear -= 1;
			};

			//			console.log(newFullYear, newMonth)
			_this._element.html('');
			_this._element.append(_this.calendarCon(_this.newFullYear, _this.newMonth));

			if(clickNum == 1) {
				_this._element.find('.content .list ul li').hover(function() {
					endCalender = $(this).attr('_date');
					//console.log(endCalender)
					checkCalenders();
				})
			} else {
				checkCalenders();
			}

			compareDate();
		})

		// 根据起始日期和结束日期获取时间段数组
		function getAllDate(day1, day2) {

			var getDate = function(str) {
				var tempDate = new Date();
				var list = str.split("-");
				tempDate.setFullYear(list[0]);
				tempDate.setMonth(list[1] - 1);
				tempDate.setDate(list[2]);
				return tempDate;
			}
			var date1 = getDate(day1);
			var date2 = getDate(day2);
			var dateArr = [];
			var i = 0;
			if(day1 != day2) {
				if(date1 > date2) {
					var tempDate = date1;
					date1 = date2;
					date2 = tempDate;
				}
				date1.setDate(date1.getDate() + 1);

				while(!(date1.getFullYear() == date2.getFullYear() &&
						date1.getMonth() == date2.getMonth() &&
						date1.getDate() == date2.getDate())) {
					var dayStr = date1.getDate().toString();
					if(dayStr.length == 1) {
						dayStr = "0" + dayStr;
					}
					var monthStr = (date1.getMonth() + 1) < 10 ? "0" + (date1.getMonth() + 1) : date1.getMonth() + 1;
					dateArr[i] = date1.getFullYear() + "-" + monthStr + "-" +
						dayStr;
					i++;
					date1.setDate(date1.getDate() + 1);
				}
				dateArr.splice(0, 0, day1);
				dateArr.push(day2);
			} else {
				dateArr.push(day1)
			}

			return dateArr;
		}

		//选中日期添加hover
		function checkCalenders() {
			if(startCalender && endCalender) {
				let getAllCalender = [];
				getAllCalender = getAllDate(startCalender, endCalender);
				_this._element.find('.content .list ul li').removeClass('hover endDate')
				getAllCalender.forEach((item) => {
					_this._element.find('.content .list ul li').each(function() {
						if(item == $(this).attr("_date")) {
							$(this).addClass('hover');
						} else if(startCalender == $(this).attr("_date")) {
							$(this).addClass('startDate');
						} else if(endCalender == $(this).attr("_date")) {
							$(this).addClass('endDate');
						}
					})
				})
			}

		}

		//比较开始日期和结束日期
		function compareDate() {

			let startTime = new Date(Date.parse(startCalender));
			let endTime = new Date(Date.parse(endCalender));
			if(clickNum == 2) { 
				if(startTime < endTime) {
					_this._element.find('.dateTimeInput input').val(startCalender + ' ~ ' + endCalender)
				} else {
					_this._element.find('.dateTimeInput input').val(endCalender + ' ~ ' + startCalender)
				}
			}
		}

		//选择日期

		_this._element.on('click', ' .content .list ul li', function() {
			var that = $(this);

			if(!$(this).hasClass('disabled') && $(this).html() != '') {
				if(_this._options.checkCalender) {

					clickNum++;

					//clickNum 点击次数，如果是一次，那么就开始时间 ，点击俩次是结束时间，点击三次归于一次
					if(clickNum == 1) {
						that.addClass('startDate');
						startCalender = that.attr('_date');
						console.log(111)
						$(this).parent('ul').children('li').hover(function() {
							endCalender = $(this).attr('_date');
							//console.log(endCalender)
							checkCalenders();
						})

						_this._element.find('.bottom-btn .sure-btn').addClass('disabled')
						_this._element.find('.dateTimeInput input').val('')
					} else if(clickNum == 2) {
						endCalender = that.attr('_date');
						//console.log(endCalender)
						that.addClass('endDate');
						checkCalenders();

						compareDate();  
						
						_this._element.find('.bottom-btn .sure-btn').removeClass('disabled')
						$(this).parent('ul').children('li').off('mouseenter').unbind('mouseleave');
					} else if(clickNum == 3) {
						clickNum = 1;
						startCalender = that.attr('_date');

						$(this).parent('ul').children('li').each(function() {
							$(this).removeClass();
						})
						that.addClass('startDate');

						$(this).parent('ul').children('li').hover(function() {
							endCalender = $(this).attr('_date');
							checkCalenders();
						})
						
						_this._element.find('.bottom-btn .sure-btn').addClass('disabled')
						_this._element.find('.dateTimeInput input').val('')
					}

				} else {
					_this._element.hide();
					$(this).css('border-radius', '3px');
					$(this).addClass('active').siblings().removeClass('active');
					_this._element.siblings('input').val($(this).attr('_date'));
				}
			}

		});

		//点击确定按钮
		_this._element.on('click', '.bottom-btn .sure-btn', function() {
			
			if(!$(this).hasClass('disabled')){
				_this._element.siblings('input').val(_this._element.find('.dateTimeInput input').val());
				_this._element.hide();
			}
			

		})

	}

	global.calendar = calendar;

})(window);