import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { preferenceLabels } from '@/utils/preferenceLabels';
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
  Waves,
  MapPin,
  Palette
} from 'lucide-react';
import { Header } from './Header';
import apiClient from '@/services/api/client';
import { useModalStore } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';

interface PreferencesScreenProps {
  onNavigate: (screen: string) => void;
}

interface UserPreferences {
  likesShopping?: boolean;
  likesGastronomy?: boolean;
  culture?: string[];
  entertainment?: string[];
  placeTypes?: string[];
}

export function PreferencesScreen({ onNavigate }: PreferencesScreenProps) {
  const [travelPrefs, setTravelPrefs] = useState({
    'culture.architecture': false,
    'culture.center': false,
    'culture.education': false,
    'culture.heritage': false,
    'culture.historical': false,
    'culture.monument': false,
    'culture.museum': false,
    'culture.religious': false,
    
    'entertainment.adventure': false,
    'entertainment.attraction': false,
    'entertainment.park': false,
    'entertainment.sports': false,
    'entertainment.tour': false,
    
    'gastronomy': false,
    
    'placetype.beach': false,
    'placetype.cave': false,
    'placetype.mountain': false,
    'placetype.nature': false,
    'placetype.park': false,
    'placetype.rural': false,
    'placetype.trail': false,
    'placetype.viewpoint': false,
    'placetype.waterfall': false,
    
    'shopping': false
  });
  const [isLoading, setIsLoading] = useState(true);
  const { openModal, closeModal, showError, showSuccess } = useModalStore();
  const updateUser = useAuthStore((state) => state.updateUser);

  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    console.log('[PreferencesScreen] useEffect - isInitialized:', isInitialized);
    if (isInitialized) {
      console.log('[PreferencesScreen] Initialized, calling loadUserPreferences...');
      loadUserPreferences();
    } else {
      console.log('[PreferencesScreen] Not initialized yet, waiting...');
    }
  }, [isInitialized]);

  const loadUserPreferences = async () => {
    console.log('[PreferencesScreen] loadUserPreferences() - Starting');
    setIsLoading(true);
    openModal('loading');
    
    try {
      console.log('[PreferencesScreen] loadUserPreferences() - Calling API /users/me...');
      const response = await apiClient.get<{ 
        name: string; 
        email: string; 
        preferences: UserPreferences | null;
      }>('/users/me');
      console.log('[PreferencesScreen] loadUserPreferences() - API success, has preferences:', !!response.data.preferences);
      
      if (response.data.preferences) {
        const prefs = response.data.preferences;
        const newPrefs: typeof travelPrefs = { ...travelPrefs };
        
        if (prefs.likesGastronomy) {
          newPrefs.gastronomy = true;
        }
        
        if (prefs.culture && Array.isArray(prefs.culture)) {
          prefs.culture.forEach((culture: string) => {
            const key = culture.toLowerCase().startsWith('culture.') ? culture.toLowerCase() : `culture.${culture.toLowerCase()}`;
            if (key in newPrefs) {
              (newPrefs as any)[key] = true;
            }
          });
        }
        
        if (prefs.entertainment && Array.isArray(prefs.entertainment)) {
          prefs.entertainment.forEach((entertainment: string) => {
            const key = entertainment.toLowerCase().startsWith('entertainment.') ? entertainment.toLowerCase() : `entertainment.${entertainment.toLowerCase()}`;
            if (key in newPrefs) {
              (newPrefs as any)[key] = true;
            }
          });
        }
        
        if (prefs.placeTypes && Array.isArray(prefs.placeTypes)) {
          prefs.placeTypes.forEach((placeType: string) => {
            const key = placeType.toLowerCase().startsWith('placetype.') ? placeType.toLowerCase() : `placetype.${placeType.toLowerCase()}`;
            if (key in newPrefs) {
              (newPrefs as any)[key] = true;
            }
          });
        }
        
        if (prefs.likesShopping) {
          newPrefs.shopping = true;
        }
        
        setTravelPrefs(newPrefs);
      }
    } catch (error: any) {
      console.error('[PreferencesScreen] loadUserPreferences() - API error:', error);
      console.error('[PreferencesScreen] loadUserPreferences() - Error response:', error.response);
      showError('Erro ao carregar preferências', error.response?.data?.message || 'Não foi possível carregar suas preferências');
    } finally {
      setIsLoading(false);
      closeModal('loading');
      console.log('[PreferencesScreen] loadUserPreferences() - Finished');
    }
  };

  const toggleTravelPref = (key: string) => {
    setTravelPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const categoryGroups = [
    {
      title: 'Cultura',
      icon: Landmark,
      categories: [
        { key: 'culture.architecture', label: preferenceLabels['culture.architecture'], icon: Building2 },
        { key: 'culture.center', label: preferenceLabels['culture.center'], icon: Building },
        { key: 'culture.education', label: preferenceLabels['culture.education'], icon: GraduationCap },
        { key: 'culture.heritage', label: preferenceLabels['culture.heritage'], icon: Crown },
        { key: 'culture.historical', label: preferenceLabels['culture.historical'], icon: Landmark },
        { key: 'culture.monument', label: preferenceLabels['culture.monument'], icon: Castle },
        { key: 'culture.museum', label: preferenceLabels['culture.museum'], icon: LibraryBig },
        { key: 'culture.religious', label: preferenceLabels['culture.religious'], icon: Church }
      ]
    },
    {
      title: 'Entretenimento',
      icon: Ticket,
      categories: [
        { key: 'entertainment.adventure', label: preferenceLabels['entertainment.adventure'], icon: Compass },
        { key: 'entertainment.attraction', label: preferenceLabels['entertainment.attraction'], icon: Ticket },
        { key: 'entertainment.park', label: preferenceLabels['entertainment.park'], icon: Trees },
        { key: 'entertainment.sports', label: preferenceLabels['entertainment.sports'], icon: Trophy },
        { key: 'entertainment.tour', label: preferenceLabels['entertainment.tour'], icon: Map }
      ]
    },
    {
      title: 'Tipo de local',
      icon: MapPin,
      categories: [
        { key: 'placetype.beach', label: preferenceLabels['placetype.beach'], icon: Waves },
        { key: 'placetype.cave', label: preferenceLabels['placetype.cave'], icon: CircleDot },
        { key: 'placetype.mountain', label: preferenceLabels['placetype.mountain'], icon: Mountain },
        { key: 'placetype.nature', label: preferenceLabels['placetype.nature'], icon: Leaf },
        { key: 'placetype.park', label: preferenceLabels['placetype.park'], icon: TreePine },
        { key: 'placetype.rural', label: preferenceLabels['placetype.rural'], icon: Home },
        { key: 'placetype.trail', label: preferenceLabels['placetype.trail'], icon: Route },
        { key: 'placetype.viewpoint', label: preferenceLabels['placetype.viewpoint'], icon: Eye },
        { key: 'placetype.waterfall', label: preferenceLabels['placetype.waterfall'], icon: Droplets }
      ]
    },
    {
      title: 'Outros',
      icon: Palette,
      categories: [
        { key: 'gastronomy', label: preferenceLabels['gastronomy'], icon: UtensilsCrossed },
        { key: 'shopping', label: preferenceLabels['shopping'], icon: ShoppingBag }
      ]
    }
  ];

  const hasAnyPreferenceSelected = () => {
    return Object.values(travelPrefs).some(value => value === true);
  };

  const areAllRequiredCategoriesSelected = () => {
    const requiredCategories = [
      {
        title: 'Cultura',
        keys: ['culture.architecture', 'culture.center', 'culture.education', 'culture.heritage', 'culture.historical', 'culture.monument', 'culture.museum', 'culture.religious']
      },
      {
        title: 'Entretenimento',
        keys: ['entertainment.adventure', 'entertainment.attraction', 'entertainment.park', 'entertainment.sports', 'entertainment.tour']
      },
      {
        title: 'Tipo de Local',
        keys: ['placetype.beach', 'placetype.cave', 'placetype.mountain', 'placetype.nature', 'placetype.park', 'placetype.rural', 'placetype.trail', 'placetype.viewpoint', 'placetype.waterfall']
      }
    ];

    return requiredCategories.every(category => {
      return category.keys.some(key => travelPrefs[key as keyof typeof travelPrefs] === true);
    });
  };

  const hasLoadedPreferences = () => {
    if (isLoading) return true;
    return areAllRequiredCategoriesSelected();
  };

  const hasCategorySelection = (categoryKeys: string[]) => {
    return categoryKeys.some(key => travelPrefs[key as keyof typeof travelPrefs] === true);
  };

  const handleSavePreferences = async () => {
    if (!areAllRequiredCategoriesSelected()) {
      showError('Preferências incompletas', 'Por favor, selecione pelo menos uma opção em cada categoria (Cultura, Entretenimento e Tipo de Local)');
      return;
    }

    openModal('loading');
    
    try {
      const culture: string[] = [];
      const entertainment: string[] = [];
      const placeTypes: string[] = [];
      let likesShopping = false;
      let likesGastronomy = false;

      Object.entries(travelPrefs).forEach(([key, value]) => {
        if (value) {
          if (key === 'gastronomy') {
            likesGastronomy = true;
          } else if (key.startsWith('culture.')) {
            culture.push(key);
          } else if (key.startsWith('entertainment.')) {
            entertainment.push(key);
          } else if (key.startsWith('placetype.')) {
            placeTypes.push(key);
          } else if (key === 'shopping') {
            likesShopping = true;
          }
        }
      });

      const savedPreferences = {
        likesShopping,
        likesGastronomy,
        culture,
        entertainment,
        placeTypes
      };

      await apiClient.put('/users/me/preferences', savedPreferences);
      updateUser({ preferences: savedPreferences });

      closeModal('loading');
      showSuccess('Preferências salvas', 'Suas preferências foram salvas com sucesso!');
      onNavigate('profile');
    } catch (error: any) {
      closeModal('loading');
      showError('Erro ao salvar preferências', error.response?.data?.message || 'Não foi possível salvar suas preferências');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Configurações"
        onBack={() => onNavigate('profile')}
      />

      <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando preferências...</p>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#01001D]">
                  <MapPin className="h-5 w-5 mr-2" />
                  Preferências de viagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categoryGroups.map(group => {
                  const GroupIcon = group.icon;
                  const categoryKeys = group.categories.map(cat => cat.key);
                  const isRequired = group.categories.length > 1 && 
                    group.title !== 'Outros';
                  const hasSelection = hasCategorySelection(categoryKeys);
                  const showError = isRequired && !hasSelection && !isLoading;
                  
                  return (
                    <Card key={group.title} className={showError ? 'border-2 border-red-500' : ''}>
                      <CardHeader>
                        <CardTitle className="flex items-center text-[#01001D]">
                          <GroupIcon className="h-5 w-5 mr-2" />
                          {group.title}
                        </CardTitle>
                        {showError && (
                          <p className="text-sm text-red-500 mt-1">Selecione pelo menos uma opção:</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className={`grid gap-3 ${group.categories.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {group.categories.map(({ key, label, icon: Icon }) => (
                            <button
                              key={key}
                              onClick={() => toggleTravelPref(key)}
                              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                                travelPrefs[key]
                                  ? 'border-[#0E0652] bg-[#0E0652] text-white'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-[#6496D8]'
                              }`}
                            >
                              <Icon className="h-5 w-5 mb-1" />
                              <span className="text-sm font-medium">{label}</span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Botão Salvar */}
                <div className="pt-4">
                  <Button 
                    onClick={handleSavePreferences}
                    className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                    disabled={!hasLoadedPreferences()}
                  >
                    Salvar preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}