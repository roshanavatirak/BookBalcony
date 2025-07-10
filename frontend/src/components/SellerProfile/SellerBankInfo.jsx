import React from "react";

const SellerBankInfo = ({ user, seller, onEdit }) => {
  if (!seller) {
    return (
      <div className="text-center text-yellow-300 font-semibold bg-zinc-800 rounded-xl p-6">
        Fetching seller data...
      </div>
    );
  }

  const isApprovedSeller = user?.isSeller && seller?.status === "Approved";

  if (!isApprovedSeller) {
    return (
      <div className="text-center text-red-300 font-semibold bg-zinc-800 rounded-xl p-6">
        You are not an approved seller yet.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 shadow-xl rounded-2xl p-6 text-white">
      <div className="flex justify-between items-center border-b border-zinc-700 pb-4 mb-6">
        <h2 className="text-xl font-bold">Bank Information</h2>
        <button
          onClick={onEdit}
          className="text-sm px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm text-zinc-400">Account Holder Name</h4>
          <p className="text-lg font-medium">{seller.bankHolderName}</p>
        </div>

        <div>
          <h4 className="text-sm text-zinc-400">Bank Account Number</h4>
          <p className="text-lg font-medium">{seller.bankAccountNumber}</p>
        </div>

        <div>
          <h4 className="text-sm text-zinc-400">IFSC Code</h4>
          <p className="text-lg font-medium">{seller.bankIFSC}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerBankInfo;
