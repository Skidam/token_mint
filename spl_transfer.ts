import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "/home/user/.config/solana/id.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("CYVNCq6pnqYjaTibsC7Tjos8yXLRqy3HDwZzd1h92rbS");

// Recipient address
const to = new PublicKey("FnfPGBdndaV6W4E4WZqEUZwtNMHhnMJMjGyjxaBhz8nD");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection, 
            keypair, 
            mint, 
            keypair.publicKey,
        ); 

        const toTokenAccount = await getOrCreateAssociatedTokenAccount ( 
            connection, 
            keypair, 
            mint, 
            to, 
        ); 

        const tx = await transfer( 
            connection, 
            keypair, 
            fromTokenAccount.address, 
            toTokenAccount.address, 
            keypair, 
            1e6,
            

        );

          console.log(`Transaction signature: ${tx}`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();