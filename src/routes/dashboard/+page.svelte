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
function logout() {
    pb.authStore.clear();
    window.location.href = '/login';
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
    <button class="logout-btn" onclick={logout}>Logout</button>
</section>
{#if data.posts}
    <ul class="newsletter-list">
        {#each data.posts as post}
        <a href="/dashboard/{post.id}">
            <li class="newsletter-item">
                <img src={`http://127.0.0.1:8090/api/files/newsletters/${post.id}/${post.Preview}`} alt="preview"/>
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

img{
    width: 100%;
}
.welcome-message {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin: 40px auto;
    max-width: 600px;
}
.logout-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 12px 25px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;
    width: 100%;
}

.logout-btn:hover {
    background-color: #e53935;
    transform: translateY(-3px);
}
.welcome-message h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 20px;
}

.subject-input {
    width: 100%;
    padding: 12px 20px;
    margin-top: 15px;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.3s;
}

.subject-input:focus {
    border-color: #4CAF50;
    outline: none;
}

.create-template-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px 25px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;
    width: 100%;
}

.create-template-btn:hover {
    background-color: #45a049;
    transform: translateY(-3px);
}

/* Newsletter List Styling */
.newsletter-list {
    list-style: none;
    padding: 0;
    margin-top: 30px;
    max-width: 1200px; /* Increase max-width to accommodate more items side by side */
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Automatically adjusts based on screen size */
    gap: 20px; /* Space between grid items */
}
.newsletter-item {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding: 20px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.newsletter-item:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
}

.newsletter-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    transition: color 0.3s ease;
}

.newsletter-title:hover {
    color: #4CAF50;
}

.newsletter-date,
.newsletter-author {
    font-size: 0.9rem;
    color: #777;
    margin: 5px 0;
}

.newsletter-date {
    font-style: italic;
}

.newsletter-author {
    font-weight: normal;
}

.newsletter-item p {
    margin: 5px 0;
}



</style>