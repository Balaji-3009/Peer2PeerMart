import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <Button
          variant="outline"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-4">When you use Campus Marketplace, we collect:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Account information (name, email, college affiliation)</li>
              <li>Listings you create (items, descriptions, prices)</li>
              <li>Messages between buyers and sellers</li>
              <li>Usage data and analytics</li>
              <li>Device information for security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. How We Use Information
            </h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide and improve our services</li>
              <li>Verify student status and prevent fraud</li>
              <li>Facilitate communication between users</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Ensure compliance with our Terms and Conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Data Sharing</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Other users as necessary for transactions (e.g., showing your
                name with listings)
              </li>
              <li>Service providers who assist in platform operations</li>
              <li>College administrators for verification purposes</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your
              information. However, no online platform can guarantee absolute
              security. You are responsible for maintaining the confidentiality
              of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
            <p className="mb-4">You may:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Access, update, or delete your account information</li>
              <li>Opt-out of non-essential communications</li>
              <li>Request a copy of your personal data</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Cookies and Tracking
            </h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your
              experience, analyze usage, and prevent fraud. You can manage
              cookie preferences in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              7. Changes to This Policy
            </h2>
            <p className="mb-4">
              We may update this policy periodically. Continued use of the
              service after changes constitutes acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
            <p>
              For privacy-related inquiries, please contact our Data Protection
              Officer at privacy@campusmarketplace.edu
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
