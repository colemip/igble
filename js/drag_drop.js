if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj['dragDrop']) { window.igble['dragDrop'] = {}; }

igble.proj = [	
	dragDrop = {
	// attributes
	nounGroupCount: 1,
	
	
	
	init: function() {
		// dragDrop.splitIntoDraggables("This is a sentence");
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
				dragDrop.onDrag(draggable);				
			},
			revert: 'invalid',			
		});
		
		dragDrop.makeDroppable($('.droppable-token'));
		
		// setup DOM mutation observer
		dragDrop._initMutationObserver();
		dragDrop._initAllAdjGroupMutationObservers();
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
				dragDrop.onDrop($(this), ui.draggable);
				$(ui.draggable).hide();
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
				if($(draggable).data('role') === $(droppable).data('role'))
					console.log("SUCCESS!");
				break;
			case 'adj':				
				dragDrop._onDropAdj(draggable);
				break;
			default:
				break;
		}	
	},
	
	_onDropAdj: function(element) {
		$(element).parent('.adjective-group').append("<span class='droppable-token adjective' data-pos='adj'></span>");
		$(element).append("<div class='adverb-group'></div>");
		$(element).find('.adverb-group').append("<div class='droppable-token adverb dropped'></div>");
		dragDrop.makeDroppable($(element).find('.adverb.dropped'));									
		$(element).css('top', '-2.0em');
		$(element).rotate({angle: 30, center: ["0%", "0%"]});
	},
	
	
	
	splitIntoDraggables: function(string) {
		var words = string.split(' ');
		for(var i=0; i < words.length; i++) {
			var word = words[i];
			var $draggableWord = $("<div class='draggable token'></div>");
			$draggableWord.append(word);
			dragDrop.makeDraggable($draggableWord);
			$('main').append($draggableWord);
		}
	},
		
	_initAllAdjGroupMutationObservers: function() {
		var $allAdjGroups = $('.adjective-group');
		$allAdjGroups.each(function() {
			dragDrop._initAdjGroupMutationObserver(this);
		});	
	},
	
	_initAdjGroupMutationObserver: function(group) {
		var target = group;
		
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function(mutation) {
				var newNodes = mutation.addedNodes;
				if(newNodes !== null) { // if new nodes added
					var $nodes = $(newNodes);
					$nodes.each(function() {
						var $node = $(this);
						var childCount = $(target).children().length; 
						dragDrop.makeDroppable($node);
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

assessment = {	
}

];

$(document).ready(function() {
	dragDrop.init();
});
