$(document).ready(function(){
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
			console.log(node);

			$('#preview-img').attr('src',node.data.path);
		},
		checkbox: true
	});
});