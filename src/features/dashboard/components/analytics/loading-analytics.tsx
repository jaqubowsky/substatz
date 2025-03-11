export const LoadingAnalytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
        <div className="h-10 w-48 bg-muted animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-muted animate-pulse rounded"></div>
        <div className="h-80 bg-muted animate-pulse rounded"></div>
      </div>

      <div className="h-80 bg-muted animate-pulse rounded"></div>
    </div>
  );
};
