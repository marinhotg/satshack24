"use server"

import prisma from "@/lib/db";

export async function createBill(formData: FormData) {
  try {
    const amount = parseFloat(formData.get("amount") as string);
    const dueDate = new Date(formData.get("dueDate") as string);
    const paymentType = formData.get("paymentType") as string;
    const currency = formData.get("currency") as string;
    const bonusRate = parseFloat(formData.get("bonusRate") as string || "0");
    
    if (isNaN(amount) || amount <= 0) {
      return { error: "Invalid amount" };
    }

    if (isNaN(bonusRate) || bonusRate < 0) {
      return { error: "Invalid bonus rate" };
    }

    const bill = await prisma.bill.create({
      data: {
        amount,
        dueDate,
        paymentType,
        currency,
        bonusRate,
        status: "PENDING",
        // fixed user for MVP
        uploader: {
          connectOrCreate: {
            where: {
              email: "test@example.com"
            },
            create: {
              email: "test@example.com",
              name: "Test User"
            }
          }
        }
      },
      include: {
        uploader: true
      }
    });

    return { success: true, data: bill };
  } catch (error) {
    console.error("Failed to create bill:", error);
    return { error: "Failed to create bill" };
  }
}