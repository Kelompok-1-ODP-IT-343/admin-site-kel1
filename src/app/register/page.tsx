'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    maritalStatus: '',

    // Address Information
    address: '',
    city: '',
    province: '',
    postalCode: '',

    // Employment Information
    occupation: '',
    company: '',
    monthlyIncome: '',
    workExperience: '',

    // KPR Information
    propertyType: '',
    propertyPrice: '',
    downPayment: '',
    loanTerm: '',

    // Account Information
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Nama lengkap wajib diisi';
      if (!formData.email) newErrors.email = 'Email wajib diisi';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email tidak valid';
      if (!formData.phone) newErrors.phone = 'Nomor telepon wajib diisi';
      if (!formData.idNumber) newErrors.idNumber = 'NIK wajib diisi';
      else if (formData.idNumber.length !== 16) newErrors.idNumber = 'NIK harus 16 digit';
      if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi';
      if (!formData.birthPlace) newErrors.birthPlace = 'Tempat lahir wajib diisi';
      if (!formData.gender) newErrors.gender = 'Jenis kelamin wajib dipilih';
      if (!formData.maritalStatus) newErrors.maritalStatus = 'Status pernikahan wajib dipilih';
    }

    if (step === 2) {
      if (!formData.address) newErrors.address = 'Alamat wajib diisi';
      if (!formData.city) newErrors.city = 'Kota wajib diisi';
      if (!formData.province) newErrors.province = 'Provinsi wajib diisi';
      if (!formData.postalCode) newErrors.postalCode = 'Kode pos wajib diisi';
    }

    if (step === 3) {
      if (!formData.occupation) newErrors.occupation = 'Pekerjaan wajib diisi';
      if (!formData.company) newErrors.company = 'Nama perusahaan wajib diisi';
      if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Penghasilan bulanan wajib diisi';
      if (!formData.workExperience) newErrors.workExperience = 'Pengalaman kerja wajib diisi';
    }

    if (step === 4) {
      if (!formData.propertyType) newErrors.propertyType = 'Jenis properti wajib dipilih';
      if (!formData.propertyPrice) newErrors.propertyPrice = 'Harga properti wajib diisi';
      if (!formData.downPayment) newErrors.downPayment = 'Uang muka wajib diisi';
      if (!formData.loanTerm) newErrors.loanTerm = 'Jangka waktu wajib dipilih';
    }

    if (step === 5) {
      if (!formData.password) newErrors.password = 'Password wajib diisi';
      else if (formData.password.length < 8) newErrors.password = 'Password minimal 8 karakter';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan';
      if (!formData.agreePrivacy) newErrors.agreePrivacy = 'Anda harus menyetujui kebijakan privasi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(5)) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Pendaftaran berhasil! Silakan cek email untuk verifikasi. (Demo)');
    }, 3000);
  };

  const steps = [
    'Data Pribadi',
    'Alamat',
    'Pekerjaan',
    'Informasi KPR',
    'Akun'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-bni-dark-blue mb-4">Data Pribadi</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.fullName ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.fullName && <p className="mt-1 text-sm text-bni-danger">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.email ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="nama@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-bni-danger">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.phone ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.phone && <p className="mt-1 text-sm text-bni-danger">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  NIK *
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.idNumber ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="16 digit NIK"
                  maxLength={16}
                />
                {errors.idNumber && <p className="mt-1 text-sm text-bni-danger">{errors.idNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Tempat Lahir *
                </label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.birthPlace ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="Kota tempat lahir"
                />
                {errors.birthPlace && <p className="mt-1 text-sm text-bni-danger">{errors.birthPlace}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Tanggal Lahir *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.birthDate ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                />
                {errors.birthDate && <p className="mt-1 text-sm text-bni-danger">{errors.birthDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Jenis Kelamin *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.gender ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-bni-danger">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Status Pernikahan *
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.maritalStatus ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih status pernikahan</option>
                  <option value="single">Belum Menikah</option>
                  <option value="married">Menikah</option>
                  <option value="divorced">Cerai</option>
                  <option value="widowed">Janda/Duda</option>
                </select>
                {errors.maritalStatus && <p className="mt-1 text-sm text-bni-danger">{errors.maritalStatus}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-bni-dark-blue mb-4">Informasi Alamat</h2>

            <div>
              <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                Alamat Lengkap *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const { name, value } = e.target;
                  setFormData(prev => ({ ...prev, [name]: value }));
                  if (errors[name]) {
                    setErrors(prev => ({ ...prev, [name]: '' }));
                  }
                }}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                  errors.address ? 'border-bni-danger' : 'border-gray-300'
                }`}
                placeholder="Masukkan alamat lengkap"
              />
              {errors.address && <p className="mt-1 text-sm text-bni-danger">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Kota *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.city ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="Nama kota"
                />
                {errors.city && <p className="mt-1 text-sm text-bni-danger">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Provinsi *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.province ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih provinsi</option>
                  <option value="jakarta">DKI Jakarta</option>
                  <option value="jabar">Jawa Barat</option>
                  <option value="jateng">Jawa Tengah</option>
                  <option value="jatim">Jawa Timur</option>
                  <option value="banten">Banten</option>
                  <option value="yogya">DI Yogyakarta</option>
                </select>
                {errors.province && <p className="mt-1 text-sm text-bni-danger">{errors.province}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Kode Pos *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.postalCode ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="12345"
                  maxLength={5}
                />
                {errors.postalCode && <p className="mt-1 text-sm text-bni-danger">{errors.postalCode}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-bni-dark-blue mb-4">Informasi Pekerjaan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Pekerjaan *
                </label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.occupation ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih pekerjaan</option>
                  <option value="employee">Karyawan Swasta</option>
                  <option value="civil_servant">PNS</option>
                  <option value="entrepreneur">Wiraswasta</option>
                  <option value="professional">Profesional</option>
                  <option value="other">Lainnya</option>
                </select>
                {errors.occupation && <p className="mt-1 text-sm text-bni-danger">{errors.occupation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.company ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="Nama perusahaan"
                />
                {errors.company && <p className="mt-1 text-sm text-bni-danger">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Penghasilan Bulanan *
                </label>
                <select
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.monthlyIncome ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih range penghasilan</option>
                  <option value="5-10">Rp 5-10 Juta</option>
                  <option value="10-20">Rp 10-20 Juta</option>
                  <option value="20-50">Rp 20-50 Juta</option>
                  <option value="50+">Rp 50 Juta+</option>
                </select>
                {errors.monthlyIncome && <p className="mt-1 text-sm text-bni-danger">{errors.monthlyIncome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Pengalaman Kerja *
                </label>
                <select
                  name="workExperience"
                  value={formData.workExperience}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.workExperience ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih pengalaman kerja</option>
                  <option value="1-2">1-2 Tahun</option>
                  <option value="3-5">3-5 Tahun</option>
                  <option value="5-10">5-10 Tahun</option>
                  <option value="10+">10+ Tahun</option>
                </select>
                {errors.workExperience && <p className="mt-1 text-sm text-bni-danger">{errors.workExperience}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-bni-dark-blue mb-4">Informasi KPR</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Jenis Properti *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.propertyType ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih jenis properti</option>
                  <option value="house">Rumah</option>
                  <option value="apartment">Apartemen</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="villa">Villa</option>
                </select>
                {errors.propertyType && <p className="mt-1 text-sm text-bni-danger">{errors.propertyType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Harga Properti *
                </label>
                <select
                  name="propertyPrice"
                  value={formData.propertyPrice}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.propertyPrice ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih range harga</option>
                  <option value="500-1000">Rp 500 Juta - 1 Miliar</option>
                  <option value="1000-2000">Rp 1-2 Miliar</option>
                  <option value="2000-5000">Rp 2-5 Miliar</option>
                  <option value="5000+">Rp 5 Miliar+</option>
                </select>
                {errors.propertyPrice && <p className="mt-1 text-sm text-bni-danger">{errors.propertyPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Uang Muka *
                </label>
                <select
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.downPayment ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih persentase DP</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="25">25%</option>
                  <option value="30">30%</option>
                </select>
                {errors.downPayment && <p className="mt-1 text-sm text-bni-danger">{errors.downPayment}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Jangka Waktu *
                </label>
                <select
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.loanTerm ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih jangka waktu</option>
                  <option value="10">10 Tahun</option>
                  <option value="15">15 Tahun</option>
                  <option value="20">20 Tahun</option>
                  <option value="25">25 Tahun</option>
                  <option value="30">30 Tahun</option>
                </select>
                {errors.loanTerm && <p className="mt-1 text-sm text-bni-danger">{errors.loanTerm}</p>}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-bni-dark-blue mb-4">Buat Akun</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.password ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="Minimal 8 karakter"
                />
                {errors.password && <p className="mt-1 text-sm text-bni-danger">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-bni-dark-blue mb-2">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent ${
                    errors.confirmPassword ? 'border-bni-danger' : 'border-gray-300'
                  }`}
                  placeholder="Ulangi password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-bni-danger">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-bni-blue focus:ring-bni-blue border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreeTerms" className="ml-3 text-sm text-bni-gray">
                  Saya menyetujui{' '}
                  <Link href="#" className="text-bni-blue hover:text-bni-dark-blue">
                    Syarat & Ketentuan
                  </Link>{' '}
                  BNI *
                </label>
              </div>
              {errors.agreeTerms && <p className="text-sm text-bni-danger">{errors.agreeTerms}</p>}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreePrivacy"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-bni-blue focus:ring-bni-blue border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreePrivacy" className="ml-3 text-sm text-bni-gray">
                  Saya menyetujui{' '}
                  <Link href="#" className="text-bni-blue hover:text-bni-dark-blue">
                    Kebijakan Privasi
                  </Link>{' '}
                  BNI *
                </label>
              </div>
              {errors.agreePrivacy && <p className="text-sm text-bni-danger">{errors.agreePrivacy}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-bni-light-gray py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="text-3xl font-bold text-bni-blue">BNI</div>
                <span className="ml-2 text-lg text-bni-gray">KPR</span>
              </div>
              <h1 className="text-2xl font-bold text-bni-dark-blue mb-2">
                Daftar Akun KPR BNI
              </h1>
              <p className="text-bni-gray">
                Lengkapi data Anda untuk mengajukan KPR
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index + 1 <= currentStep
                        ? 'bg-bni-blue text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`ml-2 text-sm ${
                      index + 1 <= currentStep ? 'text-bni-blue' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-4 ${
                        index + 1 < currentStep ? 'bg-bni-blue' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn-outline"
                  >
                    Sebelumnya
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary ml-auto"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn-primary ml-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </div>
                    ) : (
                      'Daftar Sekarang'
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-bni-gray">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-bni-blue hover:text-bni-dark-blue font-semibold">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
