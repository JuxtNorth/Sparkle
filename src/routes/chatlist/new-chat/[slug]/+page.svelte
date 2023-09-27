<script lang="ts">
	import {
		ChatHeader,
		MessageContainer,
		ChatBox,
		FireCollection
	} from '$lib/Components';
	import { getProfilePicture } from '$lib/Utils';
	import { goto } from '$app/navigation';
	import firebaseApp from '$lib/firebaseInit.ts';
	import {
		getFirestore,
		doc,
		getDoc,
		addDoc,
		setDoc,
		collection,
		runTransaction,
		serverTimestamp,
		updateDoc,
		arrayUnion
	} from 'firebase/firestore';

	export let data;

	let chatID,
		username = data.username,
		lastMessage,
		messagesRef;
	const db = getFirestore(firebaseApp);

	$: messagesRef = collection(
		db,
		`chats/${chatID}`,
		'messages'
	);

	async function handleSend(event: CustomEvent) {
		const { message } = event.detail;
		if (!chatID) {
			// Auto add a message on chat creation
			chatID = await getChat(username, message);
			return;
		}
		const selfUsername = await getSelfUsername();
		if (lastMessage.sender === selfUsername) {
			await updateDoc(lastMessage.ref, {
				content: arrayUnion(message)
			});
			return;
		}
		await addDoc(messagesRef, {
			timestamp: serverTimestamp(),
			content: [message],
			sender: selfUsername,
			type: 'text'
		});
	}

	function handleSnaphot(event) {
		lastMessage = event.detail.data.at(-1);
		console.log(lastMessage);
	}

	function handleClose() {
		goto('/chatlist/find');
	}

	async function getChat(
		username: string,
		message: string
	): Promise<string> {
		// If chat exists return chatID
		const chatRef = doc(
			db,
			`users/${data.self.uid}/chats/${username}`
		);
		const chat = await getDoc(chatRef);
		if (chat.exists()) {
			return chat.data().id;
		} else {
			return await createChat(username, message);
		}
	}

	async function createChat(
		username2: string,
		message: string
	): Promise<void> {
		const uid1 = data.self.uid;
		const uid2 = data.uid;
		try {
			const chatID = await runTransaction(
				db,
				async () => {
					const username1 = await getSelfUsername();
					const id = await createChatDoc([
						username1,
						username2
					]);
					// Add chatID to self's chat collection
					const path1 = `users/${uid1}/chats`;
					await setDoc(
						doc(db, path1, username2),
						{
							id: id,
							createdAt: serverTimestamp()
						},
						{ merge: true }
					);

					// Add chatID to other user's request collection.
					const path2 = `users/${uid2}/requests`;
					await setDoc(
						doc(db, path2, username1),
						{
							id: id,
							createdAt: serverTimestamp()
						},
						{ merge: true }
					);
					const messagesRef = collection(
						db,
						`chats/${id}`,
						'messages'
					);
					await addDoc(messagesRef, {
						timestamp: serverTimestamp(),
						content: [message],
						sender: username1,
						type: 'text'
					});
					return id;
				}
			);
			return chatID;
		} catch (error) {
			console.error(error);
		}
	}

	async function createChatDoc(
		members: string[]
	): string {
		const chatsRef = collection(db, 'chats');
		const chatRef = await addDoc(chatsRef, {
			createdAt: serverTimestamp(),
			members: members
		});
		return chatRef.id;
	}

	let _cache;
	async function getSelfUsername() {
		if (_cache) return _cache;
		try {
			const userRef = doc(db, 'users', data.self.uid);
			const user = await getDoc(userRef);
			_cache = user.data().username;
			return _cache;
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="container">
	<ChatHeader
		on:close={handleClose}
		{username}
		showCallButtons={false}
		status="online"
	/>
	{#if chatID?.length > 0}
		<MessageContainer
			{chatID}
			{username}
			on:snapshot={handleSnaphot}
		/>
	{/if}
	<ChatBox on:send={handleSend} />
</div>

<style lang="scss">
	div.container {
		min-height: calc(100vh - 72px);
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
