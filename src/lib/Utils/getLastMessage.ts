import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

async function getLastMessage(db, chatID: string, maxLength = 16): Promise<string> {
	let lastMessage = '';
	const path = `chats/${chatID}/messages`;
	const messagesRef = collection(db, path);
	const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
	const docs = await getDocs(q);
	docs.forEach((snapshot) => {
		const { content } = snapshot.data();
		const sliced =
			content.at(-1).length > maxLength ? content.at(-1).slice(0, maxLength) : content.at(-1);
		const unread = content.length > 1 ? ` +${content.length - 1} more` : '';
		lastMessage = `${sliced}${unread}`;
	});
	return lastMessage;
}

export default getLastMessage;
