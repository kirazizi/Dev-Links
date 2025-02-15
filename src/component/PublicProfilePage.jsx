import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Github, Youtube, Linkedin, ArrowRight } from 'lucide-react';
import { Typography, Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/images/logo-devlinks-small.svg"
import { OrbitProgress } from 'react-loading-indicators';


const PublicProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


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
  case "github":ArrowRight
    return "bg-[#1A1A1A] hover:bg-black/90"
  case "youtube":
    return "bg-[#EE3939] hover:bg-[#EE3939]/90"
  case "linkedin":
    return "bg-[#2D68FF] hover:bg-[#2D68FF]/90"
  default:
    return "bg-gray-800 hover:bg-gray-800/90"
  }
}


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_HASURA_GRAPHQL_URL,
          {
            query: `
              query GetUserProfile($userId: String!) {
                users_by_pk(id: $userId) {
                  id
                  first_name
                  last_name
                  email
                  image
                  links {
                    id
                    platform
                    url
                  }
                }
              }
            `,
            variables: {
              userId,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': import.meta.env.VITE_HASURA_X_SECRET,
            },
          }
        );

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        setProfile(response.data.data.users_by_pk)
        setLinks(response.data.data.users_by_pk.links)
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <OrbitProgress variant="disc" color="#633CFF" size="medium" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="h-screen mx-auto grid place-items-center text-center px-8">
        <div>
          <img src={Logo} className="w-14 h-14 mx-auto"/>
          <Typography
            variant="h1"
            className="mt-10 !text-3xl !leading-snug md:!text-4xl text-[#633CFF]"
          >
            Error 404 <br /> It looks like something went wrong.
          </Typography>
          <Typography className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
            Don&apos;t worry, our team is already on it.Please try refreshing
            the page or come back later.
          </Typography>
          <Button
          onClick={() => {
            navigate("/dashboard")
          }}
          className="w-full px-4 md:w-[8rem] bg-[#633CFF]"
          >
            back home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto relative bg-white min-h-screen">
      <div className="top-0 left-0 right-0 h-[300px] bg-[#633CFF] rounded-b-[32px]" />
      <div className="relative">

        <div className="mt-[-160px] px-4 w-[300px] align-center mx-auto">
          <div className="bg-white rounded-[24px] shadow-lg p-6 space-y-2">
            <div className="flex justify-center">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profile"ArrowRight
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


export default PublicProfilePage;