"use server"

import prisma from "@/lib/db";

export async function createBill(formData: FormData) {
  try {
    const amount = parseFloat(formData.get("amount") as string);
    const dueDate = new Date(formData.get("dueDate") as string);
    const currency = formData.get("currency") as string;
    const bonusRate = parseFloat(formData.get("bonusRate") as string || "0");
    const fileUrl = formData.get("fileUrl") as string;
    const uploadedById = formData.get("userId");

    if (isNaN(amount) || amount <= 0) {
      return { error: "Invalid amount" };
    }

    if (isNaN(bonusRate) || bonusRate < 0) {
      return { error: "Invalid bonus rate" };
    }

    if (!uploadedById) {
      return { error: "User ID is required" };
    }

    if (!fileUrl) {
      return { error: "Bill file URL is required" };
    }

    const bill = await prisma.bill.create({
      data: {
        amount,
        dueDate,
        currency,
        bonusRate,
        status: "PENDING",
        uploadedBy: Number(uploadedById),
        fileUrl, 
        filePathname: fileUrl.split('/').pop() || 'bill', 
        fileUploadedAt: new Date(), 
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