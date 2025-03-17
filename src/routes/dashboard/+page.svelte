<script lang="ts">
import type { PageProps } from './$types';
import { pb } from '$lib/pocketbase';
let { data }: PageProps = $props();


let subject = $state('');

async function createTemplate() {
    const currentUser = pb.authStore.record;

    const data = {
        "Subject": subject,
        "Created_by": currentUser?.email,
        "Content": null
    };
    const record = await pb.collection('newsletters').create(data);

    location.reload();
}


</script>
<section class="welcome-message">
    <h1>Welcome to the Email Builder!</h1>
    <input 
        type="text" 
        placeholder="Enter subject..." 
        bind:value={subject} 
        class="subject-input" />
    <button class="create-template-btn" onclick={createTemplate}>Create Template</button>
</section>
{#if data.posts}
    <ul class="newsletter-list">
        {#each data.posts as post}
        <a href="/dashboard/{post.id}">
            <li class="newsletter-item">
                <h2 class="newsletter-title">{post.Subject}</h2>
                <p class="newsletter-date">Created on: {post.Created_at}</p>
                <p class="newsletter-author">By: {post.Created_by}</p>
                <p class="newsletter-author">Updated By: {post.Updated_by}</p>
                <p class="newsletter-author">Updated At: {post.Updated_at}</p>
            </li>
        </a>
        {/each}
    </ul>
{:else}
    <p>No newsletters available.</p>
{/if}

<style>
.create-template-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease;
}

.create-template-btn:hover {
    background-color: #45a049;
}
.welcome-message {
background-color: #f5f5f5;
padding: 20px;
margin-bottom: 20px;
border-radius: 8px;
text-align: center;
}

.welcome-message h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
}

.newsletter-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.newsletter-item {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 20px;
    padding: 20px;
    transition: all 0.3s ease;
}

.newsletter-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
}

.newsletter-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.newsletter-date,
.newsletter-author {
    font-size: 0.9rem;
    color: #555;
    margin: 5px 0;
}

.newsletter-date {
    font-style: italic;
}

.newsletter-author {
    font-weight: normal;
}

.newsletter-item h2 {
    line-height: 1.4;
}

.newsletter-list li {
    transition: background-color 0.3s ease;
}

.newsletter-list li:hover {
    background-color: #f1f1f1;
}

p {
    font-family: 'Arial', sans-serif;
    line-height: 1.5;
}

</style>