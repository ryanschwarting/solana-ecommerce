import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const transferSolana = async (toPublicKeyString: string, amount: number) => {
  const toPublicKey = new PublicKey(toPublicKeyString);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // Connect to Solana devnet

  try {
    // Fetch recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();

    // Build transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: toPublicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Sign transaction
    transaction.recentBlockhash = blockhash;

    // Send transaction
    const signature = await connection.sendTransaction(transaction, []);
    console.log("Transaction sent:", signature);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
};

export default transferSolana;
