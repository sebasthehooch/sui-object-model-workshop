module scavenger::test_buck {

    // ----- Use Statements -----

    use sui::coin::{ Self };
    use sui::url;
    use scavenger::vault;

    // ----- Structs -----

    /// One-time witness type for the TEST_BUCK coin
    /// The 'drop' ability allows this type to be dropped after the init function completes
    public struct TEST_BUCK has drop {}

    // ----- Init Functions -----

    /// Module initializer, called once when the module is published
    /// @param test_buck - One-time witness for the TEST_BUCK currency
    /// @param ctx - Transaction context for accessing sender and creating objects
    fun init(
        test_buck: TEST_BUCK,
        ctx: &mut tx_context::TxContext,
    ) {
        // Create a new currency with the following parameters:
        // - 9 decimals of precision
        // - Symbol: BUCK
        // - Name: Bucket USD
        // - Description: Test token for the testnet
        // - Icon URL: Link to the token's SVG image
        let (mut treasury_cap, coin_metadata) = coin::create_currency<TEST_BUCK>(
            test_buck,
            9,
            b"BUCK",
            b"Bucket USD",
            b"Bucket USD at testnet for testing",
            option::some(
                url::new_unsafe_from_bytes(
                    b"https://bucket-cdn-eason.s3.us-west-1.amazonaws.com/BUCK.svg"
                )
            ),
            ctx
        );
        // Freeze the metadata to make it immutable
        transfer::public_freeze_object(coin_metadata);

        // Mint 10^19 tokens (10 billion tokens with 9 decimal places)
        let coin = coin::mint<TEST_BUCK>(
            &mut treasury_cap,
            10000000000000000000,
            ctx
        );
        // Freeze the treasury cap to prevent further minting
        transfer::public_freeze_object(treasury_cap);

        // Create a new vault with:
        // - The newly minted coins
        // - Withdrawal amount of 10 billion (10^10)
        // - Access code of 777
        let admin_cap = vault::new<TEST_BUCK>(coin, 10000000000, 777, ctx);

        // Transfer the admin capability to the transaction sender
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

}
