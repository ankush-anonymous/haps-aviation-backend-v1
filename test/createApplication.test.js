const { applicationService } = require("../service/applicationService");

async function createApplication(applicationData) {
  try {
    const result = await applicationService.createApplication(applicationData);
    console.log("Application created successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to create application:", error);
    throw error; // Re-throw the error if you want the caller to handle it
  }
}

// Example usage
const applicationData = {
  referralSource: "social-media",
  salesAgent: "jane-smith",
  numCoApplicants: 1,
  status: "Saved",
  businessName: "asdf",
  operatingName: "sadf",
  language: "English",
  industry: "finance",
  hstNumber: "123456789",
  yearsInBusiness: 23423,
  phone: "07360094881",
  fax: "07360094882",
  addressLine1: "225-E, Aditya syndicate colony",
  city: "Adityapur",
  province: "Jharkhand",
  postalCode: "831014",
  firstName: "asdfasdf",
  middleName: "asdf",
  lastName: "asdfasdfad",
  isPrincipal: true,
  position: "asdfasdf",
  ownershipPercent: 23,
  contact: "07360094881",
  homeOwnership: "Owner",
  coApplicantType: "co signer individual",
  phoneSameAsCompany: true,
  addressSameAsCompany: false,
  equipmentDescription: "fdasfasdf",
};

// Call the function to test the service
createApplication(applicationData)
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.error("error in creating application")
  });
