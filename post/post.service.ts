import { InjectRepository } from "@nestjs/typeorm";
import { posts } from "./post.entity";
import { Repository } from "typeorm";

export class PostService{
    constructor(
        @InjectRepository(posts) private postRepository: Repository<posts>,
    ){}

    async save (user: posts): Promise<posts> {
        return this.postRepository.save(user);
    }

    async findByUserId(userId: number, page: number, limit : number): Promise<posts[]>{
        return await this.postRepository.find({
            where: {user_id: userId},
            skip: (page - 1) * limit,
            take: limit,
            order:{
                created_at: 'DESC',
            },
        });

    }

    async findByUserIdAndPostId(userId: number, postId: number):Promise<posts> {
        const post = await this.postRepository.findOne({
            where : {
                user_id : userId,
                id: postId,
            }
        });

        if(!post){
            return new posts();
        }

        return post;
    }

    async deletedById(postId : number){
        await this.postRepository.delete({id : postId})
    }
}