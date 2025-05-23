import React, { useState } from 'react';
import { supabase, getCRMUserByEmail } from '@/integrations/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Nouvelle fonction pour vérifier l'email dans Airtable
  const checkCRMAndProceed = async (action: 'login' | 'signup') => {
    setLoading(true);
    setMessage('');
    const crmUser = await getCRMUserByEmail(email);
    if (!crmUser) {
      setMessage("Impossible de vous connecter. Merci de contacter votre administrateur ou d'utiliser l'adresse email avec laquelle vous avez commandé notre vidéo.");
      setLoading(false);
      return false;
    }
    // On stocke le prénom et la photo dans le contexte utilisateur
    setUser({
      firstName: crmUser.firstName || '',
      email: crmUser.email || '',
      profilePicture: crmUser.profilePicture || null,
    });
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await checkCRMAndProceed('login');
    if (!ok) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("Connexion réussie !");
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await checkCRMAndProceed('signup');
    if (!ok) return;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("Inscription réussie ! Vérifie tes emails pour valider ton compte.");
      navigate('/');
    }
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("Un email de réinitialisation a été envoyé.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        {mode === 'login' && 'Connexion'}
        {mode === 'signup' && 'Créer un compte'}
        {mode === 'reset' && 'Mot de passe oublié'}
      </h2>
      <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleReset}>
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        {mode !== 'reset' && (
          <div style={{ marginBottom: 16 }}>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
        )}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#f59e42', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
          {loading ? 'Chargement...' :
            mode === 'login' ? 'Se connecter' :
            mode === 'signup' ? 'Créer un compte' :
            'Envoyer le lien'}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {mode === 'login' && (
          <>
            <span>Pas encore de compte ? </span>
            <button onClick={() => { setMode('signup'); setMessage(''); }} style={{ color: '#f59e42', background: 'none', border: 'none', cursor: 'pointer' }}>Créer un compte</button>
            <br />
            <button onClick={() => { setMode('reset'); setMessage(''); }} style={{ color: '#f59e42', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>Mot de passe oublié ?</button>
          </>
        )}
        {mode === 'signup' && (
          <>
            <span>Déjà un compte ? </span>
            <button onClick={() => { setMode('login'); setMessage(''); }} style={{ color: '#f59e42', background: 'none', border: 'none', cursor: 'pointer' }}>Se connecter</button>
          </>
        )}
        {mode === 'reset' && (
          <>
            <span>Retour à la </span>
            <button onClick={() => { setMode('login'); setMessage(''); }} style={{ color: '#f59e42', background: 'none', border: 'none', cursor: 'pointer' }}>connexion</button>
          </>
        )}
      </div>
      {message && <div style={{ marginTop: 20, color: message.startsWith('Erreur') || message.startsWith('Impossible') ? 'red' : 'green', textAlign: 'center' }}>{message}</div>}
    </div>
  );
};

export default LoginPage; 