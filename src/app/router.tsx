import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { UserPreferences } from '@/types';

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
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage').then(m => ({ default: m.default })));
const ChangePasswordPage = lazy(() => import('@/pages/profile/ChangePasswordPage').then(m => ({ default: m.default })));
const GroupSettingsPage = lazy(() => import('@/pages/settings/GroupSettingsPage').then(m => ({ default: m.default })));
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.default })));
const AboutUsPage = lazy(() => import('@/pages/about/AboutUsPage').then(m => ({ default: m.default })));
const InvitationsPage = lazy(() => import('@/pages/InvitationsPage').then(m => ({ default: m.default })));

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  console.log('[ProtectedRoute] Component rendering');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  const preferencesLoaded = useAuthStore((state) => state.preferencesLoaded);
  
  React.useEffect(() => {
    console.log('[ProtectedRoute] useEffect - State changed:');
    console.log('  - isInitialized:', isInitialized);
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - Current pathname:', window.location.pathname);
  }, [isInitialized, isAuthenticated]);
  
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
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] NOT authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  const currentPath = window.location.pathname;
  const preferences = (user as { preferences?: UserPreferences } | null)?.preferences;
  const hasPreferences =
    !!preferences &&
    (
      (preferences.culture?.length ?? 0) > 0 ||
      (preferences.entertainment?.length ?? 0) > 0 ||
      (preferences.placeTypes?.length ?? 0) > 0 ||
      preferences.likesGastronomy ||
      preferences.likesShopping
    );

  if (!preferencesLoaded) {
    console.log('[ProtectedRoute] Waiting for preferences to load...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E0652]"></div>
      </div>
    );
  }

  if (!hasPreferences && currentPath !== '/preferences') {
    console.log('[ProtectedRoute] User missing preferences, redirecting to /preferences');
    return <Navigate to="/preferences" replace />;
  }

  console.log('[ProtectedRoute] Rendering: Protected content');
  return <>{children}</>;
}

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E0652]"></div>
  </div>
);

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
      <GuestRoute>
        <Suspense fallback={<LoadingFallback />}>
          <LoginPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        <Suspense fallback={<LoadingFallback />}>
          <RegisterPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <GuestRoute>
        <Suspense fallback={<LoadingFallback />}>
          <ResetPasswordPage />
        </Suspense>
      </GuestRoute>
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
    path: '/privacy-policy',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PrivacyPolicyPage />
      </Suspense>
    ),
  },
  {
    path: '/about-us',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AboutUsPage />
      </Suspense>
    ),
  },
  {
    path: '/invitations',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <InvitationsPage />
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

