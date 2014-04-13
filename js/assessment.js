if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.assessment) { window.igble.proj.assessment = {}; }

igble.proj.assessment = {	
	
		player_score: 0,
		timer_value: 0,
		
		init: function() {
			igble.proj.assessment.updateTimer();
		},
		
		getPlayerScore: function() {
			return igble.proj.assessment.player_score;
		},
		
		updatePlayerScore: function(amount) {
			this.player_score += amount;
			$('#score').text(this.getPlayerScore());
		},
		
		updateTimer: function() {
			igble.proj.assessment.timer_value++;
			if(igble.proj.assessment > 10) return;
			$('#timer').text(igble.proj.assessment.timer_value);		
			setTimeout(igble.proj.assessment.updateTimer, 1000);
			
		}			
};

$(document).ready(function() {
	igble.proj.assessment.init();
});