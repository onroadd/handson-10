import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
  } from '@nestjs/common';
  import { CreatePostDTO } from './create-post.dto';
  
 
  import { PostService } from './post.service';
  import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtPayloadDTO } from 'src/auth/dto/jwt-payload.dto';
import { posts} from './post.entity';
  
  @Controller('post')
  export class PostController {
    constructor(private readonly postService: PostService) {}
  
    @Post()
    async create(@Req() request: Request, @Body() createPostDTO: CreatePostDTO) {
      const userJwtPayLoad: JwtPayloadDTO = request['user'];
  
      const post: posts = new posts();
      post.content = createPostDTO.content;
      post.image_url = createPostDTO.image_url;
      post.title = createPostDTO.title;
      post.user_id = userJwtPayLoad.sub;
      await this.postService.save(post);
    }
  
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findAll(
      @Req() request: Request,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ): Promise<posts[]> {
      const userJwtPayLoad: JwtPayloadDTO = request['user'];
      return await this.postService.findByUserId(userJwtPayLoad.sub, page, limit);
    }
  
    @Get(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the post' })
    async findOne(@Req() request: Request, @Param('id') id: number) {
      const userJwtPayLoad: JwtPayloadDTO = request['user'];
      return await this.postService.findByUserIdAndPostId(userJwtPayLoad.sub, id);
    }
  
    @Put(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the post' })
    async updateOne(
      @Req() request: Request,
      @Param('id') id: number,
      @Body() createPostDTO: CreatePostDTO
    ) {
      const userJwtPayLoad: JwtPayloadDTO = request['user'];
      const post: posts = await this.postService.findByUserIdAndPostId(userJwtPayLoad.sub, id);
      if(post.id == null) {
        throw new NotFoundException();
      }
      post.content = createPostDTO.content;
      post.image_url = createPostDTO.image_url;
      post.title = createPostDTO.title;
      await this.postService.save(post);
    }
  
    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the post' })
    async deleteOne(@Req() request: Request, @Param('id') id : number) {
      const userJwtPayLoad: JwtPayloadDTO = request['user'];
      const post: posts = await this.postService.findByUserIdAndPostId(userJwtPayLoad.sub, id);
      if(post.id == null){
        throw new NotFoundException();
      }

      await this.postService.deletedById(id);
    }
  }
  