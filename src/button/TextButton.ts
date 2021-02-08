import Button = require("./Button");
import TextButtonParams = require("./param/TextButtonParams");

class TextButton extends Button {

	static font: g.Font;

	background: g.E;
	text: g.Label;

	static getFont(game: g.Game): g.Font {
		return (this.font || (this.font = new g.DynamicFont({
			game: game,
			fontFamily: "monospace",
			size: 40,
		})));
	}

	constructor(params: TextButtonParams) {
		params.color = params.color || "white";
		params.textColor = params.textColor || "black";
		params.font = params.font || TextButton.getFont(params.scene.game);
		params.fontSize = params.fontSize || 20;
		super(params);
	}

	createButton(params: TextButtonParams): g.E {
		this.background = this.createBackground(params);
		this.text = this.createText(params);
		return this.background;
	}

	createBackground(params: TextButtonParams): g.E {
		return (new g.FilledRect({
			scene: params.scene,
			cssColor: params.color,
			width: params.width,
			height: params.height,
			touchable: params.touchable,
			local: params.local,
			parent: this
		}));
	}

	createText(params: TextButtonParams): g.Label {
		return (new g.Label({
			scene: params.scene,
			width: params.width,
			height: params.height,
			maxWidth: params.width,
			font: params.font,
			fontSize: params.fontSize,
			text: params.text,
			textColor: params.textColor,
			textAlign: g.TextAlign.Center,
			x: (params.width - params.text.length * params.fontSize * .55) / 2,
			y: (params.height - params.fontSize * 1.5) / 2,
			local: params.local,
			parent: this
		}));
	}

	getTextWidth(): number {
		return this.text.text.length * this.text.fontSize * .55;
	}

	setText(text: string): void {
		this.text.text = text;
		this.text.x = (this.width - text.length * this.text.fontSize * .55) / 2;
		this.text.y = (this.height - this.text.fontSize * 1.5) / 2;
		this.text.invalidate();
		this.text.modified();
	}

}

export = TextButton;
