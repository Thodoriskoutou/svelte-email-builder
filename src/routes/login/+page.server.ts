import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import type { PageServerLoad } from './$types'
import type { ClientResponseError } from 'pocketbase';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (locals.pb.authStore.record) {
        redirect(303, '/dashboard')
    }

    const authMethods = await locals.pb.collection('users').listAuthMethods()
    const fail = url.searchParams.get("fail") === "true"

    return {
        providers: authMethods.oauth2.enabled && authMethods.oauth2.providers,
        fail
    }
}

export const actions: Actions = {
    login: async ({ locals, request }) => {
        const data = await request.formData()
        const email = data.get('email')
        const password = data.get('password')
        
        if (!email || !password) {
            return fail(400, { emailRequired: email === null, passwordRequired: password === null })
        }

        try {
            await locals.pb
            .collection('users')
            .authWithPassword(email.toString(), password.toString())
        } catch (e) {
            const errorObj = e as ClientResponseError;
            return fail(500, {fail: true, message: errorObj.data.message});
        }
        redirect(303, '/dashboard')
    },
    // oAuth2
    oauth2: async ({ locals, cookies, request }) => {
        const authMethods = await locals.pb.collection('users').listAuthMethods()
        if(!authMethods.oauth2.enabled) {
            return fail(400, { method: 'oauth2', missing: true })
        }
        const data = await request.formData()
        const provider = data.get('provider') || ''
        if (!provider.length) {
            return fail(400, { provider, missing: true })
        }
        const found = authMethods.oauth2.providers.find((p: any) => p.name === provider)
        if (!found) {
            return fail(400, { provider, incorrect: true })
        }
        cookies.set('provider', JSON.stringify(found), {httpOnly: true, path: `/auth/callback/${provider}`})

        redirect(303, found.authURL + '&redirect_url=' + Bun.env.ORIGIN + '/auth/callback/' + found.name)
    },
    logout: async ({ locals }) => {
        await locals.pb.authStore.clear()
        redirect(303, '/login')
    }
}