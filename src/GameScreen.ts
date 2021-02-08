import { Label } from "@akashic-extension/akashic-label";
import BottomPopup = require("./BottomPopup");
import Button = require("./button/Button");
import TextButton = require("./button/TextButton");
import * as events from "./common/events";
import turn = require("./enum/Turn");
import GameCore = require("./GameCore");
import Player = require("./Player");

class GameScreen extends g.E {

	gameCore: GameCore;

	questionLayout: g.E;
	contentLayout: g.E;

	gameStatusLabel: Label;
	userStatusLabel: Label;
	questionLabel: Label;
	answerLabel: Label;
	myAnswerLabel: Label;
	quizNumLabel: Label;
	bottomLeftLabel: Label;

	resetButton: Button;
	questionButton: Button;
	stopButton: Button;
	nextButton: Button;
	finishButton: Button;

	popup: BottomPopup;

	currentTurn: turn;

	question: string;
	answer: string;
	myAnswer: string;

	quizNum: number;

	constructor(params: g.EParameterObject, gameCore: GameCore) {
		super(params);

		this.gameCore = gameCore;

		this.quizNum = 0;

		// background
		// new g.FilledRect({
		// 	scene: this.scene,
		// 	cssColor: "Indigo",
		// 	width: this.width,
		// 	height: this.height,
		// 	opacity: 1,
		// 	local: true,
		// 	parent: this
		// });

		this.scene.message.add(ev => {
			if (!ev.data) return;
			let playerID = ev.player.id;

			if (ev.data.type === "text") {
				const inputTextEvent = ev as events.InputTextEvent;
				if (playerID === g.game.selfId) {
					if (this.currentTurn === turn.question && gameCore.myPlayer.isMaster()) {
						if (this.question === "") {
							g.game.raiseEvent(new g.MessageEvent({
								message: "Question",
								text: inputTextEvent.data.text
							}));
						} else if (this.answer === "") {
							g.game.raiseEvent(new g.MessageEvent({
								message: "Answer",
								text: inputTextEvent.data.text
							}));
						}
					} else if (this.currentTurn === turn.answer && !gameCore.myPlayer.isMaster()) {
						if ( this.myAnswer === "") {
							g.game.raiseEvent(new g.MessageEvent({
								message: "MyAnswer",
								text: inputTextEvent.data.text
							}));
						}
					}
				}
			} else {
				if (ev.data.message === "Question" && this.currentTurn === turn.question && this.question === "") {
					this.setQuestion(ev.data.text);
				}

				if (ev.data.message === "Answer" && this.currentTurn === turn.question && this.answer === "") {
					this.setAnswer(ev.data.text);
				}

				if (ev.data.message === "MyAnswer" && ev.player.id === g.game.selfId
					&& this.currentTurn === turn.answer && this.myAnswer === "") {
					this.setMyAnswer(ev.data.text);

					if (this.isWin()) {
						this.onWin();
						g.game.raiseEvent(new g.MessageEvent({ message: "Clear", age: g.game.age }));
					} else {
						this.onLose();
						g.game.raiseEvent(new g.MessageEvent({ message: "Failed", age: g.game.age }));
					}
				}
			}

			//
			if (ev.data.message === "Failed") {
				if (ev.player.id !== g.game.selfId && g.game.age - ev.data.age < g.game.fps * 3) {
				    // this.showPopup((ev.player.name != null ? ev.player.name : "Player " + ev.player.id) + " Failed !");
					this.setBottomLeftLabel((ev.player.name != null ? ev.player.name : "Player " + ev.player.id) + " Failed !");
				}
			}

			if (ev.data.message === "Clear") {
				if (ev.player.id !== g.game.selfId && g.game.age - ev.data.age < g.game.fps * 3) {
				    // this.showPopup((ev.player.name != null ? ev.player.name : "Player " + ev.player.id) + " Clear !");
					this.setBottomLeftLabel((ev.player.name != null ? ev.player.name : "Player " + ev.player.id) + " Clear !");
				}
			}

			if (ev.data.message === "ClosePopup") {
				if (ev.player.id === g.game.selfId) {
					this.closePopup();
				}
			}
		});

		gameCore.onMasterJoined.addOnce((masterId) => {
			this.onMasterJoined();
		});

		this.createLayout();
		this.createText();
		this.createMasterButtons();
		this.createDebugButton();

		this.onStart();
	}

	createLayout(): void {
		this.questionLayout = new g.E({
			scene: this.scene,
			// cssColor: "black",
			width: 400,
			height: 200,
			x: this.gameCore.center.x,
			y: 140,
			anchorX: .5,
			anchorY: .5,
			local: true,
			parent: this
		});

		new g.FilledRect({
			scene: this.scene,
			cssColor: "black",
			width: this.questionLayout.width,
			height: this.questionLayout.height,
			opacity: .2,
			local: true,
			parent: this.questionLayout
		});

		var height = this.height - (this.questionLayout.y + this.questionLayout.height / 2);

		this.contentLayout = new g.E({
			scene: this.scene,
			// cssColor: "red",
			width: this.width,
			height: height,
			x: this.gameCore.center.x,
			y: this.height - height / 2,
			anchorX: .5,
			anchorY: .5,
			local: true,
			parent: this
		});
	}

	createText(): void {
		this.questionLabel = new Label({
			scene: this.scene,
			width: this.questionLayout.width - 32,
			font: this.gameCore.font,
			fontSize: 20,
			text: "questionLabel",
			textColor: "Indigo",
			textAlign: g.TextAlign.Center,
			x: 16,
			y: 16,
			local: true
		});

		this.answerLabel = new Label({
			scene: this.scene,
			width: this.contentLayout.width - 16,
			font: this.gameCore.font,
			fontSize: 18,
			text: "answerLabel",
			textColor: "Indigo",
			x: 16,
			y: 32,
			local: true
		});

		this.myAnswerLabel = new Label({
			scene: this.scene,
			width: this.contentLayout.width - 16,
			font: this.gameCore.font,
			fontSize: 18,
			text: "myAnswerLabel",
			textColor: "Indigo",
			x: 16,
			y: 32,
			local: true
		});

		this.quizNumLabel = new Label({
			scene: this.scene,
			width: this.contentLayout.width - 32,
			font: this.gameCore.font,
			fontSize: 18,
			text: "quizNumLabel",
			textColor: "Indigo",
			textAlign: g.TextAlign.Right,
			x: 16,
			y: this.contentLayout.height - 34,
			local: true
		});

		this.gameStatusLabel = new Label({
			scene: this.scene,
			width: this.contentLayout.width - 24,
			font: this.gameCore.font,
			fontSize: 18,
			text: "gameStatusLabel",
			textColor: "Indigo",
			textAlign: g.TextAlign.Center,
			x: 12,
			y: this.contentLayout.height * .5 - 18,
			local: true,
			parent: this.contentLayout
		});

		this.userStatusLabel = new Label({
			scene: this.scene,
			width: this.contentLayout.width - 24,
			font: this.gameCore.font,
			fontSize: 30,
			text: "userStatusLabel",
			textColor: "Indigo",
			textAlign: g.TextAlign.Center,
			x: 12,
			y: this.contentLayout.height * .55 - 30,
			local: true
		});

		this.bottomLeftLabel = new Label({
			scene: this.scene,
			width: this.contentLayout.width - 24,
			font: this.gameCore.font,
			fontSize: 18,
			text: "bottomLeftLabel",
			textColor: "Indigo",
			textAlign: g.TextAlign.Left,
			x: 12,
			y: this.contentLayout.height - 34,
			local: true,
		});

	}

	createMasterButtons(): void {
		let parent = this.contentLayout;

		let buttonwidth = 160;
		let buttonheight = 50;
		let y = parent.height * .6;

		this.resetButton = new TextButton({
			scene: parent.scene,
			width: buttonwidth,
			height: buttonheight,
			text: "Reset",
			fontSize: Math.round(buttonheight / 2),
			textColor: "white",
			color: "Indigo",
			x: (parent.width - buttonwidth - 16) / 2,
			y: y
		});

		this.questionButton = new TextButton({
			scene: parent.scene,
			width: buttonwidth,
			height: buttonheight,
			text: "Question!",
			fontSize: Math.round(buttonheight / 2),
			textColor: "white",
			color: "Indigo",
			x: (parent.width + buttonwidth + 16) / 2,
			y: y
		});

		this.stopButton = new TextButton({
			scene: parent.scene,
			width: buttonwidth,
			height: buttonheight,
			text: "Stop",
			fontSize: Math.round(buttonheight / 2),
			textColor: "white",
			color: "Indigo",
			x: parent.width / 2,
			y: y
		});

		this.nextButton = new TextButton({
			scene: parent.scene,
			width: buttonwidth,
			height: buttonheight,
			text: "Next",
			fontSize: Math.round(buttonheight / 2),
			textColor: "white",
			color: "Indigo",
			x: parent.width / 2,
			y: y - buttonheight/2 - 8
		});

		this.finishButton = new TextButton({
			scene: parent.scene,
			width: buttonwidth,
			height: buttonheight,
			text: "Finish",
			fontSize: Math.round(buttonheight / 2),
			textColor: "white",
			color: "Indigo",
			x: parent.width / 2,
			y: y + buttonheight/2 + 8
		});

		this.resetButton.onClick.add(this.onReset, this);
		this.questionButton.onClick.add(this.onQuestion, this);
		this.stopButton.onClick.add(this.onStop, this);
		this.nextButton.onClick.add(this.onNext, this);
		this.finishButton.onClick.add(this.onFinish, this);
	}

	createDebugButton(): void {
		let input1 = new TextButton({
			scene: this.scene,
			width: 50,
			height: 20,
			text: "input1",
			fontSize: Math.round(12),
			textColor: "white",
			color: "Indigo",
			x: 33,
			y: 18,
			local: true,
			parent: this
		});

		let input2 = new TextButton({
			scene: this.scene,
			width: 50,
			height: 20,
			text: "input2",
			fontSize: Math.round(12),
			textColor: "white",
			color: "Indigo",
			x: 33 + 50 + 8,
			y: 18,
			local: true,
			parent: this
		});

		let input3 = new TextButton({
			scene: this.scene,
			width: 50,
			height: 20,
			text: "input3",
			fontSize: Math.round(12),
			textColor: "white",
			color: "Indigo",
			x: 33 + (50 + 8) * 2,
			y: 18,
			local: true,
			parent: this
		});

		input1.onClick.add((ev) => {
			console.log("input1");
			g.game.raiseEvent(new g.MessageEvent({
				type: "text",
				text: "input1 input1 input1 input1 input1 input1 input1 input1 input1 input1 input1 input1 input1 input1 input1"
			}, ev.player));
		});

		input2.onClick.add((ev) => {
			console.log("input2");
			g.game.raiseEvent(new g.MessageEvent({
				type: "text",
				text: "input2 input2 input2 input2"
			}, ev.player));
		});

		input3.onClick.add((ev) => {
			console.log("input3");
			g.game.raiseEvent(new g.MessageEvent({
				type: "text",
				text: "input3 input3"
			}, ev.player));
		});
	}

	showPopup(text: string): void {
		if (this.popup && !this.popup.destroyed()) {
			this.popup.label.text = text;
			this.popup.label.invalidate();
			return;
		}

		// this.popup = new Popup({
		//     scene: this.scene,
		//     text: text,
		//     font: this.gameCore.font,
		//     width: this.width * .8,
		//     x: g.game.width / 2,
		//     y: g.game.height / 2,
		//     anchorX: .5,
		//     anchorY: .5,
		//     local: true,
		//     parent: this.scene
		// });

		this.popup = new BottomPopup({
			scene: this.scene,
			text: text,
			font: this.gameCore.font,
			width: this.width,
			x: g.game.width / 2,
			y: g.game.height,
			anchorX: .5,
			anchorY: 1,
			local: true,
			parent: this.scene
		});

		this.popup.closeButton.onClick.add(() => {
			g.game.raiseEvent(new g.MessageEvent({ message: "ClosePopup" }));
		});
	}

	closePopup(): void {
		if (this.popup && !this.popup.destroyed()) {
			this.popup.destroy();
		}
	}

	onStart(): void {
		this.setGameStatus("initializing...");
	}

	onMasterJoined(): void {
		if (this.gameCore.myPlayer.isMaster()) {
			this.contentLayout.append(this.answerLabel);
			this.contentLayout.append(this.resetButton);
			this.contentLayout.append(this.questionButton);
			this.contentLayout.append(this.stopButton);
			this.contentLayout.append(this.nextButton);
			this.contentLayout.append(this.finishButton);
		} else {
			this.contentLayout.append(this.myAnswerLabel);
			this.contentLayout.append(this.userStatusLabel);
		}

		this.questionLayout.append(this.questionLabel);
		this.contentLayout.append(this.quizNumLabel);
		this.contentLayout.append(this.bottomLeftLabel);

		this.setGameStatus("");
		this.setBottomLeftLabel("");

		this.onQuestionTurn();
	}

	onQuestionTurn(): void {
		console.log("onQuestionTurn");
		this.currentTurn = turn.question;

		this.quizNum++;
		this.setQuizNum(this.quizNum);

		this.setQuestion("");
		this.setAnswer("");

		if (this.gameCore.myPlayer.isMaster()) {
			this.resetButton.show();
			this.questionButton.show();
			this.stopButton.hide();
			this.nextButton.hide();
			this.finishButton.hide();
		} else {
			this.setMyAnswer("");
			this.setUserStatus("");

			this.questionLabel.hide();
			this.myAnswerLabel.hide();
			this.setGameStatus("waiting for questions");
		}
	}

	onAnswerTurn(): void {
		console.log("onAnswerTurn");
		this.currentTurn = turn.answer;

		if (this.gameCore.myPlayer.isMaster()) {
			this.resetButton.hide();
			this.questionButton.hide();
			this.stopButton.show();
			this.nextButton.hide();
			this.finishButton.hide();
		} else {
			this.questionLabel.show();
			this.myAnswerLabel.show();
			this.setGameStatus("");
		}
	}

	onResult(): void {
		console.log("onResult");
		this.currentTurn = -1;

		this.closePopup();
		this.setBottomLeftLabel("");

		if (this.gameCore.myPlayer.isMaster()) {
			this.resetButton.hide();
			this.questionButton.hide();
			this.stopButton.hide();
			this.nextButton.show();
			this.finishButton.show();
		} else {
			if (this.isWin()) this.onWin();
			else this.onLose();
		}
	}

	// button onClick
	onReset(ev: g.PointEvent): void {
		if (ev.player.id !== Player.masterId) return;
		// console.log("onReset");
		if (this.question.length > 0) this.setQuestion("");
		if (this.answer.length > 0) this.setAnswer("");
	}

	onQuestion(ev: g.PointEvent): void {
		if (ev.player.id !== Player.masterId) return;
		if (this.question.length === 0) {
			console.log("Question is empty !");
			return;
		}
		if (this.answer.length === 0) {
			console.log("Answer is empty !");
			return;
		}
		this.onAnswerTurn();
	}

	onStop(ev: g.PointEvent): void {
		if (ev.player.id !== Player.masterId) return;
		this.onResult();
	}

	onNext(ev: g.PointEvent): void {
		if (ev.player.id !== Player.masterId) return;
		this.onQuestionTurn();
	}

	onFinish(ev: g.PointEvent): void {
		if (ev.player.id !== Player.masterId) return;
		console.log("onFinish");
	}

	//
	onLose(): void {
		console.log("onLose");
		this.currentTurn = -1;
		this.setUserStatus("You Lose !");
	}

	onWin(): void {
		console.log("onWin");
		this.currentTurn = -1;
		this.setUserStatus("You Win !");
	}

	//
	isWin(): boolean {
		return this.answer === this.myAnswer;
	}

	//
	setQuestion(text: string): void {
		console.log("Question:", text);
		this.question = text;

		this.questionLabel.text = "Question:\n" + this.question;
		this.questionLabel.invalidate();
	}

	setAnswer(text: string): void {
		console.log("Answer:", text);
		this.answer = text;

		this.answerLabel.text = "Answer: " + this.answer;
		this.answerLabel.invalidate();
	}

	setMyAnswer(text: string): void {
		console.log("My Answer:", text);
		this.myAnswer = text;

		this.myAnswerLabel.text = "Your Answer: " + this.myAnswer;
		this.myAnswerLabel.invalidate();
	}

	setQuizNum(num: number): void {
		console.log("Quiz Num:", num);

		this.quizNumLabel.text = "Quiz: " + num;
		this.quizNumLabel.invalidate();
	}

	setGameStatus(text: string): void {
		console.log("Game Status:", text);

		this.gameStatusLabel.text = text;
		this.gameStatusLabel.invalidate();
	}

	setUserStatus(text: string): void {
		console.log("User Status:", text);

		this.userStatusLabel.text = text;
		this.userStatusLabel.invalidate();
	}

	setBottomLeftLabel(text: string): void {
		console.log("setBottomLeftLabel:", text);

		this.bottomLeftLabel.text = text;
		this.bottomLeftLabel.invalidate();
	}

}

export = GameScreen;
