import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsPage() {
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
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Campus Marketplace, a peer-to-peer platform for college
              students to buy and sell used items. By accessing or using our
              service, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
            <p className="mb-4">
              You must be a currently enrolled college student with a valid .edu
              email address to use this platform. You are responsible for
              maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Prohibited Items</h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Alcohol, tobacco, or any illegal substances</li>
              <li>Weapons or dangerous items</li>
              <li>Counterfeit or stolen goods</li>
              <li>
                Items that violate copyright or intellectual property rights
              </li>
              <li>Any item prohibited by your college/university policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Transactions</h2>
            <p className="mb-4">
              Campus Marketplace is not responsible for any transactions between
              buyers and sellers. All negotiations, payments, and exchanges are
              solely between the involved parties. We recommend meeting in safe,
              public locations on campus for exchanges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Content Responsibility
            </h2>
            <p className="mb-4">
              You are solely responsible for the accuracy and legality of any
              content you post. We reserve the right to remove any listings that
              violate these terms without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Limitation of Liability
            </h2>
            <p className="mb-4">
              Campus Marketplace shall not be liable for any damages resulting
              from the use or inability to use the service, unauthorized access
              to your account, or any content posted by users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
            <p className="mb-4">
              We may modify these terms at any time. Continued use of the
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p>
              For questions about these Terms, please contact us at
              support@campusmarketplace.edu
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
