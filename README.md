# Waste

A collaborative food management app developed to minimize food waste and enhance user engagement.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Usage](#usage)
- [Application Map](#application-map)
- [Class Diagram](#class-diagram)
- [Features Design Specifications](#features-design-specification)
- [Testing](#testing)
- [Technologies Used](#technologies-used)
- [License](#license)

## Introduction

Waste is a React Native application designed to address the issue of food waste by providing users with tools to manage their food inventory effectively. This app focuses on creating a sustainable approach to food consumption while offering a user-friendly interface for an enjoyable experience.

## Features

- **Pantry Management:** Easily track and manage your available ingredients.
- **Recipe Search:** Find recipes based on the ingredients you have. All recipes come with a nutritional information modal.
- **Food Donation and Selling:** Contribute to reducing waste by donating to local food banks or selling excess groceries.
- **Expiration Notifications:** Receive push notifications when one of your ingredients is closed to expiring.
- **Favorite Recipes & Ratings:** Good or bad, rate a recipe along with other users!
- **Food Storage Tips:** Customized tips for the user to help extend food shelf life, relative to pantry.

## Usage

- Upon launching the app, users can add items to their virtual pantry by taking pictures and inputting purchase details.
- The intuitive recipe search tool helps users discover recipes based on available ingredients.
- Options for donating to local food banks or selling groceries provide additional ways to reduce waste.

## Application Map
Below is the application map for Waste, it outlines the flow of the app beginning from the home page. Application is color coded depending on restrictions of being a registered user or not. The purple elements represent the features that anyone visiting the app can see, meaning non-registered users and registered users. Blue elements represent the pages able to be viewed strictly by registered users. Lastly, the yellow elements represent actions that only registered users can perform in the app. Refer below for the visualization of the application map.

![App Map](https://github.com/johnnynu/wstev1/blob/master/appmapwaste.PNG)

## Class Diagram
This UML diagrams contains the classes and relationships necessary to build the application. The first class is the Profile class which is the base for all of the other classes when a user is successfully logged in. Once logged in, the User may then use all features of the application such as the ReceiptScanner, Pantry, and Calendar.
![UML Diagram](https://github.com/johnnynu/wstev1/blob/master/classdiagramwaste.PNG)

## Features Design Specifications
For a deeper understanding to some of the core features of Waste, reference this [document](https://docs.google.com/document/d/1DhMeMalPH9iSho_0usakCmPoE0V5nydbR76enD5bwlM/edit?usp=sharing). Each feature outline will include an activity diagram along with a brief description of the feature designed.

## Testing
For the sake of length, all information about testing will be in this [document](https://docs.google.com/document/d/18tUTWPjKamsutftLz-_BwN3-7puMM4pQEfRLqdZckIU/edit?usp=sharing). Our testing report covers five levels of testing: Unit, Module, Integration, System and Acceptance. 

## Technologies Used

- React Native (Expo)
- Chakra UI
- Firebase

## License

This project is licensed under the [MIT License](LICENSE).
