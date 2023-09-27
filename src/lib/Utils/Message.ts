import {
	serverTimestamp,
	addDoc
} from 'firebase/firestore';

type MessageType = 'text' | 'peer_request';

interface MessageParams {
	content?: string[];
	type?: MessageType;
	sender: string;
	timestamp?: any;
}

class Message {
	public timestamp: any = serverTimestamp();
	public content: string[] = [];
	public type: string = 'text';
	public sender: string;
	public self?: boolean;

	constructor(params: MessageParams) {
		Object.assign(this, params);
	}

	public toFirestore(): Record<string, any> {
		return {
			timestamp: serverTimestamp(),
			content: this.content,
			type: this.type,
			sender: this.sender
		};
	}

	public fromFirestore(snapshot, options = {}): this {
		const data = snapshot.data(options);
		this.content = data.content;
		this.type = data.type;
		this.timestamp = data.timestamp;
		this.sender = data.sender;
		return this;
	}

	public addMessage(message: string): void {
		if (this.type === 'peer_request') {
			console.error(
				`A peer request message object cannot have more than one ids in it's content`
			);
			return;
		}
		this.content.push(message);
	}

	public setAuthor(selfUser) {
		this.self = selfUser.username == this.sender;
	}

	public async commit(collection): Promise<void> {
		await addDoc(collection, this.toFirestore());
	}
}

export default Message;
