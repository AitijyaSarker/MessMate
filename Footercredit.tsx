

import React from 'react';


const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9-22.35 22.35 0 01-2.949-2.585 22.35 22.35 0 01-2.043-3.235A22.045 22.045 0 01.5 8.25c0-1.848 1.492-3.34 3.34-3.34.823 0 1.587.324 2.146.866l.044.045.03.03.04.04 1.48 1.48 1.48-1.48.04-.04.03-.03.045-.045.044-.046A3.332 3.332 0 0115.16 4.91c1.848 0 3.34 1.492 3.34 3.34 0 .866-.328 1.666-.885 2.378a22.045 22.045 0 01-2.043 3.235 22.35 22.35 0 01-2.949 2.585 22.35 22.35 0 01-2.582 1.9 20.759 20.759 0 01-1.162.682l-.019.01-.005.003h-.002z" />
    </svg>
);

interface FooterCreditProps {
    name: string;
    link: string;
}

export const FooterCredit: React.FC<FooterCreditProps> = ({ name, link }) => {
    const currentYear = new Date().getFullYear();

    return (
        // MODIFIED: Padding and text size reduced significantly
        <div className="pt-3 px-2 pb-2 text-center text-[11px] text-slate-500 leading-relaxed">
            <div className="flex items-center justify-center space-x-1">
                <span>Made with</span>
                <HeartIcon className="h-3.5 w-3.5 text-red-500" />
                <span>by</span>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-400 hover:text-white transition-colors"
                >
                    {name}
                </a>
            </div>
            <p className="mt-1">&copy; {currentYear} {name}. All Rights Reserved.</p>
        </div>
    );
};