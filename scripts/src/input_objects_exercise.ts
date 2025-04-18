import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import keyPairJson from "../keypair.json";

/**
 *
 * Global variables
 *
 * These variables are used throughout the exercise below.
 *
 */
const { secretKey } = decodeSuiPrivateKey(keyPairJson.privateKey);
const keypair = Ed25519Keypair.fromSecretKey(secretKey);

const PACKAGE_ID = `0x8f0b6cbef998d26f03daa8a9e90d17d57bce8d4b45cb90911662a828f903d323`;

const COUNTER_OBJECT_ID = `0x33a950ff57b782bc66f6416bf3fdf7d44de94a84fa823b9b9291f49d4b0270da`;

const rpcUrl = getFullnodeUrl("testnet");
const suiClient = new SuiClient({ url: rpcUrl });

/**
 * Objects as input: Exercise 1
 *
 * In this exercise, you use Sui objects as inputs in a PTB to update the value of a shared object.
 *
 * When finished, run the following command in the scripts directory to test your solution:
 *
 * yarn input-objects
 *
 * RESOURCES:
 * - https://sdk.mystenlabs.com/typescript/transaction-building/basics#transactions
 */
const main = async () => {
  /**
   * Task 1:
   *
   * Create a new Transaction instance from the @mysten/sui/transactions module.
   */
  const tx = new Transaction();

  /**
   * Task 2:
   *
   * Create a coin to pay the fee for incrementing the counter.
   * Based on the counter.move file, we need to provide a SUI coin with at least the minimum fee (10).
   * We use the `splitCoins` function to create a coin with the minimum fee from our gas fee.
   *
   * Resources:
   * - SplitCoins: https://sdk.mystenlabs.com/typescript/transaction-building/basics
   */
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(10)]);

  /**
   * Task 3:
   *
   * Execute the call to the `counter::increment` function to the transaction instance.
   *
   * The target should be in the format {package address}::{module name}::{function name}. The
   * package address is provided above. The module name is `counter` and the function name is
   * `increment`.
   *
   * Resources:
   * - Object inputs: https://sdk.mystenlabs.com/typescript/transaction-building/basics#object-references
   */

  tx.moveCall({
    target: `${PACKAGE_ID}::counter::increment`, // TODO: Add target here
    arguments: [tx.object(COUNTER_OBJECT_ID), coin]
  });

  /**
   * Task 4:
   *
   * Sign and execute the transaction using the SuiClient instance created above.
   *
   * Print the result to the console.
   *
   * Resources:
   * - Observing transaction results: https://sdk.mystenlabs.com/typescript/transaction-building/basics#observing-the-results-of-a-transaction
   */
  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });
  await suiClient.waitForTransaction({
    digest: result.digest,
  });
  console.log(
    `[Success] view your transaction result at: https://suiscan.xyz/testnet/tx/${result.digest}`
  );
};

main();
