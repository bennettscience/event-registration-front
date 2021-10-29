import {writable} from 'svelte/store';

// Store data about the currently selected course
// to display in the sidebar.
export let courseDetailInitial = {
    available: "",
    description: "",
    ends: "",
    id: "",
    links: [],
    location: {
        address: "", 
        description: "", 
        id: "", 
        name: ""
    },
    presenters: [],
    starts: "",
    state: "",
    title: "",
}
export let courseDetail = writable(courseDetailInitial);

// User detail for authentication in different views.
export let user = writable({})

// TODO: Rely on the courses store rather than refetching
export let courses = writable([])
export let registrations = writable([])
export let locations = writable([])
export let courseTypes = writable();