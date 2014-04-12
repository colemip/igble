if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.assessment) { window.igble.proj.assessment = {}; }

igble.proj = {	
	assessment : {
		player_score: 0,
		
		getPlayerScore: function() {
			return igble.proj.assessment.player_score;
		}
		
	}
};