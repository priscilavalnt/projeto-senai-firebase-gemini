import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
} from '../firebaseconfig';
import { User } from '../types';
import { INITIAL_TEST_USER } from '../data/studioData';

export const translateFirebaseError = (error: any): string => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique o e-mail ou faça seu cadastro.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Tente novamente.';
    case 'auth/invalid-email':
      return 'Formato de e-mail inválido.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está em uso por outra conta no Firebase.';
    case 'auth/weak-password':
      return 'A senha deve conter pelo menos 6 caracteres.';
    case 'auth/popup-closed-by-user':
      return 'A janela de autenticação do Google foi fechada antes de concluir.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela pop-up do Google. Permita pop-ups para este site.';
    case 'auth/cancelled-popup-request':
      return 'Solicitação cancelada. Tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha de conexão com os servidores do Firebase. Verifique sua internet.';
    case 'auth/operation-not-allowed':
      return 'Este método de login (E-mail/Senha ou Google) ainda não foi ativado no Console do Firebase (Aba Authentication > Sign-in method).';
    case 'auth/unauthorized-domain':
      return 'Domínio não autorizado no Firebase. Adicione o domínio do app na aba Authentication > Settings > Authorized domains do Firebase Console.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas em sequência. Aguarde alguns instantes antes de reenviar.';
    default:
      return error?.message || 'Ocorreu um erro na autenticação. Tente novamente.';
  }
};

/**
 * Autentica usuário com E-mail e Senha
 */
export const loginWithEmailAndPasswordService = async (
  email: string,
  pass: string
): Promise<User> => {
  // Se o Firebase estiver configurado com credenciais válidas
  if (isFirebaseConfigured() && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = userCredential.user;

      // Se o e-mail não estiver verificado, podemos disparar novamente o e-mail de verificação
      if (!fbUser.emailVerified) {
        try {
          await sendEmailVerification(fbUser);
        } catch (e) {
          console.warn('E-mail de verificação já enviado recentemente:', e);
        }
      }

      return {
        id: fbUser.uid,
        name: fbUser.displayName || email.split('@')[0],
        email: fbUser.email || email,
        avatar: fbUser.photoURL || undefined,
        provider: 'credentials',
        emailVerified: fbUser.emailVerified,
      };
    } catch (fbError: any) {
      // Se for o usuário de teste eu@eu.com e o Firebase falhar por não existir no projeto do usuário,
      // permitimos o acesso do usuário de teste para validação local do applet
      if (
        email.toLowerCase() === INITIAL_TEST_USER.email.toLowerCase() &&
        pass === INITIAL_TEST_USER.password
      ) {
        return {
          id: 'test-user-1',
          name: INITIAL_TEST_USER.name,
          email: INITIAL_TEST_USER.email,
          phone: INITIAL_TEST_USER.phone,
          provider: 'credentials',
          emailVerified: true,
        };
      }
      throw new Error(translateFirebaseError(fbError));
    }
  }

  // Fallback quando as credenciais ainda não foram preenchidas no firebaseconfig.js:
  // Valida com o usuário de teste ou usuários cadastrados no localStorage
  const storedUsersRaw = localStorage.getItem('tarja_preta_registered_users');
  const registeredUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

  const matchedUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
  );

  if (
    (email.toLowerCase() === INITIAL_TEST_USER.email.toLowerCase() &&
      pass === INITIAL_TEST_USER.password) ||
    matchedUser
  ) {
    const isTestUser = email.toLowerCase() === INITIAL_TEST_USER.email.toLowerCase();
    const storedVerified = localStorage.getItem('tarja_preta_email_verified_' + email.toLowerCase());
    
    // Usuário de teste já vem verificado por padrão; novos registros dependem de verificação
    const emailVerified = isTestUser ? true : storedVerified === 'true';

    return matchedUser
      ? {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          phone: matchedUser.phone,
          provider: 'credentials',
          emailVerified,
        }
      : {
          id: 'test-user-1',
          name: INITIAL_TEST_USER.name,
          email: INITIAL_TEST_USER.email,
          phone: INITIAL_TEST_USER.phone,
          provider: 'credentials',
          emailVerified: true,
        };
  }

  throw new Error(
    'E-mail ou senha incorretos. Use o usuário de teste (eu@eu.com / 1234) ou cadastre suas credenciais no firebaseconfig.js.'
  );
};

/**
 * Cadastra novo usuário com E-mail e Senha e envia e-mail de verificação padrão do Firebase
 */
export const registerWithEmailAndPasswordService = async (
  name: string,
  email: string,
  pass: string,
  phone?: string
): Promise<User> => {
  if (isFirebaseConfigured() && auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = userCredential.user;

      if (name.trim()) {
        try {
          await updateProfile(fbUser, { displayName: name.trim() });
        } catch (profileError) {
          console.warn('Erro ao atualizar perfil no Firebase:', profileError);
        }
      }

      // Envio de e-mail padrão do Firebase para verificação
      try {
        await sendEmailVerification(fbUser);
      } catch (verificationError) {
        console.warn('Erro ao enviar e-mail de verificação inicial:', verificationError);
      }

      return {
        id: fbUser.uid,
        name: name.trim() || fbUser.displayName || email.split('@')[0],
        email: fbUser.email || email,
        phone: phone?.trim(),
        provider: 'credentials',
        emailVerified: fbUser.emailVerified, // false até ser validado
      };
    } catch (fbError: any) {
      throw new Error(translateFirebaseError(fbError));
    }
  }

  // Fallback quando não há credenciais no firebaseconfig.js
  const storedUsersRaw = localStorage.getItem('tarja_preta_registered_users');
  const registeredUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

  if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Este e-mail já está cadastrado localmente.');
  }

  const newUser = {
    id: 'user-' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    password: pass,
    phone: phone?.trim() || '(11) 98765-4321',
    provider: 'credentials' as const,
  };

  registeredUsers.push(newUser);
  localStorage.setItem('tarja_preta_registered_users', JSON.stringify(registeredUsers));

  // Marca como não verificado inicialmente para simular a barreira obrigatória
  localStorage.setItem('tarja_preta_email_verified_' + email.toLowerCase(), 'false');

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    provider: 'credentials',
    emailVerified: false,
  };
};

/**
 * Reenvia o e-mail de verificação padrão do Firebase para o usuário logado
 */
export const resendVerificationEmailService = async (currentUser?: User | null): Promise<void> => {
  if (isFirebaseConfigured() && auth && auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
      return;
    } catch (fbError: any) {
      throw new Error(translateFirebaseError(fbError));
    }
  }

  // Fallback para modo demo / local
  await new Promise((resolve) => setTimeout(resolve, 600));
};

/**
 * Atualiza o status do usuário e verifica se o e-mail já foi validado
 */
export const checkEmailVerifiedService = async (currentUser?: User | null): Promise<boolean> => {
  if (isFirebaseConfigured() && auth && auth.currentUser) {
    try {
      await auth.currentUser.reload();
      return auth.currentUser.emailVerified;
    } catch (fbError: any) {
      console.warn('Erro ao verificar reload do usuário no Firebase:', fbError);
      return false;
    }
  }

  // Fallback para modo demo / local
  if (currentUser?.email) {
    const verified = localStorage.getItem('tarja_preta_email_verified_' + currentUser.email.toLowerCase());
    return verified === 'true';
  }
  return false;
};

/**
 * Simula a confirmação do link de e-mail (usado em ambiente de teste/demonstração)
 */
export const markEmailAsVerifiedDemoService = (email: string): void => {
  localStorage.setItem('tarja_preta_email_verified_' + email.toLowerCase(), 'true');
};

/**
 * Autentica usuário com a conta do Google (Firebase Auth GoogleAuthProvider)
 * Contas do Google já vêm verificadas por padrão
 */
export const loginWithGoogleService = async (): Promise<User> => {
  if (isFirebaseConfigured() && auth) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      return {
        id: fbUser.uid,
        name: fbUser.displayName || 'Usuário Google',
        email: fbUser.email || 'usuario@google.com',
        avatar: fbUser.photoURL || undefined,
        provider: 'google',
        emailVerified: fbUser.emailVerified || true,
      };
    } catch (fbError: any) {
      throw new Error(translateFirebaseError(fbError));
    }
  }

  // Se o Firebase ainda estiver com as credenciais padrão no firebaseconfig.js,
  // simula um login Google de demonstração verificado
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'google-user-' + Date.now(),
        name: 'Cliente Google (Demo)',
        email: 'cliente.google@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        phone: '(11) 97123-9988',
        provider: 'google',
        emailVerified: true,
      });
    }, 500);
  });
};

/**
 * Realiza logout do usuário (Firebase + Local)
 */
export const logoutService = async (): Promise<void> => {
  if (isFirebaseConfigured() && auth) {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn('Erro no signOut do Firebase:', error);
    }
  }
};
