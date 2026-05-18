'use client';

import type { ReactNode } from 'react';

type OpenCommercialContactButtonProps = {
  children: ReactNode;
  className?: string;
  selectedType?: 'Espacio publicitario' | 'Enviar música' | 'Entrevista / cobertura' | 'Alianza / sponsor' | 'Otro';
};

export default function OpenCommercialContactButton({ children, className, selectedType }: OpenCommercialContactButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent('openCommercialContact', {
            detail: selectedType ? { selectedType } : undefined,
          }),
        );
      }}
    >
      {children}
    </button>
  );
}
