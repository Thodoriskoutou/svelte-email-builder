import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks';
import PocketBase from 'pocketbase'

export const authentication: Handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(Bun.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090')
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    try {
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh()
    } catch (_) {
        event.locals.pb.authStore.clear()
    }

    if (event.url.pathname.length < 2) {
        redirect(303, '/dashboard')
    }

    const response = await resolve(event)

    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ sameSite: 'Lax' }));

    return response
}

const unprotectedPrefix = ['/login', '/register', '/auth' ];

export const authorization: Handle = async ({ event, resolve }) => {
	if (!unprotectedPrefix.some((path) => event.url.pathname.startsWith(path)) && event.url.pathname !== '/') {
		const loggedIn = await event.locals.pb.authStore.model;
		if (!loggedIn) {
			throw redirect(303, '/login');
		}
	}
	const result = await resolve(event);
	return result;
};

export const handle = sequence(authentication, authorization)