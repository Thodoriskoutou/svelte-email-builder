import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';

export const load:PageLoad  = async ({params}) => {
    try {
        const records = await pb.collection('newsletters').getFullList();

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