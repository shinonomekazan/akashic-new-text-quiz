import TextButtonParams = require("./TextButtonParams");

interface ImageTextButtonParams extends TextButtonParams {
	src: g.Surface | g.ImageAsset;
	srcWidth?: number;
	srcHeight?: number;
}

export = ImageTextButtonParams;
