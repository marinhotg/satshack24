import { PrismaClient, User as PrismaUser, Bill, Rating } from "@prisma/client";

const prisma = new PrismaClient();

// Types
type CreateUserInput = {
  email: string;
  senha: string;
  name: string;
  nodeId: string;
};

type UpdateUserOptions = {
  email?: string;
  senha?: string;
  name?: string;
  nodeId?: string;
  averageRating?: number;
  totalPaid?: number;
};

export class UserService {
  // Criar novo usuário
  async createUser(userData: CreateUserInput): Promise<PrismaUser> {
    return prisma.user.create({
      data: {
        ...userData,
        totalPaid: 0,
        averageRating: 0,
      },
    });
  }

  // Buscar usuário por ID
  async getUserById(userId: number): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        reservedBills: true,
        uploadedBills: true,
        ratings: true,
      },
    });
  }

  // Buscar usuário por email
  async getUserByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  // Atualizar usuário
  async updateUser(
    userId: number,
    updateData: UpdateUserOptions
  ): Promise<PrismaUser> {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  // Atualizar média de avaliação do usuário
  async updateUserRating(userId: number): Promise<PrismaUser> {
    const ratings = await prisma.rating.findMany({
      where: {
        bill: {
          uploadedBy: userId,
        },
      },
      select: {
        rating: true,
      },
    });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
        : 0;

    return prisma.user.update({
      where: { id: userId },
      data: {
        averageRating,
      },
    });
  }

  // Atualizar total pago pelo usuário
  async updateUserTotalPaid(userId: number): Promise<PrismaUser> {
    const reservedBills = await prisma.bill.findMany({
      where: {
        reservedBy: userId,
        status: "PAID",
      },
      select: {
        amount: true,
      },
    });

    const totalPaid = reservedBills.reduce(
      (acc, curr) => acc + Math.round(curr.amount),
      0
    );

    return prisma.user.update({
      where: { id: userId },
      data: {
        totalPaid,
      },
    });
  }

  // Buscar contas reservadas pelo usuário
  async getBillsReservedByUser(
    userId: number,
    status?: string
  ): Promise<Bill[]> {
    return prisma.bill.findMany({
      where: {
        reservedBy: userId,
        ...(status && { status }),
      },
      include: {
        rating: true,
      },
    });
  }

  // Buscar contas enviadas pelo usuário
  async getBillsUploadedByUser(
    userId: number,
    status?: string
  ): Promise<Bill[]> {
    return prisma.bill.findMany({
      where: {
        uploadedBy: userId,
        ...(status && { status }),
      },
      include: {
        rating: true,
        reserver: true,
      },
    });
  }

  // Buscar avaliações feitas pelo usuário
  async getUserRatings(userId: number): Promise<Rating[]> {
    return prisma.rating.findMany({
      where: {
        raterId: userId,
      },
      include: {
        bill: true,
      },
    });
  }

  // Deletar usuário
  async deleteUser(userId: number): Promise<PrismaUser> {
    return prisma.user.delete({
      where: { id: userId },
    });
  }

  async getNodeIdByUserId(userId: number): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nodeId: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user.nodeId;
  }
}
