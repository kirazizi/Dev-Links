import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import Empty from "../assets/images/illustration-empty.svg";
import { jwtDecode } from 'jwt-decode';
import MobilePreview from './MobilePreview';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { gql } from '@apollo/client';


import GithubImage from '../assets/images/icon-github.svg';
import YoutubeImage from '../assets/images/icon-youtube.svg';
import LinkedinImage from '../assets/images/icon-linkedin.svg';
import FacebookImage from '../assets/images/icon-facebook.svg';
import TwitterImage from '../assets/images/icon-twitter.svg';
import DevtoImage from '../assets/images/icon-devto.svg';
import CodewarsImage from '../assets/images/icon-codewars.svg';
import FreecodecampImage from '../assets/images/icon-freecodecamp.svg';
import GitlabImage from '../assets/images/icon-gitlab.svg';
import HashnodeImage from '../assets/images/icon-hashnode.svg';
import StackoverflowImage from '../assets/images/icon-stack-overflow.svg';
import TwitchImage from '../assets/images/icon-twitch.svg';
import FrontendMentorImage from '../assets/images/icon-frontend-mentor.svg';

const UPDATE_LINK = gql`
  mutation UpdateLink($id: uuid!, $platform: String!, $url: String!) {
    update_links_by_pk(
      pk_columns: { id: $id }
      _set: { platform: $platform, url: $url }
    ) {
      id
      platform
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
`;

const DELETE_LINKS = gql`
  mutation DeleteLink($id: uuid!) {
    delete_links_by_pk(id: $id) {
      id
    }
  }
`;

const linkSchema = z.object({
  id: z.string(),
  platform: z.string().min(1, "Can't be empty"),
  url: z.string().url("Please enter a valid URL").min(1, "Can't be empty"),
  isNew: z.boolean().optional(),
});

const formSchema = z.object({
  links: z.array(linkSchema),
});

const platforms = {
  github: { name: 'GitHub', color: "#1A1A1A", icon: GithubImage },
  youtube: { name: 'YouTube', color: "#EE1D52", icon: YoutubeImage },
  linkedin: { name: 'LinkedIn', color: "#2D68FF", icon: LinkedinImage },
  facebook: { name: 'Facebook', color: "#1877F2", icon: FacebookImage },
  twitter: { name: 'Twitter', color: "#1DA1F2", icon: TwitterImage },
  devto: { name: 'Dev.to', color: "#000000", icon: DevtoImage },
  codewars: { name: 'Codewars', color: "#8A0E57", icon: CodewarsImage },
  freecodecamp: { name: 'freeCodeCamp', color: "#2F3942", icon: FreecodecampImage },
  gitlab: { name: 'GitLab', color: "#FC6D26", icon: GitlabImage },
  hashnode: { name: 'Hashnode', color: "#2962FF", icon: HashnodeImage },
  stackoverflow: { name: 'Stack Overflow', color: "#F48024", icon: StackoverflowImage },
  twitch: { name: 'Twitch', color: "#9146FF", icon: TwitchImage },
  frontendmentor: { name: 'Frontend Mentor', color: "#00BB8F", icon: FrontendMentorImage },
};

const PlatformIcon = ({ platform }) => {
  const PlatformImage = platforms[platform]?.icon;
  return PlatformImage ? (
    <img src={PlatformImage} alt={platforms[platform].name} style={{ width: '20px', height: '20px' }} />
  ) : null;
};

const LinksPage = () => {
  const { links, setLinks } = useAuth();
  const [removedLinks, setRemovedLinks] = useState([]);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem('authToken');
  const auth0Id = jwtDecode(token).sub;
  const [insertLinks] = useMutation(INSERT_LINKS);
  const [deleteLinks] = useMutation(DELETE_LINKS);
  const [updateLinks] = useMutation(UPDATE_LINK);
  const [isSaving, setIsSaving] = useState(false);

  const addLink = () => {
    const newLink = {
      id: `${crypto.randomUUID()}`,
      platform: "github",
      url: "",
      isNew: true,
    };
    setLinks([...links, newLink]);
  };

  const removeLink = (id) => {
    setLinks(links.filter((link) => link.id !== id));
    setRemovedLinks([...removedLinks, id]);
  };

  const updateLink = (id, updates) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, ...updates } : link)));
  };

  const handleSave = async () => {
    try {
      const validationResult = formSchema.safeParse({ links });

      if (!validationResult.success) {
        const errorMap = {};
        validationResult.error.errors.forEach((err) => {
          const index = err.path[1];
          errorMap[index] = errorMap[index] || {};
          errorMap[index][err.path[2]] = { message: err.message };
        });
        setErrors({ links: errorMap });
        return;
      }

      setErrors({});
      setIsSaving(true);

      await Promise.all(
        removedLinks.map(async (id) => {
          await deleteLinks({ variables: { id } });
        })
      );
      setRemovedLinks([]);

      const newLinks = links.filter((link) => link.isNew).map((link) => ({
        platform: link.platform,
        url: link.url,
        user_id: auth0Id,
      }));

      if (newLinks.length > 0) {
        await insertLinks({ variables: { objects: newLinks } });
      }

      const existingLinks = links.filter((link) => !link.isNew);
      await Promise.all(
        existingLinks.map(async (link) => {
          await updateLinks({
            variables: {
              id: link.id,
              platform: link.platform,
              url: link.url,
            },
          });
        })
      );

      setLinks(links.map((link) => ({ ...link, isNew: false })));
      setIsSaving(false);

      toast("Your changes have been successfully saved!");
    } catch (error) {
      console.error('Error saving links:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="bottom-center" className="" />
      <main className="max-w-screen-2xl mx-auto px-6 py-8 grid lg:grid-cols-[308px,1fr] gap-8 lg:gap-40 lg:ml-40">
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
                        <SelectTrigger className={`h-12 ${errors.links?.[index]?.platform ? "border-[#FF3939] focus-visible:ring-[#FF3939]" : ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            side="bottom"
                            avoidCollisions={false}
                          >
                          {Object.entries(platforms).map(([value, { icon: Icon }]) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center gap-2">
                                <PlatformIcon platform={value} />
                                {platforms[value].name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.links?.[index]?.platform && (
                        <p className="text-[#FF3939] text-sm mt-1">{errors.links[index].platform.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-500">Link</label>
                      <div className="relative">
                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(link.id, { url: e.target.value })}
                          placeholder={`e.g. https://${link.platform}.com/username`}
                          className={`h-12 pr-24 ${errors.links?.[index]?.url ? "border-[#FF3939] focus-visible:ring-[#FF3939]" : ""}`}
                        />
                        {errors.links?.[index]?.url && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#FF3939]">
                            {errors.links[index].url.message}
                          </span>
                        )}
                      </div>
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