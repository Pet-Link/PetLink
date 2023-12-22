import { environment } from '../environment';
import postModel from '../models/postModel';
import replyModel from '../models/replyModel';

export class forumService {
    private static baseUrl: string = environment.apiUrl;
    
    static getAllPosts() {
        return fetch(`${this.baseUrl}/post/all/with-name`);
    }

    static createPost(post: postModel) {
        return fetch(`${this.baseUrl}/post/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
    }

    static createReply(reply: replyModel) {
        return fetch(`${this.baseUrl}/reply/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reply)
        });
    }

    static getAllRepliesForAPost(post_ID: number) {
        return fetch(`${this.baseUrl}/post/${post_ID}/replies`);
    }

    static getAllReplies() {
        return fetch(`${this.baseUrl}/reply/all`);
    }
}