// src/pages/QRCodePage.tsx
import React from 'react';

interface QRCodePageProps {
  orderId: string;
  qrCode: string;
}

export const QRCodePage: React.FC<QRCodePageProps> = ({ orderId, qrCode }) => {
  return (
    <div className="qr-code-page">
      <h1>Pick-up Code</h1>
      <p>Order: {orderId}</p>
      {/* In a real app, you would use a library to generate a QR code from the qrCode string */}
      <div className="qr-code-placeholder">
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}`} alt="QR Code" />
      </div>
      <p>Please show this code to the staff.</p>
    </div>
  );
};
