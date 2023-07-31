import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import { simplePassword, strongPassword } from "./PasswordGeneratorFunction";

const PasswordGenApp = () => {
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

  const [password, setPassword] = useState(simplePassword(6, 10));
  const [messageIndex, setMessageIndex] = useState(0);


  //Handles the change in the input box form the user and sets the value of password to that input
  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  //Enables copy functionality
  const passwordCopy = () => {
    navigator.clipboard.writeText(password);
  };

  // Generates strong or simple password based on the parameters
  const newPasswordGenerator = (passwordStrength, minLength, MaxLength) => {
    setPassword(passwordStrength(minLength, MaxLength));
  };

  //Generates new message each time buttons are clicked. Utilizes messageList array.
  const newMessageGenerator = () =>
    messageIndex < messageList.length - 1
      ? setMessageIndex((previousMessageIndex) => previousMessageIndex + 1)
      : setMessageIndex(0);

  return (
    <div className=" my-16 md:my-0 md:w-3/5   md:flex md:justify-center ">
      <div className=" min-w-[320px] max-w-[350px] h-80 bg-pale-turquoise rounded-2xl flex flex-col justify-around  items-center">
        <div className=" text-dark-blue text-sm my-2">
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
            className="relative bottom-3/4 left-[210px] text-gery hover:text-dark-blue active:text-[#008000]"
            onClick={passwordCopy}
          >
            <ContentCopyIcon />
          </div>
        </div>
        <div className="flex justify-around mb-5">
          <button
            className=" bg-turquoise-100 h-14 w-2/5 rounded-md hover:bg-turquoise"
            onClick={() => {
              newPasswordGenerator(simplePassword, 6, 10);
              newMessageGenerator();
            }}
          >
            Another Simple Password
          </button>
          <button
            className=" bg-turquoise-100 h-14 w-2/5 rounded-md  hover:bg-turquoise"
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
