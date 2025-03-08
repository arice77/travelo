import { KeychainSDK } from 'keychain-sdk';

const username = localStorage.getItem('username');

export const upvotePostOnHive = async (permlink, author, weight) => {
  try {
    const keychain = new KeychainSDK(window);
    const formParamsAsObject = {
      data: {
        username: username,
        permlink: permlink,
        author: author,
        weight: weight,
      },
    };
    const vote = await keychain.vote(formParamsAsObject.data);
    console.log({ vote });
    return vote;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
