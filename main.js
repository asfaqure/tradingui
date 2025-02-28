// Example frontend usage
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display posts
  const response = await fetch('/api/posts');
  const posts = await response.json();
  
  const postsContainer = document.createElement('div');
  postsContainer.className = 'posts-container';
  
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>By ${post.username}</small>
    `;
    postsContainer.appendChild(postElement);
  });

  document.body.appendChild(postsContainer);
});
