import { PrismaClient } from "@prisma/client";
import { User } from "../types/bill";

const prisma = new PrismaClient();

export class UserService {
  // Função para criar um novo usuário
  async createUser(
    userData: Omit<
      User,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "totalUploaded"
      | "totalPaid"
      | "averageRating"
    >
  ) {
    return prisma.user.create({
      data: {
        ...userData,
        totalUploaded: 0,
        totalPaid: 0,
        averageRating: 0,
      },
    });
  }

  // Função para atualizar os dados de um usuário existente
  async updateUser(
    userId: number,
    updateOptions: {
      rating?: number;
      totalPaid?: number;
      totalUploaded?: number;
    }
  ) {
    const updateData: Partial<User> = {};

    // Condicional para cada campo que pode ser atualizado
    if (updateOptions.rating !== undefined) {
      updateData.averageRating = updateOptions.rating;
    }
    if (updateOptions.totalPaid !== undefined) {
      updateData.totalPaid = updateOptions.totalPaid;
    }
    if (updateOptions.totalUploaded !== undefined) {
      updateData.totalUploaded = updateOptions.totalUploaded;
    }

    // Verifica se há campos para atualizar
    if (Object.keys(updateData).length === 0) {
      throw new Error("Nenhum campo para atualizar foi fornecido.");
    }

    // Realiza a atualização com os dados coletados
    return prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async getBillsReservedByUser(userId: number) {
    return prisma.bill.findMany({
      where: {
        reservedBy: userId,
        status: "PAID",
      },
    });
  }

  async getBillsUploadedByUser(userId: number) {
    return prisma.bill.findMany({
      where: {
        uploadedBy: userId,
      },
    });
  }
}
