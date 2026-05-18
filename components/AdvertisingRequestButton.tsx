'use client';

export default function AdvertisingRequestButton() {
  const onClick = () => {
    window.dispatchEvent(
      new CustomEvent('openCommercialContact', {
        detail: { selectedType: 'Espacio publicitario' },
      }),
    );
  };

  return (
    <button type="button" onClick={onClick} className="btn-gold mt-4 inline-flex">
      Solicitar publicidad
    </button>
  );
}
