import GameCore = require("./GameCore");

function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		assetIds: ["se", "button_answer"]
	});

	scene.loaded.add(() => {
		new GameCore(scene);
	});

	g.game.pushScene(scene);
}

export = main;
