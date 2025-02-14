import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Link, SmartphoneIcon, GripVertical, Github, Youtube, Linkedin, Facebook, ChevronRight } from "lucide-react"
import Logo from '../assets/images/logo-devlinks-large.svg';
import Empty from "../assets/images/illustration-empty.svg";
import { jwtDecode } from 'jwt-decode';
import MobilePreview from './MobilePreview';
import { useAuth } from '@/context/AuthContext';

// import Github from '../assets/images/icon-github.svg';
// import Youtube from '../assets/images/icon-youtube.svg';
// import Linkedin from '../assets/images/icon-linkedin.svg';
// import Facebook from '../assets/images/icon-facebook.svg';

const UPDATE_LINK = gql`
  mutation UpdateLink($id: uuid!, $title: String!, $url: String!) {
    update_links_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, url: $url }
    ) {
      id
      title
      url
    }
  }
`;

const INSERT_LINKS = gql`
  mutation insertLinks($objects: [links_insert_input!]!) {
    insert_links(objects: $objects) {
      returning {
        id
        platform
        url
      }
    }
  }
`

const DELETE_LINKS = gql`
  mutation DeleteLink($id: uuid!) {
    delete_links_by_pk(id: $id) {
      id
    }
  }
`;

const platforms = {
  github: { name: 'GitHub', color: "#1A1A1A", icon: Github },
  youtube: { name: 'YouTube', color: "#EE1D52", icon: Youtube },
  linkedin: { name: 'LinkedIn', color: "#2D68FF", icon: Linkedin },
  facebook: { name: 'Facebook', color: "#1877F2", icon: Facebook },
};


const LinksPage = () => {

  const { links, setLinks } = useAuth();

  const [removedLinks, setRemovedLinks] = useState([]);
  const token = localStorage.getItem('authToken');
  const auth0Id = jwtDecode(token).sub;
  const [insertLinks] = useMutation(INSERT_LINKS);
  const [deleteLinks] = useMutation(DELETE_LINKS);
  const [isSaving, setIsSaving] = useState(false);

  const addLink = () => {
    const newLink = {
      id: `${crypto.randomUUID()}`,
      platform: "github",
      url: "",
      isNew: true
    }
    setLinks([...links, newLink]);
  };

  const removeLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
    setRemovedLinks([...removedLinks, id]);
  };

  const updateLink = (id, updates) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    ));
  };


  const handleSave = async () => {
    try {

      setIsSaving(true);
      await Promise.all(removedLinks.map(async (id) => {
        await deleteLinks({ variables: { id } });
      }));

      setRemovedLinks([]);

      const LinkSave = links.filter(link => link.isNew).map(link => ({
        platform: link.platform,
        url: link.url,
        user_id: auth0Id
      }));
      
      await insertLinks({ variables: { objects: LinkSave } });

      setLinks(links.map(link => ({ ...link, isNew: false })));

      setIsSaving(false);

      console.log('Links saved successfully');;

    }
    catch(error){
      console.error('Error saving links:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-screen-2xl mx-auto px-6 py-8 grid md:grid-cols-[308px,1fr] gap-8 md:gap-40 md:ml-40">
        <MobilePreview />
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Customize your links</h1>
            <p className="text-gray-500">
              Add/edit/remove links below and then share all your profiles with the world!
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full border-2 border-[#8860E6] text-[#8860E6] hover:bg-[#8860E6]/5 h-12"
            onClick={addLink}
          >
            + Add new link
          </Button>

          {links.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-10 text-center">
              <div className="max-w-[350px] mx-auto space-y-6">
                <img src={Empty} alt="Empty state" className="w-40 h-40 mx-auto" />
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Let's get you started</h2>
                  <p className="text-gray-500">
                    Use the "Add new link" button to get started. Once you have more than one link, you can reorder and
                    edit them. We're here to help you share your profiles with everyone!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {links.map((link, index) => (
                <div key={link.id} className="p-5 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-6 w-6 text-gray-500" />
                      <span className="font-bold">Link #{index + 1}</span>
                    </div>
                    <button 
                      onClick={() => removeLink(link.id)} 
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-500">Platform</label>
                      <Select 
                        value={link.platform} 
                        onValueChange={(value) => updateLink(link.id, { platform: value })}
                      >
                        <SelectTrigger className="h-12">
                            <SelectValue>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(platforms).map(([value, { icon: Icon }]) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-5 w-5" />
                                  {platforms[value].name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-500">Link</label>
                      <Input
                        value={link.url}
                        onChange={(e) => updateLink(link.id, { url: e.target.value })}
                        placeholder={`e.g. https://${link.platform}.com/username`}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-end">
          <Button
            className="px-6 bg-[#633CFF] hover:bg-[#BEADFF]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving" : "Save"}
          </Button>
        </div>
      </footer>

    </div>
  );
};

export default LinksPage;