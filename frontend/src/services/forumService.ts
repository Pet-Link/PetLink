import { environment } from '../environment';
import postModel from '../models/postModel';

export class forumService {
    private static baseUrl: string = environment.apiUrl;
    
    static getAllPosts() {
        return fetch(`${this.baseUrl}/post/all/with-name`);
    }

    static createPost(post: postModel) {
    {
        return fetch(`${this.baseUrl}/post/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
    }
}
}