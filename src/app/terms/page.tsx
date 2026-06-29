export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>

      <div className="prose prose-indigo text-gray-500">
        <p className="mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using Pathway to Scripture, you accept and agree to be bound by the terms and provision of this agreement.
          In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
        <p className="mb-4">
          Pathway to Scripture provides users with access to a rich collection of resources, educational content, and community features
          related to scripture study. You understand and agree that the service is provided &quot;AS-IS&quot; and that Pathway to Scripture assumes
          no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. User Conduct</h2>
        <p className="mb-4">
          You agree to use our services only for lawful purposes. You are prohibited from posting on or transmitting through Pathway to Scripture
          any material that is defamatory, threatening, obscene, harmful, or otherwise unlawful or offensive.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Privacy Policy</h2>
        <p className="mb-4">
          Registration data and certain other information about you are subject to our applicable privacy policy. By using our site, you consent
          to the collection and use of this information in accordance with that policy.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Modifications to Service</h2>
        <p className="mb-4">
          Pathway to Scripture reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently,
          the Service (or any part thereof) with or without notice. You agree that Pathway to Scripture shall not be liable to you or to any
          third party for any modification, suspension or discontinuance of the Service.
        </p>
      </div>
    </div>
  );
}
