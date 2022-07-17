import { useEffect, useRef, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { useAppSelector } from "../../app/hooks";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./profile-edit-modal.module.css";
import { MdOutlineFileUpload } from "react-icons/md";

type Props = {
  showModal: boolean;
  setShowModal: () => void;
};

export const ProfileEditModal = ({ showModal, setShowModal }: Props) => {
  const domNode = useClickOutside(setShowModal);
  const { userDetails, allUsers } = useAppSelector((store) => store?.auth);

  const [profileDetails, setProfileDetails] = useState({
    displayName: "",
    userName: "",
    portfolioLink: "",
    bio: "",
  });

  const [errMsg, setErrMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef<any>(null);

  useEffect(() => {
    setProfileDetails({
      displayName: userDetails!.displayName,
      userName: userDetails!.userName,
      portfolioLink: userDetails!.portfolioLink,
      bio: userDetails!.bio,
    });
  }, [userDetails]);

  useEffect(() => {
    setErrMsg("");
  }, [profileDetails.userName]);

  useEffect(() => {
    let timeout: any;
    if (
      profileDetails.userName &&
      profileDetails.userName !== userDetails?.userName
    ) {
      timeout = setTimeout(() => {
        const userExists = allUsers.some((user) => {
          return (
            user.userName.toLowerCase() ===
            profileDetails?.userName.toLowerCase()
          );
        });
        if (userExists) {
          setErrMsg("User already Exists");
        }
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [allUsers, profileDetails.userName, userDetails?.userName]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const name = e.target.name;
    const value = e.target.value;

    setProfileDetails({ ...profileDetails, [name]: value });
  };

  return (
    <div
      className={`${
        showModal
          ? `${styles.modalOverlay} ${styles.showModal}`
          : `${styles.modalOverlay}`
      }`}
    >
      <div ref={domNode} className={styles.modalContainer}>
        <form className={styles.form}>
          <div className={styles.imgContainer}>
            {userDetails?.photo ? (
              <img
                className={`avatar ${styles.profilePhoto}`}
                src={userDetails?.photo}
                alt="gojo"
              />
            ) : (
              <BsPersonCircle className={styles.profilePhoto} />
            )}
            <MdOutlineFileUpload
              onClick={() => filePickerRef.current.click()}
              className={styles.uploadIcon}
            />
            <input type="file" ref={filePickerRef} hidden />
          </div>
          <label htmlFor="displayName">Full Name</label>
          <input
            type="text"
            name="displayName"
            value={profileDetails.displayName}
            onChange={handleChange}
          />

          <p
            className={errMsg ? styles.errmsg : styles.offscreen}
            aria-live="assertive"
          >
            {errMsg}
          </p>

          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            name="userName"
            value={profileDetails.userName}
            onChange={handleChange}
          />

          <label htmlFor="portfolioLink">Portfolio Link</label>
          <input
            type="text"
            name="portfolioLink"
            value={profileDetails.portfolioLink}
            onChange={handleChange}
          />

          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            name="bio"
            onChange={handleChange}
            value={profileDetails.bio}
          />

          <div className={styles.btnContainer}>
            <button className="btn">Submit</button>

            <button
              className=" btn btn-outline"
              onClick={(e) => {
                e.preventDefault();
                setShowModal();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};