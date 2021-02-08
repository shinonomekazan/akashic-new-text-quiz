export interface InputTextEventData {
	type: "text";
	text: string;
}

export interface InputTextEvent extends g.MessageEvent {
	data: InputTextEventData;
}
