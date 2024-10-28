import React, { useState } from 'react';

interface StarRatingProps {
  rating: number; 
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const starsCount = 5; 

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
            color: index < rating ? '#ccac00' : 'gray',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

