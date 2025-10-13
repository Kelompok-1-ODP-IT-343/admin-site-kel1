'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function UserProfile() {
  const [user, setUser] = useState({
    id: 'USR001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    dateOfBirth: '1985-05-15',
    occupation: 'Software Engineer',
    company: 'PT. Tech Indonesia',
    monthlyIncome: 15000000,
    memberSince: '2024-01-01',
    ktp: '3171234567890123',
    npwp: '12.345.678.9-012.000',
    maritalStatus: 'Menikah',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Istri',
      phone: '+62 812-9876-5432'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(user);
  };

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-bni-light-gray">
      <Header />

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-bni-gray">
              <Link href="/dashboard" className="hover:text-bni-blue">Dashboard</Link>
              <span>/</span>
              <span className="text-bni-dark-blue font-semibold">Profil Pengguna</span>
            </div>
          </nav>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-bni-dark-blue mb-2">Profil Pengguna</h1>
                <p className="text-bni-gray">Kelola informasi pribadi dan preferensi akun Anda</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="btn-primary flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                  Edit Profil
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="btn-outline"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    Simpan
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <div className="card bg-white">
                <div className="text-center">
                  <div className="w-32 h-32 bg-bni-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-4xl font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-bni-dark-blue mb-1">{user.name}</h2>
                  <p className="text-bni-gray mb-2">{user.email}</p>
                  <p className="text-sm text-bni-gray mb-4">Member ID: {user.id}</p>
                  
                  <div className="bg-bni-light-gray rounded-lg p-4 mb-4">
                    <p className="text-sm text-bni-gray">Member Sejak</p>
                    <p className="font-semibold text-bni-dark-blue">{formatDate(user.memberSince)}</p>
                  </div>

                  <button className="btn-outline w-full mb-3">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                    </svg>
                    Ubah Foto Profil
                  </button>
                  
                  <button className="btn-outline w-full text-red-600 border-red-200 hover:bg-red-50">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                    Hapus Akun
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="card bg-white">
                <h3 className="text-lg font-bold text-bni-dark-blue mb-6">Informasi Pribadi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Nama Lengkap</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Nomor Telepon</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Tanggal Lahir</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{formatDate(user.dateOfBirth)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Status Pernikahan</label>
                    {isEditing ? (
                      <select
                        value={editForm.maritalStatus}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      >
                        <option value="Belum Menikah">Belum Menikah</option>
                        <option value="Menikah">Menikah</option>
                        <option value="Cerai">Cerai</option>
                      </select>
                    ) : (
                      <p className="text-bni-gray">{user.maritalStatus}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">No. KTP</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.ktp}
                        onChange={(e) => handleInputChange('ktp', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.ktp}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Alamat</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="card bg-white">
                <h3 className="text-lg font-bold text-bni-dark-blue mb-6">Informasi Pekerjaan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Pekerjaan</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.occupation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Perusahaan</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.company}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Penghasilan Bulanan</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.monthlyIncome}
                        onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{formatCurrency(user.monthlyIncome)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">NPWP</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.npwp}
                        onChange={(e) => handleInputChange('npwp', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.npwp}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card bg-white">
                <h3 className="text-lg font-bold text-bni-dark-blue mb-6">Kontak Darurat</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Nama</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.emergencyContact.name}
                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.emergencyContact.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Hubungan</label>
                    {isEditing ? (
                      <select
                        value={editForm.emergencyContact.relationship}
                        onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      >
                        <option value="Orang Tua">Orang Tua</option>
                        <option value="Suami">Suami</option>
                        <option value="Istri">Istri</option>
                        <option value="Saudara">Saudara</option>
                        <option value="Teman">Teman</option>
                      </select>
                    ) : (
                      <p className="text-bni-gray">{user.emergencyContact.relationship}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-bni-dark-blue mb-2">Nomor Telepon</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.emergencyContact.phone}
                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-blue"
                      />
                    ) : (
                      <p className="text-bni-gray">{user.emergencyContact.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="card bg-white">
                <h3 className="text-lg font-bold text-bni-dark-blue mb-6">Pengaturan Akun</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-bni-light-gray rounded-lg">
                    <div>
                      <h4 className="font-semibold text-bni-dark-blue">Notifikasi Email</h4>
                      <p className="text-sm text-bni-gray">Terima notifikasi tentang status aplikasi KPR</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bni-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bni-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bni-light-gray rounded-lg">
                    <div>
                      <h4 className="font-semibold text-bni-dark-blue">Notifikasi SMS</h4>
                      <p className="text-sm text-bni-gray">Terima SMS untuk update penting</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bni-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bni-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bni-light-gray rounded-lg">
                    <div>
                      <h4 className="font-semibold text-bni-dark-blue">Autentikasi Dua Faktor</h4>
                      <p className="text-sm text-bni-gray">Tingkatkan keamanan akun Anda</p>
                    </div>
                    <button className="btn-outline text-sm">
                      Aktifkan
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="btn-primary w-full mb-3">
                    Ubah Password
                  </button>
                  <button className="btn-outline w-full">
                    Download Data Pribadi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}