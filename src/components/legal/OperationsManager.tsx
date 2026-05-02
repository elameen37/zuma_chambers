import React from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, Package, ClipboardList, MapPin, 
  Clock, CheckCircle2, AlertCircle, ShoppingCart,
  HardDrive, Monitor, Briefcase, Plus
} from 'lucide-react';
import { useHRStore } from '@/lib/hr-service';

export default function OperationsManager() {
  const { dispatchLogs, assets } = useHRStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Clerk Dispatch Log */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-3">
            <Truck size={20} className="text-gold-primary" /> Clerk Dispatch & Field Log
          </h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-gold-primary hover:text-white transition-colors">New Dispatch</button>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-gold-dark/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <th className="p-4">Personnel</th>
                <th className="p-4">Destination / Purpose</th>
                <th className="p-4">Time Log</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {dispatchLogs.map((log, i) => (
                <tr key={log.id} className="border-b border-gold-dark/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-dark/20 flex items-center justify-center text-[10px] font-bold text-gold-primary">
                        CL
                      </div>
                      <span className="text-xs font-medium text-white">Clerk #{log.clerkId}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-200 font-bold">{log.destination}</span>
                      <span className="text-[10px] text-gray-500 italic mt-1">{log.purpose}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-[10px]">
                      <span className="flex items-center gap-1 text-gray-400"><Clock size={10} /> Out: {log.timeOut}</span>
                      {log.timeIn && <span className="flex items-center gap-1 text-green-500"><CheckCircle2 size={10} /> In: {log.timeIn}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                      log.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stationery & Inventory Mini Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-gold-primary/10">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShoppingCart size={14} className="text-gold-primary" /> Stationery Requests
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-gold-dark/5">
                <div>
                  <p className="text-[11px] text-white font-bold">Bond Paper (80gsm)</p>
                  <p className="text-[9px] text-gray-500">Requested by Lit. Dept</p>
                </div>
                <span className="text-[10px] text-amber-500 font-bold">Pending</span>
              </div>
              <button className="w-full py-2 bg-gold-primary/10 text-gold-primary border border-gold-primary/20 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-gold-primary hover:text-black transition-all">
                Request Supplies
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-gold-primary" /> Vehicle Movement
            </h4>
            <div className="flex items-center justify-center py-4 text-center">
              <div>
                <AlertCircle size={24} className="text-gold-dark/20 mx-auto mb-2" />
                <p className="text-[10px] text-gray-500 italic">No active movements recorded today.</p>
                <button className="mt-3 text-[10px] font-bold text-gold-primary uppercase tracking-widest">Register Trip</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Asset Management */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-3">
            <HardDrive size={20} className="text-gold-primary" /> Asset Management
          </h3>
        </div>

        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="glass-card p-4 hover:border-gold-primary/20 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-white/5 rounded border border-gold-dark/10 group-hover:border-gold-primary/30 transition-colors">
                  {asset.category === 'Electronics' ? <Monitor size={16} className="text-blue-400" /> : <Briefcase size={16} className="text-purple-400" />}
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  asset.status === 'Available' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {asset.status}
                </span>
              </div>
              
              <h4 className="text-xs font-bold text-white font-inter mb-1">{asset.name}</h4>
              <p className="text-[10px] text-gray-500">{asset.category}</p>
              
              {asset.assignedTo && (
                <div className="mt-3 pt-3 border-t border-gold-dark/5 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gold-primary/10 flex items-center justify-center text-[8px] font-bold text-gold-primary">
                    {asset.assignedTo.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[10px] text-gray-400">Assigned to <span className="text-white">{asset.assignedTo}</span></span>
                </div>
              )}
            </div>
          ))}
          
          <button className="w-full py-4 bg-white/5 border border-dashed border-gold-dark/20 rounded-xl text-gray-500 hover:text-gold-primary hover:border-gold-primary/40 transition-all flex flex-col items-center justify-center gap-2">
            <Plus size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Register New Asset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
