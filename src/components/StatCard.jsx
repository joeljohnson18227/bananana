import { forwardRef } from 'react';

const StatCard = forwardRef(function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'blue', 
  bgColor = 'white',
  borderColor = 'slate-200',
  trend,
  trendLabel,
  className = '',
  ...props 
}, ref) {
  const iconColors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50',
    indigo: 'text-indigo-600 bg-indigo-50',
  };

  const iconBg = iconColors[iconColor] || iconColors.blue;

  return (
    <div
      ref={ref}
      className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${borderColor} ${bgColor} ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span
                className={`font-medium ${
                  trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-slate-500">{trendLabel || 'vs last month'}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`flex-shrink-0 rounded-lg p-3 ${iconBg}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;