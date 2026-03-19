import {StreamChat} from 'stream-chat';
import {ENV} from './env.js';
import {StreamClient} from '@stream-io/node-sdk';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error('Stream API key and secret must be provided');
}

export const streamClient = new StreamClient(apiKey, apiSecret); //this is for video call features
export const chatClient = StreamChat.getInstance(apiKey, apiSecret); //this is for chat features

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log(`Stream user upserted successfully`, userData);
  } catch (error) {
    console.error('Error upserting Stream user:', error);
  } 
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log(`Stream user ${userId} deleted successfully`);
  } catch (error) {
    console.error('Error in deleting Stream user:', error);
  } 
};

//to generate a token for a user