/* credit & thanks to:
moon image - http://binarymillenium.soup.io/post/195579525/Lunar-DTM100-to-Blender-displacment-map
3d sphere - http://www.codesin.net/post/Mapping-Images-on-Spherical-Surfaces-Using-Javascript-and-HTML5-Canvas/
*/

(function(){
    var WrapSphereDemo;
    (function (WrapSphereDemo) {
	var image;
	var context;
	var myImg = new Image();
	myImg.src = "img/lunarsurface.jpg";

	var rotation = 0;
	var interval;
	function Render() {
	    GenerateImage(myImg, rotation);
	    clearInterval(interval);
	    interval = setInterval(function(){
		GenerateImage(myImg, rotation+=0.05);
	    }, 50)

	}
	window.stopSearchAnimation = function(){
	    clearInterval(interval);
	    var final = document.getElementById("moon");
	    final.width = 0;
	    final.height = 0;

	}
	window.startSearchAnimation = Render;
	function scaleImageData(imageData, scale) {
	    var scaled = c.createImageData(imageData.width * scale, imageData.height * scale);

	    for(var row = 0; row < imageData.height; row++) {
		for(var col = 0; col < imageData.width; col++) {
		    var sourcePixel = [
			imageData.data[(row * imageData.width + col) * 4 + 0],
			imageData.data[(row * imageData.width + col) * 4 + 1],
			imageData.data[(row * imageData.width + col) * 4 + 2],
			imageData.data[(row * imageData.width + col) * 4 + 3]
		    ];
		    for(var y = 0; y < scale; y++) {
			var destRow = row * scale + y;
			for(var x = 0; x < scale; x++) {
			    var destCol = col * scale + x;
			    for(var i = 0; i < 4; i++) {
				scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
				    sourcePixel[i];
			    }
			}
		    }
		}
	    }

	    return scaled;
	}
	var hex1 = [
	    "0x00cca4ba67",
	    "0x00557225b6",
	    "0x00557225b6",
	    "0x00c10f16f3",
	    "0x0006ecde3e",
	    "0x005d0fe4a2",
	    "0x0040bb74f6",
	    "0x00d928a177",
	    "0x008c34aacd",
	    "0x00d1af2508"
	];
	var hex2 = [
	    "0x2fbb7ea4387b73a60811e48b4e72eae4a9e2801af19ce3d01da420219a26a398",
	    "0xbbaf21edc6258891d667c2e4e364c5dbc5b187183ac67c43606ceeac0a22ae06",
	    "0xbbaf21edc6258891d667c2e4e364c5dbc5b187183ac67c43606ceeac0a22ae06",
	    "0xe8ff5c2901d0783fc41f9e1198e2d147f9edbcd6b7e8cc75c904e8b2f50da26c",
	    "0x77dfbb3010bc06102ccaf4b9dea494c18690db527632fcffec01ce5bbcd9adbe",
	    "0x17010f617a25c39d9abf7ed639edfe8ee396a3b5f53ce9ac218fec05b9aa2fef",
	    "0x7b5e2b2a8e7708d1b941049d8e752a0accdd266ed0209f452861eaef78c57dd7",
	    "0x5b7b1e4005c10de4621c92a2057995d14e4be96972d60e30faaa603f1e9b6c20",
	    "0x83f46ca96aa53c127e82a78670a8be64ec1cac79813ab3f7ed01aab4b424cead",
	    "0x6d127ad1a940681c971f55f1cbfc45daf44d9399bb1d751b2288a97df360e176"

	];
	function GenerateImage(myImg, rotation) {
	    var canvasToDrawOn =  document.createElement("canvas");
	    moon.width=30;
	    moon.height=30;

	    var ctx = canvasToDrawOn.getContext("2d");

	    // Copy the image into a canvas and the get the imagedata
	    var offscreenCanvas = document.createElement("canvas");
	    offscreenCanvas.width = myImg.width;
	    offscreenCanvas.height = myImg.height;
	    var offscreenContext = offscreenCanvas.getContext("2d");
	    offscreenContext.drawImage(myImg, 0, 0);
	    var fromImage = offscreenContext.getImageData(0, 0, myImg.width, myImg.height);

	    // Create a new image with the source image wrapped around a sphere
	    var yRotate = rotation;
	    var xRotate = Math.PI / 2;

	    var toImage = ctx.getImageData(0, 0, 20 * 2, 20 * 2);
	    var image = SphereImageLib.WrapSphere(fromImage, toImage, xRotate, yRotate, 20);
	    ctx.putImageData(image, 0, 0);

	    var final = document.getElementById("moon");
	    final.width = 400;
	    final.height = 400;
	    finalCtx = final.getContext('2d');
	    finalCtx.fillStyle = "#000011";
	    //finalCtx.fillRect(0,0,400,400);
	    finalCtx.scale(8,8);
	    finalCtx.mozImageSmoothingEnabled = false;
	    finalCtx.webkitImageSmoothingEnabled = false;
	    finalCtxmsImageSmoothingEnabled = false;
	    finalCtx.imageSmoothingEnabled = false;
	    finalCtx.drawImage(canvasToDrawOn, 5, 5);

	    var position = Math.sin(rotation * .8) * 140 + 190;

	    finalCtx.drawbeginPath


	    finalCtx.scale(.125,.125);
	    var offset = 10;
	    finalCtx.strokeStyle = "#00cc00";
	    finalCtx.fillStyle = "rgba(0,100,0,.3)";

	    finalCtx.fillRect(0, 380, 400, 400);
	    finalCtx.fillRect(235 - offset, position - 30, 120, 22);
	    finalCtx.lineWidth = 4;
	    finalCtx.lineCap = "round";



	    finalCtx.lineJoin = "bevel";

	    finalCtx.strokeRect(190 - offset, position, 25, 25);

	    finalCtx.beginPath();
	    finalCtx.moveTo(215 - offset, position + 12);
	    finalCtx.lineTo(235 - offset, position - 8);
	    finalCtx.lineTo(355 - offset, position - 8);
	    finalCtx.stroke();

	    var hex = Math.floor(Math.random() * 10);

	    finalCtx.font = "20px screen1";
	    finalCtx.fillStyle = "rgba(255,0,0,.7)"
	    finalCtx.fillText(hex1[hex],  240 - offset, position - 15);


	    finalCtx.font = "14px screen2";
	    finalCtx.fillStyle = "rgba(255,255,0,.7)"
	    finalCtx.fillText(hex2[hex], 7, 395);


	}
    })(WrapSphereDemo || (WrapSphereDemo = {}));

    var SphereImageLib;
    (function (SphereImageLib) {
	function WrapSphere(fromImage, toImage, xRotate, yRotate, radius) {
	    var coordinates = new SphereMapper(fromImage.width, fromImage.height, xRotate, yRotate, radius);

	    for (var i = 0; i < toImage.data.length; i++) {
		toImage.data[i] = 0;
	    }

	    for (var i = 0; i < fromImage.width; i++) {
		for (var j = 0; j < fromImage.height; j++) {
		    coordinates.Map(i, j);

		    if (coordinates.z > 0) {
			var fromPixel = new Pixel(fromImage, i, j);
			var toPixel = new Pixel(toImage, coordinates.x + coordinates.radius, coordinates.y + coordinates.radius);
			toPixel.Copy(fromPixel);
		    }
		}
	    }
	    return toImage;
	}
	SphereImageLib.WrapSphere = WrapSphere;

	var RotateResult = (function () {
	    function RotateResult() {
	    }
	    return RotateResult;
	})();
	SphereImageLib.RotateResult = RotateResult;

	var SphereMapper = (function () {
	    function SphereMapper(width, height, xRotate, yRotate, radius) {
		this.theta0 = 0.0;
		this.theta1 = 2.0 * Math.PI;
		this.phi0 = 0.0;
		this.phi1 = Math.PI;
		this.width = width;
		this.height = height;
		this.xRotate = xRotate;
		this.yRotate = yRotate;
		this.radius = radius;
	    }
	    //// map a pixel to a position on the sphere
	    SphereMapper.prototype.Map = function (i, j) {
		var theta = this.MapCoordinate(0.0, this.width - 1, this.theta1, this.theta0, i);
		var phi = this.MapCoordinate(0.0, this.height - 1, this.phi0, this.phi1, j);

		this.x = this.radius * Math.sin(phi) * Math.cos(theta);
		this.y = this.radius * Math.sin(phi) * Math.sin(theta);
		this.z = this.radius * Math.cos(phi);

		var result;
		result = this.Rotate(this.xRotate, this.y, this.z);
		this.y = result.r1;
		this.z = result.r2;

		result = this.Rotate(this.yRotate, this.x, this.z);
		this.x = result.r1;
		this.z = result.r2;
	    };

	    SphereMapper.prototype.MapCoordinate = function (i1, i2, w1, w2, p) {
		return ((p - i1) / (i2 - i1)) * (w2 - w1) + w1;
	    };

	    SphereMapper.prototype.Rotate = function (angle, axisA, axisB) {
		return {
		    r1: axisA * Math.cos(angle) - axisB * Math.sin(angle),
		    r2: axisA * Math.sin(angle) + axisB * Math.cos(angle)
		};
	    };
	    return SphereMapper;
	})();
	SphereImageLib.SphereMapper = SphereMapper;

	var Pixel = (function () {
	    function Pixel(image, x, y) {
		this.image = image;
		this.index = (Math.floor(x) + Math.floor(y) * this.image.width) * 4;
	    }
	    Pixel.prototype.Copy = function (from) {
		for (var i = 0; i < 3; i++) {
		    this.image.data[this.index + i] = from.image.data[from.index + i];
		}
		this.image.data[this.index + 3] = 255; // Alpha not opaque
	    };
	    return Pixel;
	})();
	SphereImageLib.Pixel = Pixel;
    })(SphereImageLib || (SphereImageLib = {}));
})()
