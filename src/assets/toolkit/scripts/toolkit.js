/**
 * Toolkit JavaScript
 */
// jshint unused:false
// jshint esnext: true

'use strict';


const $ = require('jquery');
const moment = require('moment');
const axios = require('axios');





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
	zipCode: '',
	init: function() {
		let that = this;
		
		that.eventListener();
		that.skycons = new Skycons({"color": "black"});
		that.getLatitudeLongitudegetWeather();
		
	},
	loadingScreen: function(){
		let that = app;
		that.loader = $('.loading-screen');
	},
	eventListener: function(){
		let that = this;
		
		$('body').on('click','.card',that.flipCard);
		$('.reload').on('click',that.reload);
		$('.search').on('submit','form',that.getNewZip);
	},
	reload: function (){
		let that = app;
		//check that we dont have a new Zip
		that.getLatitudeLongitudegetWeather(that.zipCode);
	},
	getNewZip: function(e){
		let that = app;

		e.preventDefault();
		that.zipCode = $('input[name=search]').val()
		that.getLatitudeLongitudegetWeather(that.zipCode);
	},
	flipCard: function(e) {	
		let that = app;

		if($(this).hasClass('active')){
			$(this).removeClass('active');
			//hide the clone
			
		}else{
			 $('.card').find('.card-ten-hour').removeClass('expand');
			$('.card').removeClass('active');
			$(this).addClass('active');
			$(this).one("transitionend webkitTransitionEnd ", that.expandCard);
		};
	},
	expandCard: function(){
		
		//Expand the Hours
		$(this).find('.card-ten-hour').addClass('expand');
	},
	getLatitudeLongitudegetWeather: function(address){
		let that = this;
		if (address === undefined || address === ''){
			address = "northfolk+va";
		}
		$.getJSON({
			url: 'http://maps.googleapis.com/maps/api/geocode/json?address='+address,
			type: 'GET',
			dataType: 'json'
		})
		.done(function(json) {
			
			$('.loading-screen').removeClass('close');
			$.each(json.results, function(key, value) {
		
			$('h2').html(value.formatted_address);
			});
			$('.current-weather').html('');
			if($('.card').length > 0){
				$('.current-weather').find('.card').fadeOut('slow',function(){
				
				$.each(json.results, function(key, value) {
					that.getWeather(value.geometry.location.lat,value.geometry.location.lng)
				});
			});
			}else{
				$.each(json.results, function(key, value) {
					that.getWeather(value.geometry.location.lat,value.geometry.location.lng)
				});
			}
			
			
		})
		.fail(function(jqXHR, textStatus) {
			//console.log(textStatus);
		});
	},
	hourlyTemplate: function(key,obj){
		return  `<li> ${obj.summary}  ${obj.temperature} &#8457; ${moment.unix(obj.time).format('hh:mm a')}</li>`
	},
	weatherCard: function(key,obj,hourly){
		let that = this;
		//console.log(that.getTenHour(hourly,obj.time))
			return `<div class="card card-${key}">
				<div class="card-content">
					<div class="card-icon" data-icon="${obj.icon}"><canvas id="${obj.icon}${key}" width="128" height="128"></canvas></div>
					<div class="card-summary">${obj.summary}</div>
					<div class="card-apparentTemperatureMax">Max Temp: ${obj.apparentTemperatureMax} &#8457;</div>
					<div class="card-apparentTemperatureMin">Min Temp: ${obj.apparentTemperatureMin} &#8457;</div>
					<div class="card-humidity">Humidity: ${obj.humidity}</div>
					<div class="card-visibility">Visibility: ${obj.visibility} mi</div>
					<div class="card-windSpeed">Wind Speed: ${obj.windSpeed} mph</div>
					<div class="card-time">${moment.unix(obj.time).format('MMMM Do YYYY')}</div>
				</div>
				<div class="card-ten-hour">
					<div class="hourly">
						<div class="loading">LOADING DATA....</div>
					</div>
				</div>
			</div>`
		

	},
	getTenHour: function(data,date){
		let that = this;
		let count= 0;
		let $theUL = $('<ul></ul>');
		
		$.each(data, function(key,value) {
			if(moment.unix(date).format('MMMM Do YYYY') === moment.unix(value.time).format('MMMM Do YYYY') ){
				$theUL.append(that.hourlyTemplate(key,value));
			};
		});

		return $theUL
		
	},
	getWeather: function(lat,long){
		let that = this;
		that.lat = lat;
		that.long = long;
		 let $test = $.getJSON('https://api.forecast.io/forecast/c641f783a18d89fe2ec4bc1234e31290/'+lat+',' + long  + "?callback=?",
		 	{
		 		extend: 'hourly',
		 		exclude: "minutely,alerts, flags"
		 	}
		 	,function (insta) {			
		}) .done(function(json) {
			let hourly = json.hourly.data;
			//Add the summary for the week
			that.mainSummary(json.daily.summary,json.daily.icon)
		
			$.each(json.daily.data, function(key,value) {
				let hourlyweather = that.getTenHour(hourly,value.time)
				$('.current-weather')
				.append($(that.weatherCard(key,value,hourly)))
				.find('.card-'+key+' .hourly').append(hourlyweather);
				console.log($('.current-weather').find('.card-'+key+' .hourly'))
			});

			$('.loading-screen').addClass('close');
			//Start the Icons
			that.initIcons();

		  })
		  .always(function() {
		   
		  });
		
	},
	mainSummary: function(summary,iconData){
		let that = this;
		//Get the p and add summary
		$('p').html(summary);
		$('body').addClass(iconData);
		that.skycons.add('weekly',iconData);
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