import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import puppeteer from 'puppeteer';

export const POST: RequestHandler = async ({ request }) => {
	const html = await request.text();
    const browser = await puppeteer.launch({});
    let preview = 'Cannot generate screenshot!';
    try {
        const page = await browser.newPage();
        await page.setContent(html);
        preview = await page.screenshot({encoding: "base64"});
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
        return text(preview);
    }
};