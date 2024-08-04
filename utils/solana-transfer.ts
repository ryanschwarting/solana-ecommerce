// import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
// import {
//   Connection,
//   PublicKey,
//   SystemProgram,
//   Transaction,
//   clusterApiUrl,
//   LAMPORTS_PER_SOL,
// } from "@solana/web3.js";

// interface TransferResult {
//   success: boolean;
//   signature?: string;
//   error?: unknown;
// }

// const transferSolana = async (
//   amount: number,
//   fromPubKey: PublicKey,
//   sendTransaction: (
//     transaction: Transaction,
//     connection: Connection
//   ) => Promise<string>
// ): Promise<TransferResult> => {
//   if (!fromPubKey) throw new WalletNotConnectedError();

//   const toPublicKey = new PublicKey(
//     "8wM3AkEXsho9MvZDjvZ7ShtFnsZoHuHcrdkcAkvccV6S"
//   );

//   const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // Connect to Solana devnet

//   const transaction = new Transaction().add(
//     SystemProgram.transfer({
//       fromPubkey: fromPubKey,
//       toPubkey: toPublicKey,
//       lamports: amount * LAMPORTS_PER_SOL,
//     })
//   );

//   transaction.feePayer = fromPubKey;
//   const { blockhash } = await connection.getLatestBlockhash();
//   transaction.recentBlockhash = blockhash;

//   try {
//     const signature = await sendTransaction(transaction, connection);
//     await connection.confirmTransaction(signature, "confirmed");
//     return { success: true, signature };
//   } catch (error) {
//     console.error("Error sending transaction:", error);
//     return { success: false, error };
//   }
// };

// export default transferSolana;

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface TransferResult {
  success: boolean;
  signature?: string;
  error?: unknown;
}

const transferSolana = async (
  amount: number,
  fromPubKey: PublicKey,
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>
): Promise<TransferResult> => {
  if (!fromPubKey) throw new WalletNotConnectedError();

  const toPublicKey = new PublicKey(
    "8wM3AkEXsho9MvZDjvZ7ShtFnsZoHuHcrdkcAkvccV6S"
  );

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // Connect to Solana devnet

  const lamports = Math.floor(amount * LAMPORTS_PER_SOL); // Ensure amount is an integer

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromPubKey,
      toPubkey: toPublicKey,
      lamports: lamports,
    })
  );

  transaction.feePayer = fromPubKey;
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  try {
    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");
    return { success: true, signature };
  } catch (error) {
    console.error("Error sending transaction:", error);
    return { success: false, error };
  }
};

export default transferSolana;
