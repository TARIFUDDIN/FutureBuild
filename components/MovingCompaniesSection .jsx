import React from "react";

const SleekMovingCompaniesSection = () => {
  const companies = [
    { 
      name: "Adobe", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/adobe/adobe-original.svg"
    },
    { 
      name: "Google", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
    },
    { 
      name: "Meta", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
    },
    { 
      name: "Netflix", 
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png"
    },
    { 
      name: "Amazon", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg"
    },
    { 
      name: "Airbnb", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg"
    },
    { 
      name: "Apple", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
    },
    { 
      name: "Microsoft", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg"
    },
    { 
      name: "Tesla", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg"
    },
    { 
      name: "Spotify", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spotify/spotify-original.svg"
    },
    { 
      name: "GitHub", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
    },
    { 
      name: "Docker", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
    },
    { 
      name: "DoorDash", 
      logo: "https://logos-world.net/wp-content/uploads/2021/02/DoorDash-Logo.png"
    },
    { 
      name: "Nu Bank", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Nubank_logo_2021.svg"
    },
    { 
      name: "TCS", 
      logo: "https://logos-world.net/wp-content/uploads/2020/09/TCS-Logo.png"
    },
    { 
      name: "Accenture", 
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Accenture-Logo.png"
    }
  ];

  // Triple the array for seamless infinite scroll
  const tripleCompanies = [...companies, ...companies, ...companies];

  return (
    <div className="relative w-full py-20 bg-black overflow-hidden">
      {/* Gradient Background with Violet Tints */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-violet-950/30"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-violet-300 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-6 text-center">
        {/* Header with Glow Effect */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-300 mb-3">
            Trusted by job seekers who've landed at top companies
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent mx-auto"></div>
        </div>

        {/* Moving Companies Container */}
        <div className="relative">
          {/* Enhanced Gradient Overlays */}
          <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-black via-black/80 to-transparent z-10"></div>
          
          {/* Subtle Glow Lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          
          {/* Scrolling container */}
          <div className="flex overflow-hidden py-6">
            <div className="flex animate-sleek-scroll space-x-16 items-center">
              {tripleCompanies.map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="group flex items-center space-x-4 px-6 py-3 flex-shrink-0 min-w-max cursor-pointer transition-all duration-500 hover:scale-110"
                >
                  {/* Logo with Glow Effect */}
                  <div className="relative">
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`}
                      className="w-8 h-8 object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Glow effect behind logo */}
                    <div className="absolute inset-0 w-8 h-8 bg-violet-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                  
                  {/* Company Name with Silver Text */}
                  <span className="text-lg font-light tracking-wider text-gray-300 group-hover:text-white transition-all duration-300 whitespace-nowrap">
                    {company.name}
                  </span>
                  
                  {/* Subtle Accent Line */}
                  <div className="w-px h-6 bg-gradient-to-b from-transparent via-violet-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-violet-400/50 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse delay-300"></div>
            <div className="w-2 h-2 bg-violet-400/50 rounded-full animate-pulse delay-700"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes sleek-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-sleek-scroll {
          animation: sleek-scroll 45s linear infinite;
        }
        
        .animate-sleek-scroll:hover {
          animation-play-state: paused;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SleekMovingCompaniesSection;