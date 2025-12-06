import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { itemStorage } from "@/utils/storage";
import { Toast } from "@/components/ui/toast";
import { toast } from "sonner";
import { Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { id: "id-cards", label: "ID Cards" },
  { id: "electronics", label: "Electronics" },
  { id: "books", label: "Books" },
  { id: "accessories", label: "Accessories" },
  { id: "others", label: "Others" },
];

interface FormData {
  itemName: string;
  category: string;
  lastSeenLocation: string;
  dateLost: string;
  description: string;
  image?: string;
}

export default function ReportLostItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    category: "others",
    lastSeenLocation: "",
    dateLost: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.itemName ||
      !formData.lastSeenLocation ||
      !formData.dateLost ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const profile = localStorage.getItem("userProfile");
      const profileData = profile
        ? JSON.parse(profile)
        : { name: "Anonymous Student" };

      itemStorage.addItem({
        name: formData.itemName,
        category: formData.category,
        location: formData.lastSeenLocation,
        date: formData.dateLost,
        description: formData.description,
        image: formData.image,
        status: "lost",
        reportedBy: profileData.name,
      });

      toast.success("Lost item reported successfully!");
      setTimeout(() => {
        navigate("/items?status=lost");
      }, 1500);
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Report Lost Item
          </h1>
          <p className="text-lg text-muted-foreground">
            Help others find your lost item by providing detailed information
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Item Name */}
            <div className="space-y-3">
              <label htmlFor="itemName" className="block text-sm font-semibold text-foreground">
                Item Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g., Blue Backpack, Samsung Galaxy S24"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-foreground"
              >
                Category <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Last Seen Location */}
            <div className="space-y-3">
              <label
                htmlFor="lastSeenLocation"
                className="block text-sm font-semibold text-foreground"
              >
                Last Seen Location <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="lastSeenLocation"
                name="lastSeenLocation"
                value={formData.lastSeenLocation}
                onChange={handleChange}
                placeholder="e.g., Library 3rd floor, Student Center"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Date Lost */}
            <div className="space-y-3">
              <label htmlFor="dateLost" className="block text-sm font-semibold text-foreground">
                Date Lost <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                id="dateLost"
                name="dateLost"
                value={formData.dateLost}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-foreground"
              >
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item in detail (color, size, distinguishing features, etc.)"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">
                Upload Image (Optional)
              </label>
              <div className="relative border-2 border-dashed border-border rounded-xl p-8 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div>
                    <p className="font-medium text-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground">or drag and drop</p>
                  </div>
                  {formData.image && (
                    <p className="text-xs text-success font-medium">Image selected ✓</p>
                  )}
                </div>
              </div>
              {formData.image && (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
              <Link
                to="/"
                className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
