<script>
	import {
		onMount,
		onDestroy,
		createEventDispatcher
	} from 'svelte';
	import {
		collection,
		onSnapshot,
		query as firebaseQuery
	} from 'firebase/firestore';

	export let path;
	export let firestore;
	export let query = null;

	let data = [],
		unsubscribe;

	const dispatch = createEventDispatcher();

	function handleSnapshot(data) {
		dispatch('snapshot', { data });
	}

	onMount(() => {
		if (query === null) {
			const collectionRef = collection(firestore, path);
			query = firebaseQuery(collectionRef);
		}
		unsubscribe = onSnapshot(query, (qs) => {
			data = [];
			qs.forEach((entry) => {
				data.push({
					id: entry.id,
					ref: entry.ref,
					...entry.data()
				});
			});
			handleSnapshot(data);
		});
	});

	onDestroy(() => unsubscribe());
</script>

<slot {data} />
