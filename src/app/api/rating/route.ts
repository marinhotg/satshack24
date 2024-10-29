import { NextRequest, NextResponse } from "next/server";
import { RatingService } from "@/services/rating";

const ratingService = new RatingService();

export async function POST(req: NextRequest) {
  try {
    // Extrai os dados da requisição
    const { billId, raterId, rating, comment } = await req.json();

    // Verifica se os dados obrigatórios estão presentes
    if (!billId || !raterId || rating === undefined) {
      return NextResponse.json(
        { error: "billId, raterId e rating são obrigatórios" },
        { status: 400 }
      );
    }

    // Cria o novo rating usando o serviço
    const newRating = await ratingService.createRating(billId, raterId, {
      rating,
      comment,
    });

    // Retorna o rating criado como resposta
    return NextResponse.json({
      message: "Rating criado com sucesso",
      rating: newRating,
    });
  } catch (error) {
    console.error("Erro ao criar rating:", error);
    return NextResponse.json(
      { error: "Erro ao criar o rating", details: (error as Error).message },
      { status: 500 }
    );
  }
}
