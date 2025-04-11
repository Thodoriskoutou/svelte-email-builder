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
                "Created_by": locals.pb.authStore.record?.email,
                "Content": null
            }
            await locals.pb.collection('newsletters').create(record)

            return { success: true }
        } else {
            return fail(400, { subject, missing: true })
        }
	},
    rename: async({request, locals}) =>{
        const data = await request.formData()
        const templateId = data.get('templateId')
        const newName = data.get('rename')
        if(templateId && templateId.length) {
            const record = {
                "Subject": newName
            }
            await locals.pb.collection('newsletters').update(templateId,record)
        } else {
            return fail(400, { templateId, invalid: true })
        }
    },
    delete:async({request,locals}) =>{
        const data = await request.formData()
        const templateId = data.get('templateId')
        if(templateId && templateId.length) {
            await locals.pb.collection('newsletters').delete(templateId)
        } else {
            return fail(400, { templateId, invalid: true })
        }
    },
    clone:async({request,locals}) =>{
        const data = await request.formData()
        const id = data.get('templateId')

        if(id && id.length) {
            const original = await locals.pb.collection('newsletters').getOne(id)
            const images: File[] = []
            original.Images.forEach(async img => {
                const url = locals.pb.files.getURL(original, img)
                images.push(await downloadFile(url, img))
            })
            const preview = (original.Preview && original.Preview.length)
                ? await downloadFile(locals.pb.files.getURL(original, original.Preview), original.Preview)
                : null
            const record = {
                "Subject": original.Subject + ' Clone',
                "Created_by": locals.pb.authStore.record?.email,
                "Content": original.Content,
                "Images": images,
                "Preview": preview
            }
            const newRecord = await locals.pb.collection('newsletters').create(record)
            let originalContent = JSON.stringify(original.Content);
            originalContent = originalContent.replaceAll(original.id, newRecord.id)
            original.Images.forEach(img => {
                originalContent = originalContent.replaceAll(img, newRecord.Images.filter(i => i.indexOf(img.split('.')[0]) === 0)[0])
            })
            await locals.pb.collection('newsletters').update(newRecord.id, {
                "Content": JSON.parse(originalContent)
            })

            return { success: true }
        } else {
            return fail(400, { id, missing: true })
        }
    }
} satisfies Actions

async function downloadFile(url, filename) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
    }
    const blob = await response.blob()
    const file = new File([blob], filename, { type: blob.type })
    
    return file
}
