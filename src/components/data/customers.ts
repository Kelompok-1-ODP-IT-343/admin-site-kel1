export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  job: string
  joinedAt: string
  status: string
  avatar: string
}

export const customers: Customer[] = [
  {
    id: "1",
    name: "Dheaz Kelvin",
    email: "dheaz@example.com",
    phone: "081234567890",
    address: "Jl. Sudirman No. 25, Jakarta Selatan",
    job: "Software Engineer",
    joinedAt: "12 Jan 2024",
    status: "Active",
    avatar: "/images/avatars/dheaz.jpg",
  },
  {
    id: "2",
    name: "Cecilion Depok",
    email: "zoksda@example.com",
    phone: "082233445566",
    address: "Jl. Margonda Raya No. 5, Depok",
    job: "UI/UX Designer",
    joinedAt: "4 Feb 2024",
    status: "Pending Verification",
    avatar: "/images/avatars/cecilion.png",
  },
  {
    id: "3",
    name: "Othman Durhaka",
    email: "acil@example.com",
    phone: "083312345678",
    address: "Jl. Veteran No. 88, Surabaya",
    job: "Data Analyst",
    joinedAt: "8 Mar 2024",
    status: "Inactive",
    avatar: "/images/avatars/othman.jpg",
  },
  {
    id: "4",
    name: "Ahong Admin",
    email: "ahong@example.com",
    phone: "081990011522",
    address: "Jl. Mangga Dua No. 13, Jakarta Barat",
    job: "Product Manager",
    joinedAt: "15 Apr 2024",
    status: "Active",
    avatar: "/images/avatars/ahong.jpg",
  },
  {
    id: "5",
    name: "Ridwan Kamil",
    email: "asd@example.com",
    phone: "081234567890",
    address: "Jl. Asia Afrika No. 10, Bandung",
    job: "Architect",
    joinedAt: "10 Mei 2024",
    status: "Active",
    avatar: "/images/avatars/ridwan.jpg",
  },
  {
    id: "6",
    name: "Zhilang Yuan",
    email: "zoksda@example.com",
    phone: "082233445566",
    address: "Jl. Pantai Indah Kapuk No. 33, Jakarta Utara",
    job: "Finance Analyst",
    joinedAt: "22 Mei 2024",
    status: "Pending",
    avatar: "/images/avatars/zhilang.jpg",
  },
  {
    id: "7",
    name: "Andro Durhaka",
    email: "acil@example.com",
    phone: "083312345678",
    address: "Jl. Diponegoro No. 42, Palembang",
    job: "QA Engineer",
    joinedAt: "4 Jun 2024",
    status: "Active",
    avatar: "/images/avatars/andro.jpg",
  },
  {
    id: "8",
    name: "Ahong Cokin",
    email: "ahong@example.com",
    phone: "081990051122",
    address: "Jl. Gunung Sahari No. 8, Jakarta Pusat",
    job: "Marketing Specialist",
    joinedAt: "9 Jul 2024",
    status: "Inactive",
    avatar: "/images/avatars/cokin.jpg",
  },
]
