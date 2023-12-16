type replyModel = {
    post_ID: number;
    discriminator_ID: number;
    date: Date; 
    expert_verify_status: boolean;
    content: string;
    replier_ID: number;
};

export default replyModel;