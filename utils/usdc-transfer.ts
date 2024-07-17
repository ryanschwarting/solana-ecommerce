import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

const USDC_DEV_PUBLIC_KEY = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

interface TransferResult {
  success: boolean;
  signature?: string;
  error?: unknown;
}

const transferUsdc = async (
  amount: number,
  fromPublicKey: PublicKey,
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>
): Promise<TransferResult> => {
  if (!fromPublicKey) throw new WalletNotConnectedError();

  const toPublicKey = new PublicKey(
    "8wM3AkEXsho9MvZDjvZ7ShtFnsZoHuHcrdkcAkvccV6S"
  );

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  try {
    const mintPublicKey = new PublicKey(USDC_DEV_PUBLIC_KEY);

    // Get the sender's associated token account address
    const senderTokenAccountAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      fromPublicKey
    );

    // Get the receiver's associated token account address
    const receiverTokenAccountAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      toPublicKey
    );

    // Create a new transaction
    const transaction = new Transaction();

    // Check if the receiver's token account exists
    try {
      await getAccount(
        connection,
        receiverTokenAccountAddress,
        "confirmed",
        TOKEN_PROGRAM_ID
      );
    } catch (e) {
      // If the account does not exist, add the create account instruction to the transaction
      const createAccountInstruction = createAssociatedTokenAccountInstruction(
        fromPublicKey,
        receiverTokenAccountAddress,
        toPublicKey,
        mintPublicKey,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      transaction.add(createAccountInstruction);
    }

    // Convert the human-readable amount to the smallest unit (for USDC, it's 6 decimals)
    const amountInSmallestUnit = Math.round(amount * Math.pow(10, 6));

    // Create an instruction to transfer amount from the sender's token account to the receiver's token account
    const transferInstruction = createTransferInstruction(
      senderTokenAccountAddress,
      receiverTokenAccountAddress,
      fromPublicKey,
      amountInSmallestUnit,
      [],
      TOKEN_PROGRAM_ID
    );

    // Add the transfer instruction to the transaction
    transaction.add(transferInstruction);

    // Add the fee payer and recent blockhash
    transaction.feePayer = fromPublicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Send the transaction using the wallet adapter's sendTransaction method
    const signature = await sendTransaction(transaction, connection);

    console.log(`Transaction signature: ${signature}`);
    console.log(
      `You can verify the transaction on https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );

    return { success: true, signature };
  } catch (error) {
    console.error("Error performing the transfer:", error);
    return { success: false, error };
  }
};

export default transferUsdc;
