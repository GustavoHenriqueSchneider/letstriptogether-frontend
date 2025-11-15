export const preferenceLabels: { [key: string]: string } = {
  'culture.architecture': 'Arquitetura',
  'culture.center': 'Centro Cultural',
  'culture.education': 'Educação',
  'culture.heritage': 'Patrimônio',
  'culture.historical': 'Histórico',
  'culture.monument': 'Monumento',
  'culture.museum': 'Museu',
  'culture.religious': 'Religioso',
  
  'entertainment.adventure': 'Aventura',
  'entertainment.attraction': 'Atrações',
  'entertainment.park': 'Parque',
  'entertainment.sports': 'Esportes',
  'entertainment.tour': 'Tour',
  
  'placetype.beach': 'Praia',
  'placetype.cave': 'Caverna',
  'placetype.mountain': 'Montanha',
  'placetype.nature': 'Natureza',
  'placetype.park': 'Parque',
  'placetype.rural': 'Rural',
  'placetype.trail': 'Trilha',
  'placetype.viewpoint': 'Mirante',
  'placetype.waterfall': 'Cachoeira',
  
  'gastronomy': 'Gastronomia',
  'shopping': 'Shopping'
};

export function getPreferenceLabel(pref: string): string {
  return preferenceLabels[pref] || pref;
}

