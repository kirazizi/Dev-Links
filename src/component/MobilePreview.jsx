import React from 'react';
import MobilePreviewImage from "../assets/images/illustration-phone-mockup.svg";
import { Github, Youtube, Linkedin, Facebook, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const platforms = {
  github: { name: 'GitHub', color: "#1A1A1A", icon: Github },
  youtube: { name: 'YouTube', color: "#EE1D52", icon: Youtube },
  linkedin: { name: 'LinkedIn', color: "#2D68FF", icon: Linkedin },
  facebook: { name: 'Facebook', color: "#1877F2", icon: Facebook },
};

const MobilePreview = () => {
  const { links, profile } = useAuth()

  return (
    <div className="relative hidden lg:block w-[308px]">
      <img src={MobilePreviewImage} alt="Mobile Preview" className="w-full" />

      <div className="absolute top-[65px] left-0 right-0 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          {profile?.image && (
            <img 
              src={profile.image} 
              className="w-full h-full object-cover" 
              alt="Profile" 
            />
          )}
        </div>

        {(profile?.first_name || profile?.last_name) && (
          <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-full px-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              {`${profile.first_name || ""} ${profile.last_name || ""}`.trim()}
            </h2>
          </div>
        )}

        {profile?.email && (
          <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-full px-4 text-center">
            <p className="text-sm text-gray-600 font-medium bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              {profile.email}
            </p>
          </div>
        )}
      </div>

      <div className="absolute top-[279px] left-[35px] right-[35px] space-y-5 overflow-y-auto h-[300px] custom-scrollbar">
        {links?.map((link) => {
          const platform = platforms[link.platform] || platforms.github
          const PlatformIcon = platform.icon

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 rounded-lg flex items-center px-4 text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: platform.color }}
            >
              <PlatformIcon className="h-5 w-5" />
              <span className="ml-2 flex-grow text-sm font-medium">
                {platform.name}
              </span>
              <ChevronRight className="h-4 w-4" />
            </a>
          )
        })}
      </div>
      <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
          width: 0; /* Remove scrollbar space */
          background: transparent; /* Optional: just to be sure */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent; /* Remove scrollbar thumb */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; /* Remove scrollbar track */
        }
      `}</style>
    </div>
  )
}


export default MobilePreview;