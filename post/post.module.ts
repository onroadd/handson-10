import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { posts } from "./post.entity";

@Module({
    imports: [TypeOrmModule.forFeature([posts])],
    controllers: [PostController],
    providers: [PostService]
})
export class postmodule{}