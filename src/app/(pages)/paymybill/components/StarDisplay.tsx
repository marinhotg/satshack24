import React from 'react';

interface StarDisplayProps {
  rating: number; 
}

const StarDisplay: React.FC<StarDisplayProps> = ({ rating }) => {
  const starsCount = 5; 

  return (
    <div style={{ display: 'flex' }}>
      {Array.from({ length: starsCount }, (_, index) => {
        const isFullStar = index < Math.floor(rating);
        const isHalfStar = index < rating && index >= Math.floor(rating);

        return (
          <span
            key={index}
            style={{
              position: 'relative',
              fontSize: '30px',
              color: '#ADAAAB',
            }}
          >
            ★
            {isFullStar && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  color: '#a87b05', 
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                ★
              </span>
            )}
            {isHalfStar && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  color: '#a87b05', 
                  overflow: 'hidden',
                  width: `${(rating - Math.floor(rating)) * 100}%`,
                }}
              >
                ★
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarDisplay;
