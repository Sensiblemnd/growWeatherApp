/**
 * Toolkit JavaScript
 */
// jshint unused:false
// jshint esnext: true

'use strict';


const $ = require('jquery');
// const React = require('react');
// const reactRouter = require('react-router');
// const reactDom = require('react-dom');
const moment = require('moment');
const axios = require('axios');

// class card extends React.Component {
//   render () {
//     return <p> Hello React!</p>;
//   }
// }
// render(<card/>, document.getElementById('app'));






let config = {
	debug: true,
	istouch:false,
	touchOrClick: '',
	init: function(){
		let $htmlElem=$('html');
		this.istouch = $htmlElem.hasClass('touch')? true : false;
		this.touchOrClick = this.istouch? 'touchend' :'click' ;
	}

};
config.init();
let  log = {
	InstagramImage: '',
	debug: function(content){
		if ((window.console && window.console.log) && config.debug){
			console.log(content);
		}
	}
};

let app = {
	InstagramImage: '',
	init: function() {
		let that = this;
		
		that.eventListener();
		that.skycons = new Skycons({"color": "black"});
		that.getLatitudeLongitudegetWeather();
		// that.skycons.add("icon1", Skycons.PARTLY_CLOUDY_DAY);
		// that.skycons.play();
	},
	loadingScreen: function(){
		that.loader = $('.loading-screen');
	},
	eventListener: function(){
		let that = this;
		
		$('body').on('click','.card',that.flipCard);

	
	

	},
	flipCard: function(e) {	
		let that = app;

		if($(this).hasClass('active')){
			$(this).removeClass('active');
			//hide the clone
			
		}else{
			$('.card').removeClass('active');
			$(this).addClass('active');

			$(this).one("transitionend webkitTransitionEnd ", that.expandCard);
			
			
		};
	},
	expandCard: function(){
		 $('.card').find('.card-ten-hour').removeClass('expand');
		//Expand the Hours
		$(this).find('.card-ten-hour').addClass('expand');
	},
	// cloneCard: function(ele){
	// 	let that = this;
	// 	let $clone = $('.card-clone');
	// 	let $element = $(ele);
		
	// 	let element = {
	// 		'top': 0,
	// 		'left': 0,
	// 		'width': 0,
	// 		'height': 0
	// 	};

		

	// 	let offset = $element.offset();
	// 	element.top = offset.top - $(document).scrollTop();
	// 	element.left = offset.left;
	// 	element.width = $element.width();
	// 	element.height = $element.height();

	// 	 $clone.html($element.html());
	// 	that.initIcons(true);
		
	// 	$clone.css({
	// 	'display': 'block',
	// 	'top': element.top,
	// 	'left': element.left
	// 	});
	// 	that.cloneAnimate(ele);

	// },
	//cloneAnimate: function(){

		// let that = this;
		// let $clone = $('.card-clone');

		// $clone.find('.card-content').css({
		//   //  'transform': 'rotateY(0deg)'
		// });
		// $clone.find('card-ten-hour').css({
		//  //   'transform': 'rotateY(-180deg)'
		// });

		// $clone.on("transitionend webkitTransitionEnd oTransitionEnd", function (e) {
		// if (e.target === e.currentTarget) {
		// 	if (e.originalEvent.propertyName == 'top') {

		// 		//Toggle the clone state
		// 		cloneflipped = !cloneflipped;

		// 		//Detect if our clone has returned to the original position and then hide it
		// 		if (!cloneflipped) {
		// 			$(element).css('opacity', 1);
		// 			$($clone).hide();
		// 		} else {
		// 		//Need to dynamically alter contents of the clone rear AFTER it animates? Do it here
		// 		//$('#cloneBack').html('hi');
		// 		}
		// 	}
		// }
		// });
	//},
	getLatitudeLongitudegetWeather: function(address){
		let that = this;
		if (address === undefined){
			address = "northfolk+va";
		}
		$.getJSON({
			url: 'http://maps.googleapis.com/maps/api/geocode/json?address='+address,
			type: 'GET',
			dataType: 'json'
		})
		.done(function(json) {
			$.each(json.results, function(key, value) {
				that.getWeather(value.geometry.location.lat,value.geometry.location.lng)
			});
		})
		.fail(function(jqXHR, textStatus) {
			//console.log(textStatus);
		});
	},
	weatherCard: function(key,obj){
		
			return `<div class="card">
				<div class="card-content">
					<div class="card-icon" data-icon="${obj.icon}"><canvas id="${obj.icon}${key}" width="128" height="128"></canvas></div>
					<div class="card-summary">${obj.summary}</div>
					<div class="card-apparentTemperatureMax">Max Temp: ${obj.apparentTemperatureMax} &#8457;</div>
					<div class="card-apparentTemperatureMin">Min Temp: ${obj.apparentTemperatureMin} &#8457;</div>
					<div class="card-humidity">Humidity: ${obj.humidity}</div>
					<div class="card-visibility">Visibility: ${obj.visibility} mi</div>
					<div class="card-windSpeed">Wind Speed: ${obj.windSpeed} mph</div>
					<div class="card-time">${moment.unix(obj.time).format('MMMM Do YYYY, h:mm:ss a')}</div>
				</div>
				<div class="card-ten-hour">asdfasdfasdf</div>
			</div>`
		

	},
	getWeather: function(lat,long){
		let that = this;
		 let $test = $.getJSON('https://api.forecast.io/forecast/c641f783a18d89fe2ec4bc1234e31290/'+lat+',' + long  + "?callback=?",
		 	{
		 		extend: "hourly",
		 		exclude: "minutely,alerts, flags"
		 	}
		 	,function (insta) {			
		}) .done(function(json) {
			
			$.each(json.daily.data, function(key,value) {
				
				$('.current-weather').append($(that.weatherCard(key,value)));
			});

			$('.loading-screen').addClass('close');
			//Start the Icons
			that.initIcons();

		  })
		  .always(function() {
		   
		  });
		
	},

	initIcons: function(clone){
		let that = this;
		if(!clone){
		let icons = $('[ data-icon]');
		
		icons.each(function() {
			//icon to display
			let iconText = $( this ).data('icon');
			let iconCanvasID = $( this).find('canvas');
			
			that.skycons.add(iconCanvasID.get(0).id,iconText);
		})
		}
		else{
			// start the clone animation
			let $clone = $('.card-clone');
			let cloneIcon =$clone.find('[ data-icon]');
			
			let iconText = $( cloneIcon ).data('icon');
			let iconCanvasID = $( cloneIcon).find('canvas');
			that.skycons.add(iconCanvasID.get(0).id,iconText);
		}
		that.skycons.play();
	}
};

app.init();