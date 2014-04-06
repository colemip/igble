if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.dragDrop = {
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
			revert: 'invalid',			
		});
		$('.droppable-token').droppable({
			accept: '.draggable-token',
			activate: function(event, ui) {},
			deactivate: function(event, ui) {},
			drop: function(event, ui) {
				$(this).text($(ui.draggable).text());
				$(this).addClass('dropped');
				$(ui.draggable).remove();
				igble.proj.dragDrop.onDrop($(this));
			},
			hoverClass: 'hover',
			tolerance: 'intersect'
		});
		
		// $('#subject-group').on('DOMNodeInserted', 'span.droppable-token', function() {
			// console.log("span.droppable-token loaded");
		// });
		
		// setup DOM mutation observer
		igble.proj.dragDrop._initMutationObserver();
	},
	
	onDrag: function(element) {
		
	},
	
	onDrop: function(element) {
		// console.log("dropped!");
		// igble.proj.dragDrop.nounGroupCount++;		
		$('#subject-group').append("<span class='droppable-token'></span>");
		// $('.droppable-token').css('width',  100/igble.proj.dragDrop.nounGroupCount + "%" );
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
				$(ui.draggable).remove();
				igble.proj.dragDrop.onDrop($(this));
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
			igble.proj.dragDrop.makeDraggable($draggableWord);
			$('main').append($draggableWord);
		}
	},
	
	_initMutationObserver: function() {
		var target =  $('#subject-group')[0];
		
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function(mutation) {
				var newNodes = mutation.addedNodes;
				if(newNodes !== null) { // if new nodes added
					var $nodes = $(newNodes);
					$nodes.each(function() {
						var $node = $(this);
						// console.log($node);
						igble.proj.dragDrop.nounGroupCount++;
						igble.proj.dragDrop.makeDroppable($node);
						igble.proj.dragDrop.resizeTokenGroup($node);
						$node.css('border', 'solid 2px #00f0f0');
						// $node.css('width',  100/igble.proj.dragDrop.nounGroupCount + "%" );
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
	 * 
	 */
	resizeTokenGroup: function(element) {
		var percOfGroupLength = 90;
		console.log("resizing elements in group");
		var parentGroup = $(element).parent();
	}
	
};

$(document).ready(function() {
	console.log("page ready");
	igble.proj.dragDrop.init();
});
