export type DeveloperDetail = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  established: string
  totalProjects: string
  partnershipStatus: string
  logo: string
}

export const developers: DeveloperDetail[] = [
  {
    id: "1",
    name: "PT Ciputra Development Tbk (Ciputra)",
    email: "ciputra@example.com",
    phone: "081234567890",
    address: "Jl. Prof. Dr. Satrio No.6, Kuningan, Jakarta Selatan",
    established: "1981",
    totalProjects: "25",
    partnershipStatus: "Active",
    logo: "/images/developers/ciputra.png",
  },
  {
    id: "2",
    name: "Sinar Mas Land",
    email: "sinarmas@example.com",
    phone: "082233445566",
    address: "BSD City, Tangerang Selatan, Banten",
    established: "1988",
    totalProjects: "40",
    partnershipStatus: "Active",
    logo: "/images/developers/sinarmas.png",
  },
  {
    id: "3",
    name: "PT Intiland Development Tbk",
    email: "intiland@example.com",
    phone: "083312345678",
    address: "Jl. Jend. Sudirman No.32, Jakarta Pusat",
    established: "1975",
    totalProjects: "30",
    partnershipStatus: "Pending",
    logo: "/images/developers/intiland.png",
  },
  {
    id: "4",
    name: "PT Summarecon Agung Tbk",
    email: "summarecon@example.com",
    phone: "081990011522",
    address: "Summarecon Kelapa Gading, Jakarta Utara",
    established: "1975",
    totalProjects: "35",
    partnershipStatus: "Active",
    logo: "/images/developers/summarecon.png",
  },
  {
    id: "5",
    name: "PT Agung Sedayu Group",
    email: "agung@example.com",
    phone: "081234567890",
    address: "Jl. Mangga Dua Raya No.8, Jakarta Barat",
    established: "1971",
    totalProjects: "28",
    partnershipStatus: "Active",
    logo: "/images/developers/agungsedayu.png",
  },
  {
    id: "6",
    name: "PT Pakuwon Jati Tbk",
    email: "pakuwon@example.com",
    phone: "082233445566",
    address: "Jl. Embong Malang No.1, Surabaya",
    established: "1982",
    totalProjects: "18",
    partnershipStatus: "Pending",
    logo: "/images/developers/pakuwon.png",
  },
  {
    id: "7",
    name: "Mayland Group",
    email: "mayland@example.com",
    phone: "083312345678",
    address: "Jl. Pluit Indah No.15, Jakarta Utara",
    established: "1990",
    totalProjects: "15",
    partnershipStatus: "Inactive",
    logo: "/images/developers/mayland.png",
  },
]
