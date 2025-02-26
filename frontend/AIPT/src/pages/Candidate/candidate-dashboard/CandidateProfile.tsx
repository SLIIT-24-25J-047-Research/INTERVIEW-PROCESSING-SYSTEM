import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mail, MapPin, Briefcase, GraduationCap, Edit2, Save, X, KeyRound, Camera } from 'lucide-react';
import CandidateHeader from '../../../components/Candidate/CandidateHeader';
import Sidebar from "../../../components/Candidate/CandidateSidebar";
import { toast } from 'react-hot-toast';
import PasswordUpdateModal from './PasswordUpdateModal';
import { useAuth } from "../../../contexts/AuthContext";

interface ProfileData {
  name: string;
  email: string;
  location: string;
  currentRole: string;
  bio: string;
  profilePicture: string;
  experience: {
    role: string;
    company: string;
    duration: string;
  }[];
  education: {
    degree: string;
    institution: string;
  }[];
  skills: string[];
  hasPassword: boolean;
}

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const userId = user?.id;

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
      setProfile(response.data);
      console.log('profile',profile);
      setEditedProfile(response.data); // Initialize edited profile with fetched data
      setError(null);
    } catch (err) {
      setError('Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);

      // Create a preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && editedProfile) {
          setEditedProfile({
            ...editedProfile,
            profilePicture: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };



  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      // Create a FormData object if there's an image to upload
      if (selectedImage) {
        const formData = new FormData();
        formData.append('profilePicture', selectedImage);

        // Upload the image first
        const imageResponse = await axios.post(
          `http://localhost:5000/api/auth/profile/${userId}/image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Update the profile picture URL with the one returned from server
        if (imageResponse.data.imageUrl) {
          editedProfile.profilePicture = imageResponse.data.imageUrl;
        }
      }

      // Then update the rest of the profile data
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      setSelectedImage(null);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile); // Reset to original profile data
  };

  const handleChange = (field: keyof ProfileData, value: string | string[] | { role: string; company: string; duration: string }[] | { degree: string; institution: string }[]) => {
    if (!editedProfile) return;

    setEditedProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const updateExperienceField = (index: number, field: string, value: string) => {
    if (!editedProfile?.experience) return;

    const updatedExperience = [...editedProfile.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };

    handleChange('experience', updatedExperience);
  };

  const updateEducationField = (index: number, field: string, value: string) => {
    if (!editedProfile?.education) return;

    const updatedEducation = [...editedProfile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };

    handleChange('education', updatedEducation);
  };

  const addExperienceItem = () => {
    if (!editedProfile) return;

    const updatedExperience = [
      ...editedProfile.experience,
      { role: '', company: '', duration: '' }
    ];

    handleChange('experience', updatedExperience);
  };

  const addEducationItem = () => {
    if (!editedProfile) return;

    const updatedEducation = [
      ...editedProfile.education,
      { degree: '', institution: '' }
    ];

    handleChange('education', updatedEducation);
  };

  const removeExperienceItem = (index: number) => {
    if (!editedProfile?.experience) return;

    const updatedExperience = editedProfile.experience.filter((_, i) => i !== index);
    handleChange('experience', updatedExperience);
  };

  const removeEducationItem = (index: number) => {
    if (!editedProfile?.education) return;

    const updatedEducation = editedProfile.education.filter((_, i) => i !== index);
    handleChange('education', updatedEducation);
  };

  const updatePassword = async (passwordData: PasswordUpdate) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/profile/${userId}/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Password updated successfully');
    } catch (err) {
      console.error('Password update error:', err);
      toast.error('Failed to update password');
      throw err;
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    handleChange('skills', skillsArray);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error: {error || 'Profile not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6">
          <CandidateHeader title="My Profile" />

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Banner and Profile Picture */}
            <div className="relative">
              {/* Banner */}
              <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

              {/* Profile Picture and Edit Button */}
              <div className="absolute top-32 left-8 flex justify-between items-end w-full pr-8">
                <div className="relative">
                  <img
                    src={editedProfile?.profilePicture || profile.profilePicture || '/default-avatar.png'}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
                  />
                  {isEditing && (
                    <>
                      <button
                        onClick={handleImageClick}
                        className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition-colors"
                        title="Change profile picture"
                      >
                        <Camera size={16} />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </>
                  )}
                </div>

                {/* Edit/Save Buttons */}
                <div className="mb-4">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Save size={16} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-white text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="mt-20 px-8 py-6">
              {/* Name and Role */}
              <div className="mb-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        value={editedProfile?.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="currentRole" className="block text-sm font-medium text-gray-600 mb-1">Current Role</label>
                      <input
                        id="currentRole"
                        type="text"
                        value={editedProfile?.currentRole || ''}
                        onChange={(e) => handleChange('currentRole', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <p className="text-lg text-gray-600">{profile.currentRole}</p>
                  </>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-500" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile?.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <span>{profile.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <span>{profile.location}</span>
                  )}
                </div>
              </div>

              {/* About/Bio */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">About</h2>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.bio || ''}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows={4}
                    placeholder="Write a short bio about yourself"
                  />
                ) : (
                  <p className="text-gray-600 whitespace-pre-line">{profile.bio || 'No bio provided'}</p>
                )}
              </div>

              {/* Professional Info Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Experience Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="text-blue-500" size={20} />
                      Experience
                    </h2>
                    {isEditing && (
                      <button
                        onClick={addExperienceItem}
                        className="text-blue-600 text-sm hover:text-blue-800"
                      >
                        + Add Experience
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {(isEditing ? editedProfile?.experience : profile.experience)?.map((exp, index) => (
                      <div key={index} className="relative">
                        {isEditing && (
                          <button
                            onClick={() => removeExperienceItem(index)}
                            className="absolute -right-2 -top-2 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        )}

                        {isEditing ? (
                          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Role</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => updateExperienceField(index, 'role', e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="Role or Position"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperienceField(index, 'company', e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="Company Name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Duration</label>
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => updateExperienceField(index, 'duration', e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Jan 2020 - Present"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="border-l-2 border-blue-200 pl-4 py-1">
                            <h3 className="font-medium">{exp.role || 'Role not specified'}</h3>
                            <p className="text-gray-600">{exp.company || 'Company not specified'}</p>
                            <p className="text-gray-500 text-sm">{exp.duration || 'Duration not specified'}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {(!isEditing && (!profile.experience || profile.experience.length === 0)) && (
                      <p className="text-gray-400 italic">No experience added yet</p>
                    )}
                  </div>
                </div>

                {/* Education Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <GraduationCap className="text-blue-500" size={20} />
                      Education
                    </h2>
                    {isEditing && (
                      <button
                        onClick={addEducationItem}
                        className="text-blue-600 text-sm hover:text-blue-800"
                      >
                        + Add Education
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {(isEditing ? editedProfile?.education : profile.education)?.map((edu, index) => (
                      <div key={index} className="relative">
                        {isEditing && (
                          <button
                            onClick={() => removeEducationItem(index)}
                            className="absolute -right-2 -top-2 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        )}

                        {isEditing ? (
                          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Degree</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducationField(index, 'degree', e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="Degree or Certificate"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Institution</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducationField(index, 'institution', e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="Institution Name"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="border-l-2 border-blue-200 pl-4 py-1">
                            <h3 className="font-medium">{edu.degree || 'Degree not specified'}</h3>
                            <p className="text-gray-600">{edu.institution || 'Institution not specified'}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {(!isEditing && (!profile.education || profile.education.length === 0)) && (
                      <p className="text-gray-400 italic">No education added yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-3">Skills</h2>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={(editedProfile?.skills || []).join(', ')}
                      onChange={handleSkillsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter skills separated by commas (e.g. JavaScript, React, UI Design)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">No skills added yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Security Settings */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <KeyRound className="text-blue-500" size={20} />
                  Security Settings
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-gray-600 text-sm">
                      {profile.hasPassword
                        ? "Change your password regularly to keep your account secure"
                        : "You're signed in with Google"}
                    </p>
                  </div>
                  <PasswordUpdateModal
                    hasPassword={profile.hasPassword}
                    onUpdatePassword={updatePassword}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;