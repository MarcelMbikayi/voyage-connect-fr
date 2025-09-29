import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

export const SignUpForm = ({ onSuccess, onSwitchToSignIn }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleChange = (field: keyof SignUpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const validatedData = signUpSchema.parse(formData);

      const { error } = await signUp(
        validatedData.email,
        validatedData.password,
        validatedData.fullName
      );

      if (error) {
        if (error.message.includes('already registered')) {
          setGeneralError('Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse.');
        } else if (error.message.includes('weak password')) {
          setErrors({ password: 'Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.' });
        } else {
          setGeneralError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        }
      } else {
        toast({
          title: 'Inscription réussie',
          description: 'Votre compte a été créé avec succès. Vous êtes maintenant connecté.',
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
        <CardTitle className="text-2xl font-bold text-primary">Créer un compte</CardTitle>
        <CardDescription>
          Rejoignez VoyageExpress pour réserver vos billets facilement
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
            <Label htmlFor="fullName">Nom complet</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Votre nom complet"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            )}
          </div>

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
            <Label htmlFor="phone">Téléphone (optionnel)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={handleChange('phone')}
                className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 caractères"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmer votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                disabled={loading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" variant="hero" className="w-full mt-6" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              'Créer mon compte'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-medium text-primary"
              onClick={onSwitchToSignIn}
              disabled={loading}
            >
              Se connecter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};