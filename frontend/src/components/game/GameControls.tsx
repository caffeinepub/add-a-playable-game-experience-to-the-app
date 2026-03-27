import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Direction } from '../../game/types';

interface GameControlsProps {
  direction: Direction;
  onDirectionChange: (direction: Direction) => void;
  disabled?: boolean;
}

export default function GameControls({ direction, onDirectionChange, disabled }: GameControlsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground mb-2">Touch Controls</p>
          <div className="grid grid-cols-3 gap-2">
            <div />
            <Button
              onClick={() => onDirectionChange('up')}
              disabled={disabled}
              variant={direction === 'up' ? 'default' : 'outline'}
              size="lg"
              className="w-16 h-16"
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
            <div />
            <Button
              onClick={() => onDirectionChange('left')}
              disabled={disabled}
              variant={direction === 'left' ? 'default' : 'outline'}
              size="lg"
              className="w-16 h-16"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => onDirectionChange('down')}
              disabled={disabled}
              variant={direction === 'down' ? 'default' : 'outline'}
              size="lg"
              className="w-16 h-16"
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => onDirectionChange('right')}
              disabled={disabled}
              variant={direction === 'right' ? 'default' : 'outline'}
              size="lg"
              className="w-16 h-16"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Or use arrow keys / WASD</p>
        </div>
      </CardContent>
    </Card>
  );
}
