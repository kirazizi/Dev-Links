import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { ArrowRight } from "lucide-react";
import { Github, Youtube, Linkedin } from "lucide-react";

const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      id
      email
      first_name
      last_name
      image
      links {
        id
        platform
        url
      }
    }
  }
`;

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
  });

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getPlatformStyles = (platform) => {
    switch (platform.toLowerCase()) {
      case "github":
        return "bg-[#1A1A1A] hover:bg-black/90";
      case "youtube":
        return "bg-[#EE3939] hover:bg-[#EE3939]/90";
      case "linkedin":
        return "bg-[#2D68FF] hover:bg-[#2D68FF]/90";
      default:
        return "bg-gray-800 hover:bg-gray-800/90";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error.message}
      </div>
    );

  const profile = data.user;

  return (
    <div className="w-full mx-auto relative bg-white min-h-screen">
      <div className="absolute top-0 left-0 right-0 h-[357px] bg-[#633CFF] rounded-b-[32px]" />

      <div className="relative">
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
              <h1 className="text-[32px] font-bold text-[#333333]">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-[#737373]">{profile.email}</p>
            </div>

            <div className="space-y-4">
              {profile.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-white ${getPlatformStyles(
                    link.platform
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
  );
};

export default PublicProfilePage;
