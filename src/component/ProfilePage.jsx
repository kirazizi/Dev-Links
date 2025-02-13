import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import MobilePreview from "./MobilePreview";
import { gql, useMutation } from "@apollo/client";


const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($auth0Id: String!, $first_name: String!, $last_name: String!, $email: String!, $image: String!) {
    update_users(
      _set: { first_name: $first_name, last_name: $last_name, email: $email, image: $image }
      where: { auth0_id: { _eq: $auth0Id } }
    ) {
      returning {
        id
        first_name
        last_name
        email
        image
      }
    }
  }
`;


const ProfilePage = ({ refetch }) => {
  const { profile, setProfile, user} = useAuth();
  const [successMessage, setSuccessMessage] = useState(false);
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageUrl, setImageUrl] = useState(profile.image || '');


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        console.log('Image uploaded:', data);
        setImageUrl(data.url);
        setProfile((prev) => ({ ...prev, image: data.url }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setErrorMessage(null);
      console.log('profile', profile);
      await updateUserProfile({
        variables: {
          auth0Id: user,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          image: profile.image || ''
        }
      });

      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
      
      await refetch();
      
    } catch (error) {
      console.error('Update failed:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-screen-2xl mx-auto px-6 py-8 grid md:grid-cols-[308px,1fr] gap-8 md:gap-40 md:ml-40">

        <MobilePreview />

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Profile Details</h1>
            <p className="text-gray-500">
              Add your details to create a personal touch to your profile.
            </p>
          </div>

          <div className="space-y-6">

            <div className="p-5 bg-gray-50 rounded-lg space-y-4">
              <label className="text-sm text-gray-500">Profile picture</label>
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profileImage"
                  />
                  <label
                    htmlFor="profileImage"
                    className="w-48 h-48 flex flex-col items-center justify-center gap-3 bg-[#8860E6]/5 hover:bg-[#8860E6]/10 rounded-lg cursor-pointer relative overflow-hidden"
                  >
                    { imageUrl ? (
                      <>
                        <img 
                          src={imageUrl}
                          className="w-full h-full object-cover rounded-lg"
                        />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                          <ImageIcon className="w-10 h-10 text-white" />
                          <span className="text-white font-medium">
                            Change Image
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-[#8860E6]" />
                        <span className="text-[#8860E6] font-medium">
                          + Upload Image
                        </span>
                      </>
                    )}
                  </label>
                </div>
                <div className="flex-1 text-xs text-gray-500">
                  <p>Image must be below 1024x1024px.</p>
                  <p>Use PNG or JPG format.</p>
                </div>
              </div>
            </div>


            <div className="p-5 bg-gray-50 rounded-lg space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm text-gray-500">
                    First name*
                  </label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleInputChange}
                    placeholder="e.g. John"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm text-gray-500">
                    Last name*
                  </label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Appleseed"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-500">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="e.g. email@example.com"
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-end">
          <Button
            className="px-6 bg-[#8860E6] hover:bg-[#7447e7]"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
        {successMessage && (
          <div className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-start text-green-500">
            Your changes have been successfully saved!
          </div>
        )}
      </footer>
    </div>
  );
};

export default ProfilePage;
