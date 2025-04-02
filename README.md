# Sui Object Model and PTBs Workshop

When learning Sui Move, developers are encouraged to use best practices to utilize the Sui object model and ensure on-chain object composability. Developers learn to write composable move code in a timely manner, but struggle to verify their code by deploying and executing the functionality on chain. The key to mastering the Sui object model is to pair your Sui move development sessions with interacting with on-chain objects via PTBs (Programmable Transaction Blocks). This workshop will guide you through the process of writing Sui Move code, deploying it to the Sui blockchain, and interacting with on-chain objects via PTBs.

# Table of Contents
- [Sui Object Model and PTBs Workshop](#sui-object-model-and-ptbs-workshop)
- [Table of Contents](#table-of-contents)
- [Environment Setup](#environment-setup)
- [Lessons](#lessons)
  - [Lesson 1: Handling Returned Objects](#lesson-1-handling-returned-objects)
    - [Exercise 1: Handling Returned Sui NFT](#exercise-1-handling-returned-sui-nft)
  - [Lesson 2: Objects as Input](#lesson-2-objects-as-input)
    - [Exercise 2: Input Objects - Counter](#exercise-2-input-objects---counter)
    - [Exercise 3: Scavenger Hunting with PTBs](#exercise-3-scavenger-hunting-with-ptbs)

# Environment Setup

Before we start, we need to set up our environment.

```bash
yarn install
```

Navigate to the `scripts` directory and run the following command: 

```bash
yarn init-keypair
```

This will generate and fund a new keypair for you to use in the workshop. Make sure not to use this keypair in any production environments.

Sui Faucet: [https://faucet.sui.io/](https://faucet.sui.io/) OR [Discord faucet](https://discord.gg/cKx75xrRMq)


# Lessons

## Lesson 1: Handling Returned Objects

One of the best practices when writing Sui Move packages is to avoid self-transfers. In other words, avoid transferring objects to the sender of the transaction, and instead return the object from the current function. This allows a caller or programmable transaction block to use the object however they see fit. 

For example, avoid this: 

```move

public struct NewObject has key, store {
  id: UID
}

public fun new(ctx: &mut TxContext) {
  let new_object = NewObject{
    id: object::new(ctx),
  };

  transfer::transfer(new_object, ctx.sender());
}
  
```

Instead, do this:

```move

public struct NewObject has key, store {
  id: UID
}

public fun new(ctx: &mut TxContext): NewObject {
  let new_object = NewObject{
    id: object::new(ctx),
  };

  new_object
}
  
```

This is easy enough to do, but in most cases (when the object doesn't have the [`drop` ability](https://move-book.com/reference/abilities.html?highlight=drop#drop)), if the returned object is not handled properly, the transaction will fail.

In this lesson, you learn how to handle returned objects properly.



### Exercise 1: Handling Returned Sui NFT


The package of the SUIII NFT is at [`0x83feeef5abcb1d5caca48f5e4e2259f8fbbcac88c10d82cc95ed58ff6f0dcd79`](https://suiscan.xyz/testnet/object/0x83feeef5abcb1d5caca48f5e4e2259f8fbbcac88c10d82cc95ed58ff6f0dcd79/tx-blocks) and the NFT object type is [`0x83feeef5abcb1d5caca48f5e4e2259f8fbbcac88c10d82cc95ed58ff6f0dcd79::sui_nft::SuiNFT`](https://suiscan.xyz/testnet/collection/0x83feeef5abcb1d5caca48f5e4e2259f8fbbcac88c10d82cc95ed58ff6f0dcd79::sui_nft::SuiNFT/items).


View the contract at [`sui_nft.move`](./lessons/returning_objects/sui_nft/sources/sui_nft.move). Try to mint an NFT to your account and view it at explorer with PTBs.

Navigate to [`scripts/lessons/return_objects/exercise.ts`](./scripts/src/lessons/return_objects/exercise.ts) and complete the exercise.

> Bonus Challenge: Can you deploy the [SUIII NFT package](./lessons/returning_objects/sui_nft) yourself and use different text and images for the NFT?
> [Install the Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install), [Create Deployer Address](https://docs.sui.io/guides/developer/getting-started/get-address), and deposit gas coins from faucet, then use `sui client publish --skip-dependency-verification` to deploy!

## Lesson 2: Objects as Input

There are a lot of situations where one will want to interact with objects on Sui. Referencing and using objects in Sui Move is simple but nuanced. To reference an object in Sui Move, make the object a function parameter. For example, 

```
public struct SimpleObject has key, store {
  id: UID, 
  value: u64 
}

public fun update_value(obj: &mut SimpleObject, new_value: u64) {
  obj.value = new_value;
}

public fun delete(obj: SimpleObject) {
  let SimpleObject {
    id, 
    value: _,
  } = obj;

  id.delete();
}
```

The `update_value` function receives the mutable reference of the `SimpleObject` and updates one of its attributes. Note that it receives only the mutable reference, therefore, the object doesn't need to be returned at the end of the function. 

The `delete` function receives the actual instance of the `SimpleObject` and deletes it by destructuring it. An object can only be destructured in the moduel that originally defined the object type. Since the object is destrutured, it does not need to be returned at the end of the function. 

This usage is straightforward, but tends to leave developers wondering what this looks out in a wider context. In this lesson, you learn how to use objects as inputs in PTBs. 

### Exercise 2: Input Objects - Counter

View the contents [`counter.move`](./lessons/input_objects/counter/sources/counter.move). There is a deployed instance of this package on the Sui blockchain. The address of the package is [`0xad3225e7d4827f81dc0686177067e1b458e8468ceabcff3456888ce3d806eb8c`](https://suiscan.xyz/testnet/object/0xad3225e7d4827f81dc0686177067e1b458e8468ceabcff3456888ce3d806eb8c/txs) and the counter object is [0x1feb03541d20064d1876c26cfa44514f2e029c8201a2fe12a60589842b9d391d](https://suiscan.xyz/testnet/object/0x1feb03541d20064d1876c26cfa44514f2e029c8201a2fe12a60589842b9d391d/fields).


Navigate to [`scripts/lessons/input_objects/exercise.ts`](./scripts/src/lessons/input_objects/exercise.ts) and complete the exercise.


### Exercise 3: Scavenger Hunting with PTBs

In this exercise, you will try to get the `Bucket USD` coin in Testnet from the vault using a key created by PTBs. The deployed contract is at [`0x25dfcadb5927395b463a426e8d63425d654a6057affc368f4dc176e587f489a5`](https://suiscan.xyz/testnet/object/0x25dfcadb5927395b463a426e8d63425d654a6057affc368f4dc176e587f489a5/contracts).

Navigate to [`scavenger`](./lessons/scavenger) to read the smart contract code.

You will need to create a PTB to:
1. Create a key
2. Set the key code correctly
3. Use the key to withdraw the `Bucket USD` coin from the vault
4. Transfer the `Bucket USD` coin to your account

Navigate to [`scripts/lessons/scavenger_hunt/exercise.ts`](./scripts/src/lessons/scavenger_hunt/exercise.ts) and complete the exercise.
