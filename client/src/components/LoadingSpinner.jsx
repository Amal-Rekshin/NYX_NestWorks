import { Building2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center">
      {/* Animated Rings Container */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Outer Glowing Ring (Spins Clockwise) */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-brand-blue animate-[spin_2s_linear_infinite] shadow-[0_0_15px_rgba(0,85,255,0.5)]"></div>
        
        {/* Middle Glowing Ring (Spins Counter-Clockwise) */}
        <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-brand-gold animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_15px_rgba(255,183,0,0.3)]"></div>
        
        {/* Inner Circle / Logo */}
        <div className="absolute inset-4 bg-dark-surface border border-dark-border rounded-full flex items-center justify-center z-10 overflow-hidden shadow-inner">
           <div className="absolute inset-0 bg-brand-blue/10 animate-pulse"></div>
           <Building2 className="w-7 h-7 text-white z-20" />
        </div>
      </div>
      
      {/* Animated Text Section */}
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-white tracking-[0.2em] uppercase mb-1.5 flex items-center">
          <span className="text-brand-blue mr-1.5">Nyx</span> 
          <span className="animate-pulse opacity-90">Wait</span>
        </h3>
        <p className="text-gray-400 font-medium text-sm tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-24">
      {content}
    </div>
  );
};

export default LoadingSpinner;
