import { Layout } from "@/components/Layout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { itemStorage, LostFoundItem } from "@/utils/storage";
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, MapPin, Calendar, User, Tag } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "id-cards", label: "ID Cards", icon: "🆔" },
  { id: "electronics", label: "Electronics", icon: "📱" },
  { id: "books", label: "Books", icon: "📚" },
  { id: "accessories", label: "Accessories", icon: "👜" },
  { id: "others", label: "Others", icon: "📦" },
];

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundItem = itemStorage.getItemById(id);
      setItem(foundItem);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin">⏳</div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Item not found
            </h1>
            <p className="text-muted-foreground mb-6">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/items"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Items
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[4];
  };

  const categoryInfo = getCategoryInfo(item.category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(item.reportedBy);
    toast.success("Contact info copied!");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - Large Image */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-24">
              <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl">{categoryInfo.icon}</span>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold text-white ${
                      item.status === "lost" ? "bg-destructive" : "bg-success"
                    }`}
                  >
                    {item.status === "lost" ? "LOST" : "FOUND"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {item.name}
              </h1>

              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold flex items-center gap-2">
                  <span>{categoryInfo.icon}</span>
                  {categoryInfo.label}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-2xl p-6 border border-border space-y-3">
              <h2 className="text-lg font-bold text-foreground">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="bg-card rounded-2xl p-6 border border-border space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {item.status === "lost" ? "Last Seen" : "Found at"}
                </h3>
                <p className="text-muted-foreground">{item.location}</p>
              </div>

              {/* Date */}
              <div className="bg-card rounded-2xl p-6 border border-border space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  {item.status === "lost" ? "Date Lost" : "Date Found"}
                </h3>
                <p className="text-muted-foreground">{formatDate(item.date)}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 space-y-4">
              <h2 className="text-lg font-bold text-foreground">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="bg-card rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Reported by
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">
                      {item.reportedBy}
                    </p>
                    <button
                      onClick={handleCopyToClipboard}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Copy name"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                </div>

                {item.status === "lost" ? (
                  <div className="bg-primary/10 text-primary rounded-xl p-4 border border-primary/20 text-sm">
                    <p className="font-medium">💡 If you found this item:</p>
                    <p className="mt-2">
                      Please contact the person above through the campus
                      directory or report it through the "Report Found Item"
                      feature and we'll help match it.
                    </p>
                  </div>
                ) : (
                  <div className="bg-success/10 text-success rounded-xl p-4 border border-success/20 text-sm">
                    <p className="font-medium">✓ Item found!</p>
                    <p className="mt-2">
                      If this is your item, please contact the person above to
                      arrange a pickup or delivery.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Link
                  to={`/items?category=${item.category}`}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-center text-sm"
                >
                  Similar Items
                </Link>
                <Link
                  to="/items"
                  className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium text-center text-sm"
                >
                  Back to All Items
                </Link>
              </div>
            </div>

            {/* Report Details */}
            <div className="text-xs text-muted-foreground border-t border-border pt-6">
              <p>Reported on: {formatDate(item.reportedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
