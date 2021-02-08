import GameScreen = require("./GameScreen");
import Player = require("./Player");
import TitleScreen = require("./TitleScreen");

class GameCore {

	center: {x: number; y: number};

	font: g.Font;

	params: g.EParameterObject;

	myPlayer: Player;

	onMasterJoined: g.Trigger<string>;

	constructor(scene: g.Scene) {
		this.center = {
			x: g.game.width/2,
			y: g.game.height/2
		};

		this.font = new g.DynamicFont({
			game: scene.game,
			fontFamily: "monospace",
			size: 80,
		});

		this.params = {
			scene: scene,
			width: g.game.width,
			height: g.game.height,
			anchorX: .5,
			anchorY: .5,
			x: this.center.x,
			y: this.center.y,
			local: true,
			parent: scene
		};

		this.myPlayer = new Player(g.game.selfId);

		this.onMasterJoined = new g.Trigger();

		g.game.join.addOnce(e => {
			Player.masterId = e.player.id;
			console.log("masterId:", Player.masterId);
			this.onMasterJoined.fire(Player.masterId);
		});

		this.onStart();
	}

	onCreate(): void {
		new TitleScreen(this.params, this);
	}

	onStart(): void {
		new GameScreen(this.params, this);
	}

}

export = GameCore;
