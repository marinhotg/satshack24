// components/StarRating.tsx
import React, { useState } from 'react';

interface StarRatingProps {
  rating: number; // Nota atual
  onRatingChange: (rating: number) => void; // Função chamada quando a nota muda
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const starsCount = 5; // Total de estrelas

  const handleClick = (index: number) => {
    onRatingChange(index + 1); 
  };

  return (
    <div style={{ display: 'flex', cursor: 'pointer' }}>
      {Array.from({ length: starsCount }, (_, index) => (
        <span
          key={index}
          onClick={() => handleClick(index)}
          style={{
            fontSize: '50px',
            color: index < rating ? 'gold' : 'gray',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

/* 
'use client';
import React, { useState } from 'react';
import StarRating from './components/StarRating';

const Page: React.FC = () => {
  const [rating, setRating] = useState<number>(0); // Estado para armazenar a nota selecionada

  const handleRatingChange = (newRating: number) => {
    setRating(newRating); // Atualiza a nota
  };

  return (
    <div>
      <h1>Avalie nosso serviço</h1>
      <StarRating rating={rating} onRatingChange={handleRatingChange} />
      <p>Você avaliou com {rating} estrela{rating !== 1 ? 's' : ''}.</p>
    </div>
  );
};

export default Page;
*/
