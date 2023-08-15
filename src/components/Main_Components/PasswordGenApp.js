import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { simplePassword, strongPassword } from "./PasswordGeneratorFunction";

const PasswordGenApp = () => {
  // Array of random messages to be displayed when generating new passwords
  const messageList = [
    "Here's a password I made just for you!",
    "Sure, no problem.",
    "Sure, here's another one.",
    "OK. Here you are!",
    "Yep. Another one for you!",
    "I love passwords!",
    "Remember to keep your passwords safe.",
    "I still love passwords!",
    "Passwords, passwords, passwords, here you go!",
  ];

  // State to hold the generated password and index of the current message
  const [password, setPassword] = useState(simplePassword(6, 10));
  const [messageIndex, setMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Handles the change in the input box form the user and sets the value of the password to that input
  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  // Enables copy functionality for the displayed password
  const passwordCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
  };

  // Generates a new password with the specified strength and updates the message
  const newPasswordGenerator = (passwordStrength, minLength, maxLength) => {
    setPassword(passwordStrength(minLength, maxLength));
    setCopied(false);
  };

  // Generates a new message each time buttons are clicked based on the messageList array
  const newMessageGenerator = () =>
    setMessageIndex((previousMessageIndex) =>
      previousMessageIndex < messageList.length - 1
        ? previousMessageIndex + 1
        : 0
    );

  return (
    <div className=" flex justify-center mb-24">
      <div className="min-w-[320px] max-w-[350px] h-80 bg-pale-turquoise rounded-2xl flex flex-col justify-around items-center">
        {/* Messages Display area */}
        <div className="text-dark-blue text-xs my-3">
          {messageList[messageIndex]}
        </div>
        <div>
          {/* Password Display text area */}
          <input
            type="text"
            className="h-[150px] w-[250px] border border-1 border-black rounded-md font-readexPro text-center text-2xl text-black tracking-wide"
            value={password}
            onChange={handleChange}
          ></input>
          {/* Password Copy button */}
          <div
            className={`relative bottom-3/4 left-[210px] ] ${
              copied === true
                ? "text-[#4BB543] hover:text-[#4BB543] "
                : "text-gery hover:text-dark-blue "
            }`}
            onClick={passwordCopy}
          >
            {copied === true ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
          </div>
        </div>
        <div className="flex justify-around mb-5">
          {/* Button to generate another simple password */}
          <button
            className="bg-turquoise-100 h-14 w-2/5 rounded-md hover:bg-turquoise"
            onClick={() => {
              newPasswordGenerator(simplePassword, 6, 10);
              newMessageGenerator();
            }}
          >
            Another Simple Password
          </button>
          {/* Button to generate another strong password */}
          <button
            className="bg-turquoise-100 h-14 w-2/5 rounded-md hover:bg-turquoise"
            onClick={() => {
              newPasswordGenerator(strongPassword, 10, 16);
              newMessageGenerator();
            }}
          >
            Another Strong Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenApp;
