import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <div className="text-9xl">404</div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground">
              Sorry! The page you're looking for doesn't exist or has been removed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              to="/items"
              className="px-6 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 transition-colors"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
