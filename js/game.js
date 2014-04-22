if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.game = {
	
	difficulty: 'easy',
	
	init: function() {
		console.log("game loaded");
		this.start();
	},
	
	start: function() {
		this.updateInstructions(igble.proj.assessment.feedback.prompts[this.difficulty].subject);
	},
	
	updateInstructions: function(instructions) {
		$('#instructions').text(instructions);
		igble.proj.assessment.highlight('instructions-container');
	},
	
	next: function(role, isFinalForRole) {
		switch(role) {
			case 'subject':
				this.updateInstructions(igble.proj.assessment.feedback.prompts[this.difficulty].verb);
				break;
			case 'verb':
				this.updateInstructions(igble.proj.assessment.feedback.prompts[this.difficulty].adj);
			case 'adj':
				this.updateInstructions(igble.proj.assessment.feedback.prompts[this.difficulty].adj);
			case 'subject-adj':
				if(isFinalForRole)
					this.updateInstructions(igble.proj.assessment.feedback.prompts[this.difficulty].adv);
				else
					this.updateInstructions(igble.proj.assessment.feedback.prompts[this.difficulty].adj_more);
				break;
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
		audio.volume = 0.3;
		audio.play();
		// pause audio after timeout
		setTimeout(function() {	
			audio.pause();	
			audio.currentTime = 0;
		}, 800);
	},
	
	updateDifficulty: function(diff) {
		this.difficulty = diff;
		
		if(diff === 'easy') {
			$('#check-clause').hide();
		} else if(diff === 'medium') {
			$('#check-clause').show();
		}
	}
};

$(document).ready(function() {
	igble.proj.game.init();	
});	