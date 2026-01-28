
import {
    Box,
    Database,
    Mail,
    MessageSquare,
    Sheet,
    Cpu,
    Webhook,
    Layers,
    Wrench,
    Grid,
    Server,
    Globe,
    Activity,
    ShoppingCart,
    CreditCard,
    Split,
    Merge,
    GitFork
} from 'lucide-react';
import { clsx } from 'clsx';

interface IconProps {
    app: string;
    size?: number;
    className?: string;
}



// eslint-disable-next-line react-refresh/only-export-components
export const APP_COLORS: Record<string, string> = {
    'google-sheets': '#10b981', // Emerald
    'google-drive': '#f59e0b', // Amber
    'google': '#4285F4',
    'gmail': '#EA4335',
    'slack': '#E01E5A',
    'openai': '#10A37F',
    'notion': '#000000',
    'airtable': '#FCB400',
    'aws': '#FF9900',
    'facebook': '#1877F2',
    'github': '#ffffff',
    'discord': '#5865F2',
    'clickup': '#7B68EE',
    'gemini-ai': '#4dabf7',
    'asana': '#F06A6A',
    'trello': '#0079BF',
    'monday': '#FF3D00',
    'hubspot': '#FF7A59',
    'salesforce': '#00A1E0',
    'pipedrive': '#26292C',
    'activecampaign': '#356AE6',
    'mailchimp': '#FFE01B',
    'shopify': '#96BF48',
    'woocommerce': '#96588A',
    'stripe': '#008CDD',
    'paypal': '#003087',
    'instagram': '#E1306C',
    'linear': '#5E6AD2',
    'intercom': '#1F8CEB',
    'zendesk': '#03363D',
    'mongodb': '#47A248',
    'mysql': '#4479A1',
    'postgresql': '#336791',
    'redis': '#DC382D',
    'pinecone': '#121212',
    'perplexity': '#22B8CF',
    'sendinblue': '#0092FF',
    'telegram': '#26A5E4'
};

// 1. BRAND COLORS (For SVG accents or Fallback Backgrounds)
const BRAND_COLORS: Record<string, string> = {
    'telegram': '#26A5E4',
    'google-drive': '#F4B400',
    'google-sheets': '#0F9D58',
    'google': '#4285F4',
    'gmail': '#EA4335',
    'slack': '#E01E5A',
    'openai': '#10A37F',
    'notion': '#000000',
    'airtable': '#FCB400',
    'aws': '#FF9900',
    'facebook': '#1877F2',
    'github': '#ffffff',
    'discord': '#5865F2',
    'clickup': '#7B68EE',
    'gemini-ai': '#4dabf7',
    'asana': '#F06A6A',
    'trello': '#0079BF',
    'monday': '#FF3D00',
    'hubspot': '#FF7A59',
    'salesforce': '#00A1E0',
    'pipedrive': '#26292C',
    'activecampaign': '#356AE6',
    'mailchimp': '#FFE01B',
    'shopify': '#96BF48',
    'woocommerce': '#96588A',
    'stripe': '#008CDD',
    'paypal': '#003087',
    'instagram': '#E1306C',
    'linear': '#5E6AD2',
    'intercom': '#1F8CEB',
    'zendesk': '#03363D',
    'mongodb': '#47A248',
    'mysql': '#4479A1',
    'postgresql': '#336791',
    'redis': '#DC382D',
    'pinecone': '#121212',
    'perplexity': '#22B8CF',
    'sendinblue': '#0092FF'
};

// 2. SVG PATHS (High Fidelity)
const BRAND_SVGS: Record<string, React.ReactNode> = {
    'google-drive': (
        <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 11.1-19.25a8.96 8.96 0 0 0 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
            <path d="m43.65 25 13.75 23.8-13.75 23.8-13.75-23.8z" fill="#ffba00" />
        </svg>
    ),
    'google-sheets': (
        <svg viewBox="0 0 87 87" xmlns="http://www.w3.org/2000/svg">
            <path d="m58 2.5h-43.5c-4.8 0-8.7 3.9-8.7 8.7v64.6c0 4.8 3.9 8.7 8.7 8.7h58c4.8 0 8.7-3.9 8.7-8.7v-50.8z" fill="#0f9d58" />
            <path d="m58 2.5 23.2 23.2h-23.2z" fill="#a4c639" />
            <path d="m23.2 23.2h40.6v5.8h-40.6zm0 11.6h40.6v5.8h-40.6zm0 11.6h40.6v5.8h-40.6zm0 11.6h23.2v5.8h-23.2z" fill="#fff" />
        </svg>
    ),
    'google-mail': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335" />
        </svg>
    ),
    'openai': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2298V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7913a4.4944 4.4944 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0743a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4593a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#fff" />
        </svg>
    ),
    'slack': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.042 15.123a2.52 2.52 0 0 1 2.52-2.52h2.52v2.52a2.52 2.52 0 0 1-5.04 0zm0-5.04a2.52 2.52 0 0 1-2.52-2.52 2.52 2.52 0 0 1 2.52-2.52h2.52v5.04zm5.04 5.04a2.52 2.52 0 0 1 2.52 2.52 2.52 2.52 0 0 1-2.52 2.52v-5.04zm5.04 0a2.52 2.52 0 0 1-2.52-2.52v-2.52h5.04a2.52 2.52 0 0 1-2.52 2.52zm0-5.04a2.52 2.52 0 0 1 2.52 2.52 2.52 2.52 0 0 1-2.52 2.52h-2.52v-5.04zm-5.04-5.04a2.52 2.52 0 0 1-2.52 2.52v2.52h-5.04a2.52 2.52 0 0 1 2.52-2.52z" fill="#fff" />
            <circle cx="5.042" cy="5.042" r="2.521" fill="#e01e5a" />
            <circle cx="18.958" cy="5.042" r="2.521" fill="#36c5f0" />
            <circle cx="18.958" cy="18.958" r="2.521" fill="#2eb67d" />
            <circle cx="5.042" cy="18.958" r="2.521" fill="#ecb22e" />
        </svg>
    ),
    'aws': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FF9900">
            <path d="M18.4 12.6c-2.4 1.7-5.5 1.1-6.1 1-.5 0-1-.4-1-.9 0-.5.3-.9.8-.9.3 0 5 .8 7.3-.8.4-.3.9-.2 1.2.2.3.4.2.9-.2 1.2.1.1.1.2 0 .2zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.8 14.5c-4.1.3-6.6-2.5-6.6-2.6-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0 .1 0 2.1 2.3 5.4 2 .4 0 .8.3.9.7 0 .5-.3.9-.8 1zm5.5-2.6c0 1-1.3 1.8-2.9 1.8-1.6 0-2.9-.8-2.9-1.8V9.1c0-.9 1.4-1.7 3-1.6 1.5-.1 2.8.7 2.8 1.6v4.8z" />
        </svg>
    ),
    'facebook': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    'github': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    ),
    'discord': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#5865F2">
            <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.2915 18.2915 0 0 0-5.488 0 12.64 12.64 0 0 0-.6173-1.1632.077.077 0 0 0-.079-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1892.3776-.2842a.0748.0748 0 0 1 .0785-.0182c3.9886 1.8305 8.3564 1.8305 12.3087 0a.0739.0739 0 0 1 .0792.0182c.1259.095.2518.19.3777.2842a.077.077 0 0 1-.0077.1276 14.7315 14.7315 0 0 1-1.8732.8923.0769.0769 0 0 0-.0407.1066c.36.6983.7715 1.3621 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
        </svg>
    ),
    'clickup': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#7B68EE">
            <path d="M2.5 13.5C2.5 8.24 6.74 4 12 4c1.1 0 2.15.18 3.12.51.52.18 1.07-.12 1.25-.65.17-.53-.13-1.07-.66-1.25a11.96 11.96 0 0 0-3.71-.61C5.36 2 0 7.36 0 14c0 1.55.3 3.03.86 4.38.2.49.77.72 1.25.52.48-.2.72-.77.52-1.25A9.5 9.5 0 0 1 2.5 13.5z" />
            <path d="M12.78 6.54c-.26-.27-.68-.27-.94 0L7.42 10.8a1.5 1.5 0 0 0-.02 2.12l4.43 4.45c.26.26.68.26.94 0l4.38-4.38a1.5 1.5 0 0 0 0-2.12l-4.37-4.33zM8.5 12l3.83-3.83 3.83 3.83-3.83 3.83L8.5 12z" fill="white" />
            <path d="M21.5 13.5c0-1.55-.3-3.03-.86-4.38-.2-.49-.77-.72-1.25-.52-.48.2-.72.77-.52 1.25.37.9.56 1.88.56 2.9C19.43 18.25 15.68 22 10.5 22c-1.1 0-2.15-.18-3.12-.51-.52-.18-1.07.12-1.25.65-.17.53.13 1.07.66 1.25a11.96 11.96 0 0 0 3.71.61c6.64 0 12-5.36 12-12z" />
        </svg>
    ),
    'notion': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l9.924-.653c1.26-.093 1.636.234 1.636 1.262v13.538c0 1.214-.747 1.495-2.052 2.149l-10.74 5.04c-.747.373-1.68-.094-1.68-1.075V5.515c0-.98.28-1.728.484-1.307zM15.42 16.52l-6.208-3.737v-4.11L15.42 10.9zm-7.61-3.27l1.402.654v4.39l-1.402.7z" />
        </svg>
    ),
    'gemini-ai': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#4dabf7">
            <path d="M21.5 12a9.5 9.5 0 0 1-9.5 9.5c.5-2.5 2.5-4.5 5-5s4.5-2.5 4.5-4.5zm-19 0a9.5 9.5 0 0 1 9.5-9.5c-.5 2.5-2.5 4.5-5 5s-4.5 2.5-4.5 4.5z" />
            <path d="M12 21.5a9.5 9.5 0 0 1 9.5-9.5c-2.5.5-4.5 2.5-5 5s-2.5 4.5-4.5 4.5zm0-19a9.5 9.5 0 0 1-9.5 9.5c2.5-.5 4.5-2.5 5-5s2.5-4.5 4.5-4.5z" />
        </svg>
    ),
    'asana': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#F06A6A">
            <path d="M12 11.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zM7 16.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM17 17.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
        </svg>
    ),
    'airtable': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FCB400">
            <path d="M12 1.5L2.5 6.5l9.5 5 9.5-5-9.5-5zm-9.5 8l9.5 5 9.5-5v8L12 22.5 2.5 17.5v-8z" />
        </svg>
    ),
    'instagram-business': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="6" ry="6" stroke="#E1306C" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="2" fill="none" />
            <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" />
        </svg>
    ),
    'stripe': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#635BFF">
            <path d="M13.9 12.3c0-1.8-1.5-2.5-3.3-2.5-2.8 0-4.4 1-4.4 1l-.7-2.6c.4-.2 1.8-.7 3.8-.7 3.4 0 5.8 1.7 5.8 4.7 0 4.9-6.7 4.1-6.7 6.4 0 .9.8 1.3 2.1 1.3 2 0 3.7-.6 3.7-.6l.6 2.6c-.7.3-2.4.7-4.2.7-3.8 0-5.9-1.9-5.9-4.8.1-4.9 6.8-4 6.8-6.1-.1-.7-.8-1-1.6-1-2.2 0-3.3.6-3.3.6l.5 2.6c.9.2 1.8.4 2.8.4 1.3 0 2.2-.4 2.2-1.4" />
        </svg>
    ),
    'salesforce': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#00A1E0">
            <path d="M16.1 9c.4-1.9-1-3.6-3-4.1-2.1-.5-4.2.8-4.7 2.9-.6-.2-1.2-.2-1.7.1-1.5.8-2.1 2.6-1.3 4.1-1.6.4-2.6 1.9-2.4 3.6.2 1.6 1.6 2.9 3.2 2.9h6.4c1.8 0 3.2-1.4 3.2-3.2 0-.2 0-.4-.1-.6 1.3-.3 2.3-1.4 2.3-2.8.1-1.4-1-2.7-1.9-2.9z" />
        </svg>
    ),
    'mongodb': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#47A248">
            <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm-1 6v12h2V6h-2z" />
        </svg>
    ),
    'mysql': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#4479A1">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 4c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8z" />
        </svg>
    ),
    'paypal': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#003087">
            <path d="M19.05 6.64c-.613-2.58-2.972-4.18-6.195-4.18H5.97c-.43 0-.79.32-.86.75l-2.43 15.36c-.05.3.18.57.48.57h3.45l.93-5.93h.38c4.66 0 8.35-1.9 9.38-6.83.18-.89.26-1.74.2-2.52l-.44-2L19.05 6.64z" />
        </svg>
    ),
    'perplexity': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#22B8CF">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4z" />
        </svg>
    ),
    'pinecone': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#121212">
            <path d="M12 .5L2.4 6 12 11.5 21.6 6 12 .5zm0 23L21.6 18 12 12.5 2.4 18 12 23.5z" />
        </svg>
    ),
    'pipedrive': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">P</text>
            <circle cx="12" cy="12" r="11" fill="#26292C" />
            <text x="12" y="16" fontSize="10" fill="white" textAnchor="middle">P</text>
        </svg>
    ),
    'postgresql': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#336791">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
    ),
    'redis': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#DC382D">
            <path d="M12 0L2 6v12l10 6 10-6V6L12 0zm0 3l8 4.8V16L12 21 4 16.2V7.8L12 3z" />
        </svg>
    ),
    'sendinblue': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0092FF">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7l5 5-5 5V7z" fill="white" />
        </svg>
    ),
    'hubspot': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FF7A59">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M10 7v10l7-5-7-5z" fill="white" />
        </svg>
    ),
    'shopify': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#96BF48">
            <path d="M12.12 1.34L3.8 4.2l1.6 15.6h13.2l1.6-15.6-8.32-2.86zm7.2 4.1L18.4 15.1H5.6L4.68 5.44l7.44-2.5 7.2 2.5z" fill="white" />
            <path d="M9 10c0 1.66 1.34 3 3 3s3-1.34 3-3V8h-6v2z" fill="white" />
        </svg>
    ),
    'woocommerce': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#96588A">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 16.5c-3.1 0-5.5-2.2-5.5-4.8 0-1.7 0-4.7 5.5-4.7s5.5 2.9 5.5 4.7c0 2.6-2.4 4.8-5.5 4.8zm-11 0c-3.1 0-5.5-2.2-5.5-4.8 0-1.7 0-4.7 5.5-4.7s5.5 2.9 5.5 4.7c0 2.6-2.4 4.8-5.5 4.8z" />
        </svg>
    ),
    'activecampaign': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#356AE6">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            <path d="M16.5 12c0-2.5-2-4.5-4.5-4.5S7.5 9.5 7.5 12s2 4.5 4.5 4.5 4.5-2 4.5-4.5z" fill="white" />
        </svg>
    ),
    'mailchimp': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FFE01B">
            <path d="M2.5 12c0-5.2 4.3-9.5 9.5-9.5s9.5 4.3 9.5 9.5-4.3 9.5-9.5 9.5S2.5 17.2 2.5 12z" />
            <path d="M18 10h-2V8h2v2zm-4 4h-4v-2h4v2zm-6-4H6V8h2v2z" fill="#000" />
        </svg>
    ),
    'zoho-crm': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#DC291E">
            <rect x="2" y="2" width="6" height="6" />
            <rect x="9" y="2" width="6" height="6" fill="#0079C1" />
            <rect x="16" y="2" width="6" height="6" fill="#FCC10B" />
            <rect x="9" y="9" width="6" height="6" fill="#009945" />
        </svg>
    ),
    'rabbitmq': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FF6600">
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <path d="M8 8V4h2v4H8zm6-4v4h-2V4h2z" />
        </svg>
    ),
    'telegram': (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#26A5E4">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.96 8.27l-2.062 9.712c-.155.673-.55.839-1.114.522l-3.08-2.268-1.487 1.43c-.163.164-.3.302-.615.302l.219-3.128 5.705-5.152c.248-.22-.054-.342-.385-.122l-7.054 4.442L4.01 13.01c-.675-.21-.687-.675.141-1.002l12.756-4.915c.59-.214 1.106.14.996 1.176z" />
        </svg>
    )
};

export const IconResolver = ({ app, size = 24, className }: IconProps) => {
    const lowerApp = app.toLowerCase();

    // 1. Resolve Brand Key (Normalize complex names)
    let brandKey = lowerApp;
    if (lowerApp.includes('aws')) brandKey = 'aws';
    if (lowerApp.includes('facebook')) brandKey = 'facebook';
    if (lowerApp.includes('github')) brandKey = 'github';
    if (lowerApp.includes('discord')) brandKey = 'discord';
    if (lowerApp.includes('clickup')) brandKey = 'clickup';
    if (lowerApp.includes('notion')) brandKey = 'notion';
    if (lowerApp.includes('gemini') || lowerApp.includes('gemini-ai') || lowerApp.includes('openai-gpt-3') || lowerApp.includes('openai')) brandKey = 'openai';
    if (lowerApp.includes('google-analytics') || lowerApp.includes('bigquery') || lowerApp.includes('calendar')) brandKey = 'google-drive';
    if (lowerApp.includes('instagram')) brandKey = 'instagram-business';
    if (lowerApp.includes('asana')) brandKey = 'asana';
    if (lowerApp.includes('airtable')) brandKey = 'airtable';
    if (lowerApp.includes('stripe')) brandKey = 'stripe';
    if (lowerApp.includes('salesforce')) brandKey = 'salesforce';
    if (lowerApp.includes('mongodb')) brandKey = 'mongodb';
    if (lowerApp.includes('mysql')) brandKey = 'mysql';
    if (lowerApp.includes('paypal')) brandKey = 'paypal';
    if (lowerApp.includes('perplexity')) brandKey = 'perplexity';
    if (lowerApp.includes('pinecone')) brandKey = 'pinecone';
    if (lowerApp.includes('pipedrive')) brandKey = 'pipedrive';
    if (lowerApp.includes('postgresql')) brandKey = 'postgresql';
    if (lowerApp.includes('redis')) brandKey = 'redis';
    if (lowerApp.includes('redis')) brandKey = 'redis';
    if (lowerApp.includes('sendinblue')) brandKey = 'sendinblue';
    if (lowerApp.includes('telegram')) brandKey = 'telegram';

    // 2. Check for official Brand SVG
    const brandSvg = BRAND_SVGS[brandKey] || BRAND_SVGS[app.replace('google-', '').toLowerCase()];

    if (brandSvg) {
        return (
            <div
                className={clsx("flex items-center justify-center p-1 bg-white/10 rounded-lg", className)}
                style={{ width: size, height: size, background: 'rgba(255,255,255,0.05)' }}
            >
                {brandSvg}
            </div>
        );
    }

    // 3. Fallback to Logical Lucide Icons
    let IconComponent = Box;

    // Core Logic Specifics
    if (app === 'builtin') {
        if (lowerApp.includes('iterator')) IconComponent = Split;
        else if (lowerApp.includes('aggregator')) IconComponent = Merge;
        else if (lowerApp.includes('router')) IconComponent = GitFork;
        else if (lowerApp.includes('sleep')) IconComponent = Activity;
        else IconComponent = Layers;
    }
    else if (lowerApp.includes('mail') || lowerApp.includes('gmail')) IconComponent = Mail;
    else if (lowerApp.includes('sheet') || lowerApp.includes('excel')) IconComponent = Sheet;
    else if (lowerApp.includes('drive') || lowerApp.includes('data-store')) IconComponent = Database;
    else if (lowerApp.includes('slack') || lowerApp.includes('discord')) IconComponent = MessageSquare;
    else if (lowerApp.includes('webhook') || lowerApp.includes('http') || lowerApp.includes('gateway')) IconComponent = Webhook;
    else if (lowerApp.includes('ai') || lowerApp.includes('gpt')) IconComponent = Cpu;
    else if (lowerApp.includes('builtin') || lowerApp.includes('core')) IconComponent = Layers;
    else if (lowerApp.includes('tools') || lowerApp.includes('util')) IconComponent = Wrench;
    else if (lowerApp.includes('server')) IconComponent = Server;
    else if (lowerApp.includes('web')) IconComponent = Globe;
    else if (lowerApp.includes('analytics')) IconComponent = Activity;
    else if (lowerApp.includes('shop') || lowerApp.includes('commerce')) IconComponent = ShoppingCart;
    else if (lowerApp.includes('pay') || lowerApp.includes('stripe')) IconComponent = CreditCard;

    // Core Tools Special
    if (lowerApp.includes('core tools')) IconComponent = Grid;

    // 4. "Avatar" Fallback for unknown brands
    const isGeneric = ['builtin', 'tools', 'util', 'core'].some(k => lowerApp.includes(k));

    if (!isGeneric && !BRAND_SVGS[brandKey] && !lowerApp.includes('webhook')) {
        const initials = app.substring(0, 2).toUpperCase();
        const color = BRAND_COLORS[lowerApp.split(':')[0]] || '#94a3b8';

        return (
            <div
                className={clsx("flex items-center justify-center rounded-lg font-bold text-white text-[9px]", className)}
                style={{ width: size, height: size, backgroundColor: color }}
            >
                {initials}
            </div>
        );
    }

    const color = BRAND_COLORS[brandKey] || BRAND_COLORS[lowerApp.split(':')[0]] || '#94a3b8';

    return <IconComponent size={size} color={color} className={className} />;
};
