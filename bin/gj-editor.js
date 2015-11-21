$(document).ready(function(){


	var $previewImg = $('#preview-img'),
		$onCanvasPreview = $('#on-canvas-preview'),
		$window = $(window),
		rootStage,
		renderer,
		$canvasContainer = $('#canvas'),
		spriteSelected = false;


	// this variable is flag for moving canvas with mouse
	var movingCanvas = false;


	// this variable flag shift key held down
	var shift = false;

	$("#sprite-list").fancytree({
		source: {
			url: "sprites.json"
		},
		postProcess: function(event, data) {
		  // assuming the ajax response contains a list of child nodes:
		  var response = data.response;

		  console.log(response);

		  //data.result = [];

		  var result = [];

		  var folderFound = [];

		  var folderKey = 0;

		  var fileKey = 0;

		  for (var i=0;i<response.length; i++) {
		  	var file = response[i];

		  	var path = file.location.split("/");

		  	var folders = path.slice(3,path.length-1);

		  	var fileName = path.slice(path.length-1,path.length)[0];

		  	var currentDepth = 0;

		  	var depth = file.depth-3;

		  	var fileObject = {
  				"title": fileName,
  				"key" : fileKey++,
  				"path" : file.location.substring(5,file.location.length)
  			};

		  	if(currentDepth==depth) {
		  		result.push(fileObject);
		  	}

		  	while(depth>currentDepth) {

		  		if(folderFound[folders[currentDepth]]) {

		  		} else {
		  			folderFound[folders[currentDepth]] = {
		  				"title": folders[currentDepth],
		  				"key" : folderKey++,
		  				"folder" : true,
		  				"children" : []
		  			};

		  			if(currentDepth==0) {
		  				result.push(folderFound[folders[currentDepth]]);
		  			}

		  			if(currentDepth>0) {
		  				folderFound[folders[currentDepth-1]].children.push(folderFound[folders[currentDepth]]);
		  			}
		  		}

		  		if(currentDepth==depth-1) {
		  			folderFound[folders[currentDepth]].children.push(fileObject);
		  		}

		  		currentDepth++;
		  	}

		  }

		  console.log(result);

		  data.result = result;
		},
		activate: function(event, data) {
			var node = data.node;
			if(!node.folder) {
				$previewImg.attr('src',node.data.path);

				$onCanvasPreview.attr('src',node.data.path);

				setTimeout(function(){
					$onCanvasPreview.css({
						top: (($canvasContainer.outerHeight() - $onCanvasPreview.outerHeight())/2) + 'px',
						left: '45px'
					});
					$onCanvasPreview.css({
						opacity: 1
					});
					spriteSelected = true;
				},0);

			} else {
				$previewImg.attr('src','');
				$onCanvasPreview.attr('src','');
				spriteSelected = false;
			}

			
		},
		keydown: function(event, data) {
			console.log(event.which);

			if(event.which==71) {
				addCurrentSpriteToCanvas();
			}
		},
		checkbox: true
	});

	var uid = 0;


	function setupCanvasPreviewMouse() {
		$canvasContainer.on('mousemove',function(e){
			var x = e.pageX - $canvasContainer.offset().left,
				y = e.pageY - $canvasContainer.offset().top;

			$onCanvasPreview.css({
				top: y-($onCanvasPreview.outerHeight()/2),
				left: x-($onCanvasPreview.outerWidth()/2)
			});
		});

		$canvasContainer.on('click', function(e){
			if(spriteSelected) {
				addCurrentSpriteToCanvas();
			}
		});
	}

	function setupCanvasMoveMouse() {

		console.log("setup Canvas Move Mouse");

		$window.keydown(function(e){

			console.log(e.which);

			if(e.which==32) {
				movingCanvas = true;
			}

			if(e.which==16) {
				shift = true;
			}

			if(e.which==38) {
				moveCanvasY(shift?-10:-1);
			}

			if(e.which==40) {
				moveCanvasY(shift?10:1);
			}

			if(e.which==39) {
				moveCanvasX(shift?10:1);
			}

			if(e.which==37) {
				moveCanvasX(shift?-10:-1);
			}
		});

		$window.keyup(function(e){
			if(e.which==32) {
				movingCanvas = false;
			}

			if(e.which==16) {
				shift = false;
			}
		});

		$canvasContainer.on('mousemove',function(e){
			var x = e.pageX - $canvasContainer.offset().left,
				y = e.pageY - $canvasContainer.offset().top;

			if(movingCanvas) {
				moveCanvasX(mouseMovementX);
				moveCanvasY(mouseMovementY);
			}
		})
	}

	function setupBasicMouseTracking() {

		window.previousMousePositionX = 0;
		window.previousMousePositionY = 0;
		window.mouseMovementX = 0;
		window.mouseMovementY = 0;

		$window.on('mousemove',function(e){
			mouseMovementX = e.pageX-previousMousePositionX;
			mouseMovementY = e.pageY-previousMousePositionY;

			previousMousePositionX = e.pageX;
			previousMousePositionY = e.pageY;
		});
	}

	function moveCanvasX(m) {

		if(movingCanvas) {
			var newX = rootStage.x + m;

			rootStage.x = newX;
		}

		
		
	}

	function moveCanvasY(m) {
		if(movingCanvas) {
			var newY = rootStage.y + m;
			
			rootStage.y = newY;
		}
	}



	//@TEMPORARY
	function getUID() {
		return uid++;
	}
	
	//@TEMPORARY
	function addCurrentSpriteToCanvas() {
		var spriteLeft = $onCanvasPreview.position().left-rootStage.x,
			spriteTop = $onCanvasPreview.position().top-rootStage.y;

		var thisSpriteID = getUID()+$onCanvasPreview.attr('src');

		console.log(thisSpriteID);

		var sprite = new PIXI.Sprite(PIXI.Texture.fromImage($onCanvasPreview.attr('src'), true, PIXI.SCALE_MODES.NEAREST));

		sprite.position.x = spriteLeft;
		sprite.position.y = spriteTop;

		rootStage.addChild(sprite);
		
	}
	

	function renderCanvas() {

		console.log($canvasContainer.outerWidth());
		console.log(parseInt($canvasContainer.outerHeight()));


		renderer = new PIXI.WebGLRenderer(parseInt($canvasContainer.outerWidth()), parseInt($canvasContainer.outerHeight()));

		console.log(renderer);


		$canvasContainer.append(renderer.view);

		rootStage = new PIXI.Container();

		animate();
	}

	function animate() {
		requestAnimationFrame(animate);

	    // this is the main render call that makes pixi draw your container and its children.
	    renderer.render(rootStage);
	}


	$window.resize(function(){

	});

	renderCanvas();
	setupBasicMouseTracking();
	setupCanvasPreviewMouse();
	setupCanvasMoveMouse();
});