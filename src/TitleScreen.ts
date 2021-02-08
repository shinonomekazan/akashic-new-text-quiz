import Button = require("./button/Button");
import TextButton = require("./button/TextButton");
import GameCore = require("./GameCore");
import Player = require("./Player");

class TitleScreen extends g.E {

	startButton: Button;

	constructor(params: g.EParameterObject, gameCore: GameCore) {
		super(params);

		// background
		new g.FilledRect({
			scene: this.scene,
			cssColor: "Indigo",
			width: this.width,
			height: this.height,
			parent: this
		});

		// title
		new g.Label({
			scene: this.scene,
			text: "Text Quiz Game",
			textColor: "white",
			font: gameCore.font,
			fontSize: 40,
			x: 80,
			y: 80,
			local: true,
			parent: this
		});

		// startButton
		this.startButton = new TextButton({
			scene: this.scene,
			text: "Start",
			fontSize: 30,
			width: 180,
			height: 60,
			x: this.width / 2,
			y: this.height - 160
		});

		this.startButton.onClick.add((ev) => {
			if (ev.player.id === Player.masterId) {
				this.removeStartButton();
				this.remove();
				gameCore.onStart();
			}
		});

		if (gameCore.myPlayer.isMaster()) {
			this.appendStartButton();
		} else gameCore.onMasterJoined.addOnce((masterId) => {
			if (masterId === g.game.selfId) {
				this.appendStartButton();
			}
		});
	}

	appendStartButton(): void {
		if (!this.startButton.parent) this.append(this.startButton);
	}

	removeStartButton(): void {
		if (!!this.startButton.parent) this.startButton.remove();
	}

}

export = TitleScreen;
