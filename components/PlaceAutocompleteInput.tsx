'use client';

import { useEffect, useRef } from 'react';

type Props = {
  placeholder: string;
  onPlaceSelect: (value: string) => void;
};

export default function PlaceAutocompleteInput({ placeholder, onPlaceSelect }: Props) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = document.createElement('gmpx-placeautocomplete');
    el.setAttribute('style', 'display: block; width: 100%');
    el.setAttribute('placeholder', placeholder);

    ref.current.replaceWith(el);

    el.addEventListener('gmpx-placeautocomplete-placechange', (e: any) => {
      const place = e.detail;
      if (place?.formattedAddress) {
        onPlaceSelect(place.formattedAddress);
      }
    });
  }, []);

  return <input ref={ref} />;
}
