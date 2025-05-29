
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateChallengeModal } from '@/components/game/CreateChallengeModal';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy } from 'lucide-react';

const PlayLobbyPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock data para partidas en curso y estadísticas
  const ongoingGames = [
    { id: 'game1', whitePlayer: 'Carlos M.', blackPlayer: 'Ana L.', timeControl: '5+0', status: 'En curso' },
    { id: 'game2', whitePlayer: 'Roberto S.', blackPlayer: 'María G.', timeControl: '10+0', status: 'En curso' },
  ];

  const recentGames = [
    { id: 'recent1', opponent: 'Luis P.', result: '1-0', timeControl: '5+0', date: '2025-01-15' },
    { id: 'recent2', opponent: 'Carmen R.', result: '0-1', timeControl: '10+0', date: '2025-01-14' },
    { id: 'recent3', opponent: 'Diego M.', result: '1/2-1/2', timeControl: '15+10', date: '2025-01-13' },
  ];

  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case '1-0': return 'default';
      case '0-1': return 'destructive';
      case '1/2-1/2': return 'secondary';
      default: return 'outline';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case '1-0': return 'Victoria';
      case '0-1': return 'Derrota';
      case '1/2-1/2': return 'Tablas';
      default: return result;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Club de Ajedrez - Jugar</h1>
          <p className="text-slate-600 text-lg">Desafía a otros socios y disfruta de partidas en tiempo real</p>
        </div>

        {/* Main Action */}
        <div className="text-center mb-12">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Trophy className="mr-2 h-5 w-5" />
            Crear Nuevo Desafío
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Partidas en Curso */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Users className="h-5 w-5" />
                Partidas en Curso
              </CardTitle>
              <CardDescription>Partidas activas del club que puedes seguir como espectador</CardDescription>
            </CardHeader>
            <CardContent>
              {ongoingGames.length > 0 ? (
                <div className="space-y-3">
                  {ongoingGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <div className="font-medium text-slate-800">{game.whitePlayer} vs {game.blackPlayer}</div>
                          <div className="text-slate-600 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {game.timeControl}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {game.status}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => window.location.href = `/play/${game.id}`}>
                          Ver Partida
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay partidas en curso en este momento</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mis Partidas Recientes */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Trophy className="h-5 w-5" />
                Mis Partidas Recientes
              </CardTitle>
              <CardDescription>Tus últimas partidas jugadas</CardDescription>
            </CardHeader>
            <CardContent>
              {recentGames.length > 0 ? (
                <div className="space-y-3">
                  {recentGames.map((game) => (
                    <div key={game.id} className="p-3 bg-slate-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm text-slate-800">vs {game.opponent}</div>
                        <Badge variant={getResultBadgeVariant(game.result)} className="text-xs">
                          {getResultText(game.result)}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {game.timeControl}
                        </span>
                        <span>{game.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aún no has jugado partidas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-slate-600">Socios en línea</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-slate-600">Partidas hoy</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-slate-600">Partidas este mes</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateChallengeModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default PlayLobbyPage;
