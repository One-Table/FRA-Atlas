// components/fra-claims/data/mock-data.ts
// 40+ Mock Data Entries for FRA Claims Registry

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

export interface FRACommunityResourceClaim {
  id: string;
  village: string;
  gramPanchayat: string;
  tehsilTaluka: string;
  district: string;
  claimants: { name: string; status: 'ST' | 'OTFD' }[];
  communityRights: { type: string; description: string }[];
  khasraCompartmentNo?: string[];
  borderingVillages: string[];
  coordinates: [number, number];
  area: number;
  description: string;
  evidence: string[];
  claimDate: string;
  status: 'pending' | 'approved' | 'rejected';
  titleNumber?: string;
}

// District boundaries data
export const districtBoundaries = {
  'Kandhamal': {
    center: [20.4731, 84.0968] as [number, number],
    radius: 25000,
    boundary: [
      [20.2, 83.8], [20.7, 83.8], [20.8, 84.4], [20.3, 84.5], [20.1, 84.1], [20.2, 83.8]
    ]
  },
  'Ganjam': {
    center: [19.3859, 84.8666] as [number, number],
    radius: 30000,
    boundary: [
      [19.1, 84.5], [19.7, 84.5], [19.8, 85.3], [19.2, 85.4], [19.0, 84.8], [19.1, 84.5]
    ]
  },
  'Khordha': {
    center: [20.1821, 85.6026] as [number, number],
    radius: 20000,
    boundary: [
      [20.0, 85.3], [20.4, 85.3], [20.5, 85.9], [20.1, 86.0], [19.9, 85.6], [20.0, 85.3]
    ]
  },
  'Cuttack': {
    center: [20.4625, 85.8828] as [number, number],
    radius: 25000,
    boundary: [
      [20.2, 85.6], [20.7, 85.6], [20.8, 86.2], [20.3, 86.3], [20.1, 85.9], [20.2, 85.6]
    ]
  },
  'Puri': {
    center: [19.8135, 85.8312] as [number, number],
    radius: 22000,
    boundary: [
      [19.5, 85.5], [20.1, 85.5], [20.2, 86.2], [19.6, 86.3], [19.4, 85.8], [19.5, 85.5]
    ]
  }
};

// Individual Claims Data (30 entries)
export const mockFRAIndividualClaims: FRAIndividualClaim[] = [
  // Kandhamal District Claims (12 entries)
  {
    id: "IND001",
    claimantName: "Ram Bahadur Singh",
    spouseName: "Sita Devi",
    fatherMotherName: "Hari Singh",
    address: "Plot No. 45, Tribal Settlement",
    village: "Kotagarh",
    gramPanchayat: "Kotagarh",
    tehsilTaluka: "Phulbani",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Sita Devi", age: 45, relationship: "Wife" },
      { name: "Ravi Singh", age: 18, relationship: "Son" },
      { name: "Priya Singh", age: 16, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "habitation",
        area: 0.5,
        description: "Residential plot with traditional hut",
        evidence: ["Village Records", "Witness Statement"]
      },
      {
        type: "self-cultivation",
        area: 2.5,
        description: "Agricultural land for paddy cultivation",
        evidence: ["Revenue Records", "Cultivation Proof"]
      }
    ],
    coordinates: [84.2619, 20.4781],
    claimDate: "2023-03-15",
    status: "approved",
    titleNumber: "KDM/2023/001",
    area: 3.0
  },
  {
    id: "IND002",
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
      {
        type: "habitation",
        area: 0.3,
        description: "Traditional dwelling place",
        evidence: ["Gram Sabha Certificate"]
      }
    ],
    coordinates: [84.1167, 20.5167],
    claimDate: "2023-05-22",
    status: "pending",
    area: 1.5
  },
  {
    id: "IND003",
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
      {
        type: "self-cultivation",
        area: 1.8,
        description: "Vegetable cultivation and horticulture",
        evidence: ["Agricultural Records", "Irrigation Certificate"]
      }
    ],
    coordinates: [84.3456, 20.3892],
    claimDate: "2023-07-10",
    status: "approved",
    titleNumber: "KDM/2023/003",
    area: 1.8
  },
  {
    id: "IND004",
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
      {
        type: "traditional",
        area: 0.8,
        description: "Traditional medicinal plant cultivation",
        evidence: ["Community Certificate", "Traditional Knowledge Records"]
      }
    ],
    coordinates: [84.1892, 20.5234],
    claimDate: "2023-08-05",
    status: "rejected",
    area: 0.8
  },
  {
    id: "IND005",
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
      {
        type: "self-cultivation",
        area: 2.2,
        description: "Turmeric and spice cultivation",
        evidence: ["Agricultural Records", "Crop Certificate"]
      },
      {
        type: "habitation",
        area: 0.4,
        description: "Family dwelling with cattle shed",
        evidence: ["Village Headman Certificate"]
      }
    ],
    coordinates: [84.0987, 20.4234],
    claimDate: "2023-09-12",
    status: "approved",
    titleNumber: "KDM/2023/005",
    area: 2.6
  },
  {
    id: "IND006",
    claimantName: "Parvati Digal",
    fatherMotherName: "Rama Digal",
    address: "Hilltop Settlement",
    village: "Balliguda",
    gramPanchayat: "Balliguda",
    tehsilTaluka: "Balliguda",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Lakshman Digal", age: 45, relationship: "Husband" },
      { name: "Rina Digal", age: 14, relationship: "Daughter" },
      { name: "Bulu Digal", age: 12, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "habitation",
        area: 0.5,
        description: "Traditional tribal settlement",
        evidence: ["Tribal Certificate", "Village Council Records"]
      },
      {
        type: "self-cultivation",
        area: 1.2,
        description: "Terrace farming on hill slopes",
        evidence: ["Agricultural Survey Records"]
      }
    ],
    coordinates: [84.1789, 20.1876],
    claimDate: "2023-05-19",
    status: "approved",
    titleNumber: "KDM/2023/006",
    area: 1.7
  },
  {
    id: "IND007",
    claimantName: "Raghunath Kanhar",
    spouseName: "Uma Kanhar",
    fatherMotherName: "Daitari Kanhar",
    address: "Tribal Hamlet",
    village: "Baliguda",
    gramPanchayat: "Baliguda",
    tehsilTaluka: "Baliguda",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Uma Kanhar", age: 28, relationship: "Wife" },
      { name: "Dibya Kanhar", age: 7, relationship: "Son" },
      { name: "Devi Kanhar", age: 5, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 2.1,
        description: "Sacred grove maintenance and traditional medicine cultivation",
        evidence: ["Religious Committee Certificate", "Traditional Healer License"]
      }
    ],
    coordinates: [84.1456, 20.1567],
    claimDate: "2023-07-22",
    status: "pending",
    area: 2.1
  },
  {
    id: "IND008",
    claimantName: "Bhima Mallick",
    spouseName: "Sita Mallick",
    fatherMotherName: "Krushna Mallick",
    address: "Forest Colony",
    village: "Chakapad",
    gramPanchayat: "Chakapad",
    tehsilTaluka: "Chakapad",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Sita Mallick", age: 33, relationship: "Wife" },
      { name: "Gopi Mallick", age: 11, relationship: "Son" },
      { name: "Mina Mallick", age: 9, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 1.4,
        description: "Traditional honey collection and NTFP gathering",
        evidence: ["Forest Department Permit", "Traditional Knowledge Certificate"]
      }
    ],
    coordinates: [84.1234, 20.3456],
    claimDate: "2023-04-08",
    status: "approved",
    titleNumber: "KDM/2023/008",
    area: 1.4
  },
  {
    id: "IND009",
    claimantName: "Krishna Nayak",
    spouseName: "Gita Nayak",
    fatherMotherName: "Govind Nayak",
    address: "Village Center",
    village: "Phiringia",
    gramPanchayat: "Phiringia",
    tehsilTaluka: "Phiringia",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Gita Nayak", age: 30, relationship: "Wife" },
      { name: "Arjun Nayak", age: 8, relationship: "Son" },
      { name: "Radha Nayak", age: 6, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 1.6,
        description: "Organic farming and seed preservation",
        evidence: ["Organic Certificate", "Seed Bank Records"]
      }
    ],
    coordinates: [84.2345, 20.3789],
    claimDate: "2023-06-03",
    status: "approved",
    titleNumber: "KDM/2023/009",
    area: 1.6
  },
  {
    id: "IND010",
    claimantName: "Dillip Pradhan",
    fatherMotherName: "Surya Pradhan",
    address: "Riverside Colony",
    village: "Gochhapada",
    gramPanchayat: "Gochhapada",
    tehsilTaluka: "Gochhapada",
    district: "Kandhamal",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Pushpa Pradhan", age: 26, relationship: "Wife" },
      { name: "Rohit Pradhan", age: 4, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 0.9,
        description: "Traditional bamboo cultivation and handicrafts",
        evidence: ["Handicraft Association Certificate", "Bamboo Cultivation License"]
      }
    ],
    coordinates: [84.0876, 20.4567],
    claimDate: "2023-08-17",
    status: "pending",
    area: 0.9
  },
  {
    id: "IND011",
    claimantName: "Mina Kanhar",
    spouseName: "Balia Kanhar",
    fatherMotherName: "Dasu Kanhar",
    address: "Mountain Side",
    village: "Kurtamgarh",
    gramPanchayat: "Kurtamgarh",
    tehsilTaluka: "Kurtamgarh",
    district: "Kandhamal",
    scheduledTribe: true,
    otherTraditionalForestDweller: false,
    familyMembers: [
      { name: "Balia Kanhar", age: 41, relationship: "Husband" },
      { name: "Tuna Kanhar", age: 15, relationship: "Son" },
      { name: "Maya Kanhar", age: 13, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "habitation",
        area: 0.6,
        description: "Mountain dwelling with traditional architecture",
        evidence: ["Cultural Heritage Certificate", "Traditional Architecture Records"]
      }
    ],
    coordinates: [84.3123, 20.2345],
    claimDate: "2023-04-26",
    status: "approved",
    titleNumber: "KDM/2023/011",
    area: 0.6
  },
  {
    id: "IND012",
    claimantName: "Radha Pradhan",
    fatherMotherName: "Madhab Pradhan",
    address: "Forest Edge",
    village: "Sirla",
    gramPanchayat: "Sirla",
    tehsilTaluka: "Sirla",
    district: "Kandhamal",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Santosh Pradhan", age: 34, relationship: "Husband" },
      { name: "Sneha Pradhan", age: 10, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 1.3,
        description: "Forest edge agriculture and fruit orchards",
        evidence: ["Horticulture Department Certificate", "Fruit Cultivation License"]
      }
    ],
    coordinates: [84.2789, 20.4123],
    claimDate: "2023-09-07",
    status: "pending",
    area: 1.3
  },

  // Ganjam District Claims (6 entries)
  {
    id: "IND013",
    claimantName: "Prakash Nayak",
    spouseName: "Meera Nayak",
    fatherMotherName: "Jagannath Nayak",
    address: "Market Road",
    village: "Berhampur",
    gramPanchayat: "Berhampur",
    tehsilTaluka: "Berhampur",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Meera Nayak", age: 35, relationship: "Wife" },
      { name: "Amit Nayak", age: 14, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 1.2,
        description: "Organic farming and fruit cultivation",
        evidence: ["Land Records", "Cultivation Certificate"]
      }
    ],
    coordinates: [84.7833, 19.3150],
    claimDate: "2023-09-12",
    status: "approved",
    titleNumber: "GNJ/2023/013",
    area: 1.2
  },
  {
    id: "IND014",
    claimantName: "Sushila Sahoo",
    spouseName: "Ramesh Sahoo",
    fatherMotherName: "Bala Sahoo",
    address: "Coastal Village Road",
    village: "Khallikote",
    gramPanchayat: "Khallikote",
    tehsilTaluka: "Khallikote",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Ramesh Sahoo", age: 42, relationship: "Husband" },
      { name: "Priya Sahoo", age: 16, relationship: "Daughter" },
      { name: "Raj Sahoo", age: 13, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 0.9,
        description: "Traditional cashew cultivation",
        evidence: ["Community Records", "Traditional Rights Certificate"]
      }
    ],
    coordinates: [84.8547, 19.2847],
    claimDate: "2023-06-28",
    status: "pending",
    area: 0.9
  },
  {
    id: "IND015",
    claimantName: "Gopi Krishna Panda",
    fatherMotherName: "Madhusudan Panda",
    address: "Hill Side Colony",
    village: "Aska",
    gramPanchayat: "Aska",
    tehsilTaluka: "Aska",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Bina Panda", age: 38, relationship: "Wife" },
      { name: "Soumya Panda", age: 15, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 1.5,
        description: "Mixed crop cultivation and kitchen garden",
        evidence: ["Revenue Records", "Irrigation Certificate"]
      }
    ],
    coordinates: [84.6678, 19.6123],
    claimDate: "2023-04-15",
    status: "approved",
    titleNumber: "GNJ/2023/015",
    area: 1.5
  },
  {
    id: "IND016",
    claimantName: "Kamala Sahoo",
    spouseName: "Bijay Sahoo",
    fatherMotherName: "Chandra Sahoo",
    address: "Coastal Road",
    village: "Chhatrapur",
    gramPanchayat: "Chhatrapur",
    tehsilTaluka: "Chhatrapur",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Bijay Sahoo", age: 39, relationship: "Husband" },
      { name: "Sagar Sahoo", age: 12, relationship: "Son" },
      { name: "Suma Sahoo", age: 10, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 0.7,
        description: "Traditional fishing and coastal agriculture",
        evidence: ["Fishermen Association Certificate", "Coastal Rights Document"]
      }
    ],
    coordinates: [84.9234, 19.3567],
    claimDate: "2023-07-14",
    status: "approved",
    titleNumber: "GNJ/2023/016",
    area: 0.7
  },
  {
    id: "IND017",
    claimantName: "Gobinda Nayak",
    fatherMotherName: "Rama Nayak",
    address: "Market Square",
    village: "Gopalpur",
    gramPanchayat: "Gopalpur",
    tehsilTaluka: "Gopalpur",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Lila Nayak", age: 33, relationship: "Wife" },
      { name: "Ravi Nayak", age: 11, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "habitation",
        area: 0.4,
        description: "Traditional fishing community settlement",
        evidence: ["Community Leader Certificate", "Traditional Settlement Records"]
      }
    ],
    coordinates: [84.9123, 19.2678],
    claimDate: "2023-05-08",
    status: "pending",
    area: 0.4
  },
  {
    id: "IND018",
    claimantName: "Sushila Mallick",
    spouseName: "Krushna Mallick",
    fatherMotherName: "Dillip Mallick",
    address: "Temple Area",
    village: "Taratarini",
    gramPanchayat: "Taratarini",
    tehsilTaluka: "Taratarini",
    district: "Ganjam",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Krushna Mallick", age: 44, relationship: "Husband" },
      { name: "Anu Mallick", age: 17, relationship: "Daughter" },
      { name: "Babu Mallick", age: 14, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 1.1,
        description: "Temple service land and religious activities",
        evidence: ["Temple Committee Certificate", "Religious Service Records"]
      }
    ],
    coordinates: [84.8789, 19.4123],
    claimDate: "2023-08-21",
    status: "approved",
    titleNumber: "GNJ/2023/018",
    area: 1.1
  },

  // Khordha District Claims (4 entries)
  {
    id: "IND019",
    claimantName: "Bijay Kumar Swain",
    spouseName: "Gitanjali Swain",
    fatherMotherName: "Nrusingha Swain",
    address: "Temple Road",
    village: "Bhubaneswar",
    gramPanchayat: "Bhubaneswar",
    tehsilTaluka: "Bhubaneswar",
    district: "Khordha",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Gitanjali Swain", age: 34, relationship: "Wife" },
      { name: "Aditya Swain", age: 12, relationship: "Son" },
      { name: "Ananya Swain", age: 9, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "habitation",
        area: 0.3,
        description: "Urban forest dwelling area",
        evidence: ["Municipal Records", "Residence Certificate"]
      }
    ],
    coordinates: [85.8245, 20.2961],
    claimDate: "2023-08-20",
    status: "pending",
    area: 0.3
  },
  {
    id: "IND020",
    claimantName: "Laxmi Narayan Jena",
    spouseName: "Sabitri Jena",
    fatherMotherName: "Raghunath Jena",
    address: "Kalinga Nagar",
    village: "Jatni",
    gramPanchayat: "Jatni",
    tehsilTaluka: "Jatni",
    district: "Khordha",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Sabitri Jena", age: 36, relationship: "Wife" },
      { name: "Subham Jena", age: 14, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 1.1,
        description: "Vegetable farming and floriculture",
        evidence: ["Agricultural Department Certificate"]
      }
    ],
    coordinates: [85.7456, 20.1678],
    claimDate: "2023-07-03",
    status: "approved",
    titleNumber: "KHD/2023/020",
    area: 1.1
  },
  {
    id: "IND021",
    claimantName: "Ravi Kumar Patra",
    spouseName: "Sunita Patra",
    fatherMotherName: "Gopal Patra",
    address: "Industrial Area",
    village: "Khordha",
    gramPanchayat: "Khordha",
    tehsilTaluka: "Khordha",
    district: "Khordha",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Sunita Patra", age: 32, relationship: "Wife" },
      { name: "Raj Patra", age: 9, relationship: "Son" },
      { name: "Rina Patra", age: 7, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "habitation",
        area: 0.5,
        description: "Displaced urban forest community",
        evidence: ["Displacement Certificate", "Urban Development Records"]
      }
    ],
    coordinates: [85.6234, 20.1234],
    claimDate: "2023-06-12",
    status: "rejected",
    area: 0.5
  },
  {
    id: "IND022",
    claimantName: "Sushila Mohanty",
    fatherMotherName: "Bhagaban Mohanty",
    address: "Village Square",
    village: "Tangi",
    gramPanchayat: "Tangi",
    tehsilTaluka: "Tangi",
    district: "Khordha",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Prakash Mohanty", age: 37, relationship: "Husband" },
      { name: "Smita Mohanty", age: 13, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 0.8,
        description: "Traditional kitchen garden and poultry",
        evidence: ["Agricultural Records", "Poultry License"]
      }
    ],
    coordinates: [85.8567, 20.0789],
    claimDate: "2023-09-03",
    status: "approved",
    titleNumber: "KHD/2023/022",
    area: 0.8
  },

  // Cuttack District Claims (4 entries)
  {
    id: "IND023",
    claimantName: "Santosh Kumar Das",
    spouseName: "Mamata Das",
    fatherMotherName: "Bhagabat Das",
    address: "River Side Colony",
    village: "Cuttack",
    gramPanchayat: "Cuttack",
    tehsilTaluka: "Cuttack",
    district: "Cuttack",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Mamata Das", age: 32, relationship: "Wife" },
      { name: "Rishi Das", age: 10, relationship: "Son" },
      { name: "Riddhi Das", age: 8, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 0.7,
        description: "Traditional fishing and aquaculture area",
        evidence: ["Fisheries Department Certificate", "Water Rights Document"]
      }
    ],
    coordinates: [85.8828, 20.4625],
    claimDate: "2023-05-11",
    status: "approved",
    titleNumber: "CTC/2023/023",
    area: 0.7
  },
  {
    id: "IND024",
    claimantName: "Pradeep Mohanty",
    fatherMotherName: "Jagannath Mohanty",
    address: "Mahanadi Bank",
    village: "Choudwar",
    gramPanchayat: "Choudwar",
    tehsilTaluka: "Choudwar",
    district: "Cuttack",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Sunita Mohanty", age: 29, relationship: "Wife" },
      { name: "Aryan Mohanty", age: 6, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 1.3,
        description: "Riverside agriculture and boat making",
        evidence: ["Revenue Records", "Craft Certificate"]
      }
    ],
    coordinates: [85.9234, 20.5123],
    claimDate: "2023-06-07",
    status: "pending",
    area: 1.3
  },
  {
    id: "IND025",
    claimantName: "Ashok Kumar Behera",
    spouseName: "Nalini Behera",
    fatherMotherName: "Gopal Behera",
    address: "Industrial Area",
    village: "Paradeep",
    gramPanchayat: "Paradeep",
    tehsilTaluka: "Paradeep",
    district: "Cuttack",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Nalini Behera", age: 31, relationship: "Wife" },
      { name: "Akash Behera", age: 9, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "habitation",
        area: 0.4,
        description: "Displaced settlement due to industrial development",
        evidence: ["Displacement Certificate", "Rehabilitation Records"]
      }
    ],
    coordinates: [86.6100, 20.3181],
    claimDate: "2023-02-14",
    status: "rejected",
    area: 0.4
  },
  {
    id: "IND026",
    claimantName: "Kailash Chandra Nayak",
    fatherMotherName: "Brundaban Nayak",
    address: "Riverbank Colony",
    village: "Banki",
    gramPanchayat: "Banki",
    tehsilTaluka: "Banki",
    district: "Cuttack",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Sulochana Nayak", age: 39, relationship: "Wife" },
      { name: "Chinmay Nayak", age: 16, relationship: "Son" },
      { name: "Chitra Nayak", age: 14, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 0.9,
        description: "Traditional boat building and river transport",
        evidence: ["Boatmen Association Certificate", "Water Transport License"]
      }
    ],
    coordinates: [85.5234, 20.3789],
    claimDate: "2023-06-16",
    status: "approved",
    titleNumber: "CTC/2023/026",
    area: 0.9
  },

  // Puri District Claims (4 entries)
  {
    id: "IND027",
    claimantName: "Jagannath Patra",
    spouseName: "Basanti Patra",
    fatherMotherName: "Chakradhar Patra",
    address: "Temple Street",
    village: "Puri",
    gramPanchayat: "Puri",
    tehsilTaluka: "Puri",
    district: "Puri",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Basanti Patra", age: 40, relationship: "Wife" },
      { name: "Sai Patra", age: 17, relationship: "Son" },
      { name: "Subhadra Patra", age: 15, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 0.6,
        description: "Traditional craft and religious activities area",
        evidence: ["Temple Committee Certificate", "Craft Guild Records"]
      }
    ],
    coordinates: [85.8312, 19.8135],
    claimDate: "2023-03-25",
    status: "approved",
    titleNumber: "PRI/2023/027",
    area: 0.6
  },
  {
    id: "IND028",
    claimantName: "Sarat Chandra Sahoo",
    spouseName: "Kalpana Sahoo",
    fatherMotherName: "Damodar Sahoo",
    address: "Coastal Road",
    village: "Konark",
    gramPanchayat: "Konark",
    tehsilTaluka: "Konark",
    district: "Puri",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Kalpana Sahoo", age: 35, relationship: "Wife" },
      { name: "Tapas Sahoo", age: 13, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 0.8,
        description: "Coastal agriculture and salt farming",
        evidence: ["Salt Works License", "Agricultural Records"]
      }
    ],
    coordinates: [86.0947, 19.8876],
    claimDate: "2023-08-14",
    status: "pending",
    area: 0.8
  },
  {
    id: "IND029",
    claimantName: "Minati Pradhan",
    spouseName: "Bijay Pradhan",
    fatherMotherName: "Surya Pradhan",
    address: "Women's Cooperative Area",
    village: "Nimapara",
    gramPanchayat: "Nimapara",
    tehsilTaluka: "Nimapara",
    district: "Puri",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Bijay Pradhan", age: 37, relationship: "Husband" },
      { name: "Swati Pradhan", age: 13, relationship: "Daughter" },
      { name: "Sambit Pradhan", age: 10, relationship: "Son" }
    ],
    landClaims: [
      {
        type: "self-cultivation",
        area: 1.6,
        description: "Cooperative farming and handicraft production",
        evidence: ["Cooperative Society Certificate", "Handicraft License"]
      }
    ],
    coordinates: [85.9567, 19.9234],
    claimDate: "2023-09-05",
    status: "approved",
    titleNumber: "PRI/2023/029",
    area: 1.6
  },
  {
    id: "IND030",
    claimantName: "Ramesh Kumar Panda",
    spouseName: "Lila Panda",
    fatherMotherName: "Govind Panda",
    address: "Beach Side",
    village: "Pipili",
    gramPanchayat: "Pipili",
    tehsilTaluka: "Pipili",
    district: "Puri",
    scheduledTribe: false,
    otherTraditionalForestDweller: true,
    familyMembers: [
      { name: "Lila Panda", age: 28, relationship: "Wife" },
      { name: "Raju Panda", age: 5, relationship: "Son" },
      { name: "Renu Panda", age: 3, relationship: "Daughter" }
    ],
    landClaims: [
      {
        type: "traditional",
        area: 0.5,
        description: "Traditional applique craft and cultural activities",
        evidence: ["Craft Heritage Certificate", "Cultural Committee Records"]
      }
    ],
    coordinates: [85.8234, 19.7567],
    claimDate: "2023-04-30",
    status: "approved",
    titleNumber: "PRI/2023/030",
    area: 0.5
  }
];

// Community Claims Data (15 entries)
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
      { name: "Laxman Pradhan", status: "OTFD" },
      { name: "Sunita Nayak", status: "ST" }
    ],
    communityRights: [
      {
        type: "minor-forest-produce",
        description: "Collection of sal leaves, honey, medicinal plants"
      },
      {
        type: "grazing",
        description: "Cattle grazing in designated forest areas"
      },
      {
        type: "traditional-access",
        description: "Access to traditional water sources and pathways"
      }
    ],
    khasraCompartmentNo: ["45/1", "45/2", "46/1"],
    borderingVillages: ["Daringbadi", "Belghar", "Raikia"],
    coordinates: [84.2619, 20.4781],
    area: 15.5,
    description: "Traditional community forest area managed for sustainable use by the local tribal community for over 50 years",
    evidence: ["Historical Records", "Community Testimony", "Forest Department Records"],
    claimDate: "2023-04-20",
    status: "approved",
    titleNumber: "KDM/COM/2023/001"
  },
  {
    id: "COM002",
    village: "Daringbadi",
    gramPanchayat: "Daringbadi",
    tehsilTaluka: "Daringbadi",
    district: "Kandhamal",
    claimants: [
      { name: "Biswanath Kanhar", status: "ST" },
      { name: "Parvati Digal", status: "ST" },
      { name: "Raju Mallick", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "biodiversity",
        description: "Conservation of indigenous plant varieties and traditional seeds"
      },
      {
        type: "fish-water",
        description: "Fishing rights in community pond and seasonal streams"
      }
    ],
    khasraCompartmentNo: ["78/1", "78/2"],
    borderingVillages: ["Kotagarh", "Raikia"],
    coordinates: [84.1167, 20.5167],
    area: 8.3,
    description: "Community managed biodiversity conservation area with traditional fishing rights",
    evidence: ["Biodiversity Register", "Water Rights Certificate", "Historical Usage Records"],
    claimDate: "2023-06-15",
    status: "pending"
  },
  {
    id: "COM003",
    village: "Khallikote",
    gramPanchayat: "Khallikote",
    tehsilTaluka: "Khallikote",
    district: "Ganjam",
    claimants: [
      { name: "Ramesh Patra", status: "ST" },
      { name: "Kamala Sahoo", status: "OTFD" },
      { name: "Gobinda Nayak", status: "ST" },
      { name: "Sushila Mallick", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "minor-forest-produce",
        description: "Collection of cashew, tamarind, and medicinal herbs"
      },
      {
        type: "traditional-access",
        description: "Traditional pathways to sacred groves and water bodies"
      }
    ],
    khasraCompartmentNo: ["12/3", "12/4"],
    borderingVillages: ["Berhampur", "Aska"],
    coordinates: [84.8547, 19.2847],
    area: 6.8,
    description: "Coastal community forest with traditional NTFP collection rights",
    evidence: ["Traditional Rights Documentation", "Community Records"],
    claimDate: "2023-07-08",
    status: "approved",
    titleNumber: "GNJ/COM/2023/003"
  },
  {
    id: "COM004",
    village: "Tikabali",
    gramPanchayat: "Tikabali",
    tehsilTaluka: "Tikabali",
    district: "Kandhamal",
    claimants: [
      { name: "Basu Nayak", status: "ST" },
      { name: "Radha Nayak", status: "ST" },
      { name: "Dillip Pradhan", status: "OTFD" },
      { name: "Mina Kanhar", status: "ST" }
    ],
    communityRights: [
      {
        type: "traditional-right",
        description: "Traditional spice cultivation and processing"
      },
      {
        type: "grazing",
        description: "Community grazing lands for cattle and goats"
      }
    ],
    khasraCompartmentNo: ["23/1", "23/2", "24/1"],
    borderingVillages: ["Kotagarh", "Chakapad", "Balliguda"],
    coordinates: [84.0987, 20.4234],
    area: 12.7,
    description: "Traditional spice cultivation area with community processing facilities",
    evidence: ["Spice Board Certificate", "Community Usage Records", "Traditional Knowledge Documentation"],
    claimDate: "2023-05-30",
    status: "approved",
    titleNumber: "KDM/COM/2023/004"
  },
  {
    id: "COM005",
    village: "Berhampur",
    gramPanchayat: "Berhampur",
    tehsilTaluka: "Berhampur",
    district: "Ganjam",
    claimants: [
      { name: "Prakash Nayak", status: "OTFD" },
      { name: "Meera Nayak", status: "OTFD" },
      { name: "Jagdish Panda", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "minor-forest-produce",
        description: "Urban forest produce collection and community gardening"
      },
      {
        type: "habitat",
        description: "Protection of urban wildlife corridors"
      }
    ],
    khasraCompartmentNo: ["56/1", "56/2"],
    borderingVillages: ["Khallikote", "Aska", "Chhatrapur"],
    coordinates: [84.7833, 19.3150],
    area: 4.2,
    description: "Urban community forest area for environmental conservation",
    evidence: ["Urban Development Authority Records", "Environmental Clearance"],
    claimDate: "2023-08-11",
    status: "pending"
  },
  {
    id: "COM006",
    village: "Balliguda",
    gramPanchayat: "Balliguda",
    tehsilTaluka: "Balliguda",
    district: "Kandhamal",
    claimants: [
      { name: "Parvati Digal", status: "ST" },
      { name: "Lakshman Digal", status: "ST" },
      { name: "Bhima Mallick", status: "ST" },
      { name: "Sita Mallick", status: "ST" },
      { name: "Raghunath Kanhar", status: "ST" }
    ],
    communityRights: [
      {
        type: "traditional-right",
        description: "Sacred grove protection and ritual practices"
      },
      {
        type: "biodiversity",
        description: "Conservation of medicinal plants and rare species"
      },
      {
        type: "traditional-access",
        description: "Pilgrimage routes and ceremonial spaces"
      }
    ],
    khasraCompartmentNo: ["89/1", "89/2", "90/1"],
    borderingVillages: ["Tikabali", "Chakapad", "Baliguda"],
    coordinates: [84.1789, 20.1876],
    area: 18.9,
    description: "Sacred community forest with ancient tribal traditions and biodiversity conservation",
    evidence: ["Religious Authority Certificate", "Biodiversity Survey", "Tribal Council Records"],
    claimDate: "2023-03-18",
    status: "approved",
    titleNumber: "KDM/COM/2023/006"
  },
  {
    id: "COM007",
    village: "Jatni",
    gramPanchayat: "Jatni",
    tehsilTaluka: "Jatni",
    district: "Khordha",
    claimants: [
      { name: "Laxmi Narayan Jena", status: "OTFD" },
      { name: "Sabitri Jena", status: "OTFD" },
      { name: "Bijay Kumar Swain", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "traditional-access",
        description: "Traditional water harvesting and irrigation systems"
      },
      {
        type: "minor-forest-produce",
        description: "Floriculture and nursery development"
      }
    ],
    khasraCompartmentNo: ["34/1", "34/2"],
    borderingVillages: ["Bhubaneswar", "Khordha", "Tangi"],
    coordinates: [85.7456, 20.1678],
    area: 5.4,
    description: "Community managed water conservation and floriculture area",
    evidence: ["Water Conservation Certificate", "Horticulture Department Records"],
    claimDate: "2023-07-25",
    status: "approved",
    titleNumber: "KHD/COM/2023/007"
  },
  {
    id: "COM008",
    village: "Choudwar",
    gramPanchayat: "Choudwar",
    tehsilTaluka: "Choudwar",
    district: "Cuttack",
    claimants: [
      { name: "Pradeep Mohanty", status: "OTFD" },
      { name: "Sunita Mohanty", status: "OTFD" },
      { name: "Santosh Kumar Das", status: "OTFD" },
      { name: "Mamata Das", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "fish-water",
        description: "Community fishing rights in Mahanadi tributaries"
      },
      {
        type: "traditional-right",
        description: "Traditional boat building and river transport"
      }
    ],
    khasraCompartmentNo: ["67/1", "67/2", "68/1"],
    borderingVillages: ["Cuttack", "Banki", "Athagarh"],
    coordinates: [85.9234, 20.5123],
    area: 7.6,
    description: "Riverside community area for traditional livelihoods and water resource management",
    evidence: ["Fisheries Cooperative Certificate", "Water Transport License", "River Management Committee Records"],
    claimDate: "2023-04-03",
    status: "pending"
  },
  {
    id: "COM009",
    village: "Konark",
    gramPanchayat: "Konark",
    tehsilTaluka: "Konark",
    district: "Puri",
    claimants: [
      { name: "Sarat Chandra Sahoo", status: "OTFD" },
      { name: "Kalpana Sahoo", status: "OTFD" },
      { name: "Jagannath Patra", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "traditional-access",
        description: "Traditional salt farming and coastal resource management"
      },
      {
        type: "habitat",
        description: "Coastal ecosystem conservation and turtle nesting protection"
      }
    ],
    khasraCompartmentNo: ["101/1", "101/2"],
    borderingVillages: ["Puri", "Nimapara", "Kakatpur"],
    coordinates: [86.0947, 19.8876],
    area: 9.3,
    description: "Coastal community conservation area with traditional salt farming rights",
    evidence: ["Coastal Zone Management Certificate", "Salt Works License", "Turtle Conservation Records"],
    claimDate: "2023-09-01",
    status: "approved",
    titleNumber: "PRI/COM/2023/009"
  },
  {
    id: "COM010",
    village: "Chakapad",
    gramPanchayat: "Chakapad",
    tehsilTaluka: "Chakapad",
    district: "Kandhamal",
    claimants: [
      { name: "Bhima Mallick", status: "ST" },
      { name: "Sita Mallick", status: "ST" },
      { name: "Krishna Nayak", status: "ST" },
      { name: "Radha Pradhan", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "minor-forest-produce",
        description: "Traditional honey production and NTFP collection"
      },
      {
        type: "traditional-right",
        description: "Traditional knowledge preservation and education"
      }
    ],
    khasraCompartmentNo: ["112/1", "112/2", "113/1"],
    borderingVillages: ["Tikabali", "Balliguda", "Kotagarh"],
    coordinates: [84.1234, 20.3456],
    area: 11.4,
    description: "Traditional knowledge center with honey production and NTFP sustainable harvesting",
    evidence: ["Traditional Knowledge Documentation", "Honey Production Certificate", "NTFP Collection License"],
    claimDate: "2023-06-20",
    status: "approved",
    titleNumber: "KDM/COM/2023/010"
  },
  {
    id: "COM011",
    village: "Phiringia",
    gramPanchayat: "Phiringia",
    tehsilTaluka: "Phiringia",
    district: "Kandhamal",
    claimants: [
      { name: "Krishna Nayak", status: "ST" },
      { name: "Gita Nayak", status: "ST" },
      { name: "Dillip Pradhan", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "biodiversity",
        description: "Seed conservation and organic farming promotion"
      },
      {
        type: "traditional-access",
        description: "Traditional farming techniques preservation"
      }
    ],
    khasraCompartmentNo: ["45/3", "45/4"],
    borderingVillages: ["Kotagarh", "Tikabali"],
    coordinates: [84.2345, 20.3789],
    area: 6.7,
    description: "Community seed bank and organic farming demonstration area",
    evidence: ["Seed Bank Certificate", "Organic Farming License", "Agricultural Extension Records"],
    claimDate: "2023-08-09",
    status: "approved",
    titleNumber: "KDM/COM/2023/011"
  },
  {
    id: "COM012",
    village: "Aska",
    gramPanchayat: "Aska",
    tehsilTaluka: "Aska",
    district: "Ganjam",
    claimants: [
      { name: "Gopi Krishna Panda", status: "OTFD" },
      { name: "Bina Panda", status: "OTFD" },
      { name: "Sushila Sahoo", status: "OTFD" },
      { name: "Ramesh Sahoo", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "traditional-access",
        description: "Traditional irrigation and water management systems"
      },
      {
        type: "minor-forest-produce",
        description: "Community garden and fruit cultivation"
      }
    ],
    khasraCompartmentNo: ["67/3", "67/4"],
    borderingVillages: ["Khallikote", "Berhampur", "Chhatrapur"],
    coordinates: [84.6678, 19.6123],
    area: 5.9,
    description: "Traditional water management community with mixed cultivation practices",
    evidence: ["Water Management Certificate", "Community Garden Records", "Traditional Irrigation Documentation"],
    claimDate: "2023-05-17",
    status: "pending"
  },
  {
    id: "COM013",
    village: "Banki",
    gramPanchayat: "Banki",
    tehsilTaluka: "Banki",
    district: "Cuttack",
    claimants: [
      { name: "Kailash Chandra Nayak", status: "OTFD" },
      { name: "Sulochana Nayak", status: "OTFD" },
      { name: "Pradeep Mohanty", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "traditional-right",
        description: "Traditional boat building and maritime skills preservation"
      },
      {
        type: "fish-water",
        description: "Community fishing and aquaculture rights"
      }
    ],
    khasraCompartmentNo: ["89/3", "89/4"],
    borderingVillages: ["Cuttack", "Choudwar", "Athagarh"],
    coordinates: [85.5234, 20.3789],
    area: 4.8,
    description: "Traditional maritime community with boat building heritage and fishing rights",
    evidence: ["Boat Building Guild Certificate", "Fishing Cooperative License", "Maritime Heritage Documentation"],
    claimDate: "2023-07-31",
    status: "approved",
    titleNumber: "CTC/COM/2023/013"
  },
  {
    id: "COM014",
    village: "Nimapara",
    gramPanchayat: "Nimapara",
    tehsilTaluka: "Nimapara",
    district: "Puri",
    claimants: [
      { name: "Minati Pradhan", status: "OTFD" },
      { name: "Bijay Pradhan", status: "OTFD" },
      { name: "Sarat Chandra Sahoo", status: "OTFD" },
      { name: "Kalpana Sahoo", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "traditional-right",
        description: "Women's cooperative and handicraft production"
      },
      {
        type: "minor-forest-produce",
        description: "Sustainable craft material collection"
      }
    ],
    khasraCompartmentNo: ["123/1", "123/2"],
    borderingVillages: ["Puri", "Konark", "Pipili"],
    coordinates: [85.9567, 19.9234],
    area: 3.4,
    description: "Women's cooperative community area for handicraft production and sustainable livelihoods",
    evidence: ["Women's Cooperative Certificate", "Handicraft Production License", "Sustainable Livelihood Records"],
    claimDate: "2023-09-18",
    status: "approved",
    titleNumber: "PRI/COM/2023/014"
  },
  {
    id: "COM015",
    village: "Pipili",
    gramPanchayat: "Pipili",
    tehsilTaluka: "Pipili",
    district: "Puri",
    claimants: [
      { name: "Ramesh Kumar Panda", status: "OTFD" },
      { name: "Lila Panda", status: "OTFD" },
      { name: "Jagannath Patra", status: "OTFD" }
    ],
    communityRights: [
      {
        type: "traditional-right",
        description: "Traditional applique craft and cultural heritage preservation"
      },
      {
        type: "habitat",
        description: "Cultural landscape conservation and traditional architecture"
      }
    ],
    khasraCompartmentNo: ["145/1", "145/2"],
    borderingVillages: ["Puri", "Nimapara", "Delang"],
    coordinates: [85.8234, 19.7567],
    area: 2.8,
    description: "Traditional craft heritage community specializing in applique art and cultural preservation",
    evidence: ["Cultural Heritage Certificate", "Craft Guild Documentation", "Traditional Art Preservation Records"],
    claimDate: "2023-04-12",
    status: "approved",
    titleNumber: "PRI/COM/2023/015"
  }
];

// Enhanced zoom function
export const handleEnhancedClaimSelect = (
  claim: FRAIndividualClaim | FRACommunityResourceClaim,
  setSelectedClaim: (claim: FRAIndividualClaim | FRACommunityResourceClaim) => void,
  setMapCenter: (center: [number, number]) => void,
  setMapZoom: (zoom: number) => void,
  setHighlightedDistrict: (district: string) => void
) => {
  setSelectedClaim(claim);
  
  // Set initial coordinates and zoom for the specific claim location
  setMapCenter(claim.coordinates);
  setMapZoom(14); // Close zoom for specific location
  
  // Highlight the district
  setHighlightedDistrict(claim.district);
  
  // Smooth transition: first zoom to district, then to specific location
  const districtInfo = districtBoundaries[claim.district as keyof typeof districtBoundaries];
  if (districtInfo) {
    // First zoom to district level
    setTimeout(() => {
      setMapCenter(districtInfo.center);
      setMapZoom(9);
    }, 100);
    
    // Then zoom to specific location
    setTimeout(() => {
      setMapCenter(claim.coordinates);
      setMapZoom(16); // Very close zoom for precise location
    }, 800);
  } else {
    // If no district boundary, just zoom to the specific location
    setTimeout(() => {
      setMapCenter(claim.coordinates);
      setMapZoom(15);
    }, 100);
  }
};

// Search utility functions
export const searchByName = (
  query: string, 
  individuals: FRAIndividualClaim[], 
  communities: FRACommunityResourceClaim[]
) => {
  const filteredIndividuals = individuals.filter(claim => 
    claim.claimantName.toLowerCase().includes(query.toLowerCase()) ||
    claim.spouseName?.toLowerCase().includes(query.toLowerCase()) ||
    claim.fatherMotherName.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredCommunities = communities.filter(claim =>
    claim.claimants.some(claimant => 
      claimant.name.toLowerCase().includes(query.toLowerCase())
    )
  );
  
  return { individuals: filteredIndividuals, communities: filteredCommunities };
};

export const searchByLocation = (
  query: string,
  individuals: FRAIndividualClaim[], 
  communities: FRACommunityResourceClaim[]
) => {
  const filteredIndividuals = individuals.filter(claim => 
    claim.village.toLowerCase().includes(query.toLowerCase()) ||
    claim.district.toLowerCase().includes(query.toLowerCase()) ||
    claim.tehsilTaluka.toLowerCase().includes(query.toLowerCase()) ||
    claim.gramPanchayat.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredCommunities = communities.filter(claim => 
    claim.village.toLowerCase().includes(query.toLowerCase()) ||
    claim.district.toLowerCase().includes(query.toLowerCase()) ||
    claim.tehsilTaluka.toLowerCase().includes(query.toLowerCase()) ||
    claim.gramPanchayat.toLowerCase().includes(query.toLowerCase())
  );
  
  return { individuals: filteredIndividuals, communities: filteredCommunities };
};

export const searchByTitleNumber = (
  query: string,
  individuals: FRAIndividualClaim[], 
  communities: FRACommunityResourceClaim[]
) => {
  const filteredIndividuals = individuals.filter(claim => 
    claim.titleNumber?.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredCommunities = communities.filter(claim =>
    claim.titleNumber?.toLowerCase().includes(query.toLowerCase())
  );
  
  return { individuals: filteredIndividuals, communities: filteredCommunities };
};