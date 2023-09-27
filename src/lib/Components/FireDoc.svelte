<script>
	import { onMount, onDestroy } from 'svelte';
	import { doc, onSnapshot } from 'firebase/firestore';

	export let path;
	export let firestore;

	let data = {},
		unsubscribe;

	onMount(() => {
		const docRef = doc(firestore, path);
		unsubscribe = onSnapshot(docRef, (doc) => {
			data = {
				id: doc.id,
				ref: doc.ref,
				...doc.data()
			};
		});
	});

	onDestroy(() => unsubscribe());
</script>

<slot {data} />
