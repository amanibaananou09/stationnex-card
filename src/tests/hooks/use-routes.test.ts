import {renderHook} from '@testing-library/react-hooks';
import {Layout} from 'common/enums';
import useRoutes from "../../hooks/use-routes";
import {RouteConfig} from "common/model";
import {createElement} from "react";

// Mock useAuth hook
jest.mock('store/AuthContext', () => ({
    useAuth: () => ({ isSignedIn: false }),
}));

// Helper to set window.location.href
const setHref = (href: string) => {
    Object.defineProperty(window, 'location', {
        value: { href },
        writable: true,
    });
};

// Sample routes for testing
const sampleRoutes: RouteConfig[] = [
    {
        name: 'Home',
        layout: '/admin',
        path: '/dashboard',
        component: () => createElement('div'),
    },
    {
        name: 'Profile',
        layout: '/admin',
        path: '/profile',
        component: () => createElement('div'),
    },
    {
        name: 'Auth',
        layout: '/auth',
        path: '/login',
        component: () => createElement('div'),
    },
    {
        name: 'Nested',
        collapse: true,
        views: [
            {
                name: 'NestedChild',
                layout: '/admin',
                path: '/nested',
                component: () => createElement('div'),
            },
        ],
    },
];

describe('useRoutes hook functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getActiveRoute', () => {
        it('returns the correct route name when URL matches a route', () => {
            setHref('http://localhost/admin/dashboard');
            const { result } = renderHook(() => useRoutes());
            const { getActiveRoute } = result.current;

            const activeRoute = getActiveRoute(sampleRoutes);
            expect(activeRoute).toBe('Home');
        });

        it('returns Default Brand Text if no route matches', () => {
            setHref('http://localhost/unknown');
            const { result } = renderHook(() => useRoutes());
            const { getActiveRoute } = result.current;

            const activeRoute = getActiveRoute(sampleRoutes);
            expect(activeRoute).toBe('Default Brand Text');
        });
    });

    describe('getActiveNavbar', () => {
        it('returns false if no matching route', () => {
            setHref('http://localhost/unknown');
            const { result } = renderHook(() => useRoutes());
            const { getActiveNavbar } = result.current;

            const activeNavbar = getActiveNavbar(sampleRoutes);
            expect(activeNavbar).toBe(false);
        });

        it('returns secondaryNavbar value if route has it', () => {
            const routesWithNavbar = [
                {
                    name: 'WithNavbar',
                    layout: '/admin',
                    path: '/with-navbar',
                    secondaryNavbar: true,
                },
            ];
            setHref('http://localhost/admin/with-navbar');
            const { result } = renderHook(() => useRoutes());
            const { getActiveNavbar } = result.current;

            const activeNavbar = getActiveNavbar(routesWithNavbar);
            expect(activeNavbar).toBe(true);
        });

        it('handles nested views correctly', () => {
            const nestedRoutes = [
                {
                    name: 'Parent',
                    collapse: true,
                    views: [
                        {
                            name: 'Child',
                            layout: '/admin',
                            path: '/child',
                        },
                    ],
                },
            ];
            setHref('http://localhost/admin/child');
            const { result } = renderHook(() => useRoutes());
            const { getActiveNavbar } = result.current;

            const navbarState = getActiveNavbar(nestedRoutes);
            expect(navbarState).toBe(false);
        });
    });

    describe('getReactRoutes', () => {
        it('generates routes correctly when user is not signed in and layout is AUTH', () => {
            setHref('http://localhost/auth/login');
            const { result } = renderHook(() => useRoutes());
            const { getReactRoutes } = result.current;

            // Force isSignedIn to false explicitly
            jest.mock('store/AuthContext', () => ({
                useAuth: () => ({ isSignedIn: false }),
            }));

            const routes = getReactRoutes(sampleRoutes, Layout.AUTH);
            // Expect routes to include only auth routes
            expect(routes.length).toBeGreaterThan(0);
            // Check that the route path appears
            expect(routes.some((r: { props: { path: string | string[]; }; }) => r.props?.path?.includes('/login'))).toBe(true);
        });
    });
});