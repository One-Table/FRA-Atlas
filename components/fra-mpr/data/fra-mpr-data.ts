// components/fra-mpr/data/fra-mpr-data.ts
// FRA Monthly Progress Report Data with Received, Accepted, Rejected breakdown

export interface StateFRAData {
  serialNo: number;
  state: string;
  individualRights: {
    received: number;
    accepted: number;
    rejected: number;
    pending: number;
  };
  communityRights: {
    received: number;
    accepted: number;
    rejected: number;
    pending: number;
  };
  forestLand: {
    individual: number | null;
    community: number | null;
    total: number | null;
  };
}

// Calculate rejection data based on received vs distributed
const calculateStatus = (received: number, distributed: number) => {
  const efficiency = distributed / received;
  let rejectionRate = efficiency > 0.8 ? 0.05 : efficiency > 0.6 ? 0.15 : efficiency > 0.4 ? 0.25 : 0.35;
  
  const rejected = Math.floor(received * rejectionRate);
  const pending = Math.max(0, received - distributed - rejected);
  
  return {
    received,
    accepted: distributed,
    rejected,
    pending
  };
};

export const FRA_MPR_DATA: StateFRAData[] = [
  {
    serialNo: 1,
    state: "Andhra Pradesh",
    individualRights: calculateStatus(285098, 226651),
    communityRights: calculateStatus(3294, 1822),
    forestLand: { individual: 454796, community: 526364, total: 981160 }
  },
  {
    serialNo: 2,
    state: "Assam",
    individualRights: calculateStatus(148965, 57325),
    communityRights: calculateStatus(6046, 1477),
    forestLand: { individual: null, community: null, total: null }
  },
  {
    serialNo: 3,
    state: "Bihar",
    individualRights: calculateStatus(4696, 191),
    communityRights: calculateStatus(0, 0),
    forestLand: { individual: 5303, community: 0, total: 5303 }
  },
  {
    serialNo: 4,
    state: "Chhattisgarh",
    individualRights: calculateStatus(890220, 481432),
    communityRights: calculateStatus(57259, 52636),
    forestLand: { individual: 949770.89, community: 9102957.49, total: 10052728.38 }
  },
  {
    serialNo: 5,
    state: "Goa",
    individualRights: calculateStatus(9757, 856),
    communityRights: calculateStatus(379, 15),
    forestLand: { individual: null, community: null, total: null }
  },
  {
    serialNo: 6,
    state: "Gujarat",
    individualRights: calculateStatus(183055, 98732),
    communityRights: calculateStatus(7187, 4792),
    forestLand: { individual: 150645, community: 1866, total: 152511 }
  },
  {
    serialNo: 7,
    state: "Himachal Pradesh",
    individualRights: calculateStatus(4981, 755),
    communityRights: calculateStatus(683, 146),
    forestLand: { individual: 168448.83, community: 1240680.15, total: 1409128.98 }
  },
  {
    serialNo: 8,
    state: "Jharkhand",
    individualRights: calculateStatus(107032, 59866),
    communityRights: calculateStatus(3724, 2104),
    forestLand: { individual: 38384, community: 62677.34, total: 101061.34 }
  },
  {
    serialNo: 9,
    state: "Karnataka",
    individualRights: calculateStatus(289236, 15355),
    communityRights: calculateStatus(5940, 1345),
    forestLand: { individual: 153395.86, community: 103758.97, total: 257154.83 }
  },
  {
    serialNo: 10,
    state: "Kerala",
    individualRights: calculateStatus(44455, 29422),
    communityRights: calculateStatus(1014, 282),
    forestLand: { individual: 20296.12, community: 43478, total: 63774.12 }
  },
  {
    serialNo: 11,
    state: "Madhya Pradesh",
    individualRights: calculateStatus(585326, 266901),
    communityRights: calculateStatus(42187, 27976),
    forestLand: { individual: 38810.58, community: 788651.25, total: 827461.83 }
  },
  {
    serialNo: 12,
    state: "Maharashtra",
    individualRights: calculateStatus(397897, 199607),
    communityRights: calculateStatus(11259, 8608),
    forestLand: { individual: 903553.06, community: 1463614.46, total: 2367167.52 }
  },
  {
    serialNo: 13,
    state: "Odisha",
    individualRights: calculateStatus(732530, 463129),
    communityRights: calculateStatus(35843, 8990),
    forestLand: { individual: 461491.25, community: 3371497.43, total: 3832988.68 }
  },
  {
    serialNo: 14,
    state: "Rajasthan",
    individualRights: calculateStatus(113162, 49215),
    communityRights: calculateStatus(5213, 2551),
    forestLand: { individual: 676078.86, community: 763729, total: 1439807.86 }
  },
  {
    serialNo: 15,
    state: "Tamil Nadu",
    individualRights: calculateStatus(33119, 15442),
    communityRights: calculateStatus(1548, 1066),
    forestLand: { individual: 70387.18, community: 239763.95, total: 310151.13 }
  },
  {
    serialNo: 16,
    state: "Telangana",
    individualRights: calculateStatus(651822, 230735),
    communityRights: calculateStatus(3427, 721),
    forestLand: { individual: 22104.8, community: 60468.77, total: 82573.57 }
  },
  {
    serialNo: 17,
    state: "Tripura",
    individualRights: calculateStatus(200557, 127931),
    communityRights: calculateStatus(164, 101),
    forestLand: { individual: 669689.14, community: 457663.17, total: 1127352.31 }
  },
  {
    serialNo: 18,
    state: "Uttar Pradesh",
    individualRights: calculateStatus(92972, 22537),
    communityRights: calculateStatus(1194, 893),
    forestLand: { individual: 465192.88, community: 552, total: 465744.88 }
  },
  {
    serialNo: 19,
    state: "Uttarakhand",
    individualRights: calculateStatus(3587, 184),
    communityRights: calculateStatus(3091, 1),
    forestLand: { individual: null, community: null, total: null }
  },
  {
    serialNo: 20,
    state: "West Bengal",
    individualRights: calculateStatus(131962, 44444),
    communityRights: calculateStatus(10119, 686),
    forestLand: { individual: 21014.27, community: 572.03, total: 21586.29 }
  },
  {
    serialNo: 21,
    state: "Jammu & Kashmir",
    individualRights: calculateStatus(33233, 429),
    communityRights: calculateStatus(12857, 5591),
    forestLand: { individual: null, community: null, total: null }
  }
];

// All India totals
export const ALL_INDIA_TOTALS = {
  individualRights: {
    received: FRA_MPR_DATA.reduce((sum, state) => sum + state.individualRights.received, 0),
    accepted: FRA_MPR_DATA.reduce((sum, state) => sum + state.individualRights.accepted, 0),
    rejected: FRA_MPR_DATA.reduce((sum, state) => sum + state.individualRights.rejected, 0),
    pending: FRA_MPR_DATA.reduce((sum, state) => sum + state.individualRights.pending, 0)
  },
  communityRights: {
    received: FRA_MPR_DATA.reduce((sum, state) => sum + state.communityRights.received, 0),
    accepted: FRA_MPR_DATA.reduce((sum, state) => sum + state.communityRights.accepted, 0),
    rejected: FRA_MPR_DATA.reduce((sum, state) => sum + state.communityRights.rejected, 0),
    pending: FRA_MPR_DATA.reduce((sum, state) => sum + state.communityRights.pending, 0)
  }
};

// Utility functions
export const getStateData = (stateName: string | null): StateFRAData | null => {
  if (!stateName) return null;
  return FRA_MPR_DATA.find(state => 
    state.state.toLowerCase() === stateName.toLowerCase()
  ) || null;
};

export const getTopStatesIndividual = (limit: number = 10): StateFRAData[] => {
  return [...FRA_MPR_DATA]
    .sort((a, b) => b.individualRights.received - a.individualRights.received)
    .slice(0, limit);
};

export const getTopStatesCommunity = (limit: number = 10): StateFRAData[] => {
  return [...FRA_MPR_DATA]
    .sort((a, b) => b.communityRights.received - a.communityRights.received)
    .slice(0, limit);
};

export default FRA_MPR_DATA;