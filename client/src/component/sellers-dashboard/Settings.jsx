import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import FaqAccordion from './FaqAccordion';

const FileInput = ({ label, value, setValue, accept, previewHeight }) => {
  useEffect(() => {
    let objectUrl;
    if (value instanceof File) {
      objectUrl = URL.createObjectURL(value);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [value]);

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-300 p-6 text-center">
        {value ? (
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            alt={label}
            className={`w-full h-${previewHeight} object-cover rounded-md mb-4`}
          />
        ) : (
          <p className="text-gray-500">No {label.toLowerCase()} selected</p>
        )}
        <input type="file" accept={accept} onChange={(e) => setValue(e.target.files[0])} className="mt-4" />
      </div>
    </div>
  );
};

const TextInput = ({ label, value, setValue, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      className="w-full border border-gray-300 p-2 rounded-lg"
    />
  </div>
);


const TextAreaInput = ({ label, value, setValue }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
    <textarea
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      className="w-full border border-gray-300 p-2 rounded-lg h-32"
    ></textarea>
  </div>
);


const Settings = ({ faq }) => {
  const [mainBannerImage, setMainBannerImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [location, setLocation] = useState("");
  const [storeName, setStoreName] = useState("");
  const [contact, setContact] = useState("");
  const [support, setSupport] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [storeDescription, setStoreDescription] = useState("")
  const [offer, setOffer] = useState("")
  const [content, setContent] = useState(faq || [])
  const [hours, setHours] = useState({
    monday: { open: "", close: "" },
    tuesday: { open: "", close: "" },
    wednesday: { open: "", close: "" },
    thursday: { open: "", close: "" },
    friday: { open: "", close: "" },
    saturday: { open: "", close: "" },
    sunday: { open: "", close: "" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/content`, { withCredentials: true });
        
        if (res.data) {
          const {
            mainBannerImage,
            logoImage,
            email,
            password,
            old_password,
            aboutUs,
            location,
            storeName,
            storeDescription,
            contact,
            offer,
            support,
            socialLinks,
            hours,
          } = res.data;
          setMainBannerImage(mainBannerImage);
          setLogoImage(logoImage);
          setOffer(offer);
          setEmail(email);
          setPassword(password);
          setOldPassword(old_password);
          setAboutUs(aboutUs);
          setLocation(location);
          setStoreName(storeName);
          setStoreDescription(storeDescription);
          setContact(contact);
          setSupport(support);
          setFacebookUrl(socialLinks.facebookUrl);
          setInstagramUrl(socialLinks.instagramUrl);
          setWhatsappUrl(socialLinks.whatsappUrl);
          setTwitterUrl(socialLinks.twitterUrl);
          setLinkedinUrl(socialLinks.linkedinUrl);
          setTiktokUrl(socialLinks.tiktokUrl);
          setHours(hours);
        }
      } catch (error) {
        toast.error('Failed to load settings');
      }
      setLoading(false);
    }

    fetchSettings()

  }, [])

  const handleHoursChange = (day, field, value) => {
    setHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        [field]: value,
      },
    }));
  };

  const uploadFile = async (file, type, timestamp, signature) => {
    if (!file) return file; // Skip if file is null

    try {
      new URL(file); // Check if it's already a URL
      return file;
    } catch (error) {
        const folder = type === 'image' ? 'images' : 'videos';
        const data = new FormData();
        data.append('file', file);
        data.append('timestamp', timestamp);
        data.append('signature', signature);
        data.append('api_key', import.meta.env.VITE_APP_CLOUDINARY_API_KEY);
        data.append('folder', folder);

        try {
            const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
            const resourceType = type === 'image' ? 'image' : 'video';
            const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data);
            const { secure_url } = res.data;
            return secure_url;
        } catch (error) {
            console.log(error)
            setError('Something went wrong in the server');
            return null; // Return null on error
        }
    }
  };

  const getSignatureForUpload = async (folder) => {
    try {
       const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/api/gensignature`,
        { folder },
        { withCredentials: true }
      );
      if (res.data.error) throw new Error(res.data.error);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong');
      }
      return null;
    }
  };

  const handleSubmitAll = async () => {
    content.map(({ question, answer }) => {
      if (!question || !answer) {
        toast.error('Provide questions and answer')
        return;
      }
    })
    const signatureData = await getSignatureForUpload('images');
    if (!signatureData) return;

    const { timestamp, signature } = signatureData;
    const uploadedMainBannerImage = await uploadFile(mainBannerImage, 'image', timestamp, signature);
    const uploadedLogoImage = await uploadFile(logoImage, 'image', timestamp, signature);

    if (uploadedMainBannerImage && uploadedLogoImage) {
      const payload = {
        mainBannerImage: uploadedMainBannerImage,
        logoImage: uploadedLogoImage,
        
        email,
        password,
        oldPassword,
        aboutUs,
        location,
        storeName,
        offer,
        content,
        storeDescription,
        businessHours: hours,
        socialLinks: {
          facebookUrl,
          instagramUrl,
          whatsappUrl,
          twitterUrl,
          linkedinUrl,
          tiktokUrl,
        },
        contact,
        support,
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/content`,
          payload,
          { withCredentials: true }
        );

        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.success('All settings updated successfully');
        }
      } catch (error) {
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error('Failed to save settings');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100  grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Main Banner Image Section */}
      {
        loading ? (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-gray-600 text-lg">Loading settings...</p>
          </div>
        ): (
          <>
            <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Main Banner Image</h1>
            <FileInput label="Main Banner Image" value={mainBannerImage} setValue={setMainBannerImage} accept="image/*" previewHeight="48" />
            <FileInput label="Logo Image" value={logoImage} setValue={setLogoImage} accept="image/*" previewHeight="32" />
          </div>
          {/* User Settings Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Settings</h1>
            <TextInput label="Email" type="email" value={email} setValue={setEmail} />
            <TextInput label="Password" type="password" value={password} setValue={setPassword} />
            <TextInput label="Old Password" type="password" value={oldPassword} setValue={setOldPassword} />
            <TextInput label="Store Name" type="text" value={storeName} setValue={setStoreName} />
            <TextAreaInput label="Store Location" value={location} setValue={setLocation} />
          </div>
          {/* Text Sections (About Us, Terms, Privacy Policy) */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Text Sections</h1>
            <TextAreaInput label="About Us" value={aboutUs} setValue={setAboutUs} />
            <TextAreaInput label="Store Description" value={storeDescription} setValue={setStoreDescription} />
            <TextInput label="offer" value={offer} setValue={setOffer} />
          </div>
          {/* Contact Info Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Contact Information</h1>
            <TextInput label="Contact" value={contact} setValue={setContact} />
            <TextInput label="Support" value={support} setValue={setSupport} />
          </div>
          {/* Social Media Links */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Social Media Links</h1>
            <TextInput label="Facebook URL" value={facebookUrl} setValue={setFacebookUrl} />
            <TextInput label="Instagram URL" value={instagramUrl} setValue={setInstagramUrl} />
            <TextInput label="WhatsApp URL" value={whatsappUrl} setValue={setWhatsappUrl} />
            <TextInput label="Twitter URL" value={twitterUrl} setValue={setTwitterUrl} />
            <TextInput label="LinkedIn URL" value={linkedinUrl} setValue={setLinkedinUrl} />
            <TextInput label="TikTok URL" value={tiktokUrl} setValue={setTiktokUrl} />
          </div>
          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Business Hours</h1>
            {Object.keys(hours).map((day) => (
              <div key={day} className="flex justify-between mb-4">
                <label className="text-sm font-semibold text-gray-700 capitalize">{day}</label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={hours[day].open}
                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                    className="border p-1 rounded"
                  />
                  <input
                    type="time"
                    value={hours[day].close}
                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                    className="border p-1 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
          <FaqAccordion faqItems={content} setFaqItems={setContent} />

          {/* Save Button */}
          <div className="col-span-full text-center">
            <button
              onClick={handleSubmitAll}
              className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-600 transition"
            >
              Save All Changes
            </button>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
          </>
        )
      }
    </div>
  );
};

export default Settings;
