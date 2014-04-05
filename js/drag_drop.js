if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.dragDrop = {
	// attributes
	nounGroupCount: 0,
	
	
	
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
			hoverClass: 'dropped',
			tolerance: 'intersect'
		});
	},
	
	onDrag: function(element) {
		
	},
	
	onDrop: function(element) {
		// console.log("dropped!");
		igble.proj.dragDrop.nounGroupCount++;
	},
	
	makeDraggable: function(element) {
		console.log(element);
		$(element).draggable();		
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
	}
	
};

$(document).ready(function() {
	console.log("page ready");
	igble.proj.dragDrop.init();
});
