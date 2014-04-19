if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.game = {
	
	difficulty: 1,
	
	init: function() {
		console.log("game loaded");
		igble.proj.game.start();
	},
	
	start: function() {
		igble.proj.game.displayPrompts();
	},
	
	displayPrompts: function() {
		alert(igble.proj.assessment.feedback.prompts.subject);
	},
	
	updateInstructions: function() {
		if(igble.proj.game.difficulty == 1) {
			$('#instructions').text('Please the subject into the diagram.');
		}
	}
};

$(document).ready(function() {
	igble.proj.game.init();
});	