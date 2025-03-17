import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';



export const load:PageLoad  = async ({params}) => {
    try {
        const TemplateId = params.TemplateId;

        const records = await pb.collection('newsletters').getOne(`${TemplateId}`);
        return {
            posts: records,
        };
    } catch (error) {
        return {
            status: 500,
            error: new Error('Failed to fetch data from PocketBase'),
        };
    }
}