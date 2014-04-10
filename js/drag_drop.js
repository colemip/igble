if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj = {	
	dragDrop : {
	// attributes
	nounGroupCount: 1,
	
	
	
	init: function() {
		// igble.proj.dragDrop.splitIntoDraggables("This is a sentence");
		
		// setup token bank
		var tokenBank = {
			immediate: {
				tokens:	
				[
					{
						text: 'The',
						pos: 'adj',
						role: 'adj'
					},
					{
						text: 'brown',
						pos: 'adj',
						role: 'adj'
					},
					{
						text: 'fox',
						pos: 'noun',
						role: 'subject'
					},
					{
						text: 'runs',
						pos: 'verb',
						role: 'verb'
					}
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
		$('.draggable').draggable({
			revert: 'invalid'
		});
		
		// setup droppables
		$('.droppable').droppable({
			accept: '.draggable', 
			activate: 
				function(event, ui) {},
						
		});
		// make stage droppable -- necessary?
		$('#diagram-stage').droppable({});
		
		
		
		$('.draggable-token').draggable({
			drag: function(event, ui) {
				var draggable = $(this).clone();
				igble.proj.dragDrop.onDrag(draggable);				
			},
			revert: 'invalid',			
		});
		
		igble.proj.dragDrop.makeDroppable($('.droppable-token'));
		
		// setup DOM mutation observer
		// igble.proj.dragDrop._initMutationObserver();
		igble.proj.dragDrop._initAllAdjGroupMutObs();
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
				igble.proj.dragDrop.onDrop($(this), ui.draggable);
				$(ui.draggable).hide();
				// check if token is placed correctly
				if(igble.proj.dragDrop.dropSucceeds($(this), ui.draggable)) {
					$(this).addClass('correct');
				} else {
					$(this).addClass('incorrect');
				}
			},
			hoverClass: 'hover',
			tolerance: 'intersect'
		});
	},
	
	onDrag: function(element) {
	},
	
	onDrop: function(draggable, droppable) {
		// console.log("dropped!");
		igble.proj.dragDrop.makeDraggable(droppable);
		switch($(draggable).data('pos')) {
			case 'noun':
				break;
			case 'adj':				
				igble.proj.dragDrop._onDropAdj(draggable);
				break;
			case 'adv':
				igble.proj.dragDrop._onDropAdverb(draggable);
				break;
			case 'verb':
				igble.proj.dragDrop._onDropVerb(draggable);
				break;
			default:
				break;
		}	
	},
	
	_onDropAdj: function(element) {
		console.log('onDrop() adj');
		$(element).parent('.adjective-group').append("<span class='droppable-token adjective' data-pos='adj' data-role='adj'></span>");
		$(element).append("<div class='adverb-group'></div>");
		$(element).find('.adverb-group').append("<div class='droppable-token adverb'></div>");
		igble.proj.dragDrop.makeDroppable($(element).find('.adverb'));									
		$(element).css('top', '-2.0em');
		$(element).rotate({angle: 30, center: ["0%", "0%"]});
	},
	
	_onDropAdverb: function(element) {
		console.log('onDrop() adv');
		$(element).parent('.adverb-group').append("<span class='droppable-token adverb' data-pos='adv'></span>");
		$(element).append("<span class='droppable-token adverb' data-pos='adv'></span>");
		// $(element).find('.adverb-group').append("<div class='droppable-token adverb'></div>");
		igble.proj.dragDrop.makeDroppable($(element).find('.adverb'));									
		$(element).css('top', '-2.0em');
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
		// console.log("adding stuff to token bank");
		var $tokenBank = $('#token-bank');
		$(tokens).each(function(key, value) {
			$tokenBank.append("<span class='draggable-token token " + value.pos + "' data-role='" + value.role + "'>" + value.text + "</span>");	
		});
		
	}
}

};

$(document).ready(function() {
	igble.proj.dragDrop.init();
});
