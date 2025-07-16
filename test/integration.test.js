const request = require("supertest"); 
const express = require("express");
const { coApplicantController } = require("../controllers/coApplicantController");
const { applicantController } = require("../controllers/applicantController");
const { corporationController } = require("../controllers/corporationController");
const { leadController } = require("../controllers/leadController");
const { equipmentDescriptionController } = require("../controllers/equipmentDescriptionController");
const { addressController } = require("../controllers/addressController");
const { pool } = require("../db/connect");

// Mock the database pool
jest.mock("../db/connect.js", () => ({
  pool: {
    query: jest.fn(),
  },
}));


const app = express();
app.use(express.json());

// Define routes for each controller
app.post("/co-applicants", coApplicantController.createCoApplicant);
app.get("/co-applicants", coApplicantController.getAllCoApplicants);
app.get("/co-applicants/:id", coApplicantController.getCoApplicantById);
app.put("/co-applicants/:id", coApplicantController.updateCoApplicantById);
app.delete("/co-applicants/:id", coApplicantController.deleteCoApplicantById);

app.post("/applicants", applicantController.createApplicant);
app.get("/applicants", applicantController.getAllApplicants);
app.get("/applicants/:id", applicantController.getApplicantById);
app.put("/applicants/:id", applicantController.updateApplicantById);
app.delete("/applicants/:id", applicantController.deleteApplicantById);

app.post("/corporations", corporationController.createCorporation);
app.get("/corporations", corporationController.getAllCorporations);
app.get("/corporations/:id", corporationController.getCorporationById);
app.put("/corporations/:id", corporationController.updateCorporationById);
app.delete("/corporations/:id", corporationController.deleteCorporationById);

app.post("/leads", leadController.createLead);
app.get("/leads", leadController.getAllLeads);
app.get("/leads/:id", leadController.getLeadById);
app.put("/leads/:id", leadController.updateLeadById);
app.delete("/leads/:id", leadController.deleteLeadById);

app.post("/equipment-descriptions", equipmentDescriptionController.createEquipmentDescription);
app.get("/equipment-descriptions", equipmentDescriptionController.getAllEquipmentDescriptions);
app.get("/equipment-descriptions/:id", equipmentDescriptionController.getEquipmentDescriptionById);
app.put("/equipment-descriptions/:id", equipmentDescriptionController.updateEquipmentDescriptionById);
app.delete("/equipment-descriptions/:id", equipmentDescriptionController.deleteEquipmentDescriptionById);

app.post("/addresses", addressController.createAddress);
app.get("/addresses", addressController.getAllAddresses);
app.get("/addresses/:id", addressController.getAddressById);
app.put("/addresses/:id", addressController.updateAddressById);
app.delete("/addresses/:id", addressController.deleteAddressById);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

describe("API Integration Tests", () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  // Co-Applicant Tests
  describe("Co-Applicant Controller", () => {
    it("should create a co-applicant", async () => {
      const mockData = {
        id: 1,
        person_id: 1,
        co_applicant_type: "partner",
        phone_same_as_company: true,
        address_same_as_company: false,
      };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .post("/co-applicants")
        .send({
          person_id: 1,
          co_applicant_type: "partner",
          phone_same_as_company: true,
          address_same_as_company: false,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockData);
    });

    it("should get all co-applicants", async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      pool.query.mockResolvedValueOnce({ rows: mockData });

      const response = await request(app).get("/co-applicants");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should get a co-applicant by ID", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).get("/co-applicants/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should update a co-applicant", async () => {
      const mockData = { id: 1, co_applicant_type: "updated" };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .put("/co-applicants/1")
        .send({ co_applicant_type: "updated" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should delete a co-applicant", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).delete("/co-applicants/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });


 // Lead Tests
  describe("Lead Controller", () => {
    it("should create a lead", async () => {
      const mockData = {
        id: 1,
        referral_source: "web",
        sales_agent: "Agent Smith",
        num_co_applicants: 2,
        status: "pending",
      };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .post("/leads")
        .send({
          referral_source: "web",
          sales_agent: "Agent Smith",
          num_co_applicants: 2,
          status: "pending",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockData);
    });

    it("should get all leads", async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      pool.query.mockResolvedValueOnce({ rows: mockData });

      const response = await request(app).get("/leads");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should get a lead by ID", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).get("/leads/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should update a lead", async () => {
      const mockData = { id: 1, status: "approved" };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .put("/leads/1")
        .send({ status: "approved" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should delete a lead", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).delete("/leads/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  // Applicant Tests   
  //Code fails this tests due to DB constraints over column relation between tables
describe("Applicant Controller", () => {
  it("should create an applicant", async () => {
    const mockData = {
      id: 1,
      lead_id: 1,
      first_name: "John",
      last_name: "Doe",
      is_principal: true,
      phone: "1234567890",
      email: "john@example.com",
      home_ownership: "own",
      monthly_payment: 1000,
    };
    pool.query.mockResolvedValueOnce({ rows: [mockData] });

    const response = await request(app)
      .post("/applicants")
      .send({
        lead_id: 1,
        first_name: "John",
        middle_name: null,
        last_name: "Doe",
        is_principal: true,
        position: null,
        ownership_percent: null,
        phone: "1234567890",
        email: "john@example.com",
        home_ownership: "own",
        monthly_payment: 1000,
      });

    console.log(response.body); // Debugging: Log the response body
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockData);
  });

  it("should get all applicants", async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    pool.query.mockResolvedValueOnce({ rows: mockData });

    const response = await request(app).get("/applicants");

    console.log(response.body); // Debugging: Log the response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it("should get an applicant by ID", async () => {
    const mockData = { id: 1 };
    pool.query.mockResolvedValueOnce({ rows: [mockData] });

    const response = await request(app).get("/applicants/1");

    console.log(response.body); // Debugging: Log the response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it("should update an applicant", async () => {
    const mockData = { id: 1, first_name: "Jane" };
    pool.query.mockResolvedValueOnce({ rows: [mockData] });

    const response = await request(app)
      .put("/applicants/1")
      .send({ first_name: "Jane" });

    console.log(response.body); // Debugging: Log the response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it("should delete an applicant", async () => {
    const mockData = { id: 1 };
    pool.query.mockResolvedValueOnce({ rows: [mockData] });

    const response = await request(app).delete("/applicants/1");

    console.log(response.body); // Debugging: Log the response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });
});


  // Corporation Tests
  describe("Corporation Controller", () => {
    it("should create a corporation", async () => {
      const mockData = {
        id: 1,
        lead_id: 1,
        business_name: "Test Corp",
        language: "English",
        industry: "Tech",
        years_in_business: 5,
        phone: "1234567890",
      };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .post("/corporations")
        .send({
          lead_id: 1,
          business_name: "Test Corp",
          operating_name: null,
          language: "English",
          industry: "Tech",
          hst_number: null,
          years_in_business: 5,
          phone: "1234567890",
          fax: null,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockData);
    });

    it("should get all corporations", async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      pool.query.mockResolvedValueOnce({ rows: mockData });

      const response = await request(app).get("/corporations");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should get a corporation by ID", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).get("/corporations/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should update a corporation", async () => {
      const mockData = { id: 1, business_name: "Updated Corp" };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .put("/corporations/1")
        .send({ business_name: "Updated Corp" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should delete a corporation", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).delete("/corporations/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

 

  // Equipment Description Tests
  describe("Equipment Description Controller", () => {
    it("should create an equipment description", async () => {
      const mockData = { id: 1, lead_id: 1, description: "Test equipment" };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .post("/equipment-descriptions")
        .send({
          lead_id: 1,
          description: "Test equipment",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockData);
    });

    it("should get all equipment descriptions", async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      pool.query.mockResolvedValueOnce({ rows: mockData });

      const response = await request(app).get("/equipment-descriptions");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should get an equipment description by ID", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).get("/equipment-descriptions/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should update an equipment description", async () => {
      const mockData = { id: 1, description: "Updated equipment" };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .put("/equipment-descriptions/1")
        .send({ description: "Updated equipment" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should delete an equipment description", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).delete("/equipment-descriptions/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  // Address Tests
  describe("Address Controller", () => {
    it("should create an address", async () => {
      const mockData = {
        id: 1,
        corporation_id: 1,
        address_line_1: "123 Main St",
        city: "Toronto",
        province: "ON",
        postal_code: "M1M1M1",
      };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .post("/addresses")
        .send({
          corporation_id: 1,
          address_line_1: "123 Main St",
          city: "Toronto",
          province: "ON",
          postal_code: "M1M1M1",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockData);
    });

    it("should get all addresses", async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      pool.query.mockResolvedValueOnce({ rows: mockData });

      const response = await request(app).get("/addresses");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should get an address by ID", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).get("/addresses/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should update an address", async () => {
      const mockData = { id: 1, city: "Ottawa" };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app)
        .put("/addresses/1")
        .send({ city: "Ottawa" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should delete an address", async () => {
      const mockData = { id: 1 };
      pool.query.mockResolvedValueOnce({ rows: [mockData] });

      const response = await request(app).delete("/addresses/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });
});