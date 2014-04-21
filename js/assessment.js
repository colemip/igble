if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.assessment) { window.igble.proj.assessment = {}; }

igble.proj.assessment = {	
	
		player_score: 0,
		timer_value: 0,
		difficulty: 'easy', // default difficulty
		
		feedback: {			
			prompts: {
				'easy': {
					subject: 'Choose the subject and drag it to its appropriate location.',
					verb: 'Choose the verb and drag it to its appropriate location.',
					adj: 'Drag the adjectives that modify the subject.',
					adv: 'Drag the adverbs that modify the verbs, adjectives, and other adverbs.',
					adj_more: 'Are there any more adjectives that modify this noun?'
				},
				'medium': {
					subject: 'Select each word in the subject clause.',
					verb: 'Select each word in the verb clause.',
					adj: 'Place the adjectives that modify the subject',
					adv: 'Drag the adverbs that modify the verbs, adjectives, and other adverbs.',
					adj_more: 'Are there any more adjectives that modify this noun?'
				}
			},		
			hints: {
				pos_purpose: {
					subject: 'Is this the subject of the sentence? An object?',
					noun: 'Is this the subject of the sentence? An object?',
					verb: 'Does this represent an action taken by the subject?',
					adj: 'What word does this modify?',
					adv: 'What word does this modify?'
				}
			},	
			errors: {
				adj: 'This is an adjective.',
				noun: 'This is a noun',
				adverb: 'This is an adverb.'
			}
		},
		
		subject_clause: ['The', 'brown', 'fox', 'with', 'the', 'bushy', 'tail'];
		verb_clause: ['runs', 'swiftly],
		
		
		/* ------------------------------------
		 model of player's problem areas
		------------------------------------*/
		player_errors: {
			subject: 0,
			noun: 0,
			verb: 0,
			adj: 0,
			adv: 0
		},
		
		init: function() {
			console.log("init assessment");
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
		onIncorrectInput: function() {
			switch(igble.proj.assessment.difficulty) {
				case 'easy':
					console.log("Bad Drop!");
					break;
				case 'medium':
					break;
				case 'hard':
					break;
				default:
					break;
			}
		},
		
		highlight: function(selector) {
			console.log("highlighting");
			$(selector).first().effect({
				effect: 'highlight',
				duration: 1000
			});
		},
		
		checkClause: function(clauseType) {
			// get all selected tokens
			var isCorrectClause = true; // assume the best
			var activeClause = igble.proj.assessment[clauseType+'_clause'];

			$('#token-bank .selected').each(function() {
				if( activeClause.indexOf($(this).text() < 0 ) {
					isCorrectClause = false;
					break;
				}				 
			});
			
			return isCorrectClause;
		}		
};

$(document).ready(function() {
	igble.proj.assessment.init();
});