"use client"
import { useEffect, useState } from 'react';

const CurrencyPage = () => {
    const [btcValues, setBtcValues] = useState({ usd: 0, eur: 0, brl: 0 });

    useEffect(() => {
        // Fetch BTC prices in USD, EUR, and BRL
        const fetchBtcValues = async () => {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,brl`);
                const data = await response.json();
                setBtcValues({
                    usd: data.bitcoin.usd,
                    eur: data.bitcoin.eur,
                    brl: data.bitcoin.brl
                });
            } catch (error) {
                console.error("Error fetching BTC values:", error);
            }
        };

        fetchBtcValues();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>BTC Conversion</h1>
            <div style={{ marginTop: '20px' }}>
                <h2>Equivalent Values for 1 BTC</h2>
                <p><strong>USD:</strong> {btcValues.usd} USD</p>
                <p><strong>EUR:</strong> {btcValues.eur} EUR</p>
                <p><strong>BRL:</strong> {btcValues.brl} BRL</p>
            </div>
        </div>
    );
};

export default CurrencyPage;
