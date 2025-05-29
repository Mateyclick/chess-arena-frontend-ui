
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Users, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameStatusDisplayProps {
  gameStatusMessage: string;
}

export const GameStatusDisplay: React.FC<GameStatusDisplayProps> = ({ gameStatusMessage }) => {
  const getStatusIcon = () => {
    if (gameStatusMessage.includes('Esperando')) {
      return <Clock className="h-4 w-4" />;
    }
    if (gameStatusMessage.includes('Jaque Mate') || gameStatusMessage.includes('Ganan')) {
      return <Trophy className="h-4 w-4" />;
    }
    if (gameStatusMessage.includes('Jaque')) {
      return <AlertCircle className="h-4 w-4" />;
    }
    if (gameStatusMessage.includes('Tablas')) {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (gameStatusMessage.includes('Conectando')) {
      return <Users className="h-4 w-4" />;
    }
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusVariant = () => {
    if (gameStatusMessage.includes('Esperando') || gameStatusMessage.includes('Conectando')) {
      return 'secondary';
    }
    if (gameStatusMessage.includes('Jaque Mate') || gameStatusMessage.includes('Ganan')) {
      return 'default';
    }
    if (gameStatusMessage.includes('Jaque')) {
      return 'destructive';
    }
    if (gameStatusMessage.includes('Tablas')) {
      return 'outline';
    }
    return 'default';
  };

  const getStatusColor = () => {
    if (gameStatusMessage.includes('Esperando') || gameStatusMessage.includes('Conectando')) {
      return 'text-yellow-600';
    }
    if (gameStatusMessage.includes('Jaque Mate') || gameStatusMessage.includes('Ganan')) {
      return 'text-green-600';
    }
    if (gameStatusMessage.includes('Jaque')) {
      return 'text-red-600';
    }
    if (gameStatusMessage.includes('Tablas')) {
      return 'text-blue-600';
    }
    return 'text-slate-600';
  };

  return (
    <Badge 
      variant={getStatusVariant()} 
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium",
        getStatusColor(),
        gameStatusMessage.includes('Conectando') && "animate-pulse"
      )}
    >
      {getStatusIcon()}
      {gameStatusMessage}
    </Badge>
  );
};
