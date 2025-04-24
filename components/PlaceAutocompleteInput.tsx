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

    const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
      if (!place || !place.formatted_address) return;
      onPlaceSelect(place.formatted_address);
    };

    // Hier könntest du z. B. einen Listener an `el` anhängen, falls API vorgesehen
    // el.addEventListener('placechange', (e) => handlePlaceSelect((e as CustomEvent).detail));

  }, [placeholder, onPlaceSelect]); // 🔄 Abhängigkeiten ergänzt

  return <input ref={ref} />;
}
