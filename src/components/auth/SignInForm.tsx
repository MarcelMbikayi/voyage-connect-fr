import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signInSchema, type SignInFormData } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';

interface SignInFormProps {
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword?: () => void;
}

export const SignInForm = ({ onSuccess, onSwitchToSignUp, onForgotPassword }: SignInFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const handleChange = (field: keyof SignInFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      // Validate form data
      const validatedData = signInSchema.parse(formData);

      const { error } = await signIn(validatedData.email, validatedData.password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setGeneralError('Email ou mot de passe incorrect. Veuillez vérifier vos informations.');
        } else if (error.message.includes('too many requests')) {
          setGeneralError('Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.');
        } else if (error.message.includes('Email not confirmed')) {
          setGeneralError('Veuillez confirmer votre email avant de vous connecter.');
        } else {
          setGeneralError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
        }
      } else {
        toast({
          title: 'Connexion réussie',
          description: 'Vous êtes maintenant connecté à votre compte.',
        });
        onSuccess?.();
      }
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setGeneralError('Une erreur de validation est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte VoyageExpress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <Alert variant="destructive">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange('email')}
                className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleChange('password')}
                className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                disabled={loading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm text-primary"
              onClick={onForgotPassword}
              disabled={loading}
            >
              Mot de passe oublié ?
            </Button>
          </div>

          <Button type="submit" variant="hero" className="w-full mt-6" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-medium text-primary"
              onClick={onSwitchToSignUp}
              disabled={loading}
            >
              Créer un compte
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};