import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setError('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = async () => {
    if (!userInput.trim()) {
      setError('Введите код с изображения');
      return;
    }

    setIsLoading(true);
    setError('');

    // Симуляция проверки
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setIsVerified(true);
      setAttempts(attempts + 1);
    } else {
      setError('Неверный код. Попробуйте снова');
      setAttempts(attempts + 1);
      generateCaptcha();
    }

    setIsLoading(false);
  };

  const resetVerification = () => {
    setIsVerified(false);
    setAttempts(0);
    generateCaptcha();
  };

  const CaptchaDisplay = () => (
    <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-lg border-2 border-dashed border-slate-300 select-none">
      <div 
        className="text-3xl font-bold text-slate-700 transform -rotate-2 tracking-wider"
        style={{
          fontFamily: 'monospace',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          filter: 'blur(0.3px)',
          letterSpacing: '8px'
        }}
      >
        {captchaText.split('').map((char, index) => (
          <span 
            key={index}
            className="inline-block"
            style={{
              transform: `rotate(${Math.random() * 20 - 10}deg) scale(${0.9 + Math.random() * 0.2})`,
              color: `hsl(${210 + Math.random() * 30}, 70%, ${30 + Math.random() * 20}%)`
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-slate-400 rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>
    </div>
  );

  if (isVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Проверка пройдена</CardTitle>
            <CardDescription>
              Вы успешно подтвердили, что являетесь человеком
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between text-sm text-green-700">
                <span>Статус:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Верифицирован
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-green-700 mt-2">
                <span>Попыток:</span>
                <span className="font-medium">{attempts}</span>
              </div>
            </div>
            <Button 
              onClick={resetVerification} 
              variant="outline" 
              className="w-full"
            >
              Пройти проверку заново
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon name="Shield" size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">Проверка безопасности</CardTitle>
          <CardDescription>
            Подтвердите, что вы не робот, введя код с изображения
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="captcha" className="text-sm font-medium">
                Введите код с изображения:
              </Label>
              <CaptchaDisplay />
            </div>
            
            <div className="space-y-2">
              <Input
                id="captcha"
                type="text"
                placeholder="Введите код"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="text-center text-lg font-mono tracking-wider"
                maxLength={6}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Icon name="AlertCircle" size={14} />
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleVerify} 
              className="w-full" 
              disabled={isLoading || !userInput.trim()}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <Icon name="Shield" size={16} className="mr-2" />
                  Проверить
                </>
              )}
            </Button>
            
            <Button 
              onClick={generateCaptcha} 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Обновить код
            </Button>
          </div>

          {attempts > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Попыток: {attempts}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}