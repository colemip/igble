if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.dragDrop = {	
						
	init: function() {		
		// setup token bank
		var tokenBank = {
			immediate: {
				tokens:	
				[
					{
						text: 'The',
						pos: 'adjective',
						role: 'subj-mod'
					},
					{
						text: 'brown',
						pos: 'adjective',
						role: 'subj-mod'
					},
					{
						text: 'fox',
						pos: 'noun',
						role: 'subject'
					},
					{
						text: 'with',
						pos: 'prep',
						role: 'subj-mod'
					},
					{
						text: 'the',
						pos: 'adjective',
						role: 'noun-mod'
					},
					{
						text: 'bushy',
						pos: 'adjective',
						role: 'noun-mod'
					},
					{
						text: 'tail',
						pos: 'noun',
						role: 'prep-det-noun'
					},
					{
						text: 'runs',
						pos: 'verb',
						role: 'verb'
					},
					{
						text: 'swiftly',
						pos: 'adverb',
						role: 'verb-mod'
					},
					// {
						// text: 'up',
						// pos: 'prep',
						// role: 'prep'
					// },
					// {
						// text: 'the',
						// pos: 'adjective',
						// role: 'adjective'
					// },
					// {
						// text: 'hill',
						// pos: 'noun',
						// role: 'noun'
					// },
					
				]
			},
			
			delayed: {
				tokens: [
					{}
				]
			}
		
		};		
		igble.proj.dragDrop.addToTokenBank(tokenBank.immediate.tokens);
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
		igble.proj.dragDrop._initAllAdjGroupMutObs();
		this.attachDiffButtonBehavior();
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
		$('#token-bank').children().droppable({
			accept: '.draggable-token.dropped',
			activate: function(event, ui) {console.log("activating droppable token bank token");},
			deactivate: function(event, ui) {console.log("deactivating droppable token bank token");},
			drop: function(event, ui) {
				$(this).text($(ui.draggable).text());				
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
				// check if token is placed correctly
				if(igble.proj.dragDrop.dropSucceeds($(this), ui.draggable)) {
					igble.proj.dragDrop.onSuccessfulDrop(ui.draggable, $(this));					
				} else {
					igble.proj.dragDrop.onFailDrop(ui.draggable, $(this));					
				}
			},
			hoverClass: 'hover',
			tolerance: 'intersect'
		});
	},
	
	
	
	/**
	 * --------------------------------------------------------------------------------------
	 * Called when element is dragged
	 * 
	 * @param draggable element
	 * @return void
	 * --------------------------------------------------------------------------------------
	 */
	onDrag: function(draggable) {
	},
	
	onDrop: function(draggable, droppable) {
		//debug
		console.log('draggable role: ' + draggable.data('role'));
		console.log('droppable role: ' + droppable.data('role'));
		
		
		igble.proj.assessment.highlight('#instructions-container');
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
	 * --------------------------------------------------------------------------------------
	 * Triggers when a successful drops occurs 
	 * 
	 * @param draggable
	 * @param droppable
	 * --------------------------------------------------------------------------------------
	 */
	onSuccessfulDrop: function(draggable, droppable) {
		console.log("onSuccessfulDrop");
		igble.proj.assessment.updatePlayerScore(1);
		droppable.addClass('correct');
		igble.proj.game.play('#audio-success');
		igble.proj.game.next(droppable.data('role'), false);
	},
	
	/**
	 * --------------------------------------------------------------------------------------
	 * Triggers when an UNsuccessful drops occurs 
	 * 
	 * @param draggable
	 * @param droppable
	 * --------------------------------------------------------------------------------------
	 */
	onFailDrop: function(draggable, droppable) {
		igble.proj.assessment.updatePlayerScore(-1);
		console.log("adding incorrect class to:");
		console.log($(this));
		droppable.addClass('incorrect');
		igble.proj.assessment.onIncorrectInput();
	},
	
	/**
	 * ------------------------------------------------------------------------------------------
	 * Triggers when an adjective is dropped
	 * ------------------------------------------------------------------------------------------
	 */
	_onDropAdj: function(element) {
		console.log("_onDropAdj");
		$(element).parent('.adjective-group').append("<span class='droppable-token adjective' data-pos='adjective' data-role='subj-mod'></span>");		
		$(element).append("<div class='adverb-group'></div>");
		$(element).find('.adverb-group').append("<div class='droppable-token adverb'></div>");
		igble.proj.dragDrop.makeDroppable($(element).find('.adverb'));									
		$(element).css('top', '-1.0em');
		$(element).rotate({angle: 30, center: ["0%", "0%"]});
	},
	
	_onDropAdverb: function(element) {
		console.log("_onDropAdverb");
		console.log("adding role " + $(element).data('role'));
		console.log(element);
		$(element).parent('.adverb-group').append("<span class='droppable-token adverb' data-pos='adv' data-role='" + $(element).data('role') + "'></span>");			
		$(element).append("<span class='droppable-token adverb' data-pos='adv'></span>");
		igble.proj.dragDrop.makeDroppable($(element).find('.adverb'));									
		$(element).css('top', '-1.0em');
		$(element).rotate({angle: 30, center: ["0%", "0%"]});
	},
	
	
	_onDropVerb: function(element) {
		console.log("_onDropVerb");
		$(element).append($("<div class='verb-mod-group'></div>").append("<span class='droppable-token adverb' data-pos='adv' data-role='verb-mod'></span>"));
		igble.proj.dragDrop.makeDroppable($(element).find('.droppable-token.adverb'));
	},
	
	/**
	 * ------------------------------------------------------------------------------------------
	 * Called when a modifier for a verb is dropped 
	 * ------------------------------------------------------------------------------------------
	 */
	// _onDropVerbMod: function(element) {
		// $(element).parent('.adverb-group').append("<span class='droppable-token adverb' data-pos='adv'></span>");
		// $(element).append("<span class='droppable-token adverb' data-pos='adv'></span>");
		// igble.proj.dragDrop.makeDroppable($(element).find('.adverb'));									
		// $(element).css('top', '-1.0em');
		// $(element).rotate({angle: 30, center: ["0%", "0%"]});
	// },
// 	
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
	 * ------------------------------------------------------------------------------------------
	 * Returns true if correct token is clicked 
	 * 
	 * @param none
	 * @return boolean
	 * ------------------------------------------------------------------------------------------
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
		$(tokens).each(function(key, value) {
			$tokenBank.append("<span class='draggable-token token rounded " + value.pos + "' data-role='" + value.role + "' data-pos='" + value.pos + "'>" + value.text + "</span>");
			$tokenBank.children().last().on('click', function() {
							console.log("token bank token clicked");
							console.log($(this));
							
							if($(this).hasClass('selected'))
								$(this).removeClass('selected');
							else
								$(this).addClass('selected');
						});	
		});
		
	},
	
	attachDiffButtonBehavior: function() {
		$('#difficulty-container').children().each(function() {
			$(this).on('click', function() {
				console.log("clicked diff button");
			});
		});
	}
};

$(document).ready(function() {
	igble.proj.dragDrop.init();
});
