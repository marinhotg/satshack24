"use server"

import prisma from "@/lib/db";

export async function createBill(formData: FormData) {
  try {
    const amount = parseFloat(formData.get("amount") as string);
    const dueDate = new Date(formData.get("dueDate") as string);
    const currency = formData.get("currency") as string;
    const bonusRate = parseFloat(formData.get("bonusRate") as string || "0");
    
    if (isNaN(amount) || amount <= 0) {
      return { error: "Invalid amount" };
    }

    if (isNaN(bonusRate) || bonusRate < 0) {
      return { error: "Invalid bonus rate" };
    }

    const user = await prisma.user.upsert({
      where: {
        email: "test@example.com"
      },
      create: {
        email: "test@example.com",
        name: "Test User",
        senha: "test123",
        nodeId: "test-123",
      },
      update: {}
    });

    const bill = await prisma.bill.create({
      data: {
        amount,
        dueDate,
        currency,
        bonusRate,
        status: "PENDING",
        uploadedBy: user.id,  
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