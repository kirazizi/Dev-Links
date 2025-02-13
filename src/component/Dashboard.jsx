import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, SmartphoneIcon} from "lucide-react"
import Logo from '../assets/images/logo-devlinks-large.svg';
import { OrbitProgress } from 'react-loading-indicators';
import LinksPage from './LinksPage';
import ProfilePage from './ProfilePage';
import { useAuth } from '../context/AuthContext';

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    users {
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('links');
  const { setProfile, setLinks, profile, links } = useAuth();
  
  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE);

  useEffect(() => {
    console.log("test", data);
    if (data) {
      setProfile((prev) => ({
        ...prev,
        id: data.users[0].id,
        first_name: data.users[0].first_name,
        last_name: data.users[0].last_name,
        email: data.users[0].email,
        image: data.users[0].image,
      }));

      const transformedLinks = data.users[0].links.map(({ id, platform, url }) => ({
        id,
        platform,
        url,
        isNew: false
      }));
      setLinks(transformedLinks);
    }

  }, [data]);


  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">
    <OrbitProgress variant="disc" color="#633CFF" size="medium" text="" textColor="" />
  </div>;
  // if (error) return <div className="min-h-screen bg-white flex items-center justify-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <img src={Logo} alt="Devlinks" className="h-8" />
            
            <Tabs defaultValue="links" className="flex-1 max-w-[240px] mx-auto ">
              <TabsList className="grid w-full grid-cols-2 bg-white">
                <TabsTrigger value="links" className="flex items-center gap-2 data-[state=active]:bg-[#8860E6]/10 data-[state=active]:text-[#8860E6]"
                  onClick={() => setActiveTab('links')}
                >
                  <Link className="h-4 w-4" />
                  Links
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2 data-[state=active]:bg-[#8860E6]/10 data-[state=active]:text-[#8860E6]"
                  onClick={() => setActiveTab('profile')}
                >
                  <SmartphoneIcon className="h-4 w-4" />
                  Profile Details
                </TabsTrigger>
              </TabsList>
            </Tabs>
  
            <Button variant="outline" className="px-5 h-10 border-purple-500">
              Preview
            </Button>
          </nav>
        </div>
      </header>

    <div className="min-h-screen bg-white">
          {
            activeTab === 'links' ? (
              <LinksPage refetch={refetch} />
            ) : (
              <ProfilePage refetch={refetch} />
            )
          }
      </div>
    </div>
  );
};

export default Dashboard;
