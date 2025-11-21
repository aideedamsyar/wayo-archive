export interface Country {
  code: string;        // ISO 2-letter code
  alpha3: string;      // ISO 3-letter code
  name: string;        // English name
  localName?: string;  // Name in local language
  region: string;      // Geographical region
}

export const COUNTRIES: Country[] = [
  // East Asia
  {
    code: "KR",
    alpha3: "KOR",
    name: "South Korea",
    localName: "대한민국",
    region: "East Asia"
  },
  {
    code: "JP",
    alpha3: "JPN",
    name: "Japan",
    localName: "日本",
    region: "East Asia"
  },
  {
    code: "CN",
    alpha3: "CHN",
    name: "China",
    localName: "中国",
    region: "East Asia"
  },
  {
    code: "TW",
    alpha3: "TWN",
    name: "Taiwan",
    localName: "台灣",
    region: "East Asia"
  },
  {
    code: "HK",
    alpha3: "HKG",
    name: "Hong Kong",
    localName: "香港",
    region: "East Asia"
  },
  {
    code: "MO",
    alpha3: "MAC",
    name: "Macau",
    localName: "澳門",
    region: "East Asia"
  },
  {
    code: "MN",
    alpha3: "MNG",
    name: "Mongolia",
    localName: "Монгол",
    region: "East Asia"
  },
  // Southeast Asia
  {
    code: "VN",
    alpha3: "VNM",
    name: "Vietnam",
    localName: "Việt Nam",
    region: "Southeast Asia"
  },
  {
    code: "TH",
    alpha3: "THA",
    name: "Thailand",
    localName: "ประเทศไทย",
    region: "Southeast Asia"
  },
  {
    code: "ID",
    alpha3: "IDN",
    name: "Indonesia",
    localName: "Indonesia",
    region: "Southeast Asia"
  },
  {
    code: "MY",
    alpha3: "MYS",
    name: "Malaysia",
    localName: "Malaysia",
    region: "Southeast Asia"
  },
  {
    code: "SG",
    alpha3: "SGP",
    name: "Singapore",
    localName: "Singapore",
    region: "Southeast Asia"
  },
  {
    code: "PH",
    alpha3: "PHL",
    name: "Philippines",
    localName: "Pilipinas",
    region: "Southeast Asia"
  },
  {
    code: "BN",
    alpha3: "BRN",
    name: "Brunei",
    localName: "Brunei",
    region: "Southeast Asia"
  },
  {
    code: "KH",
    alpha3: "KHM",
    name: "Cambodia",
    localName: "កម្ពុជា",
    region: "Southeast Asia"
  },
  {
    code: "LA",
    alpha3: "LAO",
    name: "Laos",
    localName: "ລາວ",
    region: "Southeast Asia"
  },
  {
    code: "MM",
    alpha3: "MMR",
    name: "Myanmar",
    localName: "မြန်မာ",
    region: "Southeast Asia"
  },
  {
    code: "TL",
    alpha3: "TLS",
    name: "Timor-Leste",
    localName: "Timor-Leste",
    region: "Southeast Asia"
  },
  // South Asia
  {
    code: "IN",
    alpha3: "IND",
    name: "India",
    localName: "भारत",
    region: "South Asia"
  },
  {
    code: "PK",
    alpha3: "PAK",
    name: "Pakistan",
    localName: "پاکستان",
    region: "South Asia"
  },
  {
    code: "BD",
    alpha3: "BGD",
    name: "Bangladesh",
    localName: "বাংলাদেশ",
    region: "South Asia"
  },
  {
    code: "LK",
    alpha3: "LKA",
    name: "Sri Lanka",
    localName: "ශ්‍රී ලංකාව",
    region: "South Asia"
  },
  {
    code: "NP",
    alpha3: "NPL",
    name: "Nepal",
    localName: "नेपाल",
    region: "South Asia"
  },
  {
    code: "BT",
    alpha3: "BTN",
    name: "Bhutan",
    localName: "འབྲུག་ཡུལ",
    region: "South Asia"
  },
  {
    code: "MV",
    alpha3: "MDV",
    name: "Maldives",
    localName: "ދިވެހިރާއްޖެ",
    region: "South Asia"
  },
  // Middle East
  {
    code: "AE",
    alpha3: "ARE",
    name: "United Arab Emirates",
    localName: "الإمارات العربية المتحدة",
    region: "Middle East"
  },
  {
    code: "SA",
    alpha3: "SAU",
    name: "Saudi Arabia",
    localName: "المملكة العربية السعودية",
    region: "Middle East"
  },
  {
    code: "QA",
    alpha3: "QAT",
    name: "Qatar",
    localName: "قطر",
    region: "Middle East"
  },
  {
    code: "BH",
    alpha3: "BHR",
    name: "Bahrain",
    localName: "البحرين",
    region: "Middle East"
  },
  {
    code: "KW",
    alpha3: "KWT",
    name: "Kuwait",
    localName: "الكويت",
    region: "Middle East"
  },
  {
    code: "OM",
    alpha3: "OMN",
    name: "Oman",
    localName: "عمان",
    region: "Middle East"
  },
  {
    code: "PS",
    alpha3: "PSE",
    name: "Palestine",
    localName: "فلسطين",
    region: "Middle East"
  },
  {
    code: "TR",
    alpha3: "TUR",
    name: "Turkey",
    localName: "Türkiye",
    region: "Middle East"
  },
  {
    code: "IR",
    alpha3: "IRN",
    name: "Iran",
    localName: "ایران",
    region: "Middle East"
  },
  {
    code: "IQ",
    alpha3: "IRQ",
    name: "Iraq",
    localName: "العراق",
    region: "Middle East"
  },
  {
    code: "JO",
    alpha3: "JOR",
    name: "Jordan",
    localName: "الأردن",
    region: "Middle East"
  },
  {
    code: "LB",
    alpha3: "LBN",
    name: "Lebanon",
    localName: "لبنان",
    region: "Middle East"
  },
  {
    code: "SY",
    alpha3: "SYR",
    name: "Syria",
    localName: "سوريا",
    region: "Middle East"
  },
  {
    code: "YE",
    alpha3: "YEM",
    name: "Yemen",
    localName: "اليمن",
    region: "Middle East"
  },
  // Central Asia
  {
    code: "KZ",
    alpha3: "KAZ",
    name: "Kazakhstan",
    localName: "Қазақстан",
    region: "Central Asia"
  },
  {
    code: "UZ",
    alpha3: "UZB",
    name: "Uzbekistan",
    localName: "O'zbekiston",
    region: "Central Asia"
  },
  {
    code: "KG",
    alpha3: "KGZ",
    name: "Kyrgyzstan",
    localName: "Кыргызстан",
    region: "Central Asia"
  },
  {
    code: "TJ",
    alpha3: "TJK",
    name: "Tajikistan",
    localName: "Тоҷикистон",
    region: "Central Asia"
  },
  {
    code: "TM",
    alpha3: "TKM",
    name: "Turkmenistan",
    localName: "Türkmenistan",
    region: "Central Asia"
  },
  // North America
  {
    code: "US",
    alpha3: "USA",
    name: "United States",
    region: "North America"
  },
  {
    code: "CA",
    alpha3: "CAN",
    name: "Canada",
    region: "North America"
  },
  {
    code: "MX",
    alpha3: "MEX",
    name: "Mexico",
    localName: "México",
    region: "North America"
  },
  // Central America
  {
    code: "GT",
    alpha3: "GTM",
    name: "Guatemala",
    region: "Central America"
  },
  {
    code: "BZ",
    alpha3: "BLZ",
    name: "Belize",
    region: "Central America"
  },
  {
    code: "HN",
    alpha3: "HND",
    name: "Honduras",
    region: "Central America"
  },
  {
    code: "SV",
    alpha3: "SLV",
    name: "El Salvador",
    region: "Central America"
  },
  {
    code: "NI",
    alpha3: "NIC",
    name: "Nicaragua",
    region: "Central America"
  },
  {
    code: "CR",
    alpha3: "CRI",
    name: "Costa Rica",
    region: "Central America"
  },
  {
    code: "PA",
    alpha3: "PAN",
    name: "Panama",
    region: "Central America"
  },
  // Caribbean
  {
    code: "CU",
    alpha3: "CUB",
    name: "Cuba",
    region: "Caribbean"
  },
  {
    code: "JM",
    alpha3: "JAM",
    name: "Jamaica",
    region: "Caribbean"
  },
  {
    code: "HT",
    alpha3: "HTI",
    name: "Haiti",
    region: "Caribbean"
  },
  {
    code: "DO",
    alpha3: "DOM",
    name: "Dominican Republic",
    localName: "República Dominicana",
    region: "Caribbean"
  },
  {
    code: "PR",
    alpha3: "PRI",
    name: "Puerto Rico",
    region: "Caribbean"
  },
  // South America
  {
    code: "BR",
    alpha3: "BRA",
    name: "Brazil",
    localName: "Brasil",
    region: "South America"
  },
  {
    code: "AR",
    alpha3: "ARG",
    name: "Argentina",
    region: "South America"
  },
  {
    code: "CO",
    alpha3: "COL",
    name: "Colombia",
    region: "South America"
  },
  {
    code: "PE",
    alpha3: "PER",
    name: "Peru",
    localName: "Perú",
    region: "South America"
  },
  {
    code: "VE",
    alpha3: "VEN",
    name: "Venezuela",
    region: "South America"
  },
  {
    code: "CL",
    alpha3: "CHL",
    name: "Chile",
    region: "South America"
  },
  {
    code: "EC",
    alpha3: "ECU",
    name: "Ecuador",
    region: "South America"
  },
  {
    code: "BO",
    alpha3: "BOL",
    name: "Bolivia",
    region: "South America"
  },
  {
    code: "PY",
    alpha3: "PRY",
    name: "Paraguay",
    region: "South America"
  },
  {
    code: "UY",
    alpha3: "URY",
    name: "Uruguay",
    region: "South America"
  },
  {
    code: "GY",
    alpha3: "GUY",
    name: "Guyana",
    region: "South America"
  },
  {
    code: "SR",
    alpha3: "SUR",
    name: "Suriname",
    region: "South America"
  },
  // Europe
  {
    code: "RU",
    alpha3: "RUS",
    name: "Russia",
    localName: "Россия",
    region: "Europe"
  },
  {
    code: "GB",
    alpha3: "GBR",
    name: "United Kingdom",
    region: "Europe"
  },
  {
    code: "FR",
    alpha3: "FRA",
    name: "France",
    localName: "France",
    region: "Europe"
  },
  {
    code: "DE",
    alpha3: "DEU",
    name: "Germany",
    localName: "Deutschland",
    region: "Europe"
  },
  {
    code: "IT",
    alpha3: "ITA",
    name: "Italy",
    localName: "Italia",
    region: "Europe"
  },
  {
    code: "ES",
    alpha3: "ESP",
    name: "Spain",
    localName: "España",
    region: "Europe"
  },
  {
    code: "PT",
    alpha3: "PRT",
    name: "Portugal",
    localName: "Portugal",
    region: "Europe"
  },
  {
    code: "NL",
    alpha3: "NLD",
    name: "Netherlands",
    localName: "Nederland",
    region: "Europe"
  },
  {
    code: "BE",
    alpha3: "BEL",
    name: "Belgium",
    localName: "België",
    region: "Europe"
  },
  {
    code: "CH",
    alpha3: "CHE",
    name: "Switzerland",
    localName: "Schweiz",
    region: "Europe"
  },
  {
    code: "AT",
    alpha3: "AUT",
    name: "Austria",
    localName: "Österreich",
    region: "Europe"
  },
  {
    code: "SE",
    alpha3: "SWE",
    name: "Sweden",
    localName: "Sverige",
    region: "Europe"
  },
  {
    code: "NO",
    alpha3: "NOR",
    name: "Norway",
    localName: "Norge",
    region: "Europe"
  },
  {
    code: "DK",
    alpha3: "DNK",
    name: "Denmark",
    localName: "Danmark",
    region: "Europe"
  },
  {
    code: "FI",
    alpha3: "FIN",
    name: "Finland",
    localName: "Suomi",
    region: "Europe"
  },
  {
    code: "IE",
    alpha3: "IRL",
    name: "Ireland",
    localName: "Éire",
    region: "Europe"
  },
  {
    code: "PL",
    alpha3: "POL",
    name: "Poland",
    localName: "Polska",
    region: "Europe"
  },
  {
    code: "RO",
    alpha3: "ROU",
    name: "Romania",
    localName: "România",
    region: "Europe"
  },
  {
    code: "GR",
    alpha3: "GRC",
    name: "Greece",
    localName: "Ελλάδα",
    region: "Europe"
  },
  {
    code: "CZ",
    alpha3: "CZE",
    name: "Czech Republic",
    localName: "Česká republika",
    region: "Europe"
  },
  {
    code: "HU",
    alpha3: "HUN",
    name: "Hungary",
    localName: "Magyarország",
    region: "Europe"
  },
  {
    code: "BG",
    alpha3: "BGR",
    name: "Bulgaria",
    localName: "България",
    region: "Europe"
  },
  {
    code: "SK",
    alpha3: "SVK",
    name: "Slovakia",
    localName: "Slovensko",
    region: "Europe"
  },
  {
    code: "HR",
    alpha3: "HRV",
    name: "Croatia",
    localName: "Hrvatska",
    region: "Europe"
  },
  {
    code: "RS",
    alpha3: "SRB",
    name: "Serbia",
    localName: "Србија",
    region: "Europe"
  },
  // Africa
  {
    code: "ZA",
    alpha3: "ZAF",
    name: "South Africa",
    region: "Africa"
  },
  {
    code: "NG",
    alpha3: "NGA",
    name: "Nigeria",
    region: "Africa"
  },
  {
    code: "EG",
    alpha3: "EGY",
    name: "Egypt",
    localName: "مصر",
    region: "Africa"
  },
  {
    code: "KE",
    alpha3: "KEN",
    name: "Kenya",
    region: "Africa"
  },
  {
    code: "ET",
    alpha3: "ETH",
    name: "Ethiopia",
    localName: "ኢትዮጵያ",
    region: "Africa"
  },
  {
    code: "GH",
    alpha3: "GHA",
    name: "Ghana",
    region: "Africa"
  },
  {
    code: "MA",
    alpha3: "MAR",
    name: "Morocco",
    localName: "المغرب",
    region: "Africa"
  },
  {
    code: "TN",
    alpha3: "TUN",
    name: "Tunisia",
    localName: "تونس",
    region: "Africa"
  },
  // Oceania
  {
    code: "AU",
    alpha3: "AUS",
    name: "Australia",
    region: "Oceania"
  },
  {
    code: "NZ",
    alpha3: "NZL",
    name: "New Zealand",
    region: "Oceania"
  },
  {
    code: "FJ",
    alpha3: "FJI",
    name: "Fiji",
    region: "Oceania"
  },
  {
    code: "PG",
    alpha3: "PNG",
    name: "Papua New Guinea",
    region: "Oceania"
  },
  // Europe (adding more countries)
  {
    code: "UA",
    alpha3: "UKR",
    name: "Ukraine",
    localName: "Україна",
    region: "Europe"
  },
  {
    code: "LT",
    alpha3: "LTU",
    name: "Lithuania",
    localName: "Lietuva",
    region: "Europe"
  },
  {
    code: "LV",
    alpha3: "LVA",
    name: "Latvia",
    localName: "Latvija",
    region: "Europe"
  },
  {
    code: "EE",
    alpha3: "EST",
    name: "Estonia",
    localName: "Eesti",
    region: "Europe"
  },
  {
    code: "SI",
    alpha3: "SVN",
    name: "Slovenia",
    localName: "Slovenija",
    region: "Europe"
  },
  {
    code: "AL",
    alpha3: "ALB",
    name: "Albania",
    localName: "Shqipëria",
    region: "Europe"
  },
  // Caribbean (adding more countries)
  {
    code: "BS",
    alpha3: "BHS",
    name: "Bahamas",
    region: "Caribbean"
  },
  {
    code: "BB",
    alpha3: "BRB",
    name: "Barbados",
    region: "Caribbean"
  },
  {
    code: "TT",
    alpha3: "TTO",
    name: "Trinidad and Tobago",
    region: "Caribbean"
  },
  // Africa (adding more countries)
  {
    code: "TZ",
    alpha3: "TZA",
    name: "Tanzania",
    region: "Africa"
  },
  {
    code: "UG",
    alpha3: "UGA",
    name: "Uganda",
    region: "Africa"
  },
  {
    code: "SN",
    alpha3: "SEN",
    name: "Senegal",
    region: "Africa"
  },
  {
    code: "CI",
    alpha3: "CIV",
    name: "Côte d'Ivoire",
    region: "Africa"
  },
  {
    code: "CM",
    alpha3: "CMR",
    name: "Cameroon",
    localName: "Cameroun",
    region: "Africa"
  },
  {
    code: "DZ",
    alpha3: "DZA",
    name: "Algeria",
    localName: "الجزائر",
    region: "Africa"
  },
  {
    code: "SD",
    alpha3: "SDN",
    name: "Sudan",
    localName: "السودان",
    region: "Africa"
  },
  {
    code: "ZM",
    alpha3: "ZMB",
    name: "Zambia",
    region: "Africa"
  },
  {
    code: "AO",
    alpha3: "AGO",
    name: "Angola",
    region: "Africa"
  },
  {
    code: "MZ",
    alpha3: "MOZ",
    name: "Mozambique",
    localName: "Moçambique",
    region: "Africa"
  },
  {
    code: "RW",
    alpha3: "RWA",
    name: "Rwanda",
    region: "Africa"
  },
  {
    code: "ML",
    alpha3: "MLI",
    name: "Mali",
    region: "Africa"
  },
  // Oceania (adding more countries)
  {
    code: "SB",
    alpha3: "SLB",
    name: "Solomon Islands",
    region: "Oceania"
  },
  {
    code: "VU",
    alpha3: "VUT",
    name: "Vanuatu",
    region: "Oceania"
  },
  {
    code: "NC",
    alpha3: "NCL",
    name: "New Caledonia",
    region: "Oceania"
  },
  // Africa (adding more countries)
  {
    code: "CD",
    alpha3: "COD",
    name: "Democratic Republic of the Congo",
    localName: "République démocratique du Congo",
    region: "Africa"
  },
  {
    code: "CG",
    alpha3: "COG",
    name: "Republic of the Congo",
    localName: "République du Congo",
    region: "Africa"
  },
  {
    code: "ZW",
    alpha3: "ZWE",
    name: "Zimbabwe",
    region: "Africa"
  },
  {
    code: "MG",
    alpha3: "MDG",
    name: "Madagascar",
    localName: "Madagasikara",
    region: "Africa"
  },
  {
    code: "BF",
    alpha3: "BFA",
    name: "Burkina Faso",
    region: "Africa"
  },
  {
    code: "TD",
    alpha3: "TCD",
    name: "Chad",
    localName: "Tchad",
    region: "Africa"
  },
  {
    code: "NE",
    alpha3: "NER",
    name: "Niger",
    region: "Africa"
  },
  {
    code: "BJ",
    alpha3: "BEN",
    name: "Benin",
    localName: "Bénin",
    region: "Africa"
  },
  {
    code: "BI",
    alpha3: "BDI",
    name: "Burundi",
    region: "Africa"
  },
  {
    code: "SS",
    alpha3: "SSD",
    name: "South Sudan",
    region: "Africa"
  },
  {
    code: "SO",
    alpha3: "SOM",
    name: "Somalia",
    localName: "Soomaaliya",
    region: "Africa"
  },
  {
    code: "DJ",
    alpha3: "DJI",
    name: "Djibouti",
    region: "Africa"
  },
  {
    code: "ER",
    alpha3: "ERI",
    name: "Eritrea",
    localName: "ኤርትራ",
    region: "Africa"
  },
  {
    code: "LY",
    alpha3: "LBY",
    name: "Libya",
    localName: "ليبيا",
    region: "Africa"
  },
  // Europe (adding more countries)
  {
    code: "BY",
    alpha3: "BLR",
    name: "Belarus",
    localName: "Беларусь",
    region: "Europe"
  },
  {
    code: "MD",
    alpha3: "MDA",
    name: "Moldova",
    localName: "Moldova",
    region: "Europe"
  },
  {
    code: "ME",
    alpha3: "MNE",
    name: "Montenegro",
    localName: "Црна Гора",
    region: "Europe"
  },
  {
    code: "MK",
    alpha3: "MKD",
    name: "North Macedonia",
    localName: "Северна Македонија",
    region: "Europe"
  },
  {
    code: "BA",
    alpha3: "BIH",
    name: "Bosnia and Herzegovina",
    localName: "Bosna i Hercegovina",
    region: "Europe"
  },
  {
    code: "IS",
    alpha3: "ISL",
    name: "Iceland",
    localName: "Ísland",
    region: "Europe"
  },
  {
    code: "LU",
    alpha3: "LUX",
    name: "Luxembourg",
    localName: "Luxembourg",
    region: "Europe"
  },
  {
    code: "MT",
    alpha3: "MLT",
    name: "Malta",
    region: "Europe"
  },
  {
    code: "CY",
    alpha3: "CYP",
    name: "Cyprus",
    localName: "Κύπρος",
    region: "Europe"
  },
  // Caribbean (adding more countries)
  {
    code: "AG",
    alpha3: "ATG",
    name: "Antigua and Barbuda",
    region: "Caribbean"
  },
  {
    code: "DM",
    alpha3: "DMA",
    name: "Dominica",
    region: "Caribbean"
  },
  {
    code: "GD",
    alpha3: "GRD",
    name: "Grenada",
    region: "Caribbean"
  },
  {
    code: "LC",
    alpha3: "LCA",
    name: "Saint Lucia",
    region: "Caribbean"
  },
  {
    code: "VC",
    alpha3: "VCT",
    name: "Saint Vincent and the Grenadines",
    region: "Caribbean"
  },
  {
    code: "KN",
    alpha3: "KNA",
    name: "Saint Kitts and Nevis",
    region: "Caribbean"
  },
  // Oceania (adding more countries)
  {
    code: "WS",
    alpha3: "WSM",
    name: "Samoa",
    region: "Oceania"
  },
  {
    code: "TO",
    alpha3: "TON",
    name: "Tonga",
    region: "Oceania"
  },
  {
    code: "KI",
    alpha3: "KIR",
    name: "Kiribati",
    region: "Oceania"
  },
  {
    code: "FM",
    alpha3: "FSM",
    name: "Micronesia",
    region: "Oceania"
  },
  {
    code: "MH",
    alpha3: "MHL",
    name: "Marshall Islands",
    region: "Oceania"
  },
  {
    code: "PW",
    alpha3: "PLW",
    name: "Palau",
    region: "Oceania"
  },
  {
    code: "TV",
    alpha3: "TUV",
    name: "Tuvalu",
    region: "Oceania"
  },
  {
    code: "NR",
    alpha3: "NRU",
    name: "Nauru",
    region: "Oceania"
  },
  // Africa (adding more countries)
  {
    code: "GA",
    alpha3: "GAB",
    name: "Gabon",
    region: "Africa"
  },
  {
    code: "TG",
    alpha3: "TGO",
    name: "Togo",
    region: "Africa"
  },
  {
    code: "SL",
    alpha3: "SLE",
    name: "Sierra Leone",
    region: "Africa"
  },
  {
    code: "LR",
    alpha3: "LBR",
    name: "Liberia",
    region: "Africa"
  },
  {
    code: "GN",
    alpha3: "GIN",
    name: "Guinea",
    localName: "Guinée",
    region: "Africa"
  },
  {
    code: "GW",
    alpha3: "GNB",
    name: "Guinea-Bissau",
    localName: "Guiné-Bissau",
    region: "Africa"
  },
  {
    code: "GM",
    alpha3: "GMB",
    name: "Gambia",
    region: "Africa"
  },
  {
    code: "MR",
    alpha3: "MRT",
    name: "Mauritania",
    localName: "موريتانيا",
    region: "Africa"
  },
  {
    code: "CV",
    alpha3: "CPV",
    name: "Cape Verde",
    localName: "Cabo Verde",
    region: "Africa"
  },
  {
    code: "CF",
    alpha3: "CAF",
    name: "Central African Republic",
    localName: "République centrafricaine",
    region: "Africa"
  },
  {
    code: "GQ",
    alpha3: "GNQ",
    name: "Equatorial Guinea",
    localName: "Guinea Ecuatorial",
    region: "Africa"
  },
  {
    code: "ST",
    alpha3: "STP",
    name: "São Tomé and Príncipe",
    localName: "São Tomé e Príncipe",
    region: "Africa"
  },
  {
    code: "KM",
    alpha3: "COM",
    name: "Comoros",
    localName: "جزر القمر",
    region: "Africa"
  },
  {
    code: "SC",
    alpha3: "SYC",
    name: "Seychelles",
    region: "Africa"
  },
  {
    code: "MU",
    alpha3: "MUS",
    name: "Mauritius",
    region: "Africa"
  },
  {
    code: "LS",
    alpha3: "LSO",
    name: "Lesotho",
    region: "Africa"
  },
  {
    code: "SZ",
    alpha3: "SWZ",
    name: "Eswatini",
    region: "Africa"
  },
  {
    code: "BW",
    alpha3: "BWA",
    name: "Botswana",
    region: "Africa"
  },
  {
    code: "NA",
    alpha3: "NAM",
    name: "Namibia",
    region: "Africa"
  },
  // Europe (adding microstates)
  {
    code: "AD",
    alpha3: "AND",
    name: "Andorra",
    localName: "Andorra",
    region: "Europe"
  },
  {
    code: "MC",
    alpha3: "MCO",
    name: "Monaco",
    localName: "Monaco",
    region: "Europe"
  },
  {
    code: "LI",
    alpha3: "LIE",
    name: "Liechtenstein",
    localName: "Liechtenstein",
    region: "Europe"
  },
  {
    code: "SM",
    alpha3: "SMR",
    name: "San Marino",
    localName: "San Marino",
    region: "Europe"
  },
  {
    code: "VA",
    alpha3: "VAT",
    name: "Vatican City",
    localName: "Città del Vaticano",
    region: "Europe"
  },
  // Caribbean (adding more territories)
  {
    code: "AI",
    alpha3: "AIA",
    name: "Anguilla",
    region: "Caribbean"
  },
  {
    code: "VG",
    alpha3: "VGB",
    name: "British Virgin Islands",
    region: "Caribbean"
  },
  {
    code: "KY",
    alpha3: "CYM",
    name: "Cayman Islands",
    region: "Caribbean"
  },
  {
    code: "MS",
    alpha3: "MSR",
    name: "Montserrat",
    region: "Caribbean"
  },
  {
    code: "TC",
    alpha3: "TCA",
    name: "Turks and Caicos Islands",
    region: "Caribbean"
  },
  {
    code: "BM",
    alpha3: "BMU",
    name: "Bermuda",
    region: "Caribbean"
  },
  // Oceania (adding more territories)
  {
    code: "CK",
    alpha3: "COK",
    name: "Cook Islands",
    region: "Oceania"
  },
  {
    code: "PF",
    alpha3: "PYF",
    name: "French Polynesia",
    region: "Oceania"
  },
  {
    code: "GU",
    alpha3: "GUM",
    name: "Guam",
    region: "Oceania"
  },
  {
    code: "MP",
    alpha3: "MNP",
    name: "Northern Mariana Islands",
    region: "Oceania"
  },
  {
    code: "AS",
    alpha3: "ASM",
    name: "American Samoa",
    region: "Oceania"
  }
];

// Group countries by region
export const COUNTRIES_BY_REGION = COUNTRIES.reduce((acc, country) => {
  if (!acc[country.region]) {
    acc[country.region] = [];
  }
  acc[country.region].push(country);
  return acc;
}, {} as Record<string, Country[]>);

// Helper function to find country by code
export const findCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code.toUpperCase());
};

// Helper function to find country by name
export const findCountryByName = (name: string): Country | undefined => {
  return COUNTRIES.find(country => 
    country.name.toLowerCase() === name.toLowerCase() ||
    country.localName?.toLowerCase() === name.toLowerCase()
  );
};

// Add a new utility function to get country name from code
export const getCountryNameFromCode = (code: string): string => {
  if (!code) return '';
  
  // Handle custom country entries
  if (code.startsWith('CUSTOM:')) {
    return code.replace('CUSTOM:', '');
  }
  
  const country = COUNTRIES.find(c => c.code === code);
  return country ? country.name : code;
}; 