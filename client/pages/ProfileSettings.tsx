import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { profileStorage, itemStorage } from "@/utils/storage";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { User, Settings, LogOut, ArrowLeft } from "lucide-react";

interface UserProfile {
  name: string;
  email?: string;
  darkMode: boolean;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Student",
    email: "",
    darkMode: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [myItems, setMyItems] = useState(0);

  useEffect(() => {
    const savedProfile = profileStorage.getProfile();
    setProfile(savedProfile);
    setTempProfile(savedProfile);

    // Count user's reports
    const allItems = itemStorage.getItems();
    const userItems = allItems.filter(
      (item) => item.reportedBy === (savedProfile.name || "Student"),
    );
    setMyItems(userItems.length);
  }, []);

  const handleSaveProfile = () => {
    if (!tempProfile.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    profileStorage.updateProfile(tempProfile);
    setProfile(tempProfile);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="md:col-span-2 space-y-8">
            {/* Profile Section */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-8 py-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl">
                    👤
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {profile.name}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Campus Member
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-8 space-y-8">
                {!isEditing ? (
                  <>
                    {/* Display Mode */}
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Personal Information
                      </h2>

                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">
                            Full Name
                          </label>
                          <p className="mt-2 text-foreground font-medium">
                            {profile.name}
                          </p>
                        </div>

                        {profile.email && (
                          <div className="bg-muted/30 rounded-lg p-4 border border-border">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">
                              Email
                            </label>
                            <p className="mt-2 text-foreground font-medium">
                              {profile.email}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setTempProfile(profile);
                        }}
                        className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        Edit Profile
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border"></div>

                    {/* Settings */}
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Settings className="w-5 h-5 text-accent" />
                        Settings
                      </h2>

                      <div className="bg-muted/30 rounded-lg p-4 border border-border flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            Dark Mode
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Use dark theme
                          </p>
                        </div>
                        <div className="w-12 h-6 bg-muted rounded-full relative">
                          <div
                            className={`w-5 h-5 rounded-full absolute top-0.5 left-0.5 transition-all ${
                              profile.darkMode
                                ? "left-6.5 bg-primary"
                                : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit Mode */}
                    <h2 className="text-lg font-bold text-foreground">
                      Edit Profile
                    </h2>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-semibold text-foreground"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={tempProfile.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-semibold text-foreground"
                        >
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={tempProfile.email || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <h3 className="font-bold text-foreground">Your Activity</h3>

              <Link
                to="/items?status=lost"
                className="block bg-destructive/10 rounded-lg p-4 hover:bg-destructive/20 transition-colors text-center"
              >
                <div className="text-2xl font-bold text-destructive">
                  {
                    itemStorage.getItems().filter((i) => i.status === "lost")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground mt-1">Lost Items</p>
              </Link>

              <Link
                to="/items?status=found"
                className="block bg-success/10 rounded-lg p-4 hover:bg-success/20 transition-colors text-center"
              >
                <div className="text-2xl font-bold text-success">
                  {
                    itemStorage.getItems().filter((i) => i.status === "found")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Found Items
                </p>
              </Link>
            </div>

            {/* Actions Card */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="font-bold text-foreground">Quick Actions</h3>

              <Link
                to="/report-lost"
                className="block w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-center text-sm"
              >
                Report Lost Item
              </Link>

              <Link
                to="/report-found"
                className="block w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium text-center text-sm"
              >
                Report Found Item
              </Link>

              <Link
                to="/items"
                className="block w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium text-center text-sm"
              >
                Browse All Items
              </Link>
            </div>

            {/* Info Card */}
            <div className="bg-secondary/10 rounded-2xl border border-secondary/20 p-6">
              <h4 className="font-semibold text-foreground mb-3">💡 Tip</h4>
              <p className="text-sm text-muted-foreground">
                Make sure your name is correct so people can contact you about
                your reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
