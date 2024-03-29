DAPSI Repo readme

# permissions-ui
A React UI module for managing permissions.

This app demonstrates the use of several consepts related to health data sharing:
* [Kantara Consent Receipt](https://kantarainitiative.org/download/7902/) / [ISO/IEC 29184:2020 Online privacy notices and consent](https://www.iso.org/standard/70331.html)
* [HL7 FHIR®](http://hl7.org/fhir/) [Consent](http://hl7.org/fhir/consent.html) and [AuditEvent](http://hl7.org/fhir/auditevent.html) resources
* IHE profile for [Basic Audit Log Pattern](https://profiles.ihe.net/ITI/BALP/index.html) (BALP)

## Features
* Show permission requests, based on HL7 FHIR Consent resource.
* Allow for management of consent choices.
* Provide access to data usage information, based on HL7 FHIR AuditEvent resource and the IHE profile BALP.
* Make the Consent Receipts available for download, in JWE format.

## Live example

See a live example at [https://dev.sensotrend.fi/permissions-ui/](https://dev.sensotrend.fi/permissions-ui/).

## Contributors

©2022 [Sensotrend Oy](https://www.sensotrend.com/). Implemented as part of the Diabetes Data Portability through Open Source Components (DiDaPOSC) project.

The project has received funding from the [Next Generation Internet Initiative](https://www.ngi.eu/) (NGI) within the framework of the [DAPSI Project](https://dapsi.ngi.eu).

European Union’s H2020 research and innovation programme under Grant Agreement no 871498.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

See [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Making a Progressive Web App

See [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

See [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

See [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)
