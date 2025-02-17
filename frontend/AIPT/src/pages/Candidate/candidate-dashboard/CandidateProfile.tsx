import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, MapPin, Briefcase, GraduationCap, Edit2, Save, X } from 'lucide-react';
import CandidateHeader from '../../../components/Candidate/CandidateHeader';
import Sidebar from "../../../components/Candidate/CandidateSidebar";
import { toast } from 'react-hot-toast';

interface ProfileData {
  fullName: string;
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
}

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function App() {
  const userId = '675a8a8b1f81aa2955e37c2d';
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
      setProfile(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
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

  const updatePassword = async (passwordData: PasswordUpdate) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}/password`, passwordData);
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error('Failed to update password');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !profile) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
         <div className="flex-1 bg-gray-50 p-24">
         <CandidateHeader title="Profile" />
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-20 left-8 flex items-end space-x-6">
            <div className="relative">
                <img
                  src={profile.profilePicture || '/default-avatar.png'}
                  alt={profile.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
              <div className="pb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.fullName || ''}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="text-2xl font-bold bg-transparent border-b border-gray-300 text-white focus:border-blue-400 outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white">{profile.fullName}</h1>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.currentRole || ''}
                    onChange={(e) => handleChange('currentRole', e.target.value)}
                    className="text-white/90 bg-transparent border-b border-gray-300 focus:border-blue-400 outline-none"
                  />
                ) : (
                  <p className="text-white/90">{profile.currentRole}</p>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-md"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors shadow-md"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-md"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-24 p-8">
            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 mb-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile?.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  profile.email
                )}

              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  profile.location
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              {isEditing ? (
                <textarea
                  value={editedProfile?.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600">{profile.bio}</p>
              )}
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="text-gray-500" size={20} />
                Experience
              </h2>
              <div className="space-y-4">
                {(isEditing ? editedProfile?.experience : profile?.experience)?.map((exp, index) => (
                  <div key={index} className="flex flex-col">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const newExp = [...(editedProfile?.experience || [])];
                            newExp[index] = { ...exp, role: e.target.value };
                            handleChange('experience', newExp);
                          }}
                          className="font-medium block w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                          placeholder="Role"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...(editedProfile?.experience || [])];
                            newExp[index] = { ...exp, company: e.target.value };
                            handleChange('experience', newExp);
                          }}
                          className="text-gray-600 block w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                          placeholder="Company"
                        />
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const newExp = [...(editedProfile?.experience || [])];
                            newExp[index] = { ...exp, duration: e.target.value };
                            handleChange('experience', newExp);
                          }}
                          className="text-gray-500 block w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                          placeholder="Duration"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium">{exp.role}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-gray-500 text-sm">{exp.duration}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="text-gray-500" size={20} />
                Education
              </h2>
              <div className="space-y-4">
                {(isEditing ? editedProfile?.education : profile?.education)?.map((edu, index) => (
                  <div key={index}>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...(editedProfile?.education || [])];
                            newEdu[index] = { ...edu, degree: e.target.value };
                            handleChange('education', newEdu);
                          }}
                          className="font-medium block w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            if (editedProfile) {
                              const newEdu = [...editedProfile.education];
                              newEdu[index] = { ...edu, institution: e.target.value };
                              handleChange('education', newEdu);
                            }
                          }}
                          className="text-gray-600 block w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                          placeholder="Institution"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedProfile?.skills : profile?.skills)?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;