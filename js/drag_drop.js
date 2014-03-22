if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.dragDrop = {
	init: function() {
		igble.proj.dragDrop.splitIntoDraggables("This is a sentence");
		
		$('.igble-proj-draggable').draggable({
			revert: true
		});
		$('.igble-proj-droppable').droppable({
			accept: '.igble-proj-draggable', 
			activate: 
				function(event, ui) {},
						
		});
	},
	
	onDrag: function(element) {
		
	},
	
	onDrop: function(element) {
		
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
			var $draggableWord = $("<div class='.igble-proj-draggable'></div>");
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
