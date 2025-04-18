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

const PACKAGE_ID = `0x25dfcadb5927395b463a426e8d63425d654a6057affc368f4dc176e587f489a5`;
const TEST_BUCK_TYPE = `0x25dfcadb5927395b463a426e8d63425d654a6057affc368f4dc176e587f489a5::test_buck::TEST_BUCK`;
const VAULT_ID = `0x46aad790c2b0ffe7951cab440641ea6a08169aac9e8e843899fd0a2d15aaa0e1`;

const rpcUrl = getFullnodeUrl("testnet");
const suiClient = new SuiClient({ url: rpcUrl });

/**
 * Scavenger Hunt: Exercise 3
 *
 * In this exercise, you use Sui objects as inputs in a PTB to update the value of a shared object.
 *
 * When finished, run the following command in the scripts directory to test your solution:
 *
 * yarn scavenger-hunt
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
  // TODO: Create a new Transaction instance here
  const tx = new Transaction();
  /**
   * Task 2:
   *
   * Create a new key using the `key::new` function.
   */
  // TODO: Create a new key here by calling the `key::new` function
  const newKey = tx.moveCall({target: `${PACKAGE_ID}::key::new`});

  /**
   * Task 3:
   *
   * Set the key code correctly using the `key::set_code` function.
   */
  // TODO: Set the key code correctly here by calling the `key::set_code` function
  const keyCode = tx.moveCall({target: `${PACKAGE_ID}::key::set_code`, arguments: [newKey, tx.pure.u64(777)]});
  /**
   * Task 4:
   *
   * Use the key to withdraw the `Bucket USD` coin from the vault using the `vault::withdraw` function.
   */
  // TODO: Use the key to withdraw the `Bucket USD` coin from the vault using the `vault::withdraw` function
  const bucketUSD = tx.moveCall({target: `${PACKAGE_ID}::vault::withdraw`, 
                                arguments: [tx.object(VAULT_ID), newKey], 
                                typeArguments: [TEST_BUCK_TYPE]});
  /**
   * Task 5:
   *
   * Transfer the `Bucket USD` coin to your account.
   */
  // TODO: Transfer the `Bucket USD` coin to your account
  tx.transferObjects([bucketUSD], '0x359f0bcc9149c236fe3c57364c85e710214bd7131c3cddcad9928e972f918923');
  /**
   * Task 6:
   *
   * Sign and execute the transaction using the SuiClient instance created above.
   *
   * Print the result to the console.
   *
   * Resources:
   * - Observing transaction results: https://sdk.mystenlabs.com/typescript/transaction-building/basics#observing-the-results-of-a-transaction
   */
  // TODO: Sign and execute the transaction here
  const result = await suiClient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
  await suiClient.waitForTransaction({ digest: result.digest });
  console.log(`[Success] view your transaction result at: https://suiscan.xyz/testnet/tx/${result.digest}`);
};

main();
