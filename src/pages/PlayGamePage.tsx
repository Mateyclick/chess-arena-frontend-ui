
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
  
  console.log('🎮 PlayGamePage: Inicializando con gameId:', gameId);

  const [gameState, setGameState] = useState<GameState>(() => {
    const chess = new Chess();
    const initialState = {
      chess,
      currentFen: chess.fen(),
      playerColor: 'white' as const,
      isMyTurn: true,
      gameHistory: [],
      gameResult: '*',
      isSpectating: false,
      whiteTimeLeft: 300,
      blackTimeLeft: 300,
      gameStatusMessage: 'Esperando oponente...'
    };
    console.log('🎯 Estado inicial del juego:', initialState);
    return initialState;
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

  console.log('🎲 Estado actual del juego:', {
    gameId,
    playerColor: gameState.playerColor,
    isMyTurn: gameState.isMyTurn,
    currentFen: gameState.currentFen,
    gameResult: gameState.gameResult,
    connected
  });

  // Simulación de conexión y inicio de partida
  useEffect(() => {
    console.log('🔌 Simulando conexión al juego...');
    const timer = setTimeout(() => {
      console.log('✅ Conexión establecida, iniciando partida');
      setConnected(true);
      setGameState(prev => ({
        ...prev,
        gameStatusMessage: 'Juegan Blancas'
      }));
    }, 2000);

    return () => {
      console.log('🧹 Limpiando timer de conexión');
      clearTimeout(timer);
    };
  }, []);

  // Simulación del reloj
  useEffect(() => {
    if (!connected || gameState.gameResult !== '*') {
      console.log('⏰ Reloj detenido - connected:', connected, 'gameResult:', gameState.gameResult);
      return;
    }

    console.log('⏰ Iniciando reloj - turno actual:', gameState.isMyTurn ? 'mío' : 'oponente');

    const interval = setInterval(() => {
      setGameState(prev => {
        const activePlayer = prev.isMyTurn && prev.playerColor === 'white' ? 'white' :
                           !prev.isMyTurn && prev.playerColor === 'white' ? 'black' :
                           prev.isMyTurn && prev.playerColor === 'black' ? 'black' : 'white';
        
        console.log('⏱️ Tick del reloj - jugador activo:', activePlayer);

        if (activePlayer === 'white') {
          const newTime = Math.max(0, prev.whiteTimeLeft - 1);
          if (newTime === 0) console.log('⚠️ ¡Tiempo agotado para blancas!');
          return { ...prev, whiteTimeLeft: newTime };
        } else {
          const newTime = Math.max(0, prev.blackTimeLeft - 1);
          if (newTime === 0) console.log('⚠️ ¡Tiempo agotado para negras!');
          return { ...prev, blackTimeLeft: newTime };
        }
      });
    }, 1000);

    return () => {
      console.log('🧹 Limpiando intervalo del reloj');
      clearInterval(interval);
    };
  }, [connected, gameState.isMyTurn, gameState.playerColor, gameState.gameResult]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    console.log('🕐 Tiempo formateado:', seconds, 'segundos =', formatted);
    return formatted;
  };

  const handlePieceDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    console.log('♟️ Intento de movimiento:', {
      from: sourceSquare,
      to: targetSquare,
      connected,
      isSpectating: gameState.isSpectating,
      isMyTurn: gameState.isMyTurn,
      gameResult: gameState.gameResult
    });

    if (!connected || gameState.isSpectating || !gameState.isMyTurn || gameState.gameResult !== '*') {
      console.log('❌ Movimiento bloqueado por condiciones del juego');
      return false;
    }

    try {
      console.log('🎯 Intentando mover pieza con chess.js...');
      const move = gameState.chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move) {
        console.log('✅ Movimiento válido ejecutado:', move);

        // Actualizar el historial de movimientos
        const moveNumber = Math.ceil(gameState.chess.history().length / 2);
        const isWhiteMove = gameState.chess.history().length % 2 === 1;
        
        console.log('📝 Actualizando historial:', {
          moveNumber,
          isWhiteMove,
          moveSan: move.san,
          totalMoves: gameState.chess.history().length
        });
        
        setGameState(prev => {
          const newHistory = [...prev.gameHistory];
          
          if (isWhiteMove) {
            console.log('⚪ Agregando movimiento de blancas');
            newHistory.push({ moveNumber, white: move.san });
          } else {
            console.log('⚫ Agregando movimiento de negras');
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
            console.log('🏁 ¡JAQUE MATE!', { gameResult, winner: gameResult === '1-0' ? 'Blancas' : 'Negras' });
          } else if (prev.chess.isDraw()) {
            gameResult = '1/2-1/2';
            statusMessage = '¡Tablas!';
            console.log('🤝 ¡TABLAS!');
          } else if (prev.chess.isCheck()) {
            statusMessage = `¡Jaque! ${prev.chess.turn() === 'w' ? 'Juegan Blancas' : 'Juegan Negras'}`;
            console.log('⚡ ¡JAQUE! - turno de:', prev.chess.turn() === 'w' ? 'Blancas' : 'Negras');
          }

          const newState = {
            ...prev,
            currentFen: prev.chess.fen(),
            isMyTurn: !prev.isMyTurn,
            gameHistory: newHistory,
            gameResult,
            gameStatusMessage: statusMessage
          };

          console.log('🔄 Estado actualizado después del movimiento:', newState);
          return newState;
        });

        return true;
      } else {
        console.log('❌ chess.js rechazó el movimiento - move es null');
      }
    } catch (error) {
      console.error('💥 Error al procesar movimiento:', error);
      console.error('📊 Detalles del error:', {
        from: sourceSquare,
        to: targetSquare,
        currentFen: gameState.currentFen,
        turn: gameState.chess.turn()
      });
    }

    return false;
  }, [connected, gameState.chess, gameState.isSpectating, gameState.isMyTurn, gameState.gameResult, gameState.gameHistory]);

  const handleOfferDraw = () => {
    console.log('🤝 Usuario ofrece tablas');
    // Aquí se implementaría la lógica para ofrecer tablas
  };

  const handleResign = () => {
    console.log('🏳️ Usuario se rinde');
    const newResult = gameState.playerColor === 'white' ? '0-1' : '1-0';
    const winner = gameState.playerColor === 'white' ? 'Negras' : 'Blancas';
    
    console.log('🏁 Partida terminada por abandono:', { newResult, winner });
    
    setGameState(prev => ({
      ...prev,
      gameResult: newResult,
      gameStatusMessage: `${winner} ganan por abandono`
    }));
  };

  console.log('🎨 Renderizando PlayGamePage con datos:', {
    whitePlayer: gameState.playerColor === 'white' ? 'YO' : whitePlayer.name,
    blackPlayer: gameState.playerColor === 'black' ? 'YO' : blackPlayer.name,
    boardOrientation: gameState.playerColor,
    moveCount: gameState.gameHistory.length,
    isSpectating: gameState.isSpectating,
    showGameControls: !gameState.isSpectating && gameState.gameResult === '*' && connected
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => {
              console.log('🔙 Navegando de vuelta al lobby');
              window.history.back();
            }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Lobby
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Partida #{gameId}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Badge variant="outline">Blitz 5+0</Badge>
                {gameState.isSpectating && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-800">
                    <Users className="h-3 w-3" />
                    Modo Espectador
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <GameStatusDisplay gameStatusMessage={gameState.gameStatusMessage} />
        </div>

        {/* Información especial para espectadores */}
        {gameState.isSpectating && (
          <div className="mb-6">
            <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-blue-50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-3 text-purple-700">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Estás viendo esta partida como espectador</span>
                </div>
                <p className="text-center text-sm text-purple-600 mt-1">
                  Puedes seguir todos los movimientos pero no puedes participar en el juego
                </p>
              </CardContent>
            </Card>
          </div>
        )}

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
                  orientation={gameState.isSpectating ? 'white' : gameState.playerColor}
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

            {/* Panel de Espectador - SOLO para espectadores */}
            {gameState.isSpectating && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-purple-700">
                      <Users className="h-5 w-5" />
                      <h3 className="font-semibold">Panel de Espectador</h3>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>• Puedes seguir la partida en tiempo real</p>
                      <p>• Los movimientos se actualizan automáticamente</p>
                      <p>• No puedes interactuar con las piezas</p>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => console.log('📊 Analizando partida en vivo...')}>
                        <Users className="h-4 w-4 mr-2" />
                        Analizar Posición
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controles del Juego - SOLO para jugadores activos en partida activa */}
            {!gameState.isSpectating && connected && gameState.gameResult === '*' && (
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
                      <Button variant="outline" size="sm" onClick={() => console.log('📊 Analizando partida...')}>
                        Analizar Partida
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => console.log('📥 Descargando PGN...')}>
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
