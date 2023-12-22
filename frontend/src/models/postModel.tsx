import React from 'react';
type postModel = {
    post_ID: number;
    title: string;
    content: string;
    post_date: string; 
    poster_ID: number;
    poster_name?: string;
    reply_count?: number;
};

export default postModel;