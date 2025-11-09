import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  Thermometer,
  Mountain,
  Waves,
  Building,
  Camera,
  Heart,
  Coffee,
  Utensils,
  Plane
} from 'lucide-react';
import { Header } from './Header';

interface PreferencesScreenProps {
  onNavigate: (screen: string) => void;
}

export function PreferencesScreen({ onNavigate }: PreferencesScreenProps) {
  const [priceRange, setPriceRange] = useState([2000, 5000]);
  const [duration, setDuration] = useState([5, 10]);
  const [temperature, setTemperature] = useState([15, 30]);
  
  const [travelPrefs, setTravelPrefs] = useState({
    beach: true,
    mountains: false,
    cities: true,
    culture: true,
    adventure: false,
    relaxation: true,
    nightlife: false,
    photography: true,
    food: true,
    budget: false,
    luxury: false,
    backpacking: false
  });

  const toggleTravelPref = (key: string) => {
    setTravelPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const categories = [
    { key: 'beach', label: 'Praia', icon: Waves },
    { key: 'mountains', label: 'Montanha', icon: Mountain },
    { key: 'cities', label: 'Cidades', icon: Building },
    { key: 'culture', label: 'Cultura', icon: Camera },
    { key: 'adventure', label: 'Aventura', icon: Mountain },
    { key: 'relaxation', label: 'Relaxamento', icon: Heart },
    { key: 'nightlife', label: 'Vida Noturna', icon: Coffee },
    { key: 'photography', label: 'Fotografia', icon: Camera },
    { key: 'food', label: 'Gastronomia', icon: Utensils },
    { key: 'budget', label: 'Econômico', icon: DollarSign },
    { key: 'luxury', label: 'Luxo', icon: Heart },
    { key: 'backpacking', label: 'Mochilão', icon: Plane }
  ];

  const handleSavePreferences = () => {
    // Aqui você salvaria as preferências no backend
    alert('Preferências salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title="Preferências de Viagem"
        onBack={() => onNavigate('dashboard')}
      />

      <div className="p-4 space-y-6">
        {/* Budget Range */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <DollarSign className="h-5 w-5 mr-2" />
              Orçamento por Pessoa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>R$ {priceRange[0].toLocaleString()}</span>
                <span>R$ {priceRange[1].toLocaleString()}</span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={500}
                max={15000}
                step={250}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <Clock className="h-5 w-5 mr-2" />
              Duração da Viagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{duration[0]} dias</span>
                <span>{duration[1]} dias</span>
              </div>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={1}
                max={30}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <Thermometer className="h-5 w-5 mr-2" />
              Temperatura Preferida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{temperature[0]}°C</span>
                <span>{temperature[1]}°C</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={-5}
                max={45}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Travel Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#01001D]">Interesses de Viagem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => toggleTravelPref(key)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    travelPrefs[key]
                      ? 'border-[#0E0652] bg-[#0E0652] text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#6496D8]'
                  }`}
                >
                  <Icon className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pb-6">
          <Button 
            onClick={handleSavePreferences}
            className="bg-[#0E0652] hover:bg-[#130F61] text-white px-8"
          >
            Salvar Preferências
          </Button>
        </div>
      </div>
    </div>
  );
}