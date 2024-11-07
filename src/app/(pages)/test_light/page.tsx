"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function TestLight() {
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [invoiceId, setInvoiceId] = useState<string | null>(null); // Para armazenar o ID do invoice
  const [billId, setBillId] = useState<number>(0); // Para armazenar o ID do node

  const handleCreateInvoice = async () => {
    if (!billId) return;

    try {
      setError(null);
      setTransactionStatus(null);

      const response = await fetch("/api/bills/light", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId: billId,
          amount: amount,
          memo: memo,
        }),
      });

      const text = await response.text();
      console.log("Resposta da API:", text);

      if (!response.ok) {
        throw new Error("Erro ao criar o invoice: " + text);
      }

      const data = JSON.parse(text);
      setQrCodeURL(data.qrCode);
      setInvoiceId(data.invoiceCode); // Usa `data.invoiceCode` para armazenar o código do invoice
      startCheckingTransactionStatus(); // Inicia a verificação do status da transação
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro:", err);
    }
  };

  // Função para verificar o status da transação periodicamente
  const startCheckingTransactionStatus = () => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch("/api/transaction/status");
        if (response.ok) {
          const data = await response.json();
          setTransactionStatus(data.status);

          if (data.status === "SUCCESS" || data.status === "CANCELLED") {
            clearInterval(intervalId); // Para de verificar quando confirmado ou cancelado
          }
        }
      } catch (error) {
        console.error("Erro ao verificar o status da transação:", error);
      }
    }, 5000); // Verifica a cada 5 segundos
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
      <div>
        <label>
          ID do Bill:
          <input
            type="number"
            value={billId}
            onChange={(e) => setBillId(Number(e.target.value))}
            placeholder="Ex: 12345"
          />
        </label>
      </div>
      <button onClick={handleCreateInvoice}>
        Criar Invoice e Gerar QR Code
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>{invoiceId}</div>

      {qrCodeURL && (
        <div>
          <h2>QR Code do Invoice</h2>
          <Image
            src={qrCodeURL}
            alt="QR Code para pagamento do invoice"
            width={200}
            height={200}
          />
        </div>
      )}

      {transactionStatus && <p>Status da Transação: {transactionStatus}</p>}
    </div>
  );
}
