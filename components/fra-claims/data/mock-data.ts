// components/fra-claims/data/mock-data-expanded.ts
// 44 Comprehensive Mock Data Entries for FRA Claims Registry

// Enhanced interface with scheme eligibility
export interface FRAIndividualClaim {
  id: string;
  claimantName: string;
  spouseName?: string;
  fatherMotherName: string;
  address: string;
  village: string;
  gramPanchayat: string;
  tehsilTaluka: string;
  district: string;
  scheduledTribe: boolean;
  otherTraditionalForestDweller: boolean;
  familyMembers: FamilyMember[];
  landClaims: LandClaim[];
  coordinates: [number, number];
  claimDate: string;
  status: 'pending' | 'approved' | 'rejected';
  titleNumber?: string;
  area?: number;
  schemeEligibility: SchemeEligibility;
  annualIncome?: number;
  bankAccount?: string;
  aadhaarNumber?: string;
  rationCardType?: 'APL' | 'BPL' | 'AAY';
  fraAtlasReference?: string; // Reference to FRA Atlas data
}

export interface FamilyMember {
  name: string;
  age: number;
  relationship: string;
}

export interface LandClaim {
  type: 'habitation' | 'self-cultivation' | 'disputed' | 'pattas' | 'rehabilitation' | 'displaced' | 'forest-villages' | 'traditional';
  area: number;
  description: string;
  evidence: string[];
}

export interface SchemeEligibility {
  pmKisan: {
    eligible: boolean;
    status: 'enrolled' | 'pending' | 'not_enrolled';
    amount?: number;
    reason?: string;
  };
  dajgua: {
    eligible: boolean;
    status: 'enrolled' | 'pending' | 'not_enrolled';
    cropArea?: number;
    reason?: string;
  };
  jalJeevanYojana: {
    eligible: boolean;
    status: 'enrolled' | 'pending' | 'not_enrolled';
    connectionStatus?: 'applied' | 'sanctioned' | 'connected';
    reason?: string;
  };
  pmAwasYojana: {
    eligible: boolean;
    status: 'enrolled' | 'pending' | 'not_enrolled';
    houseStatus?: 'applied' | 'sanctioned' | 'completed';
    reason?: string;
  };
  mgnrega: {
    eligible: boolean;
    status: 'enrolled' | 'pending' | 'not_enrolled';
    jobCardNumber?: string;
    daysWorked?: number;
    reason?: string;
  };
  forestRightsIncentive: {
    eligible: boolean;
    status: 'enrolled' | 'pending' | 'not_enrolled';
    incentiveType?: 'conservation' | 'afforestation' | 'ntfp';
    amount?: number;
    reason?: string;
  };
}

export interface FRACommunityResourceClaim {
  id: string;
  village: string;
  gramPanchayat: string;
  tehsilTaluka: string;
  district: string;
  claimants: { name: string; status: 'ST' | 'OTFD' }[];
  communityRights: {
    type: string;
    description: string;
  }[];
  khasraCompartmentNo?: string[];
  borderingVillages: string[];
  coordinates: [number, number];
  area: number;
  description: string;
  evidence: string[];
  claimDate: string;
  status: 'pending' | 'approved' | 'rejected';
  titleNumber?: string;
  communitySchemeEligibility?: {
    cfmScheme: { eligible: boolean; status: string };
    ecoDevelopment: { eligible: boolean; status: string };
    tribalDevelopment: { eligible: boolean; status: string };
  };
}

// Helper function to generate scheme eligibility
const generateSchemeEligibility = (
  claim: { 
    scheduledTribe: boolean; 
    landClaims: LandClaim[]; 
    status: string;
    area?: number;
    village: string;
  },
  annualIncome: number
): SchemeEligibility => {
  const cultivationArea = claim.landClaims
    .filter(lc => lc.type === 'self-cultivation')
    .reduce((sum, lc) => sum + lc.area, 0);
  
  const hasLand = cultivationArea > 0;
  const isTribal = claim.scheduledTribe;
  const isApproved = claim.status === 'approved';
  const isBPL = annualIncome < 120000;
  
  return {
    pmKisan: {
      eligible: hasLand && cultivationArea <= 2.0 && isApproved,
      status: hasLand && cultivationArea <= 2.0 && isApproved ? 
        (Math.random() > 0.6 ? 'enrolled' : 'pending') : 'not_enrolled',
      amount: hasLand && cultivationArea <= 2.0 && isApproved ? 6000 : undefined,
      reason: !hasLand ? 'No cultivable land' : 
               cultivationArea > 2.0 ? 'Land area exceeds limit' :
               !isApproved ? 'Claim not approved' : undefined
    },
    dajgua: {
      eligible: isTribal && hasLand && isApproved,
      status: isTribal && hasLand && isApproved ? 
        (Math.random() > 0.5 ? 'enrolled' : 'pending') : 'not_enrolled',
      cropArea: hasLand ? cultivationArea : undefined,
      reason: !isTribal ? 'Not scheduled tribe' :
               !hasLand ? 'No cultivable land' :
               !isApproved ? 'Claim not approved' : undefined
    },
    jalJeevanYojana: {
      eligible: isBPL,
      status: isBPL ? (Math.random() > 0.4 ? 'enrolled' : 'pending') : 'not_enrolled',
      connectionStatus: isBPL ? 
        (Math.random() > 0.7 ? 'connected' : 
         Math.random() > 0.4 ? 'sanctioned' : 'applied') : undefined,
      reason: !isBPL ? 'Above income threshold' : undefined
    },
    pmAwasYojana: {
      eligible: isBPL && (isTribal || claim.village.includes('forest')),
      status: isBPL && (isTribal || claim.village.includes('forest')) ? 
        (Math.random() > 0.5 ? 'enrolled' : 'pending') : 'not_enrolled',
      houseStatus: isBPL && (isTribal || claim.village.includes('forest')) ?
        (Math.random() > 0.6 ? 'completed' : 
         Math.random() > 0.3 ? 'sanctioned' : 'applied') : undefined,
      reason: !isBPL ? 'Above income threshold' :
               !(isTribal || claim.village.includes('forest')) ? 'Not priority category' : undefined
    },
    mgnrega: {
      eligible: isBPL,
      status: isBPL ? 'enrolled' : 'not_enrolled',
      jobCardNumber: isBPL ? `JC${Math.floor(Math.random() * 100000)}` : undefined,
      daysWorked: isBPL ? Math.floor(Math.random() * 100) + 50 : undefined,
      reason: !isBPL ? 'Above income threshold' : undefined
    },
    forestRightsIncentive: {
      eligible: isTribal && isApproved,
      status: isTribal && isApproved ? 
        (Math.random() > 0.7 ? 'enrolled' : 'pending') : 'not_enrolled',
      incentiveType: isTribal && isApproved ? 
        (['conservation', 'afforestation', 'ntfp'] as const)[Math.floor(Math.random() * 3)] : undefined,
      amount: isTribal && isApproved ? Math.floor(Math.random() * 25000) + 5000 : undefined,
      reason: !isTribal ? 'Not scheduled tribe' :
               !isApproved ? 'Claim not approved' : undefined
    }
  };
};

// 44 Comprehensive Individual Claims Data
export const mockFRAIndividualClaims: FRAIndividualClaim[] = [
  // Kandhamal District (12 entries)
  {
    id: "KDM001",
    claimantName: "Ram Bahadur Singh",
    spouseName: "Sita Devi Singh",
    fatherMotherName: "Hari Singh",
    address: "Plot No. 45, Tribal Settlement",
    village: "Kotagarh",
    gramPanchayat: "Kotagarh",
    tehsilTaluka: "Phulbani",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Sita Devi Singh", age: 45, relationship: "Wife" },
      { name: "Ravi Singh", age: 18, relationship: "Son" },
      { name: "Priya Singh", age: 16, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "habitation", area: 0.5, description: "Residential plot with traditional hut", evidence: ["Village Records", "Witness Statement"] },
      { type: "self-cultivation", area: 2.5, description: "Agricultural land for paddy cultivation", evidence: ["Revenue Records", "Cultivation Proof"] }
    ],
    coordinates: [84.2619, 20.4781],
    claimDate: "2023-03-15",
    status: "approved",
    titleNumber: "KDM2023001",
    area: 3.0,
    annualIncome: 85000,
    bankAccount: "HDFC001234567890",
    aadhaarNumber: "1234-5678-9012",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM002",
    claimantName: "Durga Majhi",
    fatherMotherName: "Bhima Majhi",
    address: "Village Road, Near Forest",
    village: "Daringbadi",
    gramPanchayat: "Daringbadi",
    tehsilTaluka: "Daringbadi",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Kiran Majhi", age: 22, relationship: "Son" },
      { name: "Sunita Majhi", age: 19, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "habitation", area: 0.3, description: "Traditional dwelling place", evidence: ["Gram Sabha Certificate"] },
      { type: "self-cultivation", area: 1.2, description: "Kitchen garden and vegetable cultivation", evidence: ["Agricultural Survey", "Photo Documentation"] }
    ],
    coordinates: [84.1167, 20.5167],
    claimDate: "2023-05-22",
    status: "pending",
    area: 1.5,
    annualIncome: 72000,
    bankAccount: "UCO123456789012",
    aadhaarNumber: "3456-7890-1234",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM003",
    claimantName: "Mangal Das",
    spouseName: "Kamala Das",
    fatherMotherName: "Gopal Das",
    address: "Kutia Para",
    village: "Belghar",
    gramPanchayat: "Belghar",
    tehsilTaluka: "Tumudibandh",
    district: "Kandhamal",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Kamala Das", age: 42, relationship: "Wife" },
      { name: "Bikash Das", age: 15, relationship: "Son" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 1.8, description: "Vegetable cultivation and horticulture", evidence: ["Agricultural Records", "Irrigation Certificate"] }
    ],
    coordinates: [84.3456, 20.3892],
    claimDate: "2023-07-10",
    status: "approved",
    titleNumber: "KDM2023003",
    area: 1.8,
    annualIncome: 145000,
    bankAccount: "BOI567890123456",
    aadhaarNumber: "4567-8901-2345",
    rationCardType: "APL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM004",
    claimantName: "Sunita Pradhan",
    spouseName: "Ravi Pradhan",
    fatherMotherName: "Gopi Pradhan",
    address: "Hill View Colony",
    village: "Raikia",
    gramPanchayat: "Raikia",
    tehsilTaluka: "Raikia",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Ravi Pradhan", age: 38, relationship: "Husband" },
      { name: "Anju Pradhan", age: 12, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "traditional", area: 0.8, description: "Traditional medicinal plant cultivation", evidence: ["Community Certificate", "Traditional Knowledge Records"] }
    ],
    coordinates: [84.1892, 20.5234],
    claimDate: "2023-08-05",
    status: "rejected",
    area: 0.8,
    annualIncome: 55000,
    bankAccount: "PNB789012345678",
    aadhaarNumber: "5678-9012-3456",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM005",
    claimantName: "Basu Nayak",
    spouseName: "Radha Nayak",
    fatherMotherName: "Krushna Nayak",
    address: "Forest Lane, Kutia Kandha Para",
    village: "Tikabali",
    gramPanchayat: "Tikabali",
    tehsilTaluka: "Tikabali",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Radha Nayak", age: 35, relationship: "Wife" },
      { name: "Sagar Nayak", age: 14, relationship: "Son" },
      { name: "Laxmi Nayak", age: 11, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.2, description: "Turmeric and spice cultivation", evidence: ["Agricultural Records", "Crop Certificate"] },
      { type: "habitation", area: 0.4, description: "Family dwelling with cattle shed", evidence: ["Village Headman Certificate"] }
    ],
    coordinates: [84.0987, 20.4234],
    claimDate: "2023-09-12",
    status: "approved",
    titleNumber: "KDM2023005",
    area: 2.6,
    annualIncome: 95000,
    bankAccount: "IOB890123456789",
    aadhaarNumber: "6789-0123-4567",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM006",
    claimantName: "Laxman Parida",
    spouseName: "Maya Parida",
    fatherMotherName: "Dhan Parida",
    address: "Mahal Sahi",
    village: "Balliguda",
    gramPanchayat: "Balliguda",
    tehsilTaluka: "Balliguda",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Maya Parida", age: 40, relationship: "Wife" },
      { name: "Bipin Parida", age: 20, relationship: "Son" },
      { name: "Nila Parida", age: 17, relationship: "Daughter" },
      { name: "Chotu Parida", age: 8, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.6, description: "Residential area with traditional architecture", evidence: ["Revenue Survey", "Community Testimony"] },
      { type: "self-cultivation", area: 1.9, description: "Mixed crop cultivation including millets", evidence: ["Crop Survey", "Agricultural Extension Records"] }
    ],
    coordinates: [84.1234, 20.4567],
    claimDate: "2023-04-18",
    status: "approved",
    titleNumber: "KDM2023006",
    area: 2.5,
    annualIncome: 78000,
    bankAccount: "SBI234567890123",
    aadhaarNumber: "7890-1234-5678",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM007",
    claimantName: "Biswanath Kanhar",
    fatherMotherName: "Ramesh Kanhar",
    address: "Forest Colony",
    village: "G Udayagiri",
    gramPanchayat: "G Udayagiri",
    tehsilTaluka: "G Udayagiri",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Anita Kanhar", age: 25, relationship: "Daughter" },
      { name: "Santosh Kanhar", age: 23, relationship: "Son" }
    ],
    landClaims: [
      { type: "traditional", area: 1.3, description: "Traditional forest produce collection area", evidence: ["Tribal Council Certificate", "Forest Department Records"] }
    ],
    coordinates: [84.2789, 20.5123],
    claimDate: "2023-06-30",
    status: "pending",
    area: 1.3,
    annualIncome: 65000,
    bankAccount: "CANARA345678901234",
    aadhaarNumber: "8901-2345-6789",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM008",
    claimantName: "Pramila Mallick",
    spouseName: "Jagdish Mallick",
    fatherMotherName: "Baidhar Mallick",
    address: "Tribal Settlement Area",
    village: "Chakapad",
    gramPanchayat: "Chakapad",
    tehsilTaluka: "Chakapad",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Jagdish Mallick", age: 50, relationship: "Husband" },
      { name: "Dipti Mallick", age: 21, relationship: "Daughter" },
      { name: "Rakesh Mallick", age: 19, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.4, description: "Traditional kutcha house with courtyard", evidence: ["Village Records", "Family History"] },
      { type: "self-cultivation", area: 1.6, description: "Paddy and vegetable cultivation", evidence: ["Irrigation Records", "Crop Documentation"] }
    ],
    coordinates: [84.3567, 20.4189],
    claimDate: "2023-02-14",
    status: "approved",
    titleNumber: "KDM2023008",
    area: 2.0,
    annualIncome: 89000,
    bankAccount: "AXIS456789012345",
    aadhaarNumber: "9012-3456-7890",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM009",
    claimantName: "Dillip Digal",
    spouseName: "Sumitra Digal",
    fatherMotherName: "Lokanath Digal",
    address: "Panchayat Road",
    village: "Nuagaon",
    gramPanchayat: "Nuagaon",
    tehsilTaluka: "Nuagaon",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Sumitra Digal", age: 43, relationship: "Wife" },
      { name: "Roshni Digal", age: 16, relationship: "Daughter" },
      { name: "Prakash Digal", age: 13, relationship: "Son" },
      { name: "Mina Digal", age: 9, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.8, description: "Extensive paddy cultivation with irrigation", evidence: ["Water Rights Certificate", "Agricultural Survey"] },
      { type: "habitation", area: 0.7, description: "Large family compound with multiple structures", evidence: ["Construction Records", "Village Survey"] }
    ],
    coordinates: [84.2345, 20.3678],
    claimDate: "2023-01-20",
    status: "approved",
    titleNumber: "KDM2023009",
    area: 3.5,
    annualIncome: 112000,
    bankAccount: "PNB567890123456",
    aadhaarNumber: "0123-4567-8901",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM010",
    claimantName: "Sanjay Kanhar",
    fatherMotherName: "Bhuban Kanhar",
    address: "Near PHC",
    village: "Mandakia",
    gramPanchayat: "Mandakia",
    tehsilTaluka: "Mandakia",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Rashmi Kanhar", age: 28, relationship: "Daughter" },
      { name: "Ajit Kanhar", age: 26, relationship: "Son" }
    ],
    landClaims: [
      { type: "traditional", area: 0.9, description: "Medicinal plant cultivation and collection", evidence: ["Traditional Knowledge Documentation", "Forest Rights Certificate"] }
    ],
    coordinates: [84.4123, 20.5456],
    claimDate: "2023-03-28",
    status: "pending",
    area: 0.9,
    annualIncome: 58000,
    bankAccount: "UNION678901234567",
    aadhaarNumber: "1234-5678-9013",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM011",
    claimantName: "Kamala Pradhan",
    spouseName: "Ashok Pradhan",
    fatherMotherName: "Mohan Pradhan",
    address: "Hill Station Road",
    village: "Baliguda",
    gramPanchayat: "Baliguda",
    tehsilTaluka: "Baliguda",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Ashok Pradhan", age: 52, relationship: "Husband" },
      { name: "Smita Pradhan", age: 24, relationship: "Daughter" },
      { name: "Raj Pradhan", age: 22, relationship: "Son" },
      { name: "Mitu Pradhan", age: 14, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "habitation", area: 0.5, description: "Traditional hill dwelling", evidence: ["Ancestral Records", "Community Certificate"] },
      { type: "self-cultivation", area: 2.1, description: "Terraced cultivation of cash crops", evidence: ["Terracing Survey", "Crop Yield Records"] }
    ],
    coordinates: [84.1678, 20.4912],
    claimDate: "2023-05-15",
    status: "approved",
    titleNumber: "KDM2023011",
    area: 2.6,
    annualIncome: 98000,
    bankAccount: "ICICI789012345678",
    aadhaarNumber: "2345-6789-0124",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KDM012",
    claimantName: "Ranjan Nayak",
    spouseName: "Bharati Nayak",
    fatherMotherName: "Chandra Nayak",
    address: "Forest Gate Colony",
    village: "Phiringia",
    gramPanchayat: "Phiringia",
    tehsilTaluka: "Phiringia",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Bharati Nayak", age: 39, relationship: "Wife" },
      { name: "Subham Nayak", age: 17, relationship: "Son" },
      { name: "Priyanka Nayak", age: 15, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 1.7, description: "Mixed farming with livestock", evidence: ["Veterinary Records", "Agricultural Survey"] },
      { type: "habitation", area: 0.3, description: "Residential plot with animal shelter", evidence: ["Construction Permit", "Village Records"] }
    ],
    coordinates: [84.2901, 20.3567],
    claimDate: "2023-07-22",
    status: "pending",
    area: 2.0,
    annualIncome: 81000,
    bankAccount: "KOTAK890123456789",
    aadhaarNumber: "3456-7890-1235",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },

  // Mayurbhanj District (12 entries)
  {
    id: "MYB001",
    claimantName: "Budhuram Murmu",
    spouseName: "Sumi Murmu",
    fatherMotherName: "Lakhiram Murmu",
    address: "Tola Sahi, Astia Village",
    village: "Astia",
    gramPanchayat: "Barasol",
    tehsilTaluka: "Jashipur",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Sumi Murmu", age: 38, relationship: "Wife" },
      { name: "Chhotu Murmu", age: 15, relationship: "Son" },
      { name: "Buli Murmu", age: 10, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "habitation", area: 0.25, description: "Traditional Santhal dwelling", evidence: ["Gram Sabha Resolution", "Elder Witness"] },
      { type: "self-cultivation", area: 1.75, description: "Upland cultivation for maize and millets", evidence: ["Cultivation Proof", "Satellite Imagery"] }
    ],
    coordinates: [86.2917, 22.0405],
    claimDate: "2023-09-01",
    status: "pending",
    area: 2.0,
    annualIncome: 65000,
    bankAccount: "SBI987654321012",
    aadhaarNumber: "2345-6789-0123",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB002",
    claimantName: "Champa Hansda",
    spouseName: "Mangal Hansda",
    fatherMotherName: "Baidhar Hansda",
    address: "Santhal Para",
    village: "Jenabil",
    gramPanchayat: "Jenabil",
    tehsilTaluka: "Rairangpur",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Mangal Hansda", age: 46, relationship: "Husband" },
      { name: "Rohit Hansda", age: 19, relationship: "Son" },
      { name: "Sunita Hansda", age: 16, relationship: "Daughter" },
      { name: "Pintu Hansda", age: 12, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.4, description: "Extended family compound", evidence: ["Family Tree Documentation", "Village Survey"] },
      { type: "self-cultivation", area: 2.3, description: "Paddy and pulse cultivation", evidence: ["Irrigation Certificate", "Crop Records"] }
    ],
    coordinates: [86.7234, 21.8976],
    claimDate: "2023-04-12",
    status: "approved",
    titleNumber: "MYB2023002",
    area: 2.7,
    annualIncome: 92000,
    bankAccount: "BOB123456789012",
    aadhaarNumber: "3456-7890-1236",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB003",
    claimantName: "Bishnu Soren",
    fatherMotherName: "Ram Soren",
    address: "Forest Range Area",
    village: "Bangriposi",
    gramPanchayat: "Bangriposi",
    tehsilTaluka: "Bangriposi",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Geeta Soren", age: 32, relationship: "Daughter-in-law" },
      { name: "Amit Soren", age: 27, relationship: "Son" },
      { name: "Baby Soren", age: 5, relationship: "Granddaughter" }
    ],
    landClaims: [
      { type: "traditional", area: 1.5, description: "Traditional forest produce collection", evidence: ["Tribal Certificate", "Forest Rights Documentation"] }
    ],
    coordinates: [86.5678, 21.9234],
    claimDate: "2023-06-08",
    status: "approved",
    titleNumber: "MYB2023003",
    area: 1.5,
    annualIncome: 58000,
    bankAccount: "UCO234567890123",
    aadhaarNumber: "4567-8901-2347",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB004",
    claimantName: "Dulari Tudu",
    spouseName: "Narayan Tudu",
    fatherMotherName: "Haren Tudu",
    address: "Tribal Colony",
    village: "Karanjia",
    gramPanchayat: "Karanjia",
    tehsilTaluka: "Karanjia",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Narayan Tudu", age: 48, relationship: "Husband" },
      { name: "Sanjay Tudu", age: 20, relationship: "Son" },
      { name: "Mamata Tudu", age: 18, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "habitation", area: 0.3, description: "Traditional tribal housing", evidence: ["Community Records", "Ancestral Proof"] },
      { type: "self-cultivation", area: 1.9, description: "Subsistence farming", evidence: ["Land Survey", "Cultivation Certificate"] }
    ],
    coordinates: [86.1234, 21.7890],
    claimDate: "2023-02-28",
    status: "pending",
    area: 2.2,
    annualIncome: 74000,
    bankAccount: "CANARA345678901234",
    aadhaarNumber: "5678-9012-3458",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB005",
    claimantName: "Kailash Marndi",
    spouseName: "Shanti Marndi",
    fatherMotherName: "Bhuban Marndi",
    address: "Forest Village",
    village: "Thakurmunda",
    gramPanchayat: "Thakurmunda",
    tehsilTaluka: "Thakurmunda",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Shanti Marndi", age: 41, relationship: "Wife" },
      { name: "Deepak Marndi", age: 17, relationship: "Son" },
      { name: "Ritu Marndi", age: 14, relationship: "Daughter" },
      { name: "Chandan Marndi", age: 11, relationship: "Son" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.4, description: "Mixed cropping with forest gardening", evidence: ["Agricultural Extension Records", "Forest Department Survey"] },
      { type: "habitation", area: 0.6, description: "Multi-generational family compound", evidence: ["Family Documentation", "Village Records"] }
    ],
    coordinates: [86.8901, 22.1567],
    claimDate: "2023-05-03",
    status: "approved",
    titleNumber: "MYB2023005",
    area: 3.0,
    annualIncome: 105000,
    bankAccount: "AXIS456789012345",
    aadhaarNumber: "6789-0123-4569",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB006",
    claimantName: "Phula Kisku",
    fatherMotherName: "Doman Kisku",
    address: "Village Centre",
    village: "Udala",
    gramPanchayat: "Udala",
    tehsilTaluka: "Udala",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Saraswati Kisku", age: 29, relationship: "Daughter" },
      { name: "Raman Kisku", age: 26, relationship: "Son" }
    ],
    landClaims: [
      { type: "traditional", area: 1.1, description: "Traditional handicraft material collection", evidence: ["Craft Documentation", "Market Records"] }
    ],
    coordinates: [86.4567, 21.6789],
    claimDate: "2023-08-19",
    status: "pending",
    area: 1.1,
    annualIncome: 52000,
    bankAccount: "PNB567890123456",
    aadhaarNumber: "7890-1234-5670",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB007",
    claimantName: "Sukuram Hembram",
    spouseName: "Basanti Hembram",
    fatherMotherName: "Jiten Hembram",
    address: "Near Forest Office",
    village: "Baripada",
    gramPanchayat: "Baripada",
    tehsilTaluka: "Baripada",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Basanti Hembram", age: 44, relationship: "Wife" },
      { name: "Srikant Hembram", age: 21, relationship: "Son" },
      { name: "Puja Hembram", age: 19, relationship: "Daughter" },
      { name: "Chintu Hembram", age: 13, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.5, description: "Traditional Sa-bali dwelling", evidence: ["Architectural Survey", "Cultural Documentation"] },
      { type: "self-cultivation", area: 2.0, description: "Organic farming practices", evidence: ["Organic Certificate", "Soil Health Records"] }
    ],
    coordinates: [86.7345, 21.9012],
    claimDate: "2023-01-11",
    status: "approved",
    titleNumber: "MYB2023007",
    area: 2.5,
    annualIncome: 87000,
    bankAccount: "ICICI678901234567",
    aadhaarNumber: "8901-2345-6781",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB008",
    claimantName: "Raimani Soren",
    spouseName: "Chaitanya Soren",
    fatherMotherName: "Gobinda Soren",
    address: "Forest Range Colony",
    village: "Betanoti",
    gramPanchayat: "Betanoti",
    tehsilTaluka: "Betanoti",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Chaitanya Soren", age: 47, relationship: "Husband" },
      { name: "Bibek Soren", age: 18, relationship: "Son" },
      { name: "Namita Soren", age: 15, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 1.8, description: "Sustainable agriculture with traditional methods", evidence: ["Traditional Farming Documentation", "Yield Records"] },
      { type: "habitation", area: 0.4, description: "Eco-friendly traditional house", evidence: ["Green Building Certificate", "Village Survey"] }
    ],
    coordinates: [86.2678, 21.8345],
    claimDate: "2023-03-07",
    status: "approved",
    titleNumber: "MYB2023008",
    area: 2.2,
    annualIncome: 79000,
    bankAccount: "UNION789012345678",
    aadhaarNumber: "9012-3456-7892",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB009",
    claimantName: "Somari Besra",
    fatherMotherName: "Kartik Besra",
    address: "Tribal Settlement",
    village: "Rasgovindpur",
    gramPanchayat: "Rasgovindpur",
    tehsilTaluka: "Rasgovindpur",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Lalita Besra", age: 30, relationship: "Daughter" },
      { name: "Tapan Besra", age: 28, relationship: "Son" },
      { name: "Rina Besra", age: 7, relationship: "Granddaughter" }
    ],
    landClaims: [
      { type: "traditional", area: 0.9, description: "Traditional knowledge-based forest management", evidence: ["Elder Testimony", "Traditional Practice Records"] }
    ],
    coordinates: [86.6789, 22.0123],
    claimDate: "2023-07-16",
    status: "pending",
    area: 0.9,
    annualIncome: 48000,
    bankAccount: "KOTAK890123456789",
    aadhaarNumber: "0123-4567-8903",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB010",
    claimantName: "Charan Majhi",
    spouseName: "Parbati Majhi",
    fatherMotherName: "Dillip Majhi",
    address: "Village Outskirts",
    village: "Morada",
    gramPanchayat: "Morada",
    tehsilTaluka: "Morada",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Parbati Majhi", age: 36, relationship: "Wife" },
      { name: "Satish Majhi", age: 16, relationship: "Son" },
      { name: "Kavita Majhi", age: 13, relationship: "Daughter" },
      { name: "Bablu Majhi", age: 9, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.35, description: "Traditional Majhi community dwelling", evidence: ["Community Certificate", "Traditional Architecture Study"] },
      { type: "self-cultivation", area: 1.95, description: "Hill slope cultivation", evidence: ["Terrace Survey", "Water Conservation Records"] }
    ],
    coordinates: [86.3456, 21.7567],
    claimDate: "2023-04-25",
    status: "approved",
    titleNumber: "MYB2023010",
    area: 2.3,
    annualIncome: 83000,
    bankAccount: "HDFC901234567890",
    aadhaarNumber: "1234-5678-9014",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB011",
    claimantName: "Jharna Munda",
    spouseName: "Prakash Munda",
    fatherMotherName: "Birsa Munda",
    address: "Forest Village Colony",
    village: "Kuliana",
    gramPanchayat: "Kuliana",
    tehsilTaluka: "Kuliana",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Prakash Munda", age: 49, relationship: "Husband" },
      { name: "Sagar Munda", age: 22, relationship: "Son" },
      { name: "Rekha Munda", age: 20, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.6, description: "Integrated farming system", evidence: ["Farming System Study", "Productivity Records"] },
      { type: "habitation", area: 0.8, description: "Extended family residential complex", evidence: ["Housing Survey", "Family Records"] }
    ],
    coordinates: [86.5012, 21.8678],
    claimDate: "2023-06-14",
    status: "approved",
    titleNumber: "MYB2023011",
    area: 3.4,
    annualIncome: 118000,
    bankAccount: "CANARA012345678901",
    aadhaarNumber: "2345-6789-0125",
    rationCardType: "APL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "MYB012",
    claimantName: "Jagannath Tudu",
    fatherMotherName: "Budhan Tudu",
    address: "Tribal Para",
    village: "Jasipur",
    gramPanchayat: "Jasipur",
    tehsilTaluka: "Jasipur",
    district: "Mayurbhanj",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Sabitri Tudu", age: 33, relationship: "Daughter-in-law" },
      { name: "Ajay Tudu", age: 31, relationship: "Son" },
      { name: "Manu Tudu", age: 8, relationship: "Grandson" },
      { name: "Sonu Tudu", age: 6, relationship: "Granddaughter" }
    ],
    landClaims: [
      { type: "traditional", area: 1.4, description: "Sacred grove management", evidence: ["Sacred Grove Documentation", "Religious Committee Certificate"] }
    ],
    coordinates: [86.7890, 22.0456],
    claimDate: "2023-08-02",
    status: "pending",
    area: 1.4,
    annualIncome: 61000,
    bankAccount: "BOI123456789012",
    aadhaarNumber: "3456-7890-1236",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },

  // Sundargarh District (10 entries)
  {
    id: "SUN001",
    claimantName: "Mangala Oram",
    spouseName: "Biswanath Oram",
    fatherMotherName: "Kailash Oram",
    address: "Tribal Colony, Sector 4",
    village: "Rourkela Rural",
    gramPanchayat: "Rourkela Rural",
    tehsilTaluka: "Rourkela",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Biswanath Oram", age: 54, relationship: "Husband" },
      { name: "Anita Oram", age: 25, relationship: "Daughter" },
      { name: "Suresh Oram", age: 23, relationship: "Son" },
      { name: "Priya Oram", age: 18, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "habitation", area: 0.6, description: "Industrial area tribal rehabilitation", evidence: ["Rehabilitation Certificate", "Government Order"] },
      { type: "self-cultivation", area: 1.4, description: "Urban periphery agriculture", evidence: ["Urban Planning Certificate", "Agricultural Survey"] }
    ],
    coordinates: [84.8834, 22.2604],
    claimDate: "2023-02-10",
    status: "approved",
    titleNumber: "SUN2023001",
    area: 2.0,
    annualIncome: 135000,
    bankAccount: "SBI234567890123",
    aadhaarNumber: "4567-8901-2347",
    rationCardType: "APL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN002",
    claimantName: "Ramesh Toppo",
    spouseName: "Savitri Toppo",
    fatherMotherName: "Mangal Toppo",
    address: "Forest Range Area",
    village: "Bonai",
    gramPanchayat: "Bonai",
    tehsilTaluka: "Bonai",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Savitri Toppo", age: 42, relationship: "Wife" },
      { name: "Deepak Toppo", age: 19, relationship: "Son" },
      { name: "Sunita Toppo", age: 17, relationship: "Daughter" },
      { name: "Rahul Toppo", age: 12, relationship: "Son" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.8, description: "Iron ore belt agriculture", evidence: ["Mining Impact Study", "Soil Testing Report"] },
      { type: "habitation", area: 0.7, description: "Traditional Oraon settlement", evidence: ["Tribal Settlement Records", "Cultural Heritage Documentation"] }
    ],
    coordinates: [85.3789, 22.1456],
    claimDate: "2023-05-18",
    status: "pending",
    area: 3.5,
    annualIncome: 95000,
    bankAccount: "UCO345678901234",
    aadhaarNumber: "5678-9012-3458",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN003",
    claimantName: "Bina Kerketta",
    fatherMotherName: "Joseph Kerketta",
    address: "Mission Road",
    village: "Sundargarh Town",
    gramPanchayat: "Sundargarh",
    tehsilTaluka: "Sundargarh",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Maria Kerketta", age: 28, relationship: "Daughter" },
      { name: "John Kerketta", age: 26, relationship: "Son" }
    ],
    landClaims: [
      { type: "traditional", area: 1.2, description: "Traditional Christian tribal settlement", evidence: ["Church Records", "Community Certificate"] }
    ],
    coordinates: [84.0234, 22.1178],
    claimDate: "2023-07-05",
    status: "approved",
    titleNumber: "SUN2023003",
    area: 1.2,
    annualIncome: 76000,
    bankAccount: "CANARA456789012345",
    aadhaarNumber: "6789-0123-4569",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN004",
    claimantName: "Dhaneshwar Tirkey",
    spouseName: "Pushpa Tirkey",
    fatherMotherName: "Simon Tirkey",
    address: "Mining Colony",
    village: "Rajgangpur",
    gramPanchayat: "Rajgangpur",
    tehsilTaluka: "Rajgangpur",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Pushpa Tirkey", age: 48, relationship: "Wife" },
      { name: "Ravi Tirkey", age: 24, relationship: "Son" },
      { name: "Kavita Tirkey", age: 21, relationship: "Daughter" },
      { name: "Amit Tirkey", age: 16, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.8, description: "Mining-affected area resettlement", evidence: ["Displacement Certificate", "Resettlement Records"] },
      { type: "self-cultivation", area: 2.2, description: "Post-mining land reclamation", evidence: ["Land Reclamation Certificate", "Environmental Clearance"] }
    ],
    coordinates: [84.4567, 22.0789],
    claimDate: "2023-03-22",
    status: "approved",
    titleNumber: "SUN2023004",
    area: 3.0,
    annualIncome: 142000,
    bankAccount: "AXIS567890123456",
    aadhaarNumber: "7890-1234-5670",
    rationCardType: "APL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN005",
    claimantName: "Sumitra Beck",
    spouseName: "Raman Beck",
    fatherMotherName: "David Beck",
    address: "Forest Settlement",
    village: "Koida",
    gramPanchayat: "Koida",
    tehsilTaluka: "Koida",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Raman Beck", age: 51, relationship: "Husband" },
      { name: "Shanti Beck", age: 22, relationship: "Daughter" },
      { name: "Prakash Beck", age: 20, relationship: "Son" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 1.9, description: "Forest-based agroforestry", evidence: ["Agroforestry Certificate", "Forest Department Approval"] },
      { type: "habitation", area: 0.5, description: "Eco-village development", evidence: ["Eco-development Certificate", "Green Village Award"] }
    ],
    coordinates: [85.1234, 22.1890],
    claimDate: "2023-08-11",
    status: "pending",
    area: 2.4,
    annualIncome: 88000,
    bankAccount: "PNB678901234567",
    aadhaarNumber: "8901-2345-6781",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN006",
    claimantName: "Pramila Xalxo",
    fatherMotherName: "Thomas Xalxo",
    address: "Church Colony",
    village: "Hemgir",
    gramPanchayat: "Hemgir",
    tehsilTaluka: "Hemgir",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Rita Xalxo", age: 31, relationship: "Daughter" },
      { name: "Peter Xalxo", age: 29, relationship: "Son" },
      { name: "Anna Xalxo", age: 25, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "traditional", area: 1.0, description: "Traditional tribal medicinal garden", evidence: ["Traditional Knowledge Documentation", "Medicinal Plant Survey"] }
    ],
    coordinates: [84.6789, 22.2345],
    claimDate: "2023-04-30",
    status: "approved",
    titleNumber: "SUN2023006",
    area: 1.0,
    annualIncome: 67000,
    bankAccount: "ICICI789012345678",
    aadhaarNumber: "9012-3456-7892",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN007",
    claimantName: "Lakhan Bhengra",
    spouseName: "Sushila Bhengra",
    fatherMotherName: "Mangal Bhengra",
    address: "Hill Station Area",
    village: "Tangarpali",
    gramPanchayat: "Tangarpali",
    tehsilTaluka: "Tangarpali",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Sushila Bhengra", age: 39, relationship: "Wife" },
      { name: "Vikash Bhengra", age: 18, relationship: "Son" },
      { name: "Preeti Bhengra", age: 15, relationship: "Daughter" },
      { name: "Chintu Bhengra", age: 10, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.4, description: "Hill slope traditional dwelling", evidence: ["Hill Settlement Survey", "Slope Stability Certificate"] },
      { type: "self-cultivation", area: 2.1, description: "Terraced hill agriculture", evidence: ["Terrace Construction Records", "Soil Conservation Certificate"] }
    ],
    coordinates: [85.5678, 22.0123],
    claimDate: "2023-06-27",
    status: "approved",
    titleNumber: "SUN2023007",
    area: 2.5,
    annualIncome: 92000,
    bankAccount: "UNION890123456789",
    aadhaarNumber: "0123-4567-8903",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN008",
    claimantName: "Agnes Minz",
    spouseName: "Francis Minz",
    fatherMotherName: "Anthony Minz",
    address: "Forest Colony",
    village: "Nuagaon",
    gramPanchayat: "Nuagaon",
    tehsilTaluka: "Nuagaon",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Francis Minz", age: 45, relationship: "Husband" },
      { name: "Joseph Minz", age: 20, relationship: "Son" },
      { name: "Mary Minz", age: 18, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 1.7, description: "Christian tribal farming community", evidence: ["Community Farming Records", "Cooperative Society Certificate"] },
      { type: "habitation", area: 0.3, description: "Traditional tribal Christian settlement", evidence: ["Parish Records", "Community Certificate"] }
    ],
    coordinates: [84.2345, 22.1567],
    claimDate: "2023-01-15",
    status: "pending",
    area: 2.0,
    annualIncome: 71000,
    bankAccount: "KOTAK901234567890",
    aadhaarNumber: "1234-5678-9014",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN009",
    claimantName: "Budhram Kisan",
    spouseName: "Jamuna Kisan",
    fatherMotherName: "Birsa Kisan",
    address: "Adivasi Colony",
    village: "Lahunipara",
    gramPanchayat: "Lahunipara",
    tehsilTaluka: "Lahunipara",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Jamuna Kisan", age: 37, relationship: "Wife" },
      { name: "Raju Kisan", age: 17, relationship: "Son" },
      { name: "Gita Kisan", age: 14, relationship: "Daughter" },
      { name: "Bulu Kisan", age: 11, relationship: "Son" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.3, description: "Traditional Kisan tribe agriculture", evidence: ["Tribal Agriculture Survey", "Traditional Crop Documentation"] },
      { type: "habitation", area: 0.6, description: "Kisan tribal settlement", evidence: ["Tribal Settlement Survey", "Cultural Documentation"] }
    ],
    coordinates: [85.7890, 22.0456],
    claimDate: "2023-09-08",
    status: "approved",
    titleNumber: "SUN2023009",
    area: 2.9,
    annualIncome: 104000,
    bankAccount: "HDFC012345678901",
    aadhaarNumber: "2345-6789-0125",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "SUN010",
    claimantName: "Philomina Lakra",
    fatherMotherName: "Martin Lakra",
    address: "Mission Station",
    village: "Bisra",
    gramPanchayat: "Bisra",
    tehsilTaluka: "Bisra",
    district: "Sundargarh",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Sebastian Lakra", age: 33, relationship: "Son" },
      { name: "Rosa Lakra", age: 30, relationship: "Daughter" },
      { name: "Michael Lakra", age: 6, relationship: "Grandson" }
    ],
    landClaims: [
      { type: "traditional", area: 1.3, description: "Mission-based tribal settlement", evidence: ["Mission Records", "Historical Documentation"] }
    ],
    coordinates: [84.8901, 22.2123],
    claimDate: "2023-05-12",
    status: "pending",
    area: 1.3,
    annualIncome: 59000,
    bankAccount: "CANARA123456789012",
    aadhaarNumber: "3456-7890-1236",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },

  // Ganjam District (5 entries)
  {
    id: "GJM001",
    claimantName: "Raghunath Sabar",
    spouseName: "Kamala Sabar",
    fatherMotherName: "Dhanesh Sabar",
    address: "Hill Village",
    village: "Parlakhemundi Rural",
    gramPanchayat: "Parlakhemundi Rural",
    tehsilTaluka: "Parlakhemundi",
    district: "Ganjam",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Kamala Sabar", age: 41, relationship: "Wife" },
      { name: "Santosh Sabar", age: 19, relationship: "Son" },
      { name: "Kiran Sabar", age: 16, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "habitation", area: 0.5, description: "Hill tribe traditional settlement", evidence: ["Hill Survey", "Tribal Certificate"] },
      { type: "self-cultivation", area: 1.8, description: "Hill slope cultivation", evidence: ["Slope Agriculture Survey", "Traditional Farming Records"] }
    ],
    coordinates: [84.4123, 18.7890],
    claimDate: "2023-04-08",
    status: "approved",
    titleNumber: "GJM2023001",
    area: 2.3,
    annualIncome: 73000,
    bankAccount: "BOB345678901234",
    aadhaarNumber: "4567-8901-2347",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "GJM002",
    claimantName: "Sushila Jani",
    spouseName: "Krushna Jani",
    fatherMotherName: "Bula Jani",
    address: "Forest Fringe Village",
    village: "Rayagada Junction",
    gramPanchayat: "Rayagada Junction",
    tehsilTaluka: "Rayagada",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Krushna Jani", age: 46, relationship: "Husband" },
      { name: "Minati Jani", age: 21, relationship: "Daughter" },
      { name: "Srikant Jani", age: 18, relationship: "Son" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.1, description: "Traditional forest dweller agriculture", evidence: ["Forest Dwelling Certificate", "Traditional Rights Documentation"] },
      { type: "habitation", area: 0.4, description: "Forest fringe dwelling", evidence: ["Forest Fringe Survey", "Settlement Records"] }
    ],
    coordinates: [84.1567, 19.1234],
    claimDate: "2023-07-21",
    status: "pending",
    area: 2.5,
    annualIncome: 86000,
    bankAccount: "UCO456789012345",
    aadhaarNumber: "5678-9012-3458",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "GJM003",
    claimantName: "Phula Harijan",
    fatherMotherName: "Gopi Harijan",
    address: "SC Colony",
    village: "Berhampur Rural",
    gramPanchayat: "Berhampur Rural",
    tehsilTaluka: "Berhampur",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Laxmi Harijan", age: 34, relationship: "Daughter" },
      { name: "Ravi Harijan", age: 32, relationship: "Son" }
    ],
    landClaims: [
      { type: "traditional", area: 0.8, description: "Traditional forest produce collection", evidence: ["Traditional Occupation Records", "Community Certificate"] }
    ],
    coordinates: [84.8789, 19.3123],
    claimDate: "2023-02-17",
    status: "rejected",
    area: 0.8,
    annualIncome: 45000,
    bankAccount: "CANARA567890123456",
    aadhaarNumber: "6789-0123-4569",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "GJM004",
    claimantName: "Nilakantha Gouda",
    spouseName: "Laxmi Gouda",
    fatherMotherName: "Jagannath Gouda",
    address: "Coastal Village",
    village: "Gopalpur",
    gramPanchayat: "Gopalpur",
    tehsilTaluka: "Gopalpur",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Laxmi Gouda", age: 38, relationship: "Wife" },
      { name: "Subash Gouda", age: 15, relationship: "Son" },
      { name: "Mamata Gouda", age: 12, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "habitation", area: 0.3, description: "Coastal forest dwelling", evidence: ["Coastal Survey", "Traditional Fishing Rights"] },
      { type: "self-cultivation", area: 1.2, description: "Coastal belt agriculture", evidence: ["Coastal Agriculture Survey", "Salt-tolerant Crop Records"] }
    ],
    coordinates: [84.9012, 19.2456],
    claimDate: "2023-09-03",
    status: "approved",
    titleNumber: "GJM2023004",
    area: 1.5,
    annualIncome: 91000,
    bankAccount: "AXIS678901234567",
    aadhaarNumber: "7890-1234-5670",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "GJM005",
    claimantName: "Padmini Behera",
    spouseName: "Ramesh Behera",
    fatherMotherName: "Nanda Behera",
    address: "Forest Village",
    village: "Aska Rural",
    gramPanchayat: "Aska Rural",
    tehsilTaluka: "Aska",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Ramesh Behera", age: 49, relationship: "Husband" },
      { name: "Priyanka Behera", age: 23, relationship: "Daughter" },
      { name: "Suresh Behera", age: 21, relationship: "Son" },
      { name: "Pinki Behera", age: 17, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.4, description: "Mixed crop forest edge cultivation", evidence: ["Edge Cultivation Survey", "Mixed Cropping Records"] },
      { type: "habitation", area: 0.6, description: "Traditional forest village dwelling", evidence: ["Forest Village Survey", "Traditional Architecture Records"] }
    ],
    coordinates: [84.6234, 19.5678],
    claimDate: "2023-06-19",
    status: "approved",
    titleNumber: "GJM2023005",
    area: 3.0,
    annualIncome: 108000,
    bankAccount: "PNB789012345678",
    aadhaarNumber: "8901-2345-6781",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },

  // Koraput District (5 entries)
  {
    id: "KOR001",
    claimantName: "Mangala Khosla",
    spouseName: "Ramesh Khosla",
    fatherMotherName: "Banchha Khosla",
    address: "Tribal Settlement",
    village: "Koraput Town",
    gramPanchayat: "Koraput",
    tehsilTaluka: "Koraput",
    district: "Koraput",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Ramesh Khosla", age: 47, relationship: "Husband" },
      { name: "Anita Khosla", age: 20, relationship: "Daughter" },
      { name: "Ravi Khosla", age: 18, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.4, description: "Urban tribal settlement", evidence: ["Urban Tribal Survey", "Settlement Certificate"] },
      { type: "self-cultivation", area: 1.6, description: "Urban periphery agriculture", evidence: ["Peri-urban Agriculture Survey", "Land Use Certificate"] }
    ],
    coordinates: [82.7109, 18.8129],
    claimDate: "2023-03-11",
    status: "approved",
    titleNumber: "KOR2023001",
    area: 2.0,
    annualIncome: 89000,
    bankAccount: "ICICI890123456789",
    aadhaarNumber: "9012-3456-7892",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KOR002",
    claimantName: "Jitu Paraja",
    fatherMotherName: "Daitari Paraja",
    address: "Hill Village",
    village: "Bandhugaon",
    gramPanchayat: "Bandhugaon",
    tehsilTaluka: "Bandhugaon",
    district: "Koraput",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Suma Paraja", age: 29, relationship: "Daughter" },
      { name: "Kalu Paraja", age: 27, relationship: "Son" }
    ],
    landClaims: [
      { type: "traditional", area: 1.5, description: "Traditional Paraja tribe forest rights", evidence: ["Paraja Tribe Certificate", "Traditional Rights Documentation"] }
    ],
    coordinates: [82.8456, 18.6789],
    claimDate: "2023-08-14",
    status: "pending",
    area: 1.5,
    annualIncome: 54000,
    bankAccount: "UNION901234567890",
    aadhaarNumber: "0123-4567-8903",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KOR003",
    claimantName: "Kamala Gadaba",
    spouseName: "Ghanashyam Gadaba",
    fatherMotherName: "Rama Gadaba",
    address: "Forest Colony",
    village: "Jeypore Rural",
    gramPanchayat: "Jeypore Rural",
    tehsilTaluka: "Jeypore",
    district: "Koraput",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Ghanashyam Gadaba", age: 52, relationship: "Husband" },
      { name: "Sarita Gadaba", age: 22, relationship: "Daughter" },
      { name: "Deepak Gadaba", age: 19, relationship: "Son" },
      { name: "Mina Gadaba", age: 14, relationship: "Daughter" }
    ],
    landClaims: [
      { type: "self-cultivation", area: 2.7, description: "Gadaba tribal traditional cultivation", evidence: ["Tribal Cultivation Survey", "Traditional Crop Documentation"] },
      { type: "habitation", area: 0.8, description: "Traditional Gadaba settlement", evidence: ["Gadaba Settlement Survey", "Cultural Heritage Documentation"] }
    ],
    coordinates: [82.5789, 18.9012],
    claimDate: "2023-01-25",
    status: "approved",
    titleNumber: "KOR2023003",
    area: 3.5,
    annualIncome: 116000,
    bankAccount: "KOTAK012345678901",
    aadhaarNumber: "1234-5678-9014",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KOR004",
    claimantName: "Bidula Kondh",
    spouseName: "Mangal Kondh",
    fatherMotherName: "Nanda Kondh",
    address: "Hill Station",
    village: "Nandapur",
    gramPanchayat: "Nandapur",
    tehsilTaluka: "Nandapur",
    district: "Koraput",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Mangal Kondh", age: 44, relationship: "Husband" },
      { name: "Priya Kondh", age: 17, relationship: "Daughter" },
      { name: "Raju Kondh", age: 15, relationship: "Son" }
    ],
    landClaims: [
      { type: "habitation", area: 0.5, description: "Traditional Kondh hill dwelling", evidence: ["Hill Settlement Survey", "Kondh Tribe Certificate"] },
      { type: "self-cultivation", area: 1.9, description: "Hill agriculture with terracing", evidence: ["Terrace Agriculture Survey", "Traditional Farming Methods"] }
    ],
    coordinates: [82.2345, 18.7456],
    claimDate: "2023-05-07",
    status: "approved",
    titleNumber: "KOR2023004",
    area: 2.4,
    annualIncome: 77000,
    bankAccount: "HDFC123456789012",
    aadhaarNumber: "2345-6789-0125",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  },
  {
    id: "KOR005",
    claimantName: "Sumitra Bhumij",
    fatherMotherName: "Gobinda Bhumij",
    address: "Adivasi Para",
    village: "Similiguda",
    gramPanchayat: "Similiguda",
    tehsilTaluka: "Similiguda",
    district: "Koraput",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Shanti Bhumij", age: 35, relationship: "Daughter" },
      { name: "Kailash Bhumij", age: 33, relationship: "Son" },
      { name: "Gita Bhumij", age: 8, relationship: "Granddaughter" }
    ],
    landClaims: [
      { type: "traditional", area: 1.1, description: "Bhumij tribe traditional forest management", evidence: ["Bhumij Traditional Practices", "Forest Management Documentation"] }
    ],
    coordinates: [82.9678, 18.5123],
    claimDate: "2023-09-26",
    status: "pending",
    area: 1.1,
    annualIncome: 49000,
    bankAccount: "CANARA234567890123",
    aadhaarNumber: "3456-7890-1236",
    rationCardType: "BPL",
    fraAtlasReference: "data/FRA_ATLAS_TEST.jpg",
    schemeEligibility: {} as SchemeEligibility
  }
];

// Apply scheme eligibility to all claims
mockFRAIndividualClaims.forEach(claim => {
  claim.schemeEligibility = generateSchemeEligibility(claim, claim.annualIncome || 80000);
});

// Community Claims Data (maintaining existing structure)
export const mockFRACommunityResourceClaims: FRACommunityResourceClaim[] = [
  {
    id: "COM001",
    village: "Kotagarh",
    gramPanchayat: "Kotagarh",
    tehsilTaluka: "Phulbani",
    district: "Kandhamal",
    claimants: [
      { name: "Ram Bahadur Singh", status: "ST" },
      { name: "Durga Majhi", status: "ST" },
      { name: "Laxman Parida", status: "ST" },
      { name: "Sunita Pradhan", status: "ST" }
    ],
    communityRights: [
      { type: "minor-forest-produce", description: "Collection of sal leaves, honey, medicinal plants" },
      { type: "grazing", description: "Cattle grazing in designated forest areas" },
      { type: "traditional-access", description: "Access to traditional water sources and pathways" }
    ],
    khasraCompartmentNo: ["451", "452", "461"],
    borderingVillages: ["Daringbadi", "Belghar", "Raikia"],
    coordinates: [84.2619, 20.4781],
    area: 15.5,
    description: "Traditional community forest area managed for sustainable use by the local tribal community for over 50 years",
    evidence: ["Historical Records", "Community Testimony", "Forest Department Records"],
    claimDate: "2023-04-20",
    status: "approved",
    titleNumber: "KDMCOM2023001",
    communitySchemeEligibility: {
      cfmScheme: { eligible: true, status: "enrolled" },
      ecoDevelopment: { eligible: true, status: "pending" },
      tribalDevelopment: { eligible: true, status: "enrolled" }
    }
  },
  // Add more community claims as needed...
];

// District boundaries data
export const districtBoundaries = {
  "Mayurbhanj": {
    center: [21.93, 86.73] as [number, number],
    radius: 25000,
    boundary: [[22.5, 85.8], [22.5, 87.1], [21.8, 87.1], [21.3, 86.8], [21.3, 85.8], [22.5, 85.8]]
  },
  "Kandhamal": {
    center: [20.4731, 84.0968] as [number, number],
    radius: 25000,
    boundary: [[20.2, 83.8], [20.7, 83.8], [20.8, 84.4], [20.3, 84.5], [20.1, 84.1], [20.2, 83.8]]
  },
  "Sundargarh": {
    center: [22.1179, 84.0171] as [number, number],
    radius: 30000,
    boundary: [[21.8, 83.5], [22.5, 83.5], [22.6, 84.8], [21.9, 84.9], [21.7, 84.0], [21.8, 83.5]]
  },
  "Ganjam": {
    center: [19.3859, 84.8666] as [number, number],
    radius: 30000,
    boundary: [[19.1, 84.5], [19.7, 84.5], [19.8, 85.3], [19.2, 85.4], [19.0, 84.8], [19.1, 84.5]]
  },
  "Koraput": {
    center: [18.8129, 82.7109] as [number, number],
    radius: 28000,
    boundary: [[18.5, 82.3], [19.2, 82.3], [19.3, 83.2], [18.6, 83.3], [18.4, 82.8], [18.5, 82.3]]
  },
  "Khordha": {
    center: [20.1821, 85.6026] as [number, number],
    radius: 20000,
    boundary: [[20.0, 85.3], [20.4, 85.3], [20.5, 85.9], [20.1, 86.0], [19.9, 85.6], [20.0, 85.3]]
  },
  "Cuttack": {
    center: [20.4625, 85.8828] as [number, number],
    radius: 25000,
    boundary: [[20.2, 85.6], [20.7, 85.6], [20.8, 86.2], [20.3, 86.3], [20.1, 85.9], [20.2, 85.6]]
  },
  "Puri": {
    center: [19.8135, 85.8312] as [number, number],
    radius: 22000,
    boundary: [[19.5, 85.5], [20.1, 85.5], [20.2, 86.2], [19.6, 86.3], [19.4, 85.8], [19.5, 85.5]]
  }
};

// Enhanced zoom function
export const handleEnhancedClaimSelect = (
  claim: FRAIndividualClaim | FRACommunityResourceClaim,
  setSelectedClaim: (claim: FRAIndividualClaim | FRACommunityResourceClaim) => void,
  setMapCenter: (center: [number, number]) => void,
  setMapZoom: (zoom: number) => void,
  setHighlightedDistrict: (district: string) => void
) => {
  setSelectedClaim(claim);
  setMapCenter(claim.coordinates);
  setMapZoom(14);
  setHighlightedDistrict(claim.district);
  
  const districtInfo = districtBoundaries[claim.district as keyof typeof districtBoundaries];
  
  if (districtInfo) {
    setTimeout(() => {
      setMapCenter(districtInfo.center);
      setMapZoom(9);
    }, 100);
    
    setTimeout(() => {
      setMapCenter(claim.coordinates);
      setMapZoom(16);
    }, 800);
  } else {
    setTimeout(() => {
      setMapCenter(claim.coordinates);
      setMapZoom(15);
    }, 100);
  }
};