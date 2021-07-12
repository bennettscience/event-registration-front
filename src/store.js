import {writable} from 'svelte/store';

// Store data about the currently selected course
// to display in the sidebar.
export let courseDetail = writable({});

// User detail for authentication in different views.
export let user = writable({})

// 
export let courses = writable([])
export let locations = writable([])
export let courseTypes = writable();