// src/routes/api/screenshot/+server.ts
import { json } from '@sveltejs/kit';
import puppeteer from 'puppeteer';
import { pb } from '$lib/pocketbase';


export async function POST({ request }) {
    let templateid = data.posts?.id;

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    await page.goto(`${appUrl}/dashboard/${templateid}`);
    
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    const blob = new Blob([screenshotBuffer], { type: 'image/png' });
    const file = new File([blob], 'preview.png', { type: 'image/png' });
    
    const formData = new FormData();
    formData.append('Preview', file);
    
    await pb.collection('newsletters').update(templateid, formData);
    pb.authStore.clear();

    return json({ success: true });
}