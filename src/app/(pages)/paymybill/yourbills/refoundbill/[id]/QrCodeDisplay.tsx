import React from 'react';
import Image from 'next/image';

interface QRCodeDisplayProps {
  dataUrl: string;
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ dataUrl, size = 200 }) => {
  if (!dataUrl) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">QR Code:</h3>
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={dataUrl}
          alt="Payment QR Code"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default QRCodeDisplay;