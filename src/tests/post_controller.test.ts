import postController from '../controllers/post_controller';
import { Request, Response } from "express";
import Post, { IPost } from '../models/post_model';
import User from '../models/user_model';

jest.mock('../models/post_model');
jest.mock('../models/user_model');

describe('Post controller tests', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Create post - successful', async () => {
        let req: Partial<Request> = {
            body: { imgUrl: 'test.jpg', content: 'Test content' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let newPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content'
        }
        jest.spyOn(Post, 'create').mockResolvedValueOnce(newPost as any);
        
        await postController.createPost(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(newPost);
    });
    
    test('Create post - raise error', async () => {
        let req: Partial<Request> = {
            body: { imgUrl: 'test.jpg', content: 'Test content' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        jest.spyOn(Post, 'create').mockResolvedValueOnce(Promise.reject('fail to create'));
        
        await postController.createPost(req as Request, res as Response);
        
        expect(res.status).toHaveBeenCalledWith(500);
    });

    test('Create post - raise error because of missing fields', async () => {
        let req: Partial<Request> = {
            body: {},
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        
        await postController.createPost(req as Request, res as Response);
        
        expect(res.status).toHaveBeenCalledWith(400);
    });
    
    test('Update post - raise error when post not found', async () => {
        let req: Partial<Request> = {
            body: { imgUrl: 'test.jpg', content: 'Test content' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        jest.spyOn(Post, 'findById').mockResolvedValueOnce({} as any);
        
        await postController.updatePost(req as Request, res as Response);
        
        expect(res.status).toHaveBeenCalledWith(500);
    });
    
    test('Update post - update post imgUrl', async () => {
        let req: Partial<Request> = {
            body: { imgUrl: 'test.jpg' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content',
            user: "someUserId"
        }
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(ExistingPost as any);
        jest.spyOn(User, 'findById').mockResolvedValueOnce({_id: "someUserId"} as any);
        jest.spyOn(Post, 'findByIdAndUpdate').mockResolvedValueOnce(ExistingPost as any);
        
        await postController.updatePost(req as Request, res as Response);
        
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Update post - update post content', async () => {
        let req: Partial<Request> = {
            body: { content: 'Test content' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content',
            user: "someUserId"
        }
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(ExistingPost as any);
        jest.spyOn(User, 'findById').mockResolvedValueOnce({_id: "someUserId"} as any);
        jest.spyOn(Post, 'findByIdAndUpdate').mockResolvedValueOnce(ExistingPost as any);
        
        await postController.updatePost(req as Request, res as Response);
        
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Update post - fail to update post because of lack permissions', async () => {
        let req: Partial<Request> = {
            body: { imgUrl: 'test.jpg', content: 'Test content' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content',
            user: "differentUserId"
        }
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(ExistingPost as any);
        jest.spyOn(User, 'findById').mockResolvedValueOnce({_id: "someUserId"} as any);
        jest.spyOn(Post, 'findByIdAndUpdate').mockResolvedValueOnce(ExistingPost as any);
        
        await postController.updatePost(req as Request, res as Response);
        
        expect(res.status).toHaveBeenCalledWith(403);
    });

    test('Update post - fail to update post because it does not exist', async () => {
        let req: Partial<Request> = {
            body: { imgUrl: 'test.jpg', content: 'Test content' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(null);
        
        await postController.updatePost(req as Request, res as Response);
        
        expect(res.status).toHaveBeenCalledWith(500);
    });

    test('Get my posts - success', async () => {
        let req: Partial<Request> = {};
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content'
        }
        jest.spyOn(Post, 'find').mockResolvedValueOnce([ExistingPost] as any);
        
        await postController.getMyPosts(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([ExistingPost]);

    });

    test('Get my posts - success get no posts', async () => {
        let req: Partial<Request> = {};
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        jest.spyOn(Post, 'find').mockResolvedValueOnce(null);
        
        await postController.getMyPosts(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith("You don't have any posts");

    });
    
    test('Comment on post - success', async () => {
        let req: Partial<Request> = {
            body: { postId: 'somePostId', comment: 'Test comment', user: "username" },
        };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content',
            comments: [{user: 'test', comment: 'comment'}],
            save: jest.fn()
        }
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(ExistingPost as any);
        jest.spyOn(Post.prototype, 'save').mockResolvedValueOnce({} as any)
        
        await postController.commentOnPost(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);

    });

    test('Comment on post - fail', async () => {
        let req: Partial<Request> = {
            body: { postId: 'somePostId', comment: 'Test comment', user: "username" },
        };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(Promise.reject('fail to find'));
        jest.spyOn(Post.prototype, 'save').mockResolvedValueOnce({} as any)
        
        await postController.commentOnPost(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);

    });

    test('Delete post - success', async () => {
        let req: Partial<Request> = {
            body: { postId: 'somePostId' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let existingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content',
            user: "someUserId"
        }
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(existingPost as any);
        jest.spyOn(User, 'findById').mockResolvedValueOnce({_id: "someUserId"} as any);
        jest.spyOn(Post, 'findByIdAndDelete').mockResolvedValueOnce({} as any);
        
        await postController.deletePost(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Delete post - fail to update post because of lack permissions', async () => {
        let req: Partial<Request> = {
            body: { imgUrl: 'test.jpg', content: 'Test content' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content',
            user: "differentUserId"
        }
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(ExistingPost as any);
        jest.spyOn(User, 'findById').mockResolvedValueOnce({_id: "someUserId"} as any);
        jest.spyOn(Post, 'findByIdAndUpdate').mockResolvedValueOnce(ExistingPost as any);
        
        await postController.deletePost(req as Request, res as Response);
        
        expect(res.status).toHaveBeenCalledWith(403);
    });

    test('Delete post - fail', async () => {
        let req: Partial<Request> = {
            body: { postId: 'somePostId' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        jest.spyOn(Post, 'findById').mockResolvedValueOnce(Promise.reject('fail to find post'));
        
        await postController.deletePost(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    test('Get all posts - success', async () => {
        let req: Partial<Request> = {};
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content'
        }
        jest.spyOn(Post, 'find').mockResolvedValueOnce([ExistingPost] as any);
        
        await postController.getAllPosts(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Like a post - success', async () => {
        let req: Partial<Request> = {
            body: { postId: 'somePostId' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content',
            like: [],
            updateOne: jest.fn()
        }
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(ExistingPost as any);
        
        await postController.likePost(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('UnLike a post - success', async () => {
        let req: Partial<Request> = {
            body: { postId: 'somePostId' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        
        let ExistingPost = {
            _id: "somePostId",
            imgUrl: 'test.jpg',
            content: 'Test content',
            like: ["someUserId"],
            updateOne: jest.fn()
        }
        jest.spyOn(Post, 'findById').mockResolvedValueOnce(ExistingPost as any);
        
        await postController.likePost(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
    });

});

