import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService, ReviewInput } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns the list of products with reviews', () => {
    const products = appController.getProducts();

    expect(Array.isArray(products)).toBe(true);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('reviews');
  });

  it('adds a review to an existing product', () => {
    const payload: ReviewInput = {
      reviewer: 'Tester',
      rating: 4,
      comment: 'Solid product.',
    };

    const review = appController.postReview(1, payload);

    expect(review).toMatchObject({ reviewer: 'Tester', rating: 4, comment: 'Solid product.' });

    const product = appController.getProducts().find(({ id }) => id === 1);
    expect(product?.reviews).toContainEqual(
      expect.objectContaining({ reviewer: 'Tester', rating: 4, comment: 'Solid product.' }),
    );
  });

  it('rejects invalid review input', () => {
    const invalidPayload: ReviewInput = {
      reviewer: '',
      rating: 8,
      comment: '',
    };

    expect(() => appController.postReview(1, invalidPayload)).toThrow(BadRequestException);
  });
});
