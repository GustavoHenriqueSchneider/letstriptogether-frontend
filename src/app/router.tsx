import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Lazy loading das páginas
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.default })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.default })));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then(m => ({ default: m.default })));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.default })));
const VotingPage = lazy(() => import('@/pages/voting/VotingPage').then(m => ({ default: m.default })));
const MatchesPage = lazy(() => import('@/pages/matches/MatchesPage').then(m => ({ default: m.default })));
const MembersPage = lazy(() => import('@/pages/members/MembersPage').then(m => ({ default: m.default })));
const PreferencesPage = lazy(() => import('@/pages/preferences/PreferencesPage').then(m => ({ default: m.default })));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage').then(m => ({ default: m.default })));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage').then(m => ({ default: m.default })));
const TermsOfUsePage = lazy(() => import('@/pages/legal/TermsOfUsePage').then(m => ({ default: m.default })));
const ChangePasswordPage = lazy(() => import('@/pages/profile/ChangePasswordPage').then(m => ({ default: m.default })));
const GroupSettingsPage = lazy(() => import('@/pages/settings/GroupSettingsPage').then(m => ({ default: m.default })));
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.default })));

// Componente de rota protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  console.log('[ProtectedRoute] Component rendering');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  // Log para depuração
  React.useEffect(() => {
    console.log('[ProtectedRoute] useEffect - State changed:');
    console.log('  - isInitialized:', isInitialized);
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - Current pathname:', window.location.pathname);
  }, [isInitialized, isAuthenticated]);
  
  // Aguardar inicialização antes de verificar autenticação
  if (!isInitialized) {
    console.log('[ProtectedRoute] Rendering: Loading screen (waiting for initialization)');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E0652]"></div>
      </div>
    );
  }
  
  console.log('[ProtectedRoute] Initialized, checking authentication...');
  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated);
  if (isAuthenticated) {
    console.log('[ProtectedRoute] Rendering: Protected content');
    return <>{children}</>;
  } else {
    console.log('[ProtectedRoute] NOT authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
}

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E0652]"></div>
  </div>
);

// Componente para redirecionar /groups/:groupId para /groups/:groupId/vote
function GroupRedirect() {
  const pathParts = window.location.pathname.split('/');
  const groupId = pathParts[2];
  if (groupId) {
    return <Navigate to={`/groups/${groupId}/vote`} replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/groups/:groupId',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <GroupRedirect />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/groups/:groupId/vote',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <VotingPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/groups/:groupId/matches',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <MatchesPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/groups/:groupId/members',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <MembersPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/groups/:groupId/settings',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <GroupSettingsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/preferences',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <PreferencesPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <NotificationsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <ProfilePage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/terms-of-use',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TermsOfUsePage />
      </Suspense>
    ),
  },
  {
    path: '/change-password',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <ChangePasswordPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);

