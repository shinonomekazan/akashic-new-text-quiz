import TextButtonParams = require("./TextButtonParams");

interface ImageTextButtonParams extends TextButtonParams {
	src: g.Surface | g.Asset;
	srcWidth?: number;
	srcHeight?: number;
}

export = ImageTextButtonParams;
