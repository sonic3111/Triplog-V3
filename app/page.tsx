'use client';

/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: typeof google;
  }
}


import { useState, useEffect, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Plus, Download } from "lucide-react";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";

function getDistanceInKm(start: string, end: string): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject('Google Maps JS not loaded');
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [start],
        destinations: [end],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (
        response: google.maps.DistanceMatrixResponse | null,
        status: google.maps.DistanceMatrixStatus
      ) => {
        if (
          status === 'OK' &&
          response &&
          response.rows[0].elements[0].status === 'OK'
        ) {
          const distanceInMeters = response.rows[0].elements[0].distance.value;
          resolve(distanceInMeters / 1000);
        } else {
          console.log('Distance Matrix response:', response, status);
          reject('Distance calculation failed');
        }
      }
    );
  });
}



type Trip = {
  id: string;
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  comment: string;
};

const mockLocations = [
  "Berlin, Germany",
  "Munich, Germany",
  "Hamburg, Germany",
  "Cologne, Germany",
  "Frankfurt, Germany"
];

export default function TripLog() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const savedTrips = localStorage.getItem('trips');
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);

  const totalKilometers = trips.reduce((sum, trip) => sum + trip.distance, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!startLocation || !endLocation) return;
  
    const distance = await getDistanceInKm(startLocation, endLocation); // <-- Google API
  
    const newTrip: Trip = {
      id: Date.now().toString(),
      date,
      startLocation,
      endLocation,
      distance,
      comment
    };
  
    setTrips([newTrip, ...trips]);
    resetForm();
  };

  const resetForm = () => {
    setStartLocation('');
    setEndLocation('');
    setComment('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleDelete = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  const exportToCSV = () => {
    const csvContent = [
      'Date,Start Location,End Location,Distance (km),Comment',
      ...trips.map(trip =>
        `"${trip.date}","${trip.startLocation}","${trip.endLocation}",${trip.distance},"${trip.comment}"`
      ),
      `,,Total,${totalKilometers},`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trips_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Trip Log</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Start Location</label>
                <LocationAutocomplete
  value={startLocation}
  onSelect={(val) => setStartLocation(val)}
  placeholder="Enter start location"
/>
                {startSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {startSuggestions.map((location, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setStartLocation(location);
                          setStartSuggestions([]);
                        }}
                      >
                        {location}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-1">End Location</label>
                <LocationAutocomplete
  value={endLocation}
  onSelect={(val) => setEndLocation(val)}
  placeholder="Enter end location"
/>
                {endSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {endSuggestions.map((location, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setEndLocation(location);
                          setEndSuggestions([]);
                        }}
                      >
                        {location}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <Input
                  value={comment}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setComment(e.target.value)}
                  placeholder="Optional comment"
                />
              </div>
            </div>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" /> Add Trip
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Trip History</CardTitle>
          {trips.length > 0 && (
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" /> Export to CSV
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Start Location</TableHead>
                <TableHead>End Location</TableHead>
                <TableHead className="text-right">Distance (km)</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>{trip.date}</TableCell>
                    <TableCell>{trip.startLocation}</TableCell>
                    <TableCell>{trip.endLocation}</TableCell>
                    <TableCell className="text-right">{trip.distance}</TableCell>
                    <TableCell>{trip.comment || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(trip.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No trips logged yet. Add your first trip above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {trips.length > 0 && (
            <div className="mt-4 text-right font-medium">
              Total Kilometers: {totalKilometers} km
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
