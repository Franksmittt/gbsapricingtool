'use client';

import { useRef } from 'react';
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { User, Bell, Palette, Upload, Download } from 'lucide-react';
import { usePricingStore } from '@/store/pricingStore';
import { ExportData } from '@/lib/types';

export default function SettingsPage() {
  // Get the current state and the import action from the store
  const { suppliers, supplierCosts, desiredGPs, importData } = usePricingStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    // Bundle all the critical data into one object
    const dataToExport: ExportData = {
      suppliers,
      supplierCosts,
      desiredGPs,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    
    const link = document.createElement("a");
    link.href = jsonString;
    const date = new Date().toISOString().split('T')[0];
    link.download = `gbsa_pricing_data_backup_${date}.json`;

    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as ExportData;

        // Basic validation to ensure the file is correct
        if (data.suppliers && data.supplierCosts && data.desiredGPs) {
          importData(data);
          alert('Data imported successfully!');
        } else {
          alert('Invalid data file format.');
        }
      } catch (error) {
        console.error("Failed to parse JSON file", error);
        alert("Failed to read or parse the file. Please ensure it's a valid JSON backup file.");
      }
    };
    reader.readAsText(file);
    // Reset input value to allow re-uploading the same file
    if(event.target) event.target.value = '';
  };


  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your application and account preferences.</p>
      </div>

      <div className="max-w-4xl space-y-8">
        
        {/* NEW Data Management Card */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            Data Management
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Save all your costs and GP% settings to a file on your computer. You can import this file later to restore your data.
          </p>
          <div className="flex gap-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            <Button onClick={handleImportClick} variant="secondary">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button onClick={handleExport} variant="primary">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <User className="mr-3 text-gray-400" /> User Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg text-white">Frank Smit (Boss)</p>
            </div>
             <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-white">frank.smit@gbsa.com</p>
            </div>
            <Button variant="outline" size="sm" disabled>Edit Profile</Button>
           </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Bell className="mr-3 text-gray-400" /> Notifications
          </h2>
           <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-200">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive an email for important alerts.</p>
              </div>
               <p className="text-sm text-gray-500 italic">Coming soon</p>
            </div>
        </Card>
        
        <Card>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Palette className="mr-3 text-gray-400" /> Appearance
          </h2>
          <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-200">Theme</p>
                <p className="text-sm text-gray-400">Current theme is Dark Mode.</p>
              </div>
               <p className="text-sm text-gray-500 italic">Coming soon</p>
            </div>
        </Card>
      </div>
    </div>
  );
}