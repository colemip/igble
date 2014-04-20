if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.dragDrop = {	
						
	init: function() {
		// igble.proj.dragDrop.splitIntoDraggables("This is a sentence");
		
		// setup token bank
		var tokenBank = {
			immediate: {
				tokens:	
				[
					{
						text: 'The',
						pos: 'adjective',
						role: 'adjective'
					},
					{
						text: 'brown',
						pos: 'adjective',
						role: 'adjective'
					},
					{
						text: 'fox',
						pos: 'noun',
						role: 'subject'
					},
					{
						text: 'with',
						pos: 'prep',
						role: 'prep'
					},
					{
						text: 'the',
						pos: 'adjective',
						role: 'adjective'
					},
					{
						text: 'bushy',
						pos: 'adjective',
						role: 'adjective'
					},
					{
						text: 'tail',
						pos: 'noun',
						role: 'noun'
					},
					{
						text: 'runs',
						pos: 'verb',
						role: 'verb'
					},
					{
						text: 'up',
						pos: 'prep',
						role: 'prep'
					},
					{
						text: 'the',
						pos: 'adjective',
						role: 'adjective'
					},
					{
						text: 'hill',
						pos: 'noun',
						role: 'noun'
					},
					
				]
			},
			
			delayed: {
				tokens: [
					{}
				]
			}
		
		};		
		igble.proj.dragDrop.addToTokenBank(tokenBank.immediate.tokens);
		
		// setup draggables
		// $('.draggable').draggable({
			// revert: 'invalid'
		// });
// 		
		// // setup droppables
		// $('.droppable').droppable({
			// accept: '.draggable', 
			// activate: 
				// function(event, ui) {},
// 						
		// });
		// make stage droppable -- necessary?
		$('#diagram-stage').droppable({});
		
		
		
		$('.draggable-token').draggable({
			drag: function(event, ui) {
				var draggable = $(this).clone();
				igble.proj.dragDrop.onDrag(draggable);				
			},
			helper: 'clone',
			revert: 'invalid',			
		});
		
		igble.proj.dragDrop.makeDroppable($('.droppable-token'));
		igble.proj.dragDrop.makeTokenBankDroppable();
		// $('#token-bank').selectable({
			// selected: function(event, ui) {
				// $(ui.selected).addClass('correct');
			// }
		// });
		
		// setup DOM mutation observer
		// igble.proj.dragDrop._initMutationObserver();
		igble.proj.dragDrop._initAllAdjGroupMutObs();
		
		// igble.proj.dragDrop.updateInstructions();
	},
	
	/**
	 * --------------------------------------------------------------------------------------
	 * Attach draggable functionality to an element or group of elements
	 * 
	 * @param element -- element or group of elements to make draggable
	 * -------------------------------------------------------------------------------------- 
	 */
	makeDraggable: function(element) {
		$(element).draggable();			
		$(element).addClass('draggable-token');	
	},
	
	
	/** 
	 * --------------------------------------------------------------------------------------
	 * Sets droppable properties for all words in token bank 
	 * 
	 * @param none
	 * --------------------------------------------------------------------------------------
	 */
	makeTokenBankDroppable: function() {
		console.log($('#token-bank').children());
		$('#token-bank').children().droppable({
			accept: '.draggable-token.dropped',
			activate: function(event, ui) {console.log("activating droppable token bank token");},
			deactivate: function(event, ui) {console.log("deactivating droppable token bank token");},
			drop: function(event, ui) {
				console.log("returning to token bank");
				$(this).text($(ui.draggable).text());
				// $(this).addClass('dropped');				
				igble.proj.dragDrop.onDrop(ui.draggable, $(this));
				$(ui.draggable).hide();
			},
			hoverClass: 'hover',
			tolerance: 'intersect'
		});
		
		$('#token-bank').children().addClass('droppable-token');
	},
	
	
	/**
	 * --------------------------------------------------------------------------------------
	 * Attach droppable functionality to an element or group of elements
	 * 
	 * @param element -- element or group of elements to make droppable
	 * -------------------------------------------------------------------------------------- 
	 */
	makeDroppable: function(element) {
		$(element).droppable({
			accept: '.draggable-token',
			activate: function(event, ui) {},
			deactivate: function(event, ui) {},
			drop: function(event, ui) {
				$(this).text($(ui.draggable).text());
				$(this).addClass('dropped');		
				$(ui.draggable).addClass('used');		
				igble.proj.dragDrop.onDrop(ui.draggable, $(this));
				// $(ui.draggable).hide();
				// check if token is placed correctly
				if(igble.proj.dragDrop.dropSucceeds($(this), ui.draggable)) {
					// update player score
					igble.proj.assessment.updatePlayerScore(1);
					$(this).addClass('correct');
					igble.proj.game.play('#audio-success');
				} else {
					// update player score
					igble.proj.assessment.updatePlayerScore(-1);
					$(this).addClass('incorrect');
					igble.proj.assessment.onIncorrectInput();
				}
			},
			hoverClass: 'hover',
			tolerance: 'intersect'
		});
	},
	
	/**
	 * --------------------------------------------------------------------------------------
	 * Make element droppable in token work
	 * 
	 * @param element -- element to allow dropping in token bank
	 * -------------------------------------------------------------------------------------- 
	 */
	makeDroppableInTokenBank: function(element) {
		
	},
	
	onDrag: function(element) {
	},
	
	onDrop: function(draggable, droppable) {
		igble.proj.dragDrop.makeDraggable(droppable);
		switch($(draggable).data('pos')) {
			case 'subject':
				
				break;
			case 'noun':
				break;
			case 'adjective':				
				igble.proj.dragDrop._onDropAdj(droppable);
				break;
			case 'adverb':
				igble.proj.dragDrop._onDropAdverb(droppable);
				break;
			case 'verb':
				igble.proj.dragDrop._onDropVerb(droppable);
				break;
			default:
				break;
		}	
	},
	
	/**
	 * ------------------------------------------------------------------------------------------
	 * Triggers when an adjective is dropped
	 * 
	 * @param 
	 * ------------------------------------------------------------------------------------------
	 */
	_onDropAdj: function(element) {
		console.log('onDrop() adj');
		console.log(element);
		$(element).parent('.adjective-group').append("<span class='droppable-token adjective' data-pos='adjective' data-role='adjective'></span>");
		$(element).append("<div class='adverb-group'></div>");
		$(element).find('.adverb-group').append("<div class='droppable-token adverb'></div>");
		igble.proj.dragDrop.makeDroppable($(element).find('.adverb'));									
		$(element).css('top', '-1.0em');
		$(element).rotate({angle: 30, center: ["0%", "0%"]});
	},
	
	_onDropAdverb: function(element) {
		console.log('onDrop() adv');
		$(element).parent('.adverb-group').append("<span class='droppable-token adverb' data-pos='adv'></span>");
		$(element).append("<span class='droppable-token adverb' data-pos='adv'></span>");
		// $(element).find('.adverb-group').append("<div class='droppable-token adverb'></div>");
		igble.proj.dragDrop.makeDroppable($(element).find('.adverb'));									
		$(element).css('top', '-1.0em');
		$(element).rotate({angle: 30, center: ["0%", "0%"]});
	},
	
	
	_onDropVerb: function(element) {
		console.log('onDrop() verb');
		$(element).append($("<div class='adverb-group'></div>").append("<span class='droppable-token adverb' data-pos='adv'></span>"));
		igble.proj.dragDrop.makeDroppable($(element).find('.droppable-token.adverb'));
	},
	
	/**
	 * ------------------------------------------------------------------------------------------ 
	 * Determines if draggable was correctly placed on droppable
	 * 
 	 * @param {Object} draggable
 	 * @param {Object} droppable
 	 * @return boolean
 	 * ------------------------------------------------------------------------------------------
	 */
	dropSucceeds: function(draggable, droppable) {
		if($(draggable).data('role') && $(droppable).data('role')) {			
			return $(draggable).data('role') === $(droppable).data('role');
		} 
	},
	
	
	/**
	 * Returns true if correct token is clicked 
	 */
	correctTokenChoice: function() {
		
	},
	
	splitIntoDraggables: function(string) {
		var words = string.split(' ');
		for(var i=0; i < words.length; i++) {
			var word = words[i];
			var $draggableWord = $("<div class='draggable token'></div>");
			$draggableWord.append(word);
			igble.proj.dragDrop.makeDraggable($draggableWord);
			$('main').append($draggableWord);
		}
	},
		
	_initAllAdjGroupMutObs: function() {
		var $allAdjGroups = $('.adjective-group');
		$allAdjGroups.each(function() {
			igble.proj.dragDrop._initAdjGroupMutObs(this);
		});	
	},
	
	_initAdjGroupMutObs: function(group) {
		var target = group;
		
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function(mutation) {
				var newNodes = mutation.addedNodes;
				if(newNodes !== null) { // if new nodes added
					var $nodes = $(newNodes);
					$nodes.each(function() {
						var $node = $(this);
						var childCount = $(target).children().length; 
						igble.proj.dragDrop.makeDroppable($node);
						$node.css('left', childCount*8 - 6 + 'em');
					});
				}
			});
		});
						
		var observerConfig = {
			attributes: true, 
			childList: true, 
			characterData: true 
		};

		observer.observe(target, observerConfig);
	},
	
	/**
	 * ------------------------------------------------------------------------------------------
	 * Takes array of token objects and populate token bank
	 * 
	 * @param tokenBank
	 * ------------------------------------------------------------------------------------------ 
	 */
	addToTokenBank: function(tokens) {
		var $tokenBank = $('#token-bank');
		console.log(tokens);
		$(tokens).each(function(key, value) {
			$tokenBank.append("<span class='draggable-token token rounded " + value.pos + "' data-role='" + value.role + "' data-pos='" + value.pos + "'>" + value.text + "</span>");	
		});
		
	}
	
	


};

$(document).ready(function() {
	igble.proj.dragDrop.init();
});
