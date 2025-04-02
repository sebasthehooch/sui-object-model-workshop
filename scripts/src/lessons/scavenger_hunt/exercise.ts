import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import keyPairJson from "../../../keypair.json";

/**
 *
 * Global variables
 *
 * These variables are used throughout the exercise below.
 *
 */
const { secretKey } = decodeSuiPrivateKey(keyPairJson.privateKey);
const keypair = Ed25519Keypair.fromSecretKey(secretKey);

const PACKAGE_ADDRESS = `0x25dfcadb5927395b463a426e8d63425d654a6057affc368f4dc176e587f489a5`;
const TEST_BUCK_TYPE = `0x25dfcadb5927395b463a426e8d63425d654a6057affc368f4dc176e587f489a5::test_buck::TEST_BUCK`;

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
   * Create a new key using the `key::new` function.
   */

  /**
   * Task 2:
   *
   * Set the key code correctly using the `key::set_code` function.
   */

  /**
   * Task 3:
   *
   * Use the key to withdraw the `Bucket USD` coin from the vault using the `vault::withdraw` function.
   */
  
  /**
   * Task 4:
   *
   * Transfer the `Bucket USD` coin to your account.
   */
};

main();
