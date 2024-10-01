import React, { useState, useEffect } from 'react';

const Crypto = () => {
  const [cryptoPrices, setCryptoPrices] = useState({});
  const URL = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,SOL,BNB,XRP&tsyms=USD';

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const response = await fetch(`${URL}&api_key=${import.meta.env.VITE_CRYPTOTECH}`);
        const data = await response.json();
        setCryptoPrices(data);
      } catch (error) {
        console.error('Error fetching crypto:', error);
      }
    };

    fetchCrypto();
  }, []);

  return (
    <section className="crypto">
      <h2>Crypto Market</h2>
      {Object.entries(cryptoPrices).map(([crypto, price]) => (
        <article key={crypto}>
          <p>1 {crypto} ≈ ${price.USD.toFixed(2)} USD</p>
          {crypto !== 'XRP' && <hr />} {/* Add a line under each entry except the last one */}
        </article>
      ))}
    </section>
  );
};

export default Crypto;