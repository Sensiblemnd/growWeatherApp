/**
 * Toolkit JavaScript
 */
// jshint unused:false
// jshint esnext: true

'use strict';


const $ = require('jquery');



let app = {
	init: function() {
		let that = this;
		that.eventListener();
	},
	eventListener: function(){
		let that = this;
		
	},
	favorite: function(){
		console.log('favorite');
	},
	getPhotos: function(){
		console.log('get photos');
	},
	filterDuplicatePhotos: function(){
		console.log('filter!');
	}
};

app.init();