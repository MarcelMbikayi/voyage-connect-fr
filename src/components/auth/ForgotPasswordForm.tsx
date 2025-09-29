import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onBack?: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: '',
  });

  const handleChange = (field: keyof ResetPasswordFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const validatedData = resetPasswordSchema.parse(formData);

      const { error } = await resetPassword(validatedData.email);

      if (error) {
        if (error.message.includes('not found')) {
          setGeneralError('Aucun compte associé à cette adresse email.');
        } else if (error.message.includes('too many requests')) {
          setGeneralError('Trop de demandes de réinitialisation. Veuillez réessayer dans quelques minutes.');
        } else {
          setGeneralError('Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        setSuccess(true);
        toast({
          title: 'Email envoyé',
          description: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
        });
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

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Email envoyé</CardTitle>
          <CardDescription>
            Vérifiez votre boîte de réception
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert>
            <AlertDescription>
              Un lien de réinitialisation du mot de passe a été envoyé à <strong>{formData.email}</strong>.
              Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas reçu l'email ? Vérifiez vos spams ou réessayez dans quelques minutes.
            </p>
            
            <Button
              variant="outline"
              onClick={() => setSuccess(false)}
              className="w-full"
            >
              Renvoyer l'email
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Mot de passe oublié</CardTitle>
        <CardDescription>
          Entrez votre email pour recevoir un lien de réinitialisation
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

          <Button type="submit" variant="hero" className="w-full mt-6" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-full"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};