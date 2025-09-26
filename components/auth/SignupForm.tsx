"use client";
import React, { useState, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { getUserDocHelper } from "@/utilities/userDocHelper";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useAlert } from "components/customAlertModal/AlertProvider";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [termsOfServiceChecked, setTermsOfServiceChecked] = useState(false);
  const [communityAttestationChecked, setCommunityAttestationChecked] =
    useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { show: showAlert } = useAlert();
  const alertRef = useRef<HTMLButtonElement>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      const userDoc = getUserDocHelper(userCredential.user.uid);
      await userDoc?.setUserData({
        displayName: username,
        uniqueUrl: username.toLowerCase().replace(/\s+/g, "-"),
        pronouns: { other: "other" },
        bio: "Please edit your profile ",
        links: "edit profile",
        profilePicture: "/profileAvatar.png",
        uid: userCredential.user.uid,
        autoApproveFollow: true,
        private: false,
        defaultContentType: "posts",
        contentType: ["posts", "blog", "thread"],
      });
      router.push("/profile/" + username.toLowerCase().replace(/\s+/g, "-"));
    } catch (error) {
      console.log("Error signing up:", error);
    }
  }

  const handleTermsOfServiceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTermsOfServiceChecked(e.target.checked);
  };

  const handleCommunityAttestationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityAttestationChecked(e.target.checked);
  };

  const handleShowTerms = () => {
    setShowTerms(!showTerms);
  };

  const termsOfServiceText = `Terms of Service

Effective Date: 09/19/2025

Welcome to yourNook. By accessing or using our services, you agree to the following Terms of Service. Please read carefully before using the Platform.

1. Community Commitment

yourNook was created as a safe space for LGBTQ+, People of Color, and allies. By joining, you agree to respect this mission and community.

Hate speech, harassment, or discriminatory behavior of any kind (including but not limited to race, gender identity, sexual orientation, religion, disability, or nationality) will not be tolerated.

Content or conduct that violates this commitment may result in immediate removal of content, suspension, or termination of your account.

2. Eligibility

You must be at least 13 years old (or the minimum legal age in your jurisdiction) to use the Platform.

By creating an account, you confirm that all information you provide is accurate and that you are legally permitted to use our services.

3. User Content

You are responsible for all content you post, upload, or share on the Platform.

Do not post content that is illegal, infringing, harmful, abusive, or otherwise violates these Terms.

By posting content, you grant the Platform a worldwide, non-exclusive, royalty-free license to display and distribute that content solely for operating and promoting the Platform.

4. Music and Media Usage

We encourage creativity, but you are responsible for ensuring that any music or media included in your videos complies with copyright law.

You may use royalty-free, properly licensed, or original music in your content.

Uploading copyrighted music, audio, or video without permission or license may result in removal of the content and/or suspension of your account.

The Platform is not liable for user-uploaded content that infringes on third-party rights.

5. Prohibited Conduct

You agree not to:

Engage in hate speech, harassment, or targeted abuse.

Impersonate others or misrepresent your affiliation.

Attempt to hack, disrupt, or exploit the Platform.

Upload malicious code, spam, or fraudulent content.

6. Intellectual Property

All rights to the Platform’s design, branding, software, and features remain the property of yourNook.

Users retain rights to their own original content but grant the Platform the license described in Section 3.

7. Termination

We reserve the right to suspend or terminate accounts that violate these Terms or our community standards.

You may delete your account at any time, but certain data may be retained as required by law.

8. Disclaimers & Limitation of Liability

The Platform is provided “as is” without warranties of any kind.

We are not responsible for damages resulting from use of the Platform, including user-generated content.

Our liability is limited to the maximum extent permitted by law.

9. Changes to the Terms

We may update these Terms from time to time. Continued use of the Platform after changes are made constitutes your acceptance of the revised Terms.

10. Contact

If you have questions about these Terms, please contact us at: yourNook@yourNook.com`;
  return (
    <>
      <div className="flex flex-col border border-gray-300 justify-center items-center bg-white p-2 sm:p-6 rounded-lg shadow-md">
        <input
          className="border w-56 m-2 rounded p-1"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border w-56 m-2 rounded p-1"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border w-56 m-2 rounded p-1"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="border w-56 m-2 rounded p-1"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex justify-start items-start mt-2">
          <input
            type={"checkbox"}
            className="mx-2 mt-2"
            checked={termsOfServiceChecked}
            onChange={handleTermsOfServiceChange}
          />
          <span className="text-xs relative">
            By checking this box I agree to the Terms of Service and Privacy
            Policy
            <p
              onClick={handleShowTerms}
              className="text-blue-500 cursor-pointer text-xs"
            >
              Read the Terms of Service here
            </p>
            {showTerms && (
              <div className="absolute top-12 left-0 bg-white border p-4 w-64 h-64 overflow-hidden z-20 shadow-lg">
                <IoIosCloseCircleOutline
                  className="absolute top-2 right-2 cursor-pointer"
                  size={20}
                  onClick={handleShowTerms}
                />
                <h2 className="text-lg font-bold mb-2">Terms of Service</h2>
                <p className="text-sm h-46 overflow-auto">
                  {termsOfServiceText.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            )}
          </span>
        </div>
        <div className="flex justify-start items-start mt-2">
          <input
            type={"checkbox"}
            className="mx-2 mt-1"
            checked={communityAttestationChecked}
            onChange={handleCommunityAttestationChange}
          />
          <span className="text-xs">
            By checking this box I attest that I am a part of the LGBT or POC
            communities, or an ally of one of these communities. Hate or
            discrimination of any kind will not be tolerated.
          </span>
        </div>
        <div className="relative inline-block group">
          <button
            ref={alertRef}
            className="cursor-pointer bg-blue-950 text-white rounded p-1 mt-1 w-56 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !email ||
              !password ||
              !username ||
              !termsOfServiceChecked ||
              !communityAttestationChecked
            }
            onClick={(e) => {
              const messages = [];
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

              if (password !== confirmPassword) {
                messages.push("Passwords do not match.");
              }
              if (password.length < 6) {
                messages.push("Password must be at least 6 characters.");
              }
              if (!emailRegex.test(email)) {
                messages.push("Please enter a valid email address.");
              }

              if (messages.length > 0) {
                showAlert(
                  messages.join(" "),
                  { bottom: 30, right: -15 },
                  alertRef
                );
                return;
              }
              handleSignup(e);
            }}
          >
            Sign Up
          </button>
          {(!email ||
            !password ||
            !username ||
            !termsOfServiceChecked ||
            !communityAttestationChecked) && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-2 rounded bg-gray-800 text-white text-sm text-center opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
              Please fill all fields and check all boxes to enable Sign Up.
            </div>
          )}
        </div>
        {/* <p>Already have an account? <a href="/login">Login</a></p> */}
      </div>
    </>
  );
}

export default SignupForm;
