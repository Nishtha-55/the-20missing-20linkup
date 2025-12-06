import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { itemStorage } from "@/utils/storage";

const CATEGORIES = [
  { id: "id-cards", label: "ID Cards", icon: "🆔" },
  { id: "electronics", label: "Electronics", icon: "📱" },
  { id: "books", label: "Books", icon: "📚" },
  { id: "accessories", label: "Accessories", icon: "👜" },
  { id: "others", label: "Others", icon: "📦" },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would be implemented in the items dashboard
    window.location.href = `/items?search=${encodeURIComponent(searchQuery)}`;
  };

  const allItems = itemStorage.getItems();
  const lostCount = allItems.filter((item) => item.status === "lost").length;
  const foundCount = allItems.filter((item) => item.status === "found").length;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Find Your Lost Items
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  A modern, community-driven platform to report and recover lost
                  items across campus.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/report-lost"
                  className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl text-center"
                >
                  Report Lost Item
                </Link>
                <Link
                  to="/report-found"
                  className="px-6 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl text-center"
                >
                  Report Found Item
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {lostCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Lost Items
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">
                    {foundCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Found Items
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Illustration Placeholder */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center">
                  <div className="text-8xl">🎓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-slate-950 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Search items by name, category, or location
            </label>
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Quick Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse items by category or view all recent reports
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/items?category=${category.id}`}
                className="group relative bg-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-border hover:border-primary/20 hover:bg-primary/5"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl">{category.icon}</span>
                  <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                    {category.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
            <Link
              to="/items"
              className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              View All Items
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Easy Reporting
              </h3>
              <p className="text-muted-foreground text-sm">
                Report lost or found items in seconds with our simple form.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Smart Search
              </h3>
              <p className="text-muted-foreground text-sm">
                Find your items quickly with our powerful search and filters.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Direct Contact
              </h3>
              <p className="text-muted-foreground text-sm">
                Connect with finders or losers directly to claim your items.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
