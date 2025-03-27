import { json, type RequestHandler } from '@sveltejs/kit';
import puppeteer from 'puppeteer';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { currentUrl, TemplateId } = await request.json();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']});
        
        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1340, height: 836, deviceScaleFactor: 1 });
            await page.goto(currentUrl, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            const screenshotBuffer = await page.screenshot({
                type: 'png',
                fullPage: false,
                encoding: 'binary'
            });
            const formData = new FormData();
            const blob = new Blob([screenshotBuffer], { type: 'image/png' });
            formData.append('Preview', blob, 'preview.png');
            await locals.pb.collection('newsletters').update(TemplateId, formData);
            return json({ 
                success: true, 
                id: TemplateId
            });
        } finally {
            await browser.close();
        }
    } catch (error) {
        console.error('Error generating screenshot:', error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
};