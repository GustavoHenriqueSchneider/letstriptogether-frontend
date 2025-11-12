import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Building2,
  Building,
  GraduationCap,
  Crown,
  Landmark,
  Castle,
  LibraryBig,
  Church,
  Compass,
  Ticket,
  Trees,
  Trophy,
  Map,
  UtensilsCrossed,
  Droplets,
  TreePine,
  Home,
  Route,
  Eye,
  Leaf,
  ShoppingBag,
  CircleDot,
  Mountain,
  Waves
} from 'lucide-react';
import { Header } from './Header';

interface PreferencesScreenProps {
  onNavigate: (screen: string) => void;
}

export function PreferencesScreen({ onNavigate }: PreferencesScreenProps) {
  const [travelPrefs, setTravelPrefs] = useState({
    // Cultura
    'culture.architecture': false,
    'culture.center': false,
    'culture.education': false,
    'culture.heritage': false,
    'culture.historical': false,
    'culture.monument': false,
    'culture.museum': false,
    'culture.religious': false,
    
    // Entretenimento
    'entertainment.adventure': false,
    'entertainment.attraction': false,
    'entertainment.park': false,
    'entertainment.sports': false,
    'entertainment.tour': false,
    
    // Gastronomia
    'food.restaurant': false,
    
    // Tipo de local
    'placetype.beach': false,
    'placetype.cave': false,
    'placetype.mountain': false,
    'placetype.nature': false,
    'placetype.park': false,
    'placetype.rural': false,
    'placetype.trail': false,
    'placetype.viewpoint': false,
    'placetype.waterfall': false,
    
    // Shopping
    'shopping': false
  });

  const toggleTravelPref = (key: string) => {
    setTravelPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const categoryGroups = [
    {
      title: 'Cultura',
      categories: [
        { key: 'culture.architecture', label: 'Arquitetura', icon: Building2 },
        { key: 'culture.center', label: 'Centro Cultural', icon: Building },
        { key: 'culture.education', label: 'Educação', icon: GraduationCap },
        { key: 'culture.heritage', label: 'Patrimônio', icon: Crown },
        { key: 'culture.historical', label: 'Histórico', icon: Landmark },
        { key: 'culture.monument', label: 'Monumento', icon: Castle },
        { key: 'culture.museum', label: 'Museu', icon: LibraryBig },
        { key: 'culture.religious', label: 'Religioso', icon: Church }
      ]
    },
    {
      title: 'Entretenimento',
      categories: [
        { key: 'entertainment.adventure', label: 'Aventura', icon: Compass },
        { key: 'entertainment.attraction', label: 'Atrações', icon: Ticket },
        { key: 'entertainment.park', label: 'Parque', icon: Trees },
        { key: 'entertainment.sports', label: 'Esportes', icon: Trophy },
        { key: 'entertainment.tour', label: 'Tour', icon: Map }
      ]
    },
    {
      title: 'Gastronomia',
      categories: [
        { key: 'food.restaurant', label: 'Restaurante', icon: UtensilsCrossed }
      ]
    },
    {
      title: 'Tipo de Local',
      categories: [
        { key: 'placetype.beach', label: 'Praia', icon: Waves },
        { key: 'placetype.cave', label: 'Caverna', icon: CircleDot },
        { key: 'placetype.mountain', label: 'Montanha', icon: Mountain },
        { key: 'placetype.nature', label: 'Natureza', icon: Leaf },
        { key: 'placetype.park', label: 'Parque', icon: TreePine },
        { key: 'placetype.rural', label: 'Rural', icon: Home },
        { key: 'placetype.trail', label: 'Trilha', icon: Route },
        { key: 'placetype.viewpoint', label: 'Mirante', icon: Eye },
        { key: 'placetype.waterfall', label: 'Cachoeira', icon: Droplets }
      ]
    },
    {
      title: 'Compras',
      categories: [
        { key: 'shopping', label: 'Shopping', icon: ShoppingBag }
      ]
    }
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
        {/* Travel Categories */}
        {categoryGroups.map(group => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="text-[#01001D]">{group.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {group.categories.map(({ key, label, icon: Icon }) => (
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
        ))}

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