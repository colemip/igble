if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj = {	
	dragDrop : {
	// attributes
	nounGroupCount: 1,
	
	
	
	init: function() {
		// igble.proj.dragDrop.splitIntoDraggables("This is a sentence");
		$('.draggable').draggable({
			revert: 'invalid'
		});
		$('.droppable').droppable({
			accept: '.draggable', 
			activate: 
				function(event, ui) {},
						
		});
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
					// console.log("success!");
					$(this).css('background-color', '#66FF66');
				}
			},
			hoverClass: 'hover',
			tolerance: 'intersect'
		});
	},
	
	onDrag: function(element) {
	},
	
	onDrop: function(draggable, droppable) {
		console.log("dropped!");
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
		$(element).parent('.adjective-group').append("<span class='droppable-token adjective' data-pos='adj'></span>");
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
	}
},

assessment : {	
}

};

$(document).ready(function() {
	igble.proj.dragDrop.init();
});
