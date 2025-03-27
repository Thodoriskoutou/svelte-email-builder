import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { error, json } from '@sveltejs/kit'
import puppeteer from 'puppeteer'

export const load:PageServerLoad  =  async ({ params, locals }) => {
    try {
        const TemplateId = params.TemplateId;
        const record = await locals.pb.collection('newsletters').getOne(`${TemplateId}`)
        return {
            template: record,
        }
    } catch (err) {
        error(500, `Failed to fetch data from Pocketbase: ${err.message}`)
    }
}

export const actions = {
	save: async ({ request, locals }) => {
		const data = await request.formData()
        const content = data.get('content')
        const html = data.get('html')
        const templateId = data.get('templateId')

        const browser = await puppeteer.launch({})
        let preview: Uint8Array<ArrayBufferLike>|null = null

        try {
            const page = await browser.newPage()
            await page.setContent(html)
            preview = await page.screenshot()
        } catch (e) {
            console.error(e)
        }

        const screenshot = new Blob([preview!], { type: 'image/png' })
        const record = {
            "Updated_by": locals.user.email,
            "Content": content,
            "Preview": preview ? new File([screenshot], 'screenshot.png', { type: 'image/png' }) : null
        }
        await locals.pb.collection('newsletters').update(templateId, record)

        return { success: true }
	},
    delete: async ({ request, locals }) => {
		const data = await request.formData()
        const templateId = data.get('templateId')
        if(templateId && templateId.length) {
            await locals.pb.collection('newsletters').delete(templateId)

            return redirect(302, '/dashboard')
        } else {
            return fail(400, { templateId, invalid: true })
        }
	},
    addImage: async ({ request, locals }) => {
		const data = await request.formData()
        const templateId = data.get('templateId')
        const file = data.get('file')
        if(!file || file.size === 0) {
            return fail(400, { file, missing: true })
        }
        if(templateId && templateId.length) {
            const result = await locals.pb.collection('newsletters').update(templateId, {
                "Images+": file
            })
            return { success: true, filename: result.Images.pop() }
        } else {
            return fail(400, { templateId, invalid: true })
        }
    }
} satisfies Actions