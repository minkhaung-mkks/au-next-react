import { useUser } from "../../context/userContextProvider";
import { useEffect, useState, useRef } from "react";
import "./Profile.css";
export default function Profile() {
    const { user, logout } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const [hasImage, setHasImage] = useState(false);
    const fileInputRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL;
    console.log(`URL => ${API_URL}`);
    async function onUpdateImage() {
        const file = fileInputRef.current?.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch(`${API_URL}/api/user/profile/image`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            if (response.ok) {
                alert("Image updated successfully.");
                fetchProfile();
            } else {
                alert("Failed to update image.");
            }
        } catch (err) {
            alert("Error uploading image.");
        }
    }
    async function fetchProfile() {
        const result = await fetch(`${API_URL}/api/user/profile`, {
            credentials: "include"
        });
        if (result.status == 401) {
            logout();
        }
        else {
            const data = await result.json();
            if (data.profileImage != null) {
                console.log("has image...");
                setHasImage(true);
            }
            console.log("data: ", data);
            setIsLoading(false);
            setData(data);
        }
    }
    useEffect(() => {
        fetchProfile();
    }, []);
    return (
        <div className="profile-page">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="profile-card">
                    <h3>Profile</h3>
                    {hasImage && (
                        <img
                            src={`${API_URL}${data.profileImage}`}
                            width={120}
                            height={120}
                        />
                    )}
                    <div>
                        <span className="profile-label">ID</span>
                        <div>{data._id}</div>
                    </div>
                    <div>
                        <span className="profile-label">Email</span>
                        <div>{data.email}</div>
                    </div>
                    <div>
                        <span className="profile-label">First Name</span>
                        <div>{data.firstname}</div>
                    </div>
                    <div>
                        <span className="profile-label">Last Name</span>
                        <div>{data.lastname}</div>
                    </div>
                    <div>
                        <span className="profile-label">Profile Image</span>
                        <div className="profile-upload">
                            <input
                                type="file"
                                id="profileImage"
                                name="profileImage"
                                ref={fileInputRef}
                            />
                            <button className="btn primary" onClick={onUpdateImage}>
                                Update Image
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}