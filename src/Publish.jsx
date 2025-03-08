import { KeychainSDK } from 'keychain-sdk';

export const publishBlogPostOnHive = async (blogDetails) => {
  try {
    const { title, content, tags } = blogDetails;
    const username = localStorage.getItem('username');

    // Validate required inputs
    if (!username || username.trim() === '') {
      throw new Error('Please log in first to publish a blog post');
    }

    if (!window.hive_keychain) {
      throw new Error('Hive Keychain extension not found. Please install it to proceed.');
    }

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    // Clean up the username and create permlink
    const cleanUsername = username.trim();
    const permlink = `hive-blog-${Date.now()}`;

    // Format the body with proper attribution
    const body = `${content}\n\nPublished by @${cleanUsername} on Hive.`;

    // Initialize Keychain SDK
    const keychain = new KeychainSDK(window);

    // Prepare post data with correct structure for Hive Keychain
    const postData = {
      username: cleanUsername,
      title,
      body,
      parent_author: '',
      parent_perm: 'hive-travel',
      json_metadata: JSON.stringify({
        tags: tags || ['hive-travel'],
        app: 'hive-travel',
        format: 'markdown',
        description: title.slice(0, 160)
      }),
      permlink,
      comment_options: JSON.stringify({
        author: cleanUsername,
        permlink,
        max_accepted_payout: '1000000.000 HBD',
        percent_hbd: 10000,
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: []
      })
    };

    // First verify the account exists
    try {
      const response = await fetch('https://api.hive.blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_accounts',
          params: [[cleanUsername]],
          id: 1
        }),
      });

      const accountData = await response.json();
      if (!accountData.result || accountData.result.length === 0) {
        throw new Error('Account not found or network error');
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      throw new Error('Unable to verify account. Please check your connection and try again.');
    }

    // Attempt to publish the post
    const post = await keychain.post(postData);
    
    if (!post.success) {
      throw new Error(post.error?.message || post.message || 'Failed to publish post');
    }

    return post;
  } catch (error) {
    console.error('Error publishing blog post:', error);
    
    // Handle specific error cases
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};
