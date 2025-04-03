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
const suiAddress = keypair.getPublicKey().toSuiAddress();

const PACKAGE_ID = `0x83feeef5abcb1d5caca48f5e4e2259f8fbbcac88c10d82cc95ed58ff6f0dcd79`;

const rpcUrl = getFullnodeUrl("testnet");
const suiClient = new SuiClient({ url: rpcUrl });

/**
 * Returning Objects: Exercise 1
 *
 * In this exercise, you will be returned a new object from a function and must transfer it to an
 * address, otherwise, the transaction will abort.
 *
 * When finished, run the following command in the scripts directory to test your solution:
 *
 * yarn return-objects
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
   * Execute the call to the `sui_nft::new` function to the transaction instance.
   *
   * The target should be in the format {package address}::{module name}::{function name}. The
   * package address is provided above. The module name is `sui_nft` and the function name is `new`.
   *
   * HINT: The arguments and typeArguments arguments are optional since this function does not take
   * any arguments or type arguments.
   */

  const nft = tx.moveCall({
    target: `${PACKAGE_ID}::sui_nft::new`,
  });

  /**
   * Task 3:
   *
   * Transfer the newly created SuiNFT object to your address.
   *
   * Use `tx.transferObjects(objects, address)` - Transfers a list of objects to the specified address.
   *
   * HINT: Use `suiAddress`` to transfer the object to your address.
   */

  // TODO: Add transferObjects call here

  /**
   * Task 4:
   *
   * Sign and execute the transaction using the SuiClient instance created above.
   *
   * Print the result to the console.
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
