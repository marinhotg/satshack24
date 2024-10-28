// src/pages/api/updateQrCode.ts
import { NextApiRequest, NextApiResponse } from "next";
import { billService } from "@/services/bill"; // Supondo que tenha o QR code em `lightningService`

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { id, qrCode } = req.body;

      // Verifica se o id e o qrCode foram fornecidos
      if (!id || !qrCode) {
        return res.status(400).json({ error: "ID e QR Code são obrigatórios" });
      }

      // Atualiza o QR code na tabela `bill`
      const updatedBill = await billService.updateQrCode(id, qrCode);

      res.status(200).json({
        message: "QR Code atualizado com sucesso",
        bill: updatedBill,
      });
    } catch (error) {
      console.error("Erro ao atualizar o QR code:", error);
      res.status(500).json({ error: "Erro ao atualizar o QR code" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
