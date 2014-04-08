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
				dragDrop.onDrag();				
			},
			revert: 'invalid',			
		});
		
		dragDrop.makeDroppable($('.droppable-token'));
		
		// $('.droppable-token').droppable({
			// accept: '.draggable-token',
			// activate: function(event, ui) {},
			// deactivate: function(event, ui) {},
			// drop: function(event, ui) {
				// $(this).text($(ui.draggable).text());
				// $(this).addClass('dropped');
				// $(ui.draggable).remove();
				// dragDrop.onDrop($(this));
			// },
			// hoverClass: 'hover',
			// tolerance: 'intersect'
		// });
		
		// $('#subject-group').on('DOMNodeInserted', 'span.droppable-token', function() {
			// console.log("span.droppable-token loaded");
		// });
		
		// setup DOM mutation observer
		dragDrop._initMutationObserver();
		dragDrop._initAllAdjGroupMutationObservers();
	},
	
	onDrag: function(element) {
		console.log("onDrag invoked");
	},
	
	onDrop: function(draggable, droppable) {
		console.log("dropped!");
		// dragDrop.nounGroupCount++;	
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
		// console.log("adj dropped");
		// move up to be flush with noun underline		
		$(element).parent('.adjective-group').append("<span class='droppable-token adjective' data-pos='adj'></span>");
		$(element).append("<div class='adverb-group'></div>");
		$(element).find('.adverb-group').append("<div class='droppable-token adverb dropped'></div>");
		dragDrop.makeDroppable($(element).find('.adverb.dropped'));									
		// var adjCountInGroup = $(element).parent('.adjective-group').length;
		// console.log("adj group count: " + adjCountInGroup);
		$(element).css('top', '-2.0em');
		// $(element).css('left', 2.5*adjCountInGroup + 'em');
		$(element).rotate({angle: 30, center: ["0%", "0%"]});
	},
	
	makeDraggable: function(element) {
		console.log(element);
		$(element).draggable();				
	},
	
	makeDroppable: function(element) {
		console.log(element);
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
	
	splitIntoDraggables: function(string) {
		var words = string.split(' ');
		console.log(words);
		for(var i=0; i < words.length; i++) {
			var word = words[i];
			var $draggableWord = $("<div class='draggable token'></div>");
			$draggableWord.append(word);
			dragDrop.makeDraggable($draggableWord);
			$('main').append($draggableWord);
		}
	},
	
	_initMutationObserver: function() {
		var target =  $('#subject-group .noun-group')[0];
		
		var observer = new MutationObserver(function (mutations) {
			console.log("mutating");
			mutations.forEach(function(mutation) {
				var newNodes = mutation.addedNodes;
				if(newNodes !== null) { // if new nodes added
					var $nodes = $(newNodes);
					$nodes.each(function() {
						var $node = $(this);
						// console.log($node);
						dragDrop.nounGroupCount++;
						dragDrop.makeDroppable($node);
						dragDrop.resizeTokenGroup($node);
						$node.css('border', 'solid 2px #00f0f0');
						console.log($node.attr('class'));
						// $node.css('width',  100/dragDrop.nounGroupCount + "%" );
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
	
	_initAllAdjGroupMutationObservers: function() {
		var $allAdjGroups = $('.adjective-group');
		console.log($allAdjGroups);
		$allAdjGroups.each(function() {
			dragDrop._initAdjGroupMutationObserver(this);
		});	
	},
	
	_initAdjGroupMutationObserver: function(group) {
		var target = group;
		console.log(target);
		
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function(mutation) {
				var newNodes = mutation.addedNodes;
				if(newNodes !== null) { // if new nodes added
					var $nodes = $(newNodes);
					$nodes.each(function() {
						var $node = $(this);
						// console.log($node);
						// dragDrop.nounGroupCount++;
						var childCount = $(target).children().length; 
						dragDrop.makeDroppable($node);
						$node.css('left', childCount*8 - 6 + 'em');
						console.log('adj group thing added');
						// dragDrop.resizeTokenGroup($node);
						// $node.css('border', 'solid 2px #00f0f0');
						// $node.css('width',  100/dragDrop.nounGroupCount + "%" );
					});
				}
			});
		});
		
		
		
		var observerConfig = {
			attributes: true, 
			childList: true, 
			characterData: true 
		};
		console.log(observer);
		observer.observe(target, observerConfig);
	},
	
	/**
	 * 
	 */
	resizeTokenGroup: function(element) {
		var percOfGroupLength = 90;
		console.log("resizing elements in group");
		var parentGroup = $(element).parent();
	}
	
},

scorer = {
	
	
}

];

$(document).ready(function() {
	console.log("page ready");
	dragDrop.init();
});
