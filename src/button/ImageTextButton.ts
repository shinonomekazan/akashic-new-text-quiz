import ImageTextButtonParams = require("./param/ImageTextButtonParams");
import TextButton = require("./TextButton");

class ImageTextButton extends TextButton {

	constructor(params: ImageTextButtonParams) {
		super(params);
	}

	createBackground(params: ImageTextButtonParams): g.E {
		return (new g.Sprite({
			scene: params.scene,
			src: params.src,
			srcWidth: params.srcWidth,
			srcHeight: params.srcHeight,
			width: params.width,
			height: params.height,
			touchable: params.touchable,
			local: params.local,
			parent: this
		}));
	}

}

export = ImageTextButton;
