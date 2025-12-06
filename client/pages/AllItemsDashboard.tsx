import { Layout } from "@/components/Layout";
import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { itemStorage, LostFoundItem } from "@/utils/storage";
import { Search, Filter } from "lucide-react";

const CATEGORIES = [
  { id: "id-cards", label: "ID Cards", icon: "🆔" },
  { id: "electronics", label: "Electronics", icon: "📱" },
  { id: "books", label: "Books", icon: "📚" },
  { id: "accessories", label: "Accessories", icon: "👜" },
  { id: "others", label: "Others", icon: "📦" },
];

export default function AllItemsDashboard() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );
  const [sortBy, setSortBy] = useState("recent");

  const allItems = itemStorage.getItems();

  const filteredItems = useMemo(() => {
    let items = [...allItems];

    // Search filter
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      items = items.filter((item) => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter) {
      items = items.filter((item) => item.status === statusFilter);
    }

    // Sorting
    if (sortBy === "recent") {
      items.sort(
        (a, b) =>
          new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
      );
    } else if (sortBy === "oldest") {
      items.sort(
        (a, b) =>
          new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
      );
    } else if (sortBy === "date-lost-recent") {
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return items;
  }, [allItems, searchQuery, categoryFilter, statusFilter, sortBy]);

  const getCategoryIcon = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId)?.icon || "📦";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Items
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse all lost and found items on campus
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-2xl p-6 mb-8 border border-border space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by name, description, or location..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              >
                <option value="">All Items</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              >
                <option value="recent">Recently Reported</option>
                <option value="oldest">Oldest First</option>
                <option value="date-lost-recent">Recently Lost/Found</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || categoryFilter || statusFilter) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("");
                    setStatusFilter("");
                    setSortBy("recent");
                  }}
                  className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold">{filteredItems.length}</span>{" "}
            {filteredItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {getCategoryIcon(item.category)}
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        item.status === "lost"
                          ? "bg-destructive"
                          : "bg-success"
                      }`}
                    >
                      {item.status === "lost" ? "Lost" : "Found"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Name */}
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Category Tag */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {getCategoryIcon(item.category)}
                    </span>
                    <span className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {CATEGORIES.find((c) => c.id === item.category)?.label ||
                        "Other"}
                    </span>
                  </div>

                  {/* Location and Date */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      📍 {item.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.status === "lost" ? "Lost on" : "Found on"}:{" "}
                      {formatDate(item.date)}
                    </p>
                  </div>

                  {/* Reported By */}
                  <p className="text-xs text-muted-foreground">
                    Reported by: {item.reportedBy}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No items found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
