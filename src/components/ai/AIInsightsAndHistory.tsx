
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { History, Brain, BarChart3, Sparkles } from 'lucide-react';

const extendedRecentSearches = [
  { query: "Procédure de divorce", time: "Il y a 2 heures", results: 15 },
  { query: "Code du commerce article 544", time: "Hier", results: 8 },
  { query: "Loi sur l'investissement 2023", time: "Il y a 2 jours", results: 23 },
  { query: "Droit de la propriété intellectuelle", time: "Il y a 3 jours", results: 12 },
  { query: "Procédure administrative contentieuse", time: "Il y a 4 jours", results: 19 },
  { query: "Code pénal infractions économiques", time: "Il y a 5 jours", results: 31 },
  { query: "Droit du travail licenciement", time: "Il y a 6 jours", results: 27 },
  { query: "Loi sur les marchés publics", time: "Il y a 1 semaine", results: 14 },
  { query: "Droit fiscal entreprises", time: "Il y a 1 semaine", results: 22 },
  { query: "Code civil responsabilité civile", time: "Il y a 1 semaine", results: 18 },
  { query: "Jurisprudence Cour suprême", time: "Il y a 2 semaines", results: 35 },
  { query: "Droit constitutionnel contrôle", time: "Il y a 2 semaines", results: 11 },
  { query: "Procédure pénale instruction", time: "Il y a 2 semaines", results: 16 },
  { query: "Droit commercial sociétés", time: "Il y a 2 semaines", results: 24 },
  { query: "Loi sur la protection des données", time: "Il y a 3 semaines", results: 29 }
];

const insights = [
  {
    icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
    title: "Tendance détectée",
    description: "Augmentation des recherches sur les marchés publics (+45% cette semaine)"
  },
  {
    icon: <Sparkles className="w-5 h-5 text-purple-600" />,
    title: "Nouveau texte pertinent",
    description: "Décret exécutif n° 24-15 pourrait intéresser vos recherches récentes"
  }
];

export function AIInsightsAndHistory() {
  // Pagination pour les recherches récentes
  const {
    currentData: paginatedSearches,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({
    data: extendedRecentSearches,
    itemsPerPage: 6
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recherches Récentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paginatedSearches.map((search, index) => (
            <div key={index} className="space-y-2">
              <div className="font-medium text-sm cursor-pointer hover:text-green-600">
                {search.query}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{search.time}</span>
                <Badge variant="secondary" className="text-xs">
                  {search.results} résultats
                </Badge>
              </div>
            </div>
          ))}
          
          {/* Pagination pour les recherches récentes */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Insights IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {insight.icon}
              </div>
              <div className="space-y-1">
                <div className="font-medium text-sm">{insight.title}</div>
                <div className="text-xs text-gray-600">{insight.description}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
