if(!window.igble) { window.igble = {}; }
if(!window.igble.proj) { window.igble.proj = {}; }
if(!window.igble.proj.dragDrop) { window.igble.proj.dragDrop = {}; }

igble.proj.dragDrop = {
	init: function() {
		$('.igble-proj-draggable').draggable();
	},
	
	onDrag: function(element) {
		
	},
	
	onDrop: function(element) {
		
	}
	
	
	
};

$(document).ready(function() {
	console.log("page ready");
	igble.proj.dragDrop.init();
});
