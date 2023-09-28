<script lang="ts">
	import { ChatHeader, MessageContainer, ChatBox, FireCollection } from '$lib/Components';
	import { isChatOpen } from '$lib/stores';
	import { onMount } from 'svelte';
	import {
		getFirestore,
		getDoc,
		setDoc,
		getDocs,
		doc,
		collection,
		runTransaction,
		addDoc,
		serverTimestamp,
		query as firestoreQuery,
		onSnapshot,
		arrayUnion,
		updateDoc,
		orderBy,
		limit
	} from 'firebase/firestore';
	import { getFirebaseUser } from '$lib/Utils';
	import firebaseApp from '$lib/firebaseInit.ts';

	export let chatID: string;
	export let username: string;

	let selfUsername, lastMessage;
	const db = getFirestore(firebaseApp);
	const messagesRef = collection(db, `chats/${chatID}`, 'messages');

	onMount(async () => {
		const self = await getFirebaseUser();
		const selfUserRef = doc(db, 'users', self.uid);
		const selfUser = await getDoc(selfUserRef);
		selfUsername = await selfUser.data().username;
	});

	function closeChat() {
		isChatOpen.set(false);
	}

	async function handleSend(event: CustomEvent): void {
		const { message } = event.detail;
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
	}

	function handleBack(e): void {
		e.preventDefault();
		closeChat();
	}
</script>

<svelte:window on:popstate={handleBack} />

<div class="container">
	<ChatHeader on:close={closeChat} {username} status="online" />
	<MessageContainer {chatID} {username} on:snapshot={handleSnaphot} />
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
