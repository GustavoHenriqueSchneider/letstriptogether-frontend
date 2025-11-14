/**
 * Mapeamento completo de categorias de preferências do banco de dados
 * para labels amigáveis em português
 */
export const preferenceLabels: { [key: string]: string } = {
  // Cultura
  'culture.architecture': 'Arquitetura',
  'culture.center': 'Centro Cultural',
  'culture.education': 'Educação',
  'culture.heritage': 'Patrimônio',
  'culture.historical': 'Histórico',
  'culture.monument': 'Monumento',
  'culture.museum': 'Museu',
  'culture.religious': 'Religioso',
  
  // Entretenimento
  'entertainment.adventure': 'Aventura',
  'entertainment.attraction': 'Atrações',
  'entertainment.park': 'Parque',
  'entertainment.sports': 'Esportes',
  'entertainment.tour': 'Tour',
  
  // Tipo de local
  'placetype.beach': 'Praia',
  'placetype.cave': 'Caverna',
  'placetype.mountain': 'Montanha',
  'placetype.nature': 'Natureza',
  'placetype.park': 'Parque',
  'placetype.rural': 'Rural',
  'placetype.trail': 'Trilha',
  'placetype.viewpoint': 'Mirante',
  'placetype.waterfall': 'Cachoeira',
  
  // Outros
  'gastronomy': 'Gastronomia',
  'shopping': 'Shopping'
};

/**
 * Retorna o label amigável para uma categoria de preferência
 * Se a categoria não for encontrada, retorna a própria categoria
 */
export function getPreferenceLabel(pref: string): string {
  return preferenceLabels[pref] || pref;
}

