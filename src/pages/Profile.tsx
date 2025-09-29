import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Globe, 
  Shield, 
  Smartphone, 
  Monitor,
  LogOut,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ProfileUpdateFormData>({
    full_name: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    preferred_language: 'fr',
  });

  // Load user profile and sessions
  useEffect(() => {
    if (user) {
      loadProfile();
      loadSessions();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        nationality: data.nationality || '',
        preferred_language: (data.preferred_language as 'fr' | 'en' | 'es' | 'de') || 'fr',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setErrors({});

    try {
      const validatedData = profileUpdateSchema.parse(formData);
      const { error } = await updateProfile(validatedData);

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour le profil.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Profil mis à jour',
          description: 'Vos informations ont été sauvegardées avec succès.',
        });
        setEditMode(false);
        loadProfile(); // Reload to get updated data
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de se déconnecter.',
        variant: 'destructive',
      });
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: 'Session terminée',
        description: 'La session a été terminée avec succès.',
      });
      loadSessions(); // Reload sessions
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la session.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent?.toLowerCase().includes('mobile')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="heading-2 mb-2">Mon profil</h1>
              <p className="text-muted-foreground">
                Gérez vos informations personnelles et vos préférences de sécurité
              </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Informations personnelles
                        </CardTitle>
                        <CardDescription>
                          Gérez vos informations de profil
                        </CardDescription>
                      </div>
                      <Button
                        variant={editMode ? "ghost" : "outline"}
                        onClick={() => {
                          if (editMode) {
                            setEditMode(false);
                            setErrors({});
                          } else {
                            setEditMode(true);
                          }
                        }}
                      >
                        {editMode ? (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Annuler
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{user?.email}</span>
                          <Badge variant="secondary">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Vérifié
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="full_name">Nom complet</Label>
                        {editMode ? (
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                            className={errors.full_name ? 'border-destructive' : ''}
                          />
                        ) : (
                          <p className="text-sm py-2">{profile?.full_name || 'Non renseigné'}</p>
                        )}
                        {errors.full_name && (
                          <p className="text-sm text-destructive">{errors.full_name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        {editMode ? (
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="0123456789"
                            className={errors.phone ? 'border-destructive' : ''}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{profile?.phone || 'Non renseigné'}</span>
                            {profile?.phone_verified ? (
                              <Badge variant="secondary">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Vérifié
                              </Badge>
                            ) : profile?.phone ? (
                              <Badge variant="outline">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Non vérifié
                              </Badge>
                            ) : null}
                          </div>
                        )}
                        {errors.phone && (
                          <p className="text-sm text-destructive">{errors.phone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date_of_birth">Date de naissance</Label>
                        {editMode ? (
                          <Input
                            id="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                            className={errors.date_of_birth ? 'border-destructive' : ''}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {profile?.date_of_birth 
                                ? new Date(profile.date_of_birth).toLocaleDateString('fr-FR')
                                : 'Non renseigné'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationalité</Label>
                        {editMode ? (
                          <Input
                            id="nationality"
                            value={formData.nationality}
                            onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                            placeholder="Française"
                            className={errors.nationality ? 'border-destructive' : ''}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{profile?.nationality || 'Non renseigné'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleUpdateProfile} 
                          disabled={loading}
                          variant="hero"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sauvegarde...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Sauvegarder
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Sessions actives
                    </CardTitle>
                    <CardDescription>
                      Gérez vos connexions actives sur différents appareils
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(session.user_agent)}
                            <div>
                              <p className="font-medium">
                                {session.user_agent?.includes('Chrome') ? 'Chrome' : 
                                 session.user_agent?.includes('Firefox') ? 'Firefox' : 
                                 session.user_agent?.includes('Safari') ? 'Safari' : 'Navigateur'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Dernière activité: {formatDate(session.last_activity)}
                              </p>
                              {session.ip_address && (
                                <p className="text-xs text-muted-foreground">
                                  IP: {session.ip_address}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Actif</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTerminateSession(session.id)}
                            >
                              Terminer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions de sécurité</CardTitle>
                    <CardDescription>
                      Gérez votre compte et vos paramètres de sécurité
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Changer de mot de passe</p>
                        <p className="text-sm text-muted-foreground">
                          Modifiez votre mot de passe de connexion
                        </p>
                      </div>
                      <Button variant="outline">
                        Modifier
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Se déconnecter</p>
                        <p className="text-sm text-muted-foreground">
                          Terminer votre session actuelle
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Choisissez comment vous souhaitez être notifié
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-muted-foreground">
                          Recevez des emails pour vos réservations et mises à jour
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications SMS</p>
                        <p className="text-sm text-muted-foreground">
                          Recevez des SMS pour les informations importantes
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications push</p>
                        <p className="text-sm text-muted-foreground">
                          Recevez des notifications push dans l'application
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;