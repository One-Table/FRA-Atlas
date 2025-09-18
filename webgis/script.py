# Based on the research, let me create a basic framework for the FRA categories and classification system for Odisha districts

# FRA Categories based on the research
fra_categories = {
    "Individual Forest Rights (IFR)": {
        "description": "Individual occupancy rights on forest land",
        "area_limit": "Up to 4 hectares per individual",
        "eligibility": "Forest dwelling ST and OTFD residing before 13th Dec 2005",
        "color": "#ff6b6b"  # Red
    },
    "Community Forest Rights (CFR)": {
        "description": "Rights to protect, regenerate, conserve or manage community forest resource",
        "scope": "Traditional and customary boundaries of village",
        "authority": "Gram Sabha",
        "color": "#4ecdc4"  # Teal
    },
    "Community Rights (CR)": {
        "description": "Rights over minor forest produce, grazing, fishing",
        "includes": "NTFP, water bodies, grazing grounds",
        "color": "#45b7d1"  # Blue
    },
    "Habitat Rights": {
        "description": "Rights of PVTGs over their habitat",
        "scope": "Particularly Vulnerable Tribal Groups",
        "color": "#96ceb4"  # Light Green
    },
    "Forest Village Conversion": {
        "description": "Conversion of forest villages to revenue villages",
        "process": "Settlement and conversion rights",
        "color": "#feca57"  # Yellow
    }
}

# Odisha district classification based on FRA potential
odisha_fra_classification = {
    "Very High Potential": {
        "districts": ["Kandhamal", "Mayurbhanj", "Rayagada", "Keonjhar", "Koraput"],
        "characteristics": "High tribal population, significant forest cover, active CFR recognition",
        "cfr_potential_percent": "> 70%",
        "color": "#27ae60"  # Dark Green
    },
    "High Potential": {
        "districts": ["Kalahandi", "Sundargarh", "Ganjam", "Angul", "Balangir"],
        "characteristics": "Moderate to high tribal population, good forest cover",
        "cfr_potential_percent": "50-70%",
        "color": "#2ecc71"  # Green
    },
    "Moderate Potential": {
        "districts": ["Sambalpur", "Dhenkanal", "Nawarangpur", "Malkangiri", "Gajapati"],
        "characteristics": "Moderate tribal population and forest cover",
        "cfr_potential_percent": "30-50%",
        "color": "#f39c12"  # Orange
    },
    "Low Potential": {
        "districts": ["Boudh", "Debagarh", "Jharsuguda", "Bargarh", "Nuapada"],
        "characteristics": "Lower tribal population or forest cover",
        "cfr_potential_percent": "10-30%",
        "color": "#e74c3c"  # Red
    },
    "Very Low Potential": {
        "districts": ["Puri", "Jagatsinghpur", "Khordha", "Cuttack", "Bhadrak", "Balasore", "Jajpur", "Kendrapara", "Nayagarh"],
        "characteristics": "Coastal areas, urban centers, minimal forest cover",
        "cfr_potential_percent": "< 10%",
        "color": "#95a5a6"  # Gray
    }
}

# All 30 districts of Odisha
all_odisha_districts = [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Debagarh",
    "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
    "Kandhamal", "Kendrapara", "Keonjhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj",
    "Nawarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sundargarh", "Subarnapur"
]

print("FRA Categories for Interactive Map Legend:")
print("=" * 50)
for category, details in fra_categories.items():
    print(f"{category}: {details['color']}")
    print(f"  Description: {details['description']}")
    print()

print("\nOdisha District FRA Classification:")
print("=" * 50)
for classification, details in odisha_fra_classification.items():
    print(f"{classification}: {details['color']}")
    print(f"  Districts: {', '.join(details['districts'])}")
    print(f"  CFR Potential: {details['cfr_potential_percent']}")
    print()

print(f"\nTotal Odisha Districts: {len(all_odisha_districts)}")