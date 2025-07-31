
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Pagination } from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useState } from 'react';
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  TrendingUp,
  Users,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ProcedureMetrics {
  id: string;
  name: string;
  averageTime: number;
  steps: number;
  documents: number;
  administrations: number;
  cost: number;
  complexityScore: number;
  successRate: number;
  userSatisfaction: number;
  feedbackCount: number;
  trends: {
    timeChange: number;
    satisfactionChange: number;
  };
}

interface UserFeedbackAnalysisProps {
  procedures: ProcedureMetrics[];
}

// Données simulées de feedback détaillé
const mockFeedbackData = {
  '1': { // Création SARL
    ratings: { 5: 45, 4: 32, 3: 28, 2: 15, 1: 36 },
    comments: [
      { id: 1, rating: 2, comment: "Trop de documents demandés, processus très long", category: "documents", date: "2024-01-15" },
      { id: 2, rating: 4, comment: "Personnel accueillant mais délais trop longs", category: "délais", date: "2024-01-12" },
      { id: 3, rating: 5, comment: "Excellente digitalisation du processus", category: "digitalisation", date: "2024-01-10" },
      { id: 4, rating: 3, comment: "Processus amélioré mais encore des lenteurs", category: "performance", date: "2024-01-08" },
      { id: 5, rating: 4, comment: "Interface utilisateur intuitive et claire", category: "interface", date: "2024-01-06" },
      { id: 6, rating: 2, comment: "Manque d'informations sur les délais", category: "information", date: "2024-01-04" },
      { id: 7, rating: 5, comment: "Service client très réactif et professionnel", category: "service", date: "2024-01-02" },
      { id: 8, rating: 3, comment: "Procédure acceptable mais pourrait être simplifiée", category: "simplification", date: "2023-12-30" }
    ],
    commonIssues: [
      { issue: "Délais trop longs", count: 67, percentage: 43 },
      { issue: "Documents redondants", count: 45, percentage: 29 },
      { issue: "Manque d'information", count: 28, percentage: 18 },
      { issue: "Personnel non formé", count: 16, percentage: 10 }
    ]
  },
  '2': { // Demande Passeport
    ratings: { 5: 178, 4: 125, 3: 89, 2: 25, 1: 15 },
    comments: [
      { id: 1, rating: 5, comment: "Processus rapide et efficace", category: "efficacité", date: "2024-01-16" },
      { id: 2, rating: 4, comment: "Bon service mais attente longue", category: "attente", date: "2024-01-14" },
      { id: 3, rating: 3, comment: "Procédure claire mais coûteuse", category: "coût", date: "2024-01-11" },
      { id: 4, rating: 5, comment: "Excellent accueil et accompagnement", category: "accueil", date: "2024-01-09" },
      { id: 5, rating: 4, comment: "Documentation claire et complète", category: "documentation", date: "2024-01-07" },
      { id: 6, rating: 2, comment: "Délais de traitement trop longs", category: "délais", date: "2024-01-05" },
      { id: 7, rating: 5, comment: "Personnel compétent et disponible", category: "personnel", date: "2024-01-03" },
      { id: 8, rating: 3, comment: "Procédure standard mais efficace", category: "procédure", date: "2023-12-31" }
    ],
    commonIssues: [
      { issue: "Files d'attente", count: 89, percentage: 21 },
      { issue: "Horaires limitées", count: 67, percentage: 15 },
      { issue: "Coût élevé", count: 45, percentage: 10 },
      { issue: "Délai de livraison", count: 34, percentage: 8 }
    ]
  },
  '3': { // Permis de Construire
    ratings: { 5: 12, 4: 18, 3: 25, 2: 28, 1: 6 },
    comments: [
      { id: 1, rating: 1, comment: "Processus extrêmement complexe et long", category: "complexité", date: "2024-01-13" },
      { id: 2, rating: 2, comment: "Manque de coordination entre services", category: "coordination", date: "2024-01-09" },
      { id: 3, rating: 3, comment: "Amélioration nécessaire de la communication", category: "communication", date: "2024-01-08" },
      { id: 4, rating: 2, comment: "Délais d'attente excessifs", category: "délais", date: "2024-01-06" },
      { id: 5, rating: 1, comment: "Procédure trop bureaucratique", category: "bureaucratie", date: "2024-01-04" },
      { id: 6, rating: 3, comment: "Manque de transparence dans les décisions", category: "transparence", date: "2024-01-02" },
      { id: 7, rating: 2, comment: "Coordination défaillante entre administrations", category: "coordination", date: "2023-12-30" },
      { id: 8, rating: 1, comment: "Processus inadapté aux besoins réels", category: "adaptation", date: "2023-12-28" }
    ],
    commonIssues: [
      { issue: "Processus trop complexe", count: 45, percentage: 51 },
      { issue: "Manque de coordination", count: 32, percentage: 36 },
      { issue: "Communication insuffisante", count: 28, percentage: 31 },
      { issue: "Délais non respectés", count: 23, percentage: 26 }
    ]
  }
};

export function UserFeedbackAnalysis({ procedures }: UserFeedbackAnalysisProps) {
  const [selectedProcedure, setSelectedProcedure] = useState<string>('1');

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
  };

  // Pagination pour les commentaires
  const feedbackData = mockFeedbackData[selectedProcedure as keyof typeof mockFeedbackData];
  const comments = feedbackData?.comments || [];
  
  // Pagination pour les commentaires généraux
  const {
    currentData: paginatedComments,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({
    data: comments,
    itemsPerPage: 1
  });

  return (
    <div className="space-y-6">
      {/* Aperçu général du feedback */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Satisfaction Moyenne</p>
              <p className="text-2xl font-bold mt-2 text-green-600">
                {procedures.reduce((acc, p) => acc + p.userSatisfaction, 0) / procedures.length.toFixed(1)}/5
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold mt-2 text-blue-600">
                {procedures.reduce((acc, p) => acc + p.feedbackCount, 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold mt-2 text-purple-600">
                {Math.round(procedures.reduce((acc, p) => acc + p.feedbackCount, 0) * 0.8)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
              <p className="text-2xl font-bold mt-2 text-orange-600">
                {Math.round(procedures.reduce((acc, p) => acc + p.averageTime, 0) / procedures.length)}j
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyse détaillée par procédure */}
      <div className="space-y-6">
        {procedures.map((procedure) => {
          const currentFeedbackData = mockFeedbackData[procedure.id as keyof typeof mockFeedbackData];
          const currentComments = currentFeedbackData?.comments || [];
          
          // Pagination pour les commentaires de cette procédure
          const {
            currentData: paginatedProcedureComments,
            currentPage: procedureCurrentPage,
            totalPages: procedureTotalPages,
            itemsPerPage: procedureItemsPerPage,
            totalItems: procedureTotalItems,
            setCurrentPage: setProcedureCurrentPage,
            setItemsPerPage: setProcedureItemsPerPage
                      } = usePagination({
              data: currentComments,
              itemsPerPage: 1
            });

          const totalRatings = currentFeedbackData ? Object.values(currentFeedbackData.ratings).reduce((acc, count) => acc + count, 0) : 0;

          return (
            <Card key={procedure.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      {procedure.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {procedure.feedbackCount} commentaires • Satisfaction: {procedure.userSatisfaction}/5
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Tendance</div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(procedure.trends.satisfactionChange)}
                        <span className={`text-sm font-medium ${procedure.trends.satisfactionChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(procedure.trends.satisfactionChange)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Distribution des notes */}
                  <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Distribution des Notes
                    </h4>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = currentFeedbackData?.ratings?.[rating as keyof typeof currentFeedbackData.ratings] || 0;
                        const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
                        
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-12">
                              <span className="text-sm">{rating}</span>
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            </div>
                            <Progress value={percentage} className="flex-1 h-2" />
                            <span className="text-sm text-gray-600 w-12 text-right">
                              {count} ({percentage}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Problèmes les plus fréquents */}
                  <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Problèmes Identifiés
                    </h4>
                    <div className="space-y-3">
                      {currentFeedbackData?.commonIssues?.map((issue, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{issue.issue}</p>
                            <p className="text-xs text-gray-600">{issue.count} mentions</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {issue.percentage}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Commentaires récents */}
                <div className="mt-6">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Commentaires Récents
                  </h4>
                  <div className="space-y-3">
                    {paginatedProcedureComments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= comment.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {comment.category}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{comment.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination pour les commentaires */}
                  {procedureTotalPages > 1 && (
                    <div className="mt-6">
                      <Pagination
                        currentPage={procedureCurrentPage}
                        totalPages={procedureTotalPages}
                        totalItems={procedureTotalItems}
                        itemsPerPage={procedureItemsPerPage}
                        onPageChange={setProcedureCurrentPage}
                        onItemsPerPageChange={setProcedureItemsPerPage}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
