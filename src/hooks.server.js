import { API_ROOT } from '$env/static/private';

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch, event }) {
    // if (request.url.startsWith)

    // console.log('API ROOT from env:', API_ROOT);
    // console.log("Event in hooks.server.js:", event);
    return fetch(request);
}