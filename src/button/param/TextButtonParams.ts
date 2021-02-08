import ButtonParams = require("./ButtonParams");

interface TextButtonParams extends ButtonParams {
	font?: g.Font;
	fontSize?: number;
	text?: string;
	color?: string;
	textColor?: string;
}

export = TextButtonParams;
