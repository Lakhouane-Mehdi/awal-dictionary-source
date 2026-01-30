import React from 'react';

export const Imprint: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1>Imprint (Impressum)</h1>
                <p className="text-sm text-gray-500">Legal Disclosure according to § 5 TMG</p>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 my-8">
                    <h3 className="mt-0">Operator</h3>
                    <p>
                        <strong>Tamazight App Project</strong><br />
                        Address Line 1<br />
                        12345 City, Country
                    </p>

                    <h3>Contact</h3>
                    <p>
                        Email: contact@example.com<br />
                        Phone: +00 123 456789
                    </p>

                    <h3>Responsible for Content (according to § 55 Abs. 2 RStV)</h3>
                    <p>
                        John Doe<br />
                        Address as above
                    </p>
                </div>

                <h3>Dispute Resolution</h3>
                <p>
                    The European Commission provides a platform for online dispute resolution (OS): <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.<br />
                    We are not willing or obliged to participate in dispute settlement proceedings before a consumer arbitration board.
                </p>

                <h3>Liability for Contents</h3>
                <p>
                    As service providers, we are liable for own contents of these websites according to Sec. 7, paragraph 1 German Telemedia Act (TMG). However, according to Sec. 8 to 10 TMG, service providers are not obligated to permanently monitor submitted or stored information or to search for evidences that indicate illegal activities.
                </p>
            </div>
        </div>
    );
};
