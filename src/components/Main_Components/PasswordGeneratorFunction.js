// PasswordGeneratorFunction.js

// Importing required JSON data containing words and special characters.
const jsonData = require("../assets/paswords-words-characters.json");
const words = jsonData.words;
const specialCharactersMatchList = jsonData.specialCharactersMatch;
const specialCharacters = jsonData.specialCharacters;

// Combines two words from the 'words' array and returns the resulting string within the specified length range.
const passwordStringGenerator = (minLength, maxLength) => {
  // Function to generate a random index between 1 and the length of 'words' array.
  const randomIndex = () => Math.floor(Math.random() * words.length) + 1;

  // Function to get two random words and concatenate them.
  const randomWords = () => words[randomIndex()] + words[randomIndex()];

  let passwordString = randomWords();

  // Loop to ensure the password length is within the specified range.
  while (passwordString.length <= minLength || passwordString.length >= maxLength) {
    passwordString = randomWords();
  }

  return passwordString;
};

// Capitalizes the first letter of a string.
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generates a simple password with a mix of capitalized words, random number, and a special character.
const simplePassword = (minLength, maxLength) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const specialCharacter =
    specialCharacters[Math.floor(Math.random() * specialCharacters.length) + 1];
  let password = passwordStringGenerator(minLength, maxLength);
  password =
    capitalizeFirstLetter(password) + randomNumber + specialCharacter;
  return password;
};

// Generates a strong password with a mix of uppercase and lowercase letters, digits, and special characters.
const strongPassword = (minLength, maxLength) => {
  let password = passwordStringGenerator(minLength, maxLength);

  // Function to replace characters in the password with corresponding special characters.
  const replaceSpecialCharacters = () => {
    // Create a regular expression pattern based on specialCharactersMatchList keys.
    const regexPattern = new RegExp(
      `[${Object.keys(specialCharactersMatchList).join("")}]`,
      "g"
    );

    // Replace characters in the password with random corresponding special characters.
    return password.replace(regexPattern, (match) => {
      const correspondingCharacters = specialCharactersMatchList[match];
      return correspondingCharacters[
        Math.floor(Math.random() * correspondingCharacters.length)
      ];
    });
  };

  // Return the final generated password after replacing special characters.
  return replaceSpecialCharacters();
};

// Export the simplePassword and strongPassword functions for use in other modules.
module.exports = { simplePassword, strongPassword };
