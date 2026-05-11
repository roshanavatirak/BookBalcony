import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Send,
  RefreshCw,
  Activity,
  X,
  BadgeIndianRupee,
  ShieldCheck,
  Info,
} from "lucide-react";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const SellerWallet = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { alert, hideAlert, success, error, warning } = useAlert();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetchWalletStats();
  }, []);

  const fetchWalletStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/seller/dashboard-stats",
        { headers }
      );
      setStats(res.data?.data?.overview || null);
    } catch (err) {
      console.error("Failed to fetch wallet stats:", err);
      error("Failed to load wallet data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!withdrawAmount || isNaN(amount) || amount <= 0) {
      warning("Please enter a valid amount");
      return;
    }

    if (stats && amount > stats.walletBalance) {
      warning(`Insufficient balance. Available: ₹${stats.walletBalance.toLocaleString()}`);
      return;
    }

    if (amount < 100) {
      warning("Minimum withdrawal amount is ₹100");
      return;
    }

    setWithdrawing(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/seller/withdraw",
        { amount },
        { headers }
      );

      success(`₹${amount.toLocaleString()} withdrawal processed successfully!`);
      setShowWithdrawModal(false);
      setWithdrawAmount("");

      // Update local stats immediately with response data
      if (res.data?.data) {
        setStats((prev) => ({
          ...prev,
          walletBalance: res.data.data.newWalletBalance,
          totalWithdrawn: res.data.data.totalWithdrawn,
        }));
      } else {
        fetchWalletStats(true);
      }
    } catch (err) {
      console.error("Withdrawal failed:", err);
      const msg = err.response?.data?.message || "Withdrawal failed. Please try again.";
      error(msg);
    } finally {
      setWithdrawing(false);
    }
  };

  const handleQuickAmount = (percent) => {
    if (!stats?.walletBalance) return;
    const amount = Math.floor((stats.walletBalance * percent) / 100);
    setWithdrawAmount(amount.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading wallet...</p>
        </div>
      </div>
    );
  }

  const walletBalance   = stats?.walletBalance   || 0;
  const totalRevenue    = stats?.totalRevenue     || 0;
  const pendingRevenue  = stats?.pendingRevenue   || 0;
  const totalWithdrawn  = stats?.totalWithdrawn   || 0;

  // Derived
  const withdrawablePercent = totalRevenue > 0
    ? Math.round((walletBalance / totalRevenue) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          duration={alert.duration}
          position={alert.position}
          autoClose={alert.autoClose}
          onClose={hideAlert}
        />
      )}

      <div className="w-full max-w-4xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-xl border border-zinc-700">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
                My Wallet
              </h1>
              <p className="text-zinc-400 mt-2 text-sm sm:text-base italic flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                Your earnings, balance & withdrawals
              </p>
            </div>
            <button
              onClick={() => fetchWalletStats(true)}
              disabled={refreshing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all flex items-center gap-2 border border-zinc-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="text-sm font-medium hidden sm:inline">Refresh</span>
            </button>
          </div>
          <hr className="border-zinc-700 rounded-full mx-auto w-3/4" />
        </div>

        {/* ── Main Wallet Balance Card ── */}
        <div className="relative bg-gradient-to-br from-yellow-400/10 via-zinc-800/60 to-zinc-900 rounded-2xl border border-yellow-400/30 p-6 sm:p-8 mb-6 overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <Wallet className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">
                  Available Balance
                </span>
              </div>
              <p className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-1">
                ₹{walletBalance.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 bg-zinc-700 rounded-full w-48">
                  <div
                    className="h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(withdrawablePercent, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400">
                  {withdrawablePercent}% of total earned
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={walletBalance <= 0}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold text-sm shadow-lg shadow-yellow-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Withdraw Funds
              </button>
              {walletBalance <= 0 && (
                <p className="text-xs text-zinc-500 text-center flex items-center gap-1 justify-center">
                  <Info className="w-3 h-3" />
                  No balance to withdraw
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── 3 Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Total Earned */}
          <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-5 hover:border-green-400/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Earned</span>
              <div className="p-2 bg-green-400/10 rounded-lg group-hover:bg-green-400/20 transition-colors">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle2 className="w-3 h-3 text-green-400" />
              <span className="text-green-400">From delivered orders</span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-5 hover:border-orange-400/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Pending</span>
              <div className="p-2 bg-orange-400/10 rounded-lg group-hover:bg-orange-400/20 transition-colors">
                <Clock className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              ₹{pendingRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <AlertCircle className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400">Awaiting delivery</span>
            </div>
          </div>

          {/* Total Withdrawn */}
          <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-5 hover:border-blue-400/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Withdrawn</span>
              <div className="p-2 bg-blue-400/10 rounded-lg group-hover:bg-blue-400/20 transition-colors">
                <ArrowUpCircle className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              ₹{totalWithdrawn.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400">Lifetime withdrawals</span>
            </div>
          </div>
        </div>

        {/* ── Earnings Breakdown ── */}
        <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-5 mb-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <BadgeIndianRupee className="w-4 h-4 text-yellow-400" />
            Earnings Breakdown
          </h2>
          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm text-zinc-300">Total Earned (Delivered)</span>
              </div>
              <span className="text-sm font-bold text-white">₹{totalRevenue.toLocaleString()}</span>
            </div>

            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: "100%" }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm text-zinc-300">Already Withdrawn</span>
              </div>
              <span className="text-sm font-bold text-white">₹{totalWithdrawn.toLocaleString()}</span>
            </div>

            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all duration-700"
                style={{
                  width: totalRevenue > 0
                    ? `${Math.min((totalWithdrawn / totalRevenue) * 100, 100)}%`
                    : "0%",
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-sm text-zinc-300">Available to Withdraw</span>
              </div>
              <span className="text-sm font-bold text-yellow-400">₹{walletBalance.toLocaleString()}</span>
            </div>

            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-700"
                style={{
                  width: totalRevenue > 0
                    ? `${Math.min((walletBalance / totalRevenue) * 100, 100)}%`
                    : "0%",
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-sm text-zinc-300">Pending (In Transit)</span>
              </div>
              <span className="text-sm font-bold text-orange-400">₹{pendingRevenue.toLocaleString()}</span>
            </div>

          </div>
        </div>

        {/* ── Info Banner ── */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-400 leading-relaxed">
            <p className="text-blue-300 font-semibold mb-1">How earnings work</p>
            Money is credited to your wallet only when an order status is marked as{" "}
            <span className="text-green-400 font-semibold">Delivered</span>. Pending revenue will
            be credited once your orders are delivered. Minimum withdrawal is{" "}
            <span className="text-yellow-400 font-semibold">₹100</span>. Withdrawals are
            processed to your registered bank account within 3–5 business days.
          </div>
        </div>
      </div>

      {/* ── Withdraw Modal ── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full p-6 shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <ArrowDownCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Withdraw Funds</h3>
              </div>
              <button
                onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(""); }}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Available Balance */}
            <div className="bg-zinc-800/60 rounded-xl p-4 mb-5 border border-zinc-700">
              <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider">Available Balance</p>
              <p className="text-3xl font-extrabold text-yellow-400">
                ₹{walletBalance.toLocaleString()}
              </p>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-lg">₹</span>
                <input
                  type="number"
                  min="100"
                  max={walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-lg font-bold focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none placeholder-zinc-600"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3" /> Minimum withdrawal: ₹100
              </p>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex gap-2 mb-5">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleQuickAmount(pct)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-400/50 rounded-lg text-xs font-bold text-zinc-300 hover:text-yellow-400 transition-all"
                >
                  {pct}%
                </button>
              ))}
            </div>

            {/* Validation warning */}
            {withdrawAmount && parseFloat(withdrawAmount) > walletBalance && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-300">Amount exceeds available balance</p>
              </div>
            )}

            {/* Bank Info note */}
            <div className="mb-5 flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400">
                Funds will be transferred to your registered bank account. Processing takes 3–5 business days.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(""); }}
                className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-all font-semibold text-sm border border-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={
                  withdrawing ||
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) <= 0 ||
                  parseFloat(withdrawAmount) > walletBalance ||
                  parseFloat(withdrawAmount) < 100
                }
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/20"
              >
                {withdrawing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send ₹{withdrawAmount ? parseFloat(withdrawAmount).toLocaleString() : "0"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerWallet;