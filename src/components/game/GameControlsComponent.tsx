
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Handshake, Flag } from 'lucide-react';
import { toast } from 'sonner';

interface GameControlsComponentProps {
  onOfferDraw: () => void;
  onResign: () => void;
  disabled?: boolean;
}

export const GameControlsComponent: React.FC<GameControlsComponentProps> = ({
  onOfferDraw,
  onResign,
  disabled = false
}) => {
  const [isOfferingDraw, setIsOfferingDraw] = useState(false);

  console.log('🎮 GameControlsComponent renderizado:', { disabled, isOfferingDraw });

  const handleOfferDraw = () => {
    console.log('🤝 Ofreciendo tablas...');
    setIsOfferingDraw(true);
    onOfferDraw();
    toast.success('Has ofrecido tablas a tu oponente');
    
    // Simular respuesta del oponente (por ahora)
    setTimeout(() => {
      console.log('⏰ Simulando respuesta del oponente a la oferta de tablas');
      setIsOfferingDraw(false);
      // toast.info('Tu oponente ha rechazado las tablas');
    }, 3000);
  };

  const handleResign = () => {
    console.log('🏳️ Confirmando rendición...');
    onResign();
    toast.error('Te has rendido');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-800">Controles de Partida</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleOfferDraw}
          disabled={disabled || isOfferingDraw}
          className="flex items-center gap-2"
        >
          <Handshake className="h-4 w-4" />
          {isOfferingDraw ? 'Oferta Enviada' : 'Ofrecer Tablas'}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={disabled}
              className="flex items-center gap-2"
              onClick={() => console.log('🚨 Abriendo diálogo de confirmación para rendirse')}
            >
              <Flag className="h-4 w-4" />
              Rendirse
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro que quieres rendirte?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Tu oponente ganará la partida inmediatamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => console.log('❌ Cancelando rendición')}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleResign} 
                className="bg-red-600 hover:bg-red-700"
              >
                Sí, rendirse
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="text-xs text-slate-600 space-y-1">
        <p>• Las tablas deben ser aceptadas por ambos jugadores</p>
        <p>• Rendirse otorga la victoria inmediatamente al oponente</p>
      </div>
    </div>
  );
};
