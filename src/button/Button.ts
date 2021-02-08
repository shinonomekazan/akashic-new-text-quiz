import ButtonParams = require("./param/ButtonParams");

abstract class Button extends g.E {

	button: g.E;

	onClick: g.Trigger<g.PointEvent>;

	isCercle: boolean;

	params: ButtonParams;

	constructor(params: ButtonParams) {
		params.width = params.width || 120;
		params.height = params.height || 40;
		params.anchorX = params.anchorX || .5;
		params.anchorY = params.anchorY || .5;
		params.isCercle = params.isCercle || false;
		params.touchable = true;

		super(params);

		this.params = params;

		params.scaleOnPressed = params.scaleOnPressed || .9;

		this.onClick = new g.Trigger();

		this.isCercle = params.isCercle;

		let outside = true;

		let pointDown = false;

		this.button = this.createButton(params);

		this.getButton().pointDown.add((ev) => {
			if (this.isOutsideButton(ev)) {
				return;
			}
			outside = false;
			pointDown = true;
			this.onPressed(ev, true);
		});

		this.getButton().pointMove.add((ev) => {
			if (!pointDown) return;
			let _outside = this.isOutsideButton(ev);
			if (outside && !_outside) {
				this.onPressed(ev, true);
			} else if (!outside && _outside) {
				this.onPressed(ev, false);
			}
			outside = _outside;
		});

		this.getButton().pointUp.add((ev) => {
			if (!pointDown) return;
			pointDown = false;
			outside = true;
			this.onPressed(ev, false);

			if (this.isOutsideButton(ev)) {
				return;
			}

			this.onClick.fire(ev);
		});
	}

	abstract createButton(params: ButtonParams): g.E;

	getButton(): g.E {
		return this.button;
	}

	onPressed(ev: g.PointEvent, pressed: boolean): void {
		if (ev.player.id !== g.game.selfId) return;

		if (pressed) {
			this.scale(this.params.scaleOnPressed);
			this.modified();
		} else {
			this.scale(1);
			this.modified();
		}
	}

	isOutsideButton(ev: g.PointEvent): boolean {
		let delta = {x: 0, y: 0};
		if (ev instanceof g.PointMoveEvent || ev instanceof g.PointUpEvent) {
			delta.x = ev.startDelta.x;
			delta.y = ev.startDelta.y;
		}
		let x = ev.point.x + delta.x;
		let y = ev.point.y + delta.y;
		if (this.isCercle) {
			let r = this.getButton().width / 2;
			x -= r;
			y -= r;
			return x * x + y * y > r * r;
		}
		return x < 0 || y < 0 || x > this.getButton().width || y > this.getButton().height;
	}

}

export = Button;
