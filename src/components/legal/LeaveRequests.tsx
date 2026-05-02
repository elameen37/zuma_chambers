import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, User, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { useHRStore, LeaveRequest } from '@/lib/hr-service';

export default function LeaveRequests() {
  const { leaveRequests, staff, updateLeaveStatus } = useHRStore();

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || 'Unknown Staff';
  const getStaffRole = (id: string) => staff.find(s => s.id === id)?.role || 'Personnel';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white font-playfair flex items-center gap-3">
          <Plane size={24} className="text-gold-primary" /> Leave & Absence Management
        </h3>
        <button className="btn-luxury px-6 py-3 text-[10px] flex items-center gap-2">
           Submit Leave Request
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {leaveRequests.map((request, i) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-gold-primary/30 transition-all"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-12 h-12 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary font-bold text-lg">
                  {getStaffName(request.staffId)[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white font-playfair">{getStaffName(request.staffId)}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{getStaffRole(request.staffId)}</p>
                </div>
                <div className="hidden lg:block h-10 w-[1px] bg-gold-dark/10" />
                <div className="hidden lg:block space-y-1">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block">Type</span>
                  <span className="text-xs text-white font-medium">{request.type} Leave</span>
                </div>
              </div>

              <div className="flex items-center gap-8 flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-center">
                    <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">From</span>
                    <span className="text-xs text-white font-mono">{request.startDate}</span>
                  </div>
                  <div className="w-8 h-[1px] bg-gold-primary/30" />
                  <div className="flex flex-col text-center">
                    <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">To</span>
                    <span className="text-xs text-white font-mono">{request.endDate}</span>
                  </div>
                </div>
                <div className="space-y-1">
                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                     request.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                     request.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                     'bg-amber-500/10 text-amber-500'
                   }`}>
                     {request.status}
                   </span>
                </div>
              </div>

              <div className="flex gap-2">
                {request.status === 'Pending' ? (
                  <>
                    <button 
                      onClick={() => updateLeaveStatus(request.id, 'Approved')}
                      className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/5"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => updateLeaveStatus(request.id, 'Rejected')}
                      className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                    >
                      <XCircle size={18} />
                    </button>
                  </>
                ) : (
                  <button className="p-3 bg-white/5 text-gray-500 rounded-xl hover:text-white transition-all">
                    <MoreVertical size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
