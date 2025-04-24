'use client';

import { useEffect, useRef } from 'react';

type Props = {
  placeholder: string;
  onPlaceSelect: (value: string) => void;
};

interface PlaceAutocompleteElement extends HTMLElement {
  value?: {
    formatted_address?: string;
  };
}

export default function PlaceAutocompleteInput({ placeholder, onPlaceSelect }: Props) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = document.createElement('gmpx-placeautocomplete') as PlaceAutocompleteElement;
    el.setAttribute('style', 'display: block; width: 100%');
    el.setAttribute('placeholder', placeholder);

    ref.current.replaceWith(el);

    const handlePlaceSelect = (event: Event) => {
      const element = event.target as PlaceAutocompleteElement;
      const place = element.value;
      if (place && place.formatted_address) {
        onPlaceSelect(place.formatted_address);
      }
    };

    el.addEventListener('placechange', handlePlaceSelect);

    return () => {
      el.removeEventListener('placechange', handlePlaceSelect);
    };
  }, [placeholder, onPlaceSelect]);

  return <input ref={ref} />;
}
