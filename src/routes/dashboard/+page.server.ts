import type { PageServerLoad } from './$types'
import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'

export const load:PageServerLoad  = async ({locals}) => {
    try {
        const records = await locals.pb.collection('newsletters').getFullList()
        records.forEach(r => {
            r.thumbnail = locals.pb.files.getURL(r, r.Preview, {'thumb': '200x200t'})
        })
        return {
            templates: records,
        }
    } catch (err) {
        error(500, `Failed to fetch data from Pocketbase: ${err.message}`)
    }
}

export const actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData()
        const subject = data.get('subject')
        if(subject && subject.length) {
            const record = {
                "Subject": subject,
                "Created_by": locals.user.email,
                "Content": null
            }
            await locals.pb.collection('newsletters').create(record)

            return { success: true }
        } else {
            return fail(400, { subject, missing: true })
        }
	}
    // TODO delete/rename
} satisfies Actions