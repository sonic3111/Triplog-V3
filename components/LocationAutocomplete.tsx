'use client';

import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
};

export function LocationAutocomplete({ value, onSelect, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address'],
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onSelect(place.formatted_address);
      }
    });
  }, []);

  return (
    <input
      ref={inputRef}
      defaultValue={value}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
