import { LoaderCircle } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground" role="status">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-primary" />
      Loading your dashboard...
    </div>
  );
}
