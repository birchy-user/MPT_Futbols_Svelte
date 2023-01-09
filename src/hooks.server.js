import { API_ROOT } from '$env/static/private';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // const { url } = event;
    // const key = `rendered:v1:${url.pathname}`;
    // const response = await resolve(event);
    // let bodyOfResposnse = await response.text();
    // console.log("Body of response: ", bodyOfResposnse);

    // return new Response(bodyOfResposnse);
    
    return resolve(event);
}

// /** @type {import('@sveltejs/kit').HandleFetch} */
// export async function handleFetch({ request, fetch, event }) {
//     // if (request.url.startsWith)

//     // console.log('API ROOT from env:', API_ROOT);
//     // console.log("Event in hooks.server.js:", event);
//     return fetch(request);
// }