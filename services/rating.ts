import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class RatingService {
  // Função para criar um novo rating para uma bill
  async createRating(
    billId: number,
    raterId: number,
    ratingData: { rating: number; comment?: string }
  ) {
    return prisma.rating.create({
      data: {
        ...ratingData,
        billId,
        raterId,
      },
    });
  }
}
