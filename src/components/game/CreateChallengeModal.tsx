
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Copy, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimeControl = {
  id: string;
  name: string;
  description: string;
  category: 'bullet' | 'blitz' | 'rapid' | 'classical';
};

type ColorPreference = 'white' | 'black' | 'random';

const timeControls: TimeControl[] = [
  { id: '1+0', name: 'Bullet 1+0', description: '1 minuto sin incremento', category: 'bullet' },
  { id: '2+1', name: 'Bullet 2+1', description: '2 minutos + 1 segundo', category: 'bullet' },
  { id: '3+0', name: 'Blitz 3+0', description: '3 minutos sin incremento', category: 'blitz' },
  { id: '3+2', name: 'Blitz 3+2', description: '3 minutos + 2 segundos', category: 'blitz' },
  { id: '5+0', name: 'Blitz 5+0', description: '5 minutos sin incremento', category: 'blitz' },
  { id: '5+3', name: 'Blitz 5+3', description: '5 minutos + 3 segundos', category: 'blitz' },
  { id: '10+0', name: 'Rápido 10+0', description: '10 minutos sin incremento', category: 'rapid' },
  { id: '15+10', name: 'Rápido 15+10', description: '15 minutos + 10 segundos', category: 'rapid' },
  { id: '30+0', name: 'Clásico 30+0', description: '30 minutos sin incremento', category: 'classical' },
  { id: '30+30', name: 'Clásico 30+30', description: '30 minutos + 30 segundos', category: 'classical' },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'bullet': return 'bg-red-100 text-red-800 border-red-200';
    case 'blitz': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'rapid': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'classical': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ isOpen, onClose }) => {
  const [selectedTimeControl, setSelectedTimeControl] = useState<string>('');
  const [preferredColor, setPreferredColor] = useState<ColorPreference>('random');
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [challengeLink, setChallengeLink] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const selectedControl = timeControls.find(tc => tc.id === selectedTimeControl);

  const handleCreateChallenge = async () => {
    if (!selectedTimeControl) {
      toast.error('Por favor selecciona un control de tiempo');
      return;
    }

    setIsCreatingChallenge(true);
    
    // Simular la creación del desafío
    setTimeout(() => {
      const gameId = `GAME${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const link = `${window.location.origin}/play/${gameId}`;
      setChallengeLink(link);
      setIsCreatingChallenge(false);
      toast.success('¡Desafío creado exitosamente!');
    }, 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(challengeLink);
      setIsCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Error al copiar el enlace');
    }
  };

  const handleClose = () => {
    setSelectedTimeControl('');
    setPreferredColor('random');
    setChallengeLink('');
    setIsCreatingChallenge(false);
    setIsCopied(false);
    onClose();
  };

  const handleJoinGame = () => {
    window.location.href = challengeLink.replace(window.location.origin, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Crear Nuevo Desafío
          </DialogTitle>
          <DialogDescription>
            Configura tu desafío y comparte el enlace con otro socio para comenzar a jugar.
          </DialogDescription>
        </DialogHeader>

        {!challengeLink ? (
          <div className="space-y-6">
            {/* Control de Tiempo */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Control de Tiempo</Label>
              <Select value={selectedTimeControl} onValueChange={setSelectedTimeControl}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el control de tiempo" />
                </SelectTrigger>
                <SelectContent>
                  {timeControls.map((control) => (
                    <SelectItem key={control.id} value={control.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getCategoryColor(control.category)}>
                          {control.category}
                        </Badge>
                        <span>{control.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedControl && (
                <p className="text-sm text-slate-600">{selectedControl.description}</p>
              )}
            </div>

            {/* Preferencia de Color */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Preferencia de Color</Label>
              <RadioGroup value={preferredColor} onValueChange={(value) => setPreferredColor(value as ColorPreference)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="white" />
                  <Label htmlFor="white" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                    Jugar con Blancas
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="black" id="black" />
                  <Label htmlFor="black" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                    Jugar con Negras
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="random" id="random" />
                  <Label htmlFor="random" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-white to-gray-800 border border-gray-300"></div>
                    Color Aleatorio
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateChallenge} 
                disabled={!selectedTimeControl || isCreatingChallenge}
                className="flex-1"
              >
                {isCreatingChallenge ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Desafío'
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Enlace Generado */
          <div className="space-y-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-green-800">
                    <Check className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold">¡Desafío Creado!</h3>
                    <p className="text-sm">Comparte este enlace con tu oponente</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border">
                    <code className="text-sm break-all">{challengeLink}</code>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                      {isCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar Enlace
                        </>
                      )}
                    </Button>
                    <Button onClick={handleJoinGame} className="flex-1">
                      Ir a la Partida
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
