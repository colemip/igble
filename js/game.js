if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.game = {
	
	difficulty: 1,
	
	init: function() {
		console.log("game loaded");
		this.start();
	},
	
	start: function() {
		this.updateInstructions(igble.proj.assessment.feedback.prompts.subject);
	},
	
	updateInstructions: function(instructions) {
		$('#instructions').text(instructions);
		igble.proj.assessment.highlight('instructions-container');
	},
	
	next: function(pos) {
		switch(pos) {
			case 'subject':
				this.updateInstructions(igble.proj.assessment.feedback.prompts.verb);
				break;
			case 'verb':
				this.updateInstructions(igble.proj.assessment.feedback.prompts.adj);
			default:
				break;
		}
	},
	
	/**
	 * ------------------------------------------------------------------------------------------ 
	 * Play audio element with given id 
	 * 
 	 * @param {Object} audioElementId
 	 * ------------------------------------------------------------------------------------------
	 */
	play: function(audioElementId) {
		var audio = $(audioElementId).get(0);
		audio.play();
		// pause audio after timeout
		setTimeout(function() {	
			audio.pause();	
			audio.currentTime = 0;
		}, 800);
	}
};

$(document).ready(function() {
	igble.proj.game.init();
});	