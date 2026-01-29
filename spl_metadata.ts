import wallet from "/home/user/.config/solana/id.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
  findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Your ata address is: Ed61x2KeDdhgQuGHmsd7XwoU9ShAnkmGW11cKeCgqpHh
// Your mint txid: 4hcrDWFun2A1h5Dm3JuD1YRQCc6Y8AXzzRGU7aoMKerq5vYQkgsqDEFqHoioV1y9gtLKzqoqmhXrD9xPvo15KRtC

// Define our Mint address
const mint = publicKey("CYVNCq6pnqYjaTibsC7Tjos8yXLRqy3HDwZzd1h92rbS");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    const metadataPda = findMetadataPda(umi, {mint})
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
        metadata: metadataPda, 
        mint: mint, 
        mintAuthority: signer, 
        payer: signer,
        updateAuthority: signer.publicKey,
      
    }
    let data: DataV2Args = {
        name: "NewyorkZurichGenevaBaselSonicInu", 
        symbol: "SINNYZ",
        uri: "", 
        sellerFeeBasisPoints: 500, 
        creators: null, 
        uses: null, 
        collection: null,

    }
    let args: CreateMetadataAccountV3InstructionArgs = {
        data: data, 
        isMutable: true, 
        collectionDetails: null,
    }
    let tx = createMetadataAccountV3(
        umi,
        {
            ...accounts,
            ...args
        }
    )
    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
