import { KeychainSDK } from 'keychain-sdk';

export const publishBlogPostOnHive = async (blogDetails) => {
  try {
    const { title, content, tags } = blogDetails;
    const username = localStorage.getItem('username');

    const body = `${content}\n\nPublished by @${username} on Hive.`;

    const permlink = `hive-blog-${Date.now()}`;

    const keychain = new KeychainSDK(window);

    const formParamsAsObject = {
      data: {
        username,
        title,
        body,
        parent_perm: 'blog',
        json_metadata: JSON.stringify({
          format: 'markdown',
          description: 'Hive Blog Post',
          tags,
        }),
        permlink,
        comment_options: JSON.stringify({
          author: username,
          permlink,
          max_accepted_payout: '10000.000 HBD',
          allow_votes: true,
          allow_curation_rewards: true,
          extensions: [],
          percent_hbd: 63,
        }),
      },
    };

    const post = await keychain.post(formParamsAsObject.data);
    return post;
  } catch (error) {
    console.error('Error publishing blog post:', error);
    throw error;
  }
};
