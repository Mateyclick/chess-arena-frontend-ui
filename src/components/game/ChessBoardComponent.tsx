
import React from 'react';
import { Chessboard } from 'react-chessboard';

interface ChessBoardComponentProps {
  fen: string;
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  orientation: 'white' | 'black';
  arePiecesDraggable: boolean;
  customSquareStyles?: { [square: string]: React.CSSProperties };
}

export const ChessBoardComponent: React.FC<ChessBoardComponentProps> = ({
  fen,
  onPieceDrop,
  orientation,
  arePiecesDraggable,
  customSquareStyles = {}
}) => {
  const handlePieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    return onPieceDrop(sourceSquare, targetSquare);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Chessboard
        position={fen}
        onPieceDrop={handlePieceDrop}
        boardOrientation={orientation}
        arePiecesDraggable={arePiecesDraggable}
        customSquareStyles={customSquareStyles}
        boardWidth={Math.min(600, window.innerWidth - 100)}
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        customDarkSquareStyle={{
          backgroundColor: '#779952'
        }}
        customLightSquareStyle={{
          backgroundColor: '#edeed1'
        }}
        animationDuration={200}
      />
    </div>
  );
};
