
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Move {
  moveNumber: number;
  white?: string;
  black?: string;
}

interface MoveListComponentProps {
  moves: Move[];
}

export const MoveListComponent: React.FC<MoveListComponentProps> = ({ moves }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-slate-800">Movimientos</h3>
        <Badge variant="outline" className="text-xs">
          {moves.length > 0 ? `${moves.length} jugadas` : 'Partida no iniciada'}
        </Badge>
      </div>
      
      <ScrollArea className="h-64 w-full rounded-md border bg-slate-50 p-3">
        {moves.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-8">
            Los movimientos aparecerán aquí cuando comience la partida
          </div>
        ) : (
          <div className="space-y-2">
            {moves.map((move, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-slate-600 w-8">
                  {move.moveNumber}.
                </span>
                <div className="flex gap-4 flex-1">
                  <span className="font-mono bg-white px-2 py-1 rounded border min-w-[60px] text-center">
                    {move.white || '...'}
                  </span>
                  <span className="font-mono bg-gray-800 text-white px-2 py-1 rounded border min-w-[60px] text-center">
                    {move.black || '...'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
