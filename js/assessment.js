if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.assessment) { window.igble.proj.assessment = {}; }

igble.proj.assessment = {	
	
		player_score: 0,
		timer_value: 0,
		difficulty: 'easy', // default difficulty
		
		feedback: {			
			prompts: {
				subject: 'Choose the subject and drag it to its appropriate location.',
				verb: 'Choose the verb and drag it to its appropriate location.',
				adj: 'Drag the adjectives that modify the subject.',
				adv: 'Drag the adverbs that modify the verbs, adjectives, and other adverbs.',
			},		
			hints: {
				pos_purpose: {
					subject: '',
					noun: '',
					verb: '',
					adj: '',
					adv: ''
				}
			},	
			errors: {
				adj: 'This is an adjective.',
				noun: 'This is a noun',
				adverb: 'This is an adverb.'
			}
		},
		
		init: function() {
			// igble.proj.assessment.updateTimer();
		},
		
		/**
		 * ------------------------------------------------------------------------------------------
		 * Get player score
		 * 
		 * @param none
		 * @return int player_score
		 * ------------------------------------------------------------------------------------------
		 */
		getPlayerScore: function() {
			return igble.proj.assessment.player_score;
		},
		
		/**
		 * ------------------------------------------------------------------------------------------
		 * Updates player_score by @param amount
		 *   		
 		 * @param int amount
 		 * @return none
 		 * ------------------------------------------------------------------------------------------
		 */
		updatePlayerScore: function(amount) {
			this.player_score += amount;
			$('#score').text(this.getPlayerScore());
		},
		
		/**
		 * ------------------------------------------------------------------------------------------
		 * Update timer every second
		 * 
		 * @param none
		 * @return none
		 * ------------------------------------------------------------------------------------------ 
		 */
		updateTimer: function() {
			igble.proj.assessment.timer_value++;
			if(igble.proj.assessment.timer_value > 10) return;
			$('#timer').text(igble.proj.assessment.timer_value);		
			setTimeout(igble.proj.assessment.updateTimer, 1000);
			
		},
		
		/**
		 * ------------------------------------------------------------------------------------------
		 * Called on incorrect diagram placement
		 * 
		 * @param none
		 * @return none
		 * ------------------------------------------------------------------------------------------ 
		 */
		onIncorrectDrop: function() {
			
		}			
};

$(document).ready(function() {
	igble.proj.assessment.init();
});