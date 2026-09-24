import React from 'react'
import { Helmet } from 'react-helmet-async'
import Header from 'components/LandingPage/Header'
import Footer from 'components/LandingPage/Footer'

const PageFrame = ({ title, description, children }) => (
  <div className='full-container'>
    <Helmet>
      <title>{title} | GrantMaestro</title>
      <meta name='description' content={description} />
      <meta name='robots' content='noindex,follow' />
    </Helmet>
    <Header />
    <main style={{ background: '#f7fafc', padding: '72px 20px' }}>
      <article style={{ maxWidth: 920, margin: '0 auto', background: '#fff', borderRadius: 12, padding: '48px', boxShadow: '0 2px 16px rgba(15, 23, 42, 0.08)', color: '#243447', lineHeight: 1.7 }}>
        {children}
      </article>
    </main>
    <Footer />
  </div>
)

const Heading = ({ children }) => <h2 style={{ color: '#163b5c', fontSize: 22, marginTop: 36 }}>{children}</h2>

export const PrivacyPolicyPage = () => (
  <PageFrame title='Privacy Policy' description='GrantMaestro privacy policy and information-handling summary.'>
    <p style={{ color: '#64748b', marginBottom: 8 }}>Last updated: 15 September 2026</p>
    <h1 style={{ color: '#163b5c', fontSize: 36, marginTop: 0 }}>Privacy Policy</h1>
    <p>GrantMaestro is committed to handling personal information responsibly. This policy explains the information we collect when organisations use our website and platform, why we use it, and the choices available to users.</p>
    <Heading>Information we collect</Heading>
    <p>We collect account and organisation information supplied during registration, including contact details, role details, subscription information and the content users add to their workspace, such as grant records, notes, tasks, uploaded documents and support requests. We also collect limited technical information needed to operate, secure and improve the service, such as browser, device, IP-address and log information.</p>
    <Heading>How we use information</Heading>
    <p>We use information to provide and secure GrantMaestro, administer accounts and subscriptions, support users, send requested service communications, maintain audit trails and improve the product. We do not sell personal information.</p>
    <Heading>Service providers and overseas processing</Heading>
    <p>GrantMaestro may use carefully selected providers for hosting, email delivery, payment processing, file storage and AI-assisted drafting. Those providers process only the information needed to perform their services and are subject to their own contractual and security controls. Organisation administrators should avoid entering sensitive personal information into optional AI drafting fields unless they have authority to do so.</p>
    <Heading>Security and retention</Heading>
    <p>We apply reasonable technical and organisational safeguards, including access controls, encrypted credential storage and audit-oriented product design. No online service can guarantee absolute security. We retain information for as long as required to provide the service, meet legal obligations, resolve disputes and maintain appropriate records.</p>
    <Heading>Your organisation’s responsibilities</Heading>
    <p>Customer organisations remain responsible for deciding which users receive access, ensuring their grant data is accurate and lawful to process, and responding to requests from their staff, applicants or other data subjects where applicable.</p>
    <Heading>Access, correction and contact</Heading>
    <p>You may request access to or correction of personal information held about you through our <a href='/contact?topic=privacy'>privacy enquiry form</a>. We may need to verify your identity before responding.</p>
    <Heading>Updates</Heading>
    <p>We may update this policy as GrantMaestro evolves. Material changes will be published on this page with an updated date.</p>
  </PageFrame>
)

export const SupportPage = () => (
  <PageFrame title='Support' description='GrantMaestro support and account assistance.'>
    <p style={{ color: '#64748b', marginBottom: 8 }}>GrantMaestro Support</p>
    <h1 style={{ color: '#163b5c', fontSize: 36, marginTop: 0 }}>How can we help?</h1>
    <p>For account access, billing, subscription, grants workspace or technical support, use the secure <a href='/contact?topic=support'>support enquiry form</a>. Include your organisation name, the email address associated with your account and a brief description of the issue.</p>
    <Heading>Get started in your first week</Heading>
    <p>Begin by adding one live or target funding opportunity, confirming its deadline and assigning an accountable officer. Next, invite the grants, finance and project staff who need to contribute. Use the task work queue to assign the first actions, and use the Acquittal Centre when an awarded grant has evidence, financial reconciliation or submission requirements.</p>
    <Heading>Account access</Heading>
    <p>If you cannot sign in, use the password reset option on the login page first. Invited team members may be asked to set a new password before accessing their workspace.</p>
    <Heading>Before contacting support</Heading>
    <p>For a faster response, include the relevant grant name, the page or action you were using, any displayed error text, and the approximate time the issue occurred. Do not include passwords, payment-card details, secret keys or other credentials.</p>
    <Heading>Response times</Heading>
    <p>We aim to respond to support requests within one to two business days. Enterprise customers may have separate support arrangements documented in their agreement.</p>
    <Heading>Security</Heading>
    <p>Do not submit passwords, payment-card details, secret keys or other credentials. We will never ask you to provide your password.</p>
  </PageFrame>
)

export const TermsOfServicePage = () => (
  <PageFrame title='Terms of Service' description='GrantMaestro platform terms of service.'>
    <p style={{ color: '#64748b', marginBottom: 8 }}>Last updated: 15 September 2026</p>
    <h1 style={{ color: '#163b5c', fontSize: 36, marginTop: 0 }}>Terms of Service</h1>
    <p>These terms govern use of the GrantMaestro website and grant-management platform. By creating an account or using the service, you agree to these terms on behalf of yourself and, where applicable, the organisation you represent.</p>
    <Heading>Service</Heading>
    <p>GrantMaestro provides tools to help organisations organise grant opportunities, tasks, records, documents, reporting and related collaboration. The service supports administrative work; it does not provide legal, financial, tax, funding or professional advice, and it does not guarantee grant eligibility, funding outcomes or compliance results.</p>
    <Heading>Accounts and access</Heading>
    <p>Organisation administrators are responsible for maintaining accurate account details, protecting credentials, assigning appropriate roles and promptly removing access for former staff or contributors. Users must not share accounts or attempt to access information outside their authorised organisation.</p>
    <Heading>Customer content</Heading>
    <p>Your organisation retains ownership of content it enters into GrantMaestro. You grant GrantMaestro the limited right to host, process and display that content only as necessary to operate, secure, support and improve the service. You are responsible for ensuring you have the necessary rights and authority to provide that content.</p>
    <Heading>Subscriptions and payment</Heading>
    <p>Subscription prices, inclusions, overage arrangements and trial conditions are displayed at the time of purchase. Payments are processed by the enabled payment provider. Unless required otherwise by law, fees are non-refundable once a paid period begins. Organisation administrators can contact support about billing questions or account changes.</p>
    <Heading>Acceptable use</Heading>
    <p>You must use the service lawfully, keep submitted information accurate, respect the rights of others and not interfere with the security or availability of GrantMaestro. You must not upload malicious files, attempt unauthorised access or use the service to process information unlawfully.</p>
    <Heading>Availability and liability</Heading>
    <p>We aim to provide a reliable service but cannot guarantee uninterrupted availability. To the extent permitted by law, GrantMaestro’s liability is limited to the fees paid for the affected service during the relevant period. Nothing in these terms excludes rights that cannot be excluded under applicable law.</p>
    <Heading>Changes and contact</Heading>
    <p>We may update these terms as the service evolves. Continued use after an updated version takes effect constitutes acceptance of the updated terms. Questions can be sent through our <a href='/contact'>contact form</a>.</p>
  </PageFrame>
)
