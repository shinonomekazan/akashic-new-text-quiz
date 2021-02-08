import { Label } from "@akashic-extension/akashic-label";
import Button = require("./button/Button");
import TextButton = require("./button/TextButton");

interface BottomPopupParams extends g.EParameterObject {
	text: string;
	font: g.Font;
}

class BottomPopup extends g.E {

	label: Label;

	closeButton: Button;

	constructor(params: BottomPopupParams) {
		params.height = params.height || Math.round(params.width * .2);
		super(params);

		// background
		new g.FilledRect({
			scene: this.scene,
			cssColor: "white",
			width: this.width,
			height: this.height,
			local: true,
			parent: this
		});

		this.label = new Label({
			scene: this.scene,
			width: this.width - 64,
			font: params.font,
			fontSize: 20,
			text: params.text,
			textColor: "black",
			x: 32,
			y: (this.height - 30) / 2,
			local: true,
			parent: this
		});

		this.closeButton = new TextButton({
			scene: this.scene,
			text: "Close",
			color: "Indigo",
			textColor: "white",
			x: this.width - 84,
			y: this.height / 2,
			local: true,
			parent: this
		});

		this.closeButton.onClick.add(() => {
			this.destroy();
		});
	}
}

export = BottomPopup;
