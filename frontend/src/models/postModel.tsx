import React from 'react';
type postModel = {
    post_ID: string;
    title: string;
    content: string;
    post_date: string; 
    poster_ID: string;
    poster_name?: string;
};

export default postModel;