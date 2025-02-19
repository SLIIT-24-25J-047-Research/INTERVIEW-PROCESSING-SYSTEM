import React, { useState, useEffect } from 'react';
import { KeyRound, Eye, EyeOff, X } from 'lucide-react';

interface PasswordUpdateModalProps {
    hasPassword: boolean;
    onUpdatePassword: (formData: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
}

const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({ hasPassword, onUpdatePassword }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string; submit?: string }>({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        try {
            // Create payload matching exactly what works in Postman
            const passwordPayload = {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
                // Remove confirmPassword from payload
            };
    
            await onUpdatePassword(passwordPayload);
            setIsOpen(false);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setErrors({
                submit: 'Failed to update password. Please try again.'
            });
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    if (!hasPassword) return null;

    const PasswordInput: React.FC<{ name: string; placeholder: string; value: string; show: boolean; onToggle: () => void }> = ({ name, placeholder, value, show, onToggle }) => (
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-md"
            >
                <KeyRound size={16} />
                Update Password
            </button>

            {isOpen && (
                <>
                    {/* Modal Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-xl font-semibold">Update Password</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <PasswordInput
                                        name="currentPassword"
                                        placeholder="Current Password"
                                        value={formData.currentPassword}
                                        show={showCurrentPassword}
                                        onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                                    />
                                    {errors.currentPassword && (
                                        <p className="text-sm text-red-500">{errors.currentPassword}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <PasswordInput
                                        name="newPassword"
                                        placeholder="New Password"
                                        value={formData.newPassword}
                                        show={showNewPassword}
                                        onToggle={() => setShowNewPassword(!showNewPassword)}
                                    />
                                    {errors.newPassword && (
                                        <p className="text-sm text-red-500">{errors.newPassword}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <PasswordInput
                                        name="confirmPassword"
                                        placeholder="Confirm New Password"
                                        value={formData.confirmPassword}
                                        show={showConfirmPassword}
                                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {errors.submit && (
                                    <p className="text-sm text-red-500">{errors.submit}</p>
                                )}

                                {/* Modal Footer */}
                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default PasswordUpdateModal;