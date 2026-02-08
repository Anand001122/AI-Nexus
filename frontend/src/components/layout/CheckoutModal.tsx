import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAPI } from '../../hooks/useAPI';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { token, setAuth } = useAuthStore();

    if (!isOpen) return null;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Simulate payment gateway latency
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Upgrade via backend
            const response = await axios.post(`${API_BASE_URL}/auth/upgrade`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setAuth(token!, {
                    email: response.data.email,
                    fullName: response.data.fullName,
                    isPremium: response.data.isPremium,
                    credits: response.data.credits
                });
                onSuccess();
            }
        } catch (error) {
            console.error('Upgrade failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#111827] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Decoration */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 sm:p-10">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-blue-600/10 rounded-2xl">
                            <Sparkles className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Expert Upgrade</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Simulated Checkout</p>
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1.5 block">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="4242 4242 4242 4242"
                                        className="w-full bg-[#020617] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1.5 block">Expiry</label>
                                    <input
                                        type="text"
                                        placeholder="12/28"
                                        className="w-full bg-[#020617] border border-white/5 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-mono"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-1.5 block">CVV</label>
                                    <input
                                        type="password"
                                        placeholder="***"
                                        className="w-full bg-[#020617] border border-white/5 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-mono"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex items-start space-x-3">
                            <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                Your payment is secured with industry-standard encryption. By clicking upgrade, you agree to our terms of service.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center space-x-3 shadow-xl ${isProcessing
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-500/20'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Secure Upgrade - $19</span>
                                    <Lock className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center space-x-6 grayscale opacity-30">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter italic">VISA</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter italic">MASTERCARD</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter italic">STRIPE</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
