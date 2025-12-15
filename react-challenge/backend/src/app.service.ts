import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

export interface Review {
  reviewer: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  reviews: Review[];
}

export interface ReviewInput {
  reviewer?: unknown;
  rating?: unknown;
  comment?: unknown;
}

@Injectable()
export class AppService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Sample Widget',
      reviews: [
        {
          reviewer: 'Alex',
          rating: 5,
          comment: 'Works perfectly for my setup.',
        },
      ],
    },
    {
      id: 2,
      name: 'Gadget Pro',
      reviews: [],
    },
  ];

  getProducts(): Product[] {
    return this.products;
  }

  addReview(productId: number, input: ReviewInput): Review {
    const product = this.products.find(({ id }) => id === productId);
    if (!product) {
      throw new NotFoundException({ message: 'Product not found.' });
    }

    const errors: string[] = [];

    const reviewer = typeof input.reviewer === 'string' ? input.reviewer.trim() : '';
    if (!reviewer) {
      errors.push('reviewer is required.');
    }

    const comment = typeof input.comment === 'string' ? input.comment.trim() : '';
    if (!comment) {
      errors.push('comment is required.');
    }

    const rating = Number(input.rating);
    if (!Number.isFinite(rating) || !Number.isInteger(rating)) {
      errors.push('rating must be an integer.');
    } else if (rating < 1 || rating > 5) {
      errors.push('rating must be between 1 and 5.');
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Invalid review payload.', errors });
    }

    const review: Review = { reviewer, rating, comment };
    product.reviews.push(review);
    return review;
  }
}
