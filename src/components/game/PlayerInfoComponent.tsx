
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerInfoComponentProps {
  playerName: string;
  avatarUrl?: string;
  rating?: number;
  timeLeft: string;
  isTheirTurn: boolean;
  position: 'top' | 'bottom';
}

export const PlayerInfoComponent: React.FC<PlayerInfoComponentProps> = ({
  playerName,
  avatarUrl,
  rating,
  timeLeft,
  isTheirTurn,
  position
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isLowTime = timeLeft.startsWith('00:') && parseInt(timeLeft.split(':')[1]) < 30;

  return (
    <Card className={cn(
      "shadow-lg border-0 bg-white/90 backdrop-blur-sm transition-all duration-300",
      isTheirTurn && "ring-2 ring-blue-500 bg-blue-50/90"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(playerName)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-800">{playerName}</h3>
                {isTheirTurn && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              {rating && (
                <Badge variant="outline" className="text-xs">
                  ELO: {rating}
                </Badge>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className={cn(
              "flex items-center gap-2 text-2xl font-mono font-bold",
              isLowTime ? "text-red-600" : isTheirTurn ? "text-blue-600" : "text-slate-700",
              isLowTime && "animate-pulse"
            )}>
              <Clock className="h-5 w-5" />
              {timeLeft}
            </div>
            {isTheirTurn && (
              <Badge variant="default" className="text-xs mt-1 bg-blue-500">
                Su turno
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
