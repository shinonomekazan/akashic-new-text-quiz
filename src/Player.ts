class Player {

	static masterId: string = "-1";

	id: string;

	constructor(id: string) {
		this.id = id;
	}

	isMaster(): boolean {
		return this.id === Player.masterId;
	}

}

export = Player;
