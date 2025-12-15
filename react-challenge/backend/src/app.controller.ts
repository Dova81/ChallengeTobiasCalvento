import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { Product, Review, ReviewInput } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/products")
  getProducts(): Product[] {
    return this.appService.getProducts();
  }

  @Post("/products/:id/reviews")
  postReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: ReviewInput,
  ): Review {
    return this.appService.addReview(id, payload);
  }
}
