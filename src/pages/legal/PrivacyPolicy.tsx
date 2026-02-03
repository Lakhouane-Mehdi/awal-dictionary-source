import React from 'react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1>Privacy Policy</h1>
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2>1. Introduction</h2>
                    <p>
                        We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>2. Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul>
                        <li><strong>Identity Data:</strong> (None currently, unless you contact us).</li>
                        <li><strong>Usage Data:</strong> Information about how you use our website, products and services.</li>
                        <li><strong>Technical Data:</strong> IP address (anonymized), browser type and version, time zone setting and location.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2>3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul>
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2>4. Cookies & Tracking</h2>
                    <p>
                        We use cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
                        You can choose to disable all cookies via the <strong className="text-indigo-500 cursor-pointer">Cookie Settings</strong> in your browser or our consent manager.
                    </p>
                    <p>
                        <strong>Essential Cookies:</strong> Required for the app to function (e.g. remembering your consent choice).<br />
                        <strong>Optional Cookies:</strong> Analytics/Marketing (only active if you opt-in).
                    </p>
                </section>

                <section className="mb-8">
                    <h2>5. International Transfers</h2>
                    <p>
                        We ensure your personal data is protected by requiring all our group companies to follow the same rules when processing your personal data.
                        Whenever we transfer your personal data out of the EEA, we ensure a similar degree of protection is afforded to it.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>6. Your Legal Rights</h2>
                    <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>
                </section>

                <section className="mb-8">
                    <h2>7. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us.
                    </p>
                </section>

            </div>
        </div>
    );
};
