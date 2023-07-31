// PasswordGeneratorFunction.js
/**
 * This file exports a function that generates random passwords for the PasswordGenerator.js React component.
 * It creates secure passwords with a mix of uppercase and lowercase letters, digits, and special characters.
 * Users can customize the password length and choose included character types.
 * @file Exports the password generator function for use in PasswordGenerator.js.
 * @see PasswordGenerator.js
 */

const jsonData = require("../assets/paswords-words-characters.json");
const words = jsonData.words;
const specialCharactersMatchList = jsonData.specialCharactersMatch;
const specialCharacters = jsonData.specialCharacters;

// Combines two words form words array and returns the result between minLength, maxLength
const passwordStringGenerator = (minLength, maxLength) => {
  //Generates random number between the length of words array
  const randomIndex = () => Math.floor(Math.random() * words.length) + 1;
  const randomWords = () => words[randomIndex()] + words[randomIndex()];

  let passwordString = randomWords();

  while (
    passwordString.length <= minLength ||
    passwordString.length >= maxLength
  ) {
    passwordString = randomWords();
  }
  return passwordString;
};

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const simplePassword = (minLength, maxLength) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const specialCharacter =
    specialCharacters[Math.floor(Math.random() * specialCharacters.length) + 1];
  let password = passwordStringGenerator(minLength, maxLength);
  password =
    capitalizeFirstLetter(password) + randomNumber + specialCharacter;
  return password;
};

const strongPassword = (minLength, maxLength) => {
  let password = passwordStringGenerator(minLength, maxLength);

  //function to replace special characters
  const replaceSpecialCharacters = () => {
    const regexPattern = new RegExp(
      `[${Object.keys(specialCharactersMatchList).join("")}]`,
      "g"
    );

    return password.replace(regexPattern, (match) => {
      const correspondingCharacters = specialCharactersMatchList[match];
      return correspondingCharacters[
        Math.floor(Math.random() * correspondingCharacters.length)
      ];
    });
  };

  // Return the final generated password after replacing special characters
  return replaceSpecialCharacters();
};

module.exports = { simplePassword, strongPassword };
