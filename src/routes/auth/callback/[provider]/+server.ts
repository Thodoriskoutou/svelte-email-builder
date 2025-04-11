import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({locals, url, cookies}) => {
    const provider = JSON.parse(cookies.get('provider') || '{}')

    if (provider.state !== url.searchParams.get('state')) {
        throw new Error('State parameters don\'t match')
    }

    try {
        const res = await locals.pb.collection('users').authWithOAuth2Code(
            provider.name,
            url.searchParams.get('code') || '',
            provider.codeVerifier,
            Bun.env.ORIGIN + '/auth/callback/' + provider.name
        )
    } catch (error) {
        console.error(error)
        redirect(303, '/login?fail=true')
    }

    redirect(303, '/login')
}