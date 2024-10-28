"use client";

import { useState } from "react";

export default function TestLight() {
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateInvoice = async () => {
    try {
      setError(null);
      const response = await fetch("/api/bills/light", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, memo }),
      });

      // Log da resposta em texto para verificar o que o servidor está retornando
      const text = await response.text();
      console.log("Resposta da API:", text);

      if (!response.ok) {
        throw new Error("Erro ao criar o invoice: " + text);
      }

      const data = JSON.parse(text);
      setQrCodeURL(data.qrCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro:", err);
    }
  };

  return (
    <div>
      <h1>Teste de Criação de Invoice</h1>
      <div>
        <label>
          Valor em Milli-satoshis:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Ex: 100000"
          />
        </label>
      </div>
      <div>
        <label>
          Memo:
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Descrição do invoice"
          />
        </label>
      </div>
      <button onClick={handleCreateInvoice}>
        Criar Invoice e Gerar QR Code
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {qrCodeURL && (
        <div>
          <h2>QR Code do Invoice</h2>
          <img src={qrCodeURL} alt="QR Code para pagamento do invoice" />
        </div>
      )}
    </div>
  );
}
