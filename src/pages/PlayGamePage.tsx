
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Chess } from 'chess.js';
import { ChessBoardComponent } from '@/components/game/ChessBoardComponent';
import { PlayerInfoComponent } from '@/components/game/PlayerInfoComponent';
import { MoveListComponent } from '@/components/game/MoveListComponent';
import { GameControlsComponent } from '@/components/game/GameControlsComponent';
import { GameStatusDisplay } from '@/components/game/GameStatusDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';

interface GameState {
  chess: Chess;
  currentFen: string;
  playerColor: 'white' | 'black';
  isMyTurn: boolean;
  gameHistory: Array<{ moveNumber: number; white?: string; black?: string }>;
  gameResult: string;
  isSpectating: boolean;
  whiteTimeLeft: number;
  blackTimeLeft: number;
  gameStatusMessage: string;
}

interface PlayerInfo {
  name: string;
  avatar?: string;
  rating?: number;
}

const PlayGamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameState, setGameState] = useState<GameState>(() => {
    const chess = new Chess();
    return {
      chess,
      currentFen: chess.fen(),
      playerColor: 'white', // Se determinará dinámicamente
      isMyTurn: true,
      gameHistory: [],
      gameResult: '*',
      isSpectating: false,
      whiteTimeLeft: 300, // 5 minutos en segundos
      blackTimeLeft: 300,
      gameStatusMessage: 'Esperando oponente...'
    };
  });

  const [whitePlayer] = useState<PlayerInfo>({
    name: 'Carlos Martínez',
    avatar: undefined,
    rating: 1650
  });

  const [blackPlayer] = useState<PlayerInfo>({
    name: 'Ana López',
    avatar: undefined,
    rating: 1580
  });

  const [connected, setConnected] = useState(false);

  // Simulación de conexión y inicio de partida
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnected(true);
      setGameState(prev => ({
        ...prev,
        gameStatusMessage: 'Juegan Blancas'
      }));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Simulación del reloj
  useEffect(() => {
    if (!connected || gameState.gameResult !== '*') return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.isMyTurn && prev.playerColor === 'white') {
          return { ...prev, whiteTimeLeft: Math.max(0, prev.whiteTimeLeft - 1) };
        } else if (!prev.isMyTurn && prev.playerColor === 'white') {
          return { ...prev, blackTimeLeft: Math.max(0, prev.blackTimeLeft - 1) };
        } else if (prev.isMyTurn && prev.playerColor === 'black') {
          return { ...prev, blackTimeLeft: Math.max(0, prev.blackTimeLeft - 1) };
        } else {
          return { ...prev, whiteTimeLeft: Math.max(0, prev.whiteTimeLeft - 1) };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [connected, gameState.isMyTurn, gameState.playerColor, gameState.gameResult]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePieceDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    if (!connected || gameState.isSpectating || !gameState.isMyTurn || gameState.gameResult !== '*') {
      return false;
    }

    try {
      const move = gameState.chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Por simplicidad, siempre promover a reina
      });

      if (move) {
        // Actualizar el historial de movimientos
        const moveNumber = Math.ceil(gameState.chess.history().length / 2);
        const isWhiteMove = gameState.chess.history().length % 2 === 1;
        
        setGameState(prev => {
          const newHistory = [...prev.gameHistory];
          
          if (isWhiteMove) {
            // Es movimiento de blancas
            newHistory.push({ moveNumber, white: move.san });
          } else {
            // Es movimiento de negras
            const lastMove = newHistory[newHistory.length - 1];
            if (lastMove && lastMove.moveNumber === moveNumber) {
              lastMove.black = move.san;
            } else {
              newHistory.push({ moveNumber, black: move.san });
            }
          }

          // Verificar fin de partida
          let gameResult = '*';
          let statusMessage = prev.isMyTurn ? 'Juegan Negras' : 'Juegan Blancas';
          
          if (prev.chess.isCheckmate()) {
            gameResult = prev.chess.turn() === 'w' ? '0-1' : '1-0';
            statusMessage = `¡Jaque Mate! ${gameResult === '1-0' ? 'Ganan Blancas' : 'Ganan Negras'}`;
          } else if (prev.chess.isDraw()) {
            gameResult = '1/2-1/2';
            statusMessage = '¡Tablas!';
          } else if (prev.chess.isCheck()) {
            statusMessage = `¡Jaque! ${prev.chess.turn() === 'w' ? 'Juegan Blancas' : 'Juegan Negras'}`;
          }

          return {
            ...prev,
            currentFen: prev.chess.fen(),
            isMyTurn: !prev.isMyTurn,
            gameHistory: newHistory,
            gameResult,
            gameStatusMessage: statusMessage
          };
        });

        return true;
      }
    } catch (error) {
      console.error('Movimiento inválido:', error);
    }

    return false;
  }, [connected, gameState.chess, gameState.isSpectating, gameState.isMyTurn, gameState.gameResult, gameState.gameHistory]);

  const handleOfferDraw = () => {
    console.log('Ofreciendo tablas...');
    // Aquí se implementaría la lógica para ofrecer tablas
  };

  const handleResign = () => {
    console.log('Rindiéndose...');
    setGameState(prev => ({
      ...prev,
      gameResult: prev.playerColor === 'white' ? '0-1' : '1-0',
      gameStatusMessage: `${prev.playerColor === 'white' ? 'Negras' : 'Blancas'} ganan por abandono`
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Lobby
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Partida #{gameId}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Badge variant="outline">Blitz 5+0</Badge>
                {gameState.isSpectating && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Espectador
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <GameStatusDisplay gameStatusMessage={gameState.gameStatusMessage} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Información del Jugador Superior */}
          <div className="xl:col-span-4">
            <PlayerInfoComponent
              playerName={gameState.playerColor === 'white' ? blackPlayer.name : whitePlayer.name}
              avatarUrl={gameState.playerColor === 'white' ? blackPlayer.avatar : whitePlayer.avatar}
              rating={gameState.playerColor === 'white' ? blackPlayer.rating : whitePlayer.rating}
              timeLeft={formatTime(gameState.playerColor === 'white' ? gameState.blackTimeLeft : gameState.whiteTimeLeft)}
              isTheirTurn={!gameState.isMyTurn && !gameState.isSpectating}
              position="top"
            />
          </div>

          {/* Tablero Principal */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <ChessBoardComponent
                  fen={gameState.currentFen}
                  onPieceDrop={handlePieceDrop}
                  orientation={gameState.playerColor}
                  arePiecesDraggable={!gameState.isSpectating && gameState.isMyTurn && connected && gameState.gameResult === '*'}
                />
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral Derecho */}
          <div className="xl:col-span-2 space-y-6">
            {/* Lista de Movimientos */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <MoveListComponent moves={gameState.gameHistory} />
              </CardContent>
            </Card>

            {/* Controles del Juego */}
            {!gameState.isSpectating && gameState.gameResult === '*' && (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <GameControlsComponent
                    onOfferDraw={handleOfferDraw}
                    onResign={handleResign}
                    disabled={!connected}
                  />
                </CardContent>
              </Card>
            )}

            {/* Resultado Final */}
            {gameState.gameResult !== '*' && (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Partida Finalizada</h3>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {gameState.gameResult === '1-0' ? 'Ganan Blancas' : 
                       gameState.gameResult === '0-1' ? 'Ganan Negras' : 'Tablas'}
                    </Badge>
                    <div className="mt-4 space-x-2">
                      <Button variant="outline" size="sm">
                        Analizar Partida
                      </Button>
                      <Button variant="outline" size="sm">
                        Descargar PGN
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Información del Jugador Inferior */}
          <div className="xl:col-span-4">
            <PlayerInfoComponent
              playerName={gameState.playerColor === 'white' ? whitePlayer.name : blackPlayer.name}
              avatarUrl={gameState.playerColor === 'white' ? whitePlayer.avatar : blackPlayer.avatar}
              rating={gameState.playerColor === 'white' ? whitePlayer.rating : blackPlayer.rating}
              timeLeft={formatTime(gameState.playerColor === 'white' ? gameState.whiteTimeLeft : gameState.blackTimeLeft)}
              isTheirTurn={gameState.isMyTurn && !gameState.isSpectating}
              position="bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayGamePage;
