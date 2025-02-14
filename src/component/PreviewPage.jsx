import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Github, Youtube, Linkedin } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function MobilePreview(){
    const { profile, links} = useAuth();
  
    const getPlatformIcon = (platform) => {
      switch (platform.toLowerCase()) {
        case "github":
          return <Github className="w-5 h-5" />
        case "youtube":
          return <Youtube className="w-5 h-5" />
        case "linkedin":
          return <Linkedin className="w-5 h-5" />
        default:
          return null
      }
    }

  const getPlatformStyles = (platform) => {
    switch (platform.toLowerCase()) {
      case "github":
        return "bg-[#1A1A1A] hover:bg-black/90"
      case "youtube":
        return "bg-[#EE3939] hover:bg-[#EE3939]/90"
      case "linkedin":
        return "bg-[#2D68FF] hover:bg-[#2D68FF]/90"
      default:
        return "bg-gray-800 hover:bg-gray-800/90"
    }
  }

  return (
    <div className="w-full mx-auto relative bg-white min-h-screen">
      <div className="absolute top-0 left-0 right-0 h-[357px] bg-[#633CFF] rounded-b-[32px]" />
      <div className="relative">
        <div className="mx-4 pt-4">
          <div className="bg-white rounded-xl p-4 flex justify-between items-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="text-[#633CFF] border-[#633CFF] hover:bg-[#633CFF]/10 rounded-lg h-10 px-4 py-2"
            >
              Back to Editor
            </Button>
            <Button className="bg-[#633CFF] text-white hover:bg-[#633CFF]/90 rounded-lg h-10 px-4 py-2">
              Share Link
            </Button>
          </div>
        </div>

        <div className="mt-[120px] px-4 w-[300px] align-center mx-auto">
          <div className="bg-white rounded-[24px] shadow-lg p-6 space-y-2">
            <div className="flex justify-center">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-[104px] h-[104px] rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-[104px] h-[104px] rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-[30px] font-bold text-[#333333]">
                {profile.first_name} {profile.last_name}
              </h1>
              <h2 className="text-[32px] font-bold text-[#333333]">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-[#737373]">{profile.email}</p>
            </div>

            <div className="space-y-4">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-white ${getPlatformStyles(
                    link.platform,
                  )}`}
                >
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(link.platform)}
                    <span className="font-medium">{link.platform}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

