import './bootstrap';
import '../css/app.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { PurchaseProvider } from './Context/PurchaseContext';
import { SharedProvider } from './Context/SharedContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from "@/components/ui/sonner"
import { DateProvider } from './Context/DateProvider';

const appName = import.meta.env.VITE_APP_NAME || 'AyniShop';
const queryClient = new QueryClient();

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const appElement = (
            <QueryClientProvider client={queryClient}>
                <DateProvider>
                    <PurchaseProvider>
                        <SharedProvider>
                            <App {...props} />
                            <Toaster closeButton richColors position="bottom-center" />
                        </SharedProvider>
                    </PurchaseProvider>
                </DateProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        );

        createRoot(el).render(appElement);
    },
    // progress: {
    //     color: '#00c455',
    //     showSpinner: true,
    // },
    progress: false,
});
