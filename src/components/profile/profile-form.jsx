"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CircleAlert,
  LoaderCircle,
  LogOut,
  Pencil,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/server-api";
import { Button } from "@/components/ui/button";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const initialProfile = {
  name: "",
  image: "",
  email: "",
  role: "customer",
  isBlocked: false,
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  city: "",
  country: "",
  createdAt: null,
};

function isValidDateOfBirth(value) {
  if (!value) return true;
  const date = new Date(`${value}T00:00:00.000Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === value
    && date <= new Date();
}

function ProfileField({ children, className = "", htmlFor, label }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

const inputClassName = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70";

function formatMemberSince(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function formatDateOfBirth(value) {
  if (!value) return "Not provided";
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime())
    ? "Not provided"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function ProfileDetail({ label, value }) {
  return (
    <div className="min-w-0 border-b py-3 last:border-0 sm:py-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium">{value || "Not provided"}</dd>
    </div>
  );
}

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const inputRef = useRef(null);
  const user = session?.user;
  const userId = user?.id;

  const loadProfile = async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await apiRequest("/api/profile");
      const loadedProfile = { ...initialProfile, ...result.data };
      setProfile(loadedProfile);
      setDraft(loadedProfile);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "We couldn't load your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    if (!userId) {
      router.replace("/sign-in?next=/dashboard/profile");
      return;
    }

    let active = true;
    apiRequest("/api/profile")
      .then((result) => {
        if (active) {
          const loadedProfile = { ...initialProfile, ...result.data };
          setProfile(loadedProfile);
          setDraft(loadedProfile);
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "We couldn't load your profile.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isPending, userId, router]);

  const updateField = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleImageChange = async (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Choose an image smaller than 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/profile-image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result?.url) {
        throw new Error(result?.error || "We couldn't upload your photo.");
      }
      setDraft((current) => ({ ...current, image: result.url }));
      toast.success("Profile photo uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't upload your photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextProfile = {
      name: draft.name.trim(),
      image: draft.image.trim(),
      phoneNumber: draft.phoneNumber.trim(),
      gender: draft.gender,
      dateOfBirth: draft.dateOfBirth,
      city: draft.city.trim(),
      country: draft.country.trim(),
    };

    if (!nextProfile.name || nextProfile.name.length > 100) {
      toast.error("Enter a name between 1 and 100 characters.");
      return;
    }
    if (
      nextProfile.phoneNumber.length > 30
      || !/^[+0-9().\-\s]*$/.test(nextProfile.phoneNumber)
      || (nextProfile.phoneNumber && nextProfile.phoneNumber.replace(/\D/g, "").length < 7)
      || nextProfile.phoneNumber.replace(/\D/g, "").length > 20
    ) {
      toast.error("Enter a valid phone number.");
      return;
    }
    if (!isValidDateOfBirth(nextProfile.dateOfBirth)) {
      toast.error("Enter a valid date of birth that is not in the future.");
      return;
    }
    if (nextProfile.city.length > 80 || nextProfile.country.length > 80) {
      toast.error("City and country must be 80 characters or fewer.");
      return;
    }
    if (nextProfile.image) {
      try {
        const imageURL = new URL(nextProfile.image);
        if (!["http:", "https:"].includes(imageURL.protocol)) throw new Error();
      } catch {
        toast.error("Enter a valid HTTP or HTTPS profile image URL.");
        return;
      }
    }

    setIsSaving(true);
    try {
      await apiRequest("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(nextProfile),
      });
      const savedProfile = { ...profile, ...nextProfile };
      setProfile(savedProfile);
      setDraft(savedProfile);
      setIsEditing(false);
      await authClient.getSession();
      toast.success("Your profile has been updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message || "We couldn't sign you out.");
      toast.success("You have signed out.");
      router.replace("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't sign you out.");
      setIsSigningOut(false);
    }
  };

  const cancelEditing = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  if (isPending || !user || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
        Loading your profile...
      </div>
    );
  }

  if (loadError) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border bg-card p-8 text-center shadow-sm">
        <CircleAlert aria-hidden="true" className="mx-auto size-7 text-destructive" />
        <h1 className="mt-3 text-lg font-semibold">Profile unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
        <Button className="mt-5" onClick={loadProfile} variant="outline">Try again</Button>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>

      <section className="mt-5 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full border bg-muted sm:size-20">
            <Image
              alt={`${profile.name || "User"} profile photo`}
              className="object-cover"
              fill
              sizes="80px"
              src={profile.image || "/avatar-default.svg"}
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold">{profile.name || "SalonBook user"}</h2>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
              {profile.role}
            </span>
          </div>
          {!isEditing ? (
            <Button
              className="gap-2 self-start sm:self-center"
              onClick={() => {
                setDraft(profile);
                setIsEditing(true);
              }}
              variant="outline"
            >
              <Pencil aria-hidden="true" />
              Edit Profile
            </Button>
          ) : (
            <Button className="self-start sm:self-center" onClick={cancelEditing} variant="outline">
              Cancel
            </Button>
          )}
        </div>
      </section>

      {isEditing ? (
        <form className="mt-5" onSubmit={handleSubmit}>
          <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="font-semibold">Edit personal details</h2>
              <p className="mt-1 text-sm text-muted-foreground">Email, account type, and status cannot be edited.</p>
            </div>

            <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-full border bg-muted">
                <Image alt="Profile photo preview" className="object-cover" fill sizes="80px" src={draft.image || "/avatar-default.svg"} unoptimized />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Profile photo</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or WEBP, up to 5 MB.</p>
                <Button
                  className="mt-3 gap-2"
                  disabled={isUploading || isSaving}
                  onClick={() => inputRef.current?.click()}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {isUploading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Camera aria-hidden="true" />}
                  {isUploading ? "Uploading..." : "Upload new photo"}
                </Button>
                <input accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleImageChange} ref={inputRef} type="file" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <ProfileField htmlFor="profile-name" label="Full name">
                <div className="relative">
                  <UserRound aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input autoComplete="name" className={`${inputClassName} pl-10`} id="profile-name" maxLength={100} onChange={updateField("name")} required value={draft.name} />
                </div>
              </ProfileField>
              <ProfileField htmlFor="profile-email" label="Email address">
                <input autoComplete="email" className={inputClassName} id="profile-email" readOnly value={draft.email} />
              </ProfileField>
              <ProfileField htmlFor="profile-phone" label="Phone number">
                <input autoComplete="tel" className={inputClassName} id="profile-phone" maxLength={30} onChange={updateField("phoneNumber")} placeholder="+880 1XXX-XXXXXX" type="tel" value={draft.phoneNumber} />
              </ProfileField>
              <ProfileField htmlFor="profile-gender" label="Gender (optional)">
                <select className={inputClassName} id="profile-gender" onChange={updateField("gender")} value={draft.gender}>
                  <option value="">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </ProfileField>
              <ProfileField htmlFor="profile-birthday" label="Date of birth (optional)">
                <input className={inputClassName} id="profile-birthday" max={new Date().toISOString().slice(0, 10)} onChange={updateField("dateOfBirth")} type="date" value={draft.dateOfBirth} />
              </ProfileField>
              <ProfileField htmlFor="profile-city" label="City (optional)">
                <input autoComplete="address-level2" className={inputClassName} id="profile-city" maxLength={80} onChange={updateField("city")} value={draft.city} />
              </ProfileField>
              <ProfileField className="sm:col-span-2" htmlFor="profile-country" label="Country (optional)">
                <input autoComplete="country-name" className={inputClassName} id="profile-country" maxLength={80} onChange={updateField("country")} value={draft.country} />
              </ProfileField>
              <ProfileField className="sm:col-span-2" htmlFor="profile-image-url" label="Or paste a profile image URL">
                <input className={inputClassName} id="profile-image-url" onChange={updateField("image")} placeholder="https://example.com/photo.jpg" type="url" value={draft.image} />
              </ProfileField>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                className="self-start text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                onClick={() => setDraft((current) => ({ ...current, image: "" }))}
                type="button"
              >
                Use default avatar
              </button>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button onClick={cancelEditing} type="button" variant="outline">Cancel</Button>
                <Button className="gap-2" disabled={isSaving || isUploading} type="submit">
                  {isSaving ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
                  {isSaving ? "Saving changes..." : "Save changes"}
                </Button>
              </div>
            </div>
          </section>
        </form>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            <h2 className="font-semibold">Personal Details</h2>
            <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <ProfileDetail label="Full Name" value={profile.name} />
              <ProfileDetail label="Email Address (read-only)" value={profile.email} />
              <ProfileDetail label="Phone Number" value={profile.phoneNumber} />
              <ProfileDetail
                label="Gender"
                value={{
                  female: "Female",
                  male: "Male",
                  "non-binary": "Non-binary",
                  "prefer-not-to-say": "Prefer not to say",
                }[profile.gender]}
              />
              <ProfileDetail label="Date of Birth" value={formatDateOfBirth(profile.dateOfBirth)} />
              <ProfileDetail
                label="Address"
                value={[profile.city, profile.country].filter(Boolean).join(", ")}
              />
            </dl>
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck aria-hidden="true" className="size-4" />
              </span>
              <h2 className="font-semibold">Account Details</h2>
            </div>
            <dl className="mt-3">
              <ProfileDetail label="Account Type" value={profile.role} />
              <ProfileDetail label="Member Since" value={formatMemberSince(profile.createdAt)} />
              <div className="border-b py-3 last:border-0 sm:py-4">
                <dt className="text-sm text-muted-foreground">Account Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${profile.isBlocked ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}>
                    <span className={`size-1.5 rounded-full ${profile.isBlocked ? "bg-destructive" : "bg-emerald-600"}`} />
                    {profile.isBlocked ? "Blocked" : "Active"}
                  </span>
                </dd>
              </div>
            </dl>
            <Button
              className="mt-5 w-full gap-2 text-destructive hover:text-destructive"
              disabled={isSigningOut}
              onClick={handleSignOut}
              variant="outline"
            >
              {isSigningOut ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <LogOut aria-hidden="true" />}
              {isSigningOut ? "Signing out..." : "Sign out"}
            </Button>
          </section>
        </div>
      )}
    </div>
  );
}
